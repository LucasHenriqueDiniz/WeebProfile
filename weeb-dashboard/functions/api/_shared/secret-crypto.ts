/**
 * Encrypts/decrypts plugin_secrets.value at rest using AES-256-GCM (Web Crypto,
 * native in the Workers runtime -- no extra dependency).
 *
 * Format: "v1." + base64(iv) + "." + base64(ciphertext+tag)
 *
 * There is no plaintext fallback. An earlier version returned unprefixed values
 * unchanged, to carry rows written before encryption-at-rest existed. plugin_secrets
 * was verified empty on 2026-08-01, so that compatibility path had no rows left to
 * serve and only stood to mask a misconfigured key by silently treating ciphertext,
 * or anything else, as a usable secret.
 */

const VERSION_PREFIX = "v1."

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!)
  return btoa(binary)
}

/**
 * Valida a chave antes de usar.
 *
 * Sem isto, uma SECRETS_ENCRYPTION_KEY malformada só aparecia como
 * `InvalidCharacterError: atob() called with invalid base64-encoded data` vindo de
 * dentro do Web Crypto, virava 500 genérico e não citava nem a variável. Em produção
 * isso passou despercebido por semanas: como nada além deste caminho cifra, o sintoma
 * era só "salvar segredo dá erro" -- e plugin_secrets ficou vazia o tempo todo.
 */
function importKeyBytes(keyB64: string): Uint8Array {
  if (!keyB64) {
    throw new Error("SECRETS_ENCRYPTION_KEY is not configured")
  }

  let bytes: Uint8Array
  try {
    bytes = base64ToBytes(keyB64)
  } catch {
    throw new Error("SECRETS_ENCRYPTION_KEY is not valid base64")
  }

  // AES aceita 128/192/256 bits. Fora disso o importKey falharia com uma mensagem
  // que também não diz de qual chave se trata.
  if (bytes.length !== 16 && bytes.length !== 24 && bytes.length !== 32) {
    throw new Error(`SECRETS_ENCRYPTION_KEY must decode to 16, 24 or 32 bytes (got ${bytes.length})`)
  }

  return bytes
}

async function importKey(keyB64: string): Promise<CryptoKey> {
  const rawKey = importKeyBytes(keyB64)
  return crypto.subtle.importKey("raw", rawKey as BufferSource, "AES-GCM", false, ["encrypt", "decrypt"])
}

export async function encryptSecret(plaintext: string, keyB64: string): Promise<string> {
  const key = await importKey(keyB64)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    new TextEncoder().encode(plaintext) as BufferSource
  )
  return `${VERSION_PREFIX}${bytesToBase64(iv)}.${bytesToBase64(new Uint8Array(ciphertext))}`
}

export async function decryptSecret(stored: string, keyB64: string): Promise<string> {
  if (!stored.startsWith(VERSION_PREFIX)) {
    throw new Error("Stored secret is not encrypted")
  }

  const [, ivB64, ciphertextB64] = stored.split(".")
  if (!ivB64 || !ciphertextB64) {
    throw new Error("Stored secret is malformed")
  }

  const key = await importKey(keyB64)
  const iv = base64ToBytes(ivB64)
  const ciphertext = base64ToBytes(ciphertextB64)
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv as BufferSource },
    key,
    ciphertext as BufferSource
  )
  return new TextDecoder().decode(plaintext)
}

export function isEncrypted(stored: string): boolean {
  return stored.startsWith(VERSION_PREFIX)
}
