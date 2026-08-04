/**
 * Encrypts/decrypts plugin_secrets.value at rest using AES-256-GCM (Web Crypto,
 * native in the Workers runtime -- no extra dependency).
 *
 * Format: "v1." + base64(iv) + "." + base64(ciphertext+tag)
 *
 * Não há mais fallback para texto puro: um valor sem o prefixo "v1." faz
 * decryptSecret() lançar. A tolerância a linhas antigas existiu até 01/08/2026,
 * quando plugin_secrets foi verificada vazia e o caminho legado deixou de ter o
 * que servir. (Esta docstring ainda descrevia o comportamento antigo.)
 *
 * Kept in sync with weeb-dashboard/functions/api/_shared/secret-crypto.ts --
 * both sides must use the same SECRETS_ENCRYPTION_KEY.
 */

const VERSION_PREFIX = "v1."

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function importKey(keyB64: string): Promise<CryptoKey> {
  const rawKey = base64ToBytes(keyB64)
  return crypto.subtle.importKey("raw", rawKey as BufferSource, "AES-GCM", false, ["decrypt"])
}

export async function decryptSecret(stored: string, keyB64: string): Promise<string> {
  // No plaintext fallback -- see the dashboard's copy of this file. plugin_secrets
  // was verified empty on 2026-08-01, so the legacy path had nothing left to serve.
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
