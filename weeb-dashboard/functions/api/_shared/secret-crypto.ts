/**
 * Encrypts/decrypts plugin_secrets.value at rest using AES-256-GCM (Web Crypto,
 * native in the Workers runtime -- no extra dependency).
 *
 * Format: "v1." + base64(iv) + "." + base64(ciphertext+tag)
 *
 * Values written before this existed are plain text with no "v1." prefix;
 * decryptSecret() returns those unchanged so old rows keep working until
 * they're re-saved (or migrated) as encrypted.
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

async function importKey(keyB64: string): Promise<CryptoKey> {
  const rawKey = base64ToBytes(keyB64)
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
    // Legacy plaintext row, written before encryption-at-rest existed.
    return stored
  }

  const [, ivB64, ciphertextB64] = stored.split(".")
  if (!ivB64 || !ciphertextB64) return stored

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
