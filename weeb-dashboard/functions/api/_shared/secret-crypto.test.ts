import { describe, it, expect } from "vitest"
import { encryptSecret, decryptSecret, isEncrypted } from "./secret-crypto"

const newKey = () => Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64")

describe("secret-crypto", () => {
  it("round-trips a secret", async () => {
    const key = newKey()
    const secret = "STEAM-API-KEY-ABC123"
    expect(await decryptSecret(await encryptSecret(secret, key), key)).toBe(secret)
  })

  it("marks output with the version prefix", async () => {
    const stored = await encryptSecret("value", newKey())
    expect(stored.startsWith("v1.")).toBe(true)
    expect(isEncrypted(stored)).toBe(true)
  })

  it("does not leave the plaintext in the stored value", async () => {
    const secret = "a-very-recognisable-secret"
    expect(await encryptSecret(secret, newKey())).not.toContain(secret)
  })

  it("uses a fresh IV, so the same secret encrypts differently each time", async () => {
    const key = newKey()
    expect(await encryptSecret("same", key)).not.toBe(await encryptSecret("same", key))
  })

  // Regressão de produção: a SECRETS_ENCRYPTION_KEY estava malformada e o único
  // sinal era `InvalidCharacterError: atob()...` de dentro do Web Crypto, virando
  // 500 genérico sem citar a variável. Como este é o único caminho que cifra,
  // nenhum segredo de plugin pôde ser salvo -- e ninguém soube por semanas.
  it("nomeia a variável quando a chave não é base64 válido", async () => {
    await expect(encryptSecret("x", "não é base64!!")).rejects.toThrow(/SECRETS_ENCRYPTION_KEY.*base64/)
  })

  it("nomeia a variável quando a chave tem tamanho inválido para AES", async () => {
    const curtaDemais = btoa("12345")
    await expect(encryptSecret("x", curtaDemais)).rejects.toThrow(/SECRETS_ENCRYPTION_KEY.*16, 24 or 32/)
  })

  it("nomeia a variável quando a chave está ausente", async () => {
    await expect(encryptSecret("x", "")).rejects.toThrow(/SECRETS_ENCRYPTION_KEY is not configured/)
  })

  // The three below are the point of this file. An earlier version returned the
  // stored value unchanged when it could not decrypt, which meant a wrong key or a
  // tampered row surfaced as a plugin failing on a nonsense credential instead of
  // as the error it was. Re-introducing that fallback must fail here.
  it("rejects a value with no version prefix", async () => {
    await expect(decryptSecret("legacy-plaintext-row", newKey())).rejects.toThrow(/not encrypted/i)
  })

  it("rejects a malformed v1. value", async () => {
    await expect(decryptSecret("v1.onlyOnePart", newKey())).rejects.toThrow(/malformed/i)
  })

  it("rejects the wrong key", async () => {
    const stored = await encryptSecret("value", newKey())
    await expect(decryptSecret(stored, newKey())).rejects.toThrow()
  })

  it("rejects a tampered ciphertext", async () => {
    const key = newKey()
    const stored = await encryptSecret("value", key)
    await expect(decryptSecret(stored.slice(0, -4) + "AAAA", key)).rejects.toThrow()
  })

  it("does not treat a plain string as encrypted", () => {
    expect(isEncrypted("nope")).toBe(false)
  })
})
