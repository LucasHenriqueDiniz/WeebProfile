import { describe, it, expect } from "vitest"
import { sealState, openState, readCookie } from "./shared"

/**
 * O cookie selado é o que segura identidade e nonce através do salto cross-site
 * que vem do steamcommunity.com. Se ele afrouxar, o callback volta a aceitar
 * `userId` de quem mandar -- ou volta a 401 em todo login pelo Steam.
 */

const KEY = btoa(String.fromCharCode(...new Uint8Array(32).map((_, i) => i * 7)))
const OUTRA_KEY = btoa(String.fromCharCode(...new Uint8Array(32).map((_, i) => i * 11)))

describe("sealState / openState", () => {
  it("devolve o mesmo state e userId que selou", async () => {
    const sealed = await sealState("nonce-123", "user_abc", KEY)

    expect(await openState(sealed, KEY)).toEqual({ state: "nonce-123", userId: "user_abc" })
  })

  // Sem isto o valor seria só um envelope: qualquer um montaria um cookie com o
  // userId alheio e escreveria o próprio SteamID na conta dele.
  it("não expõe o userId em texto no valor selado", async () => {
    const sealed = await sealState("nonce-123", "user_clerk_segredo", KEY)

    expect(sealed).not.toContain("user_clerk_segredo")
    expect(sealed).not.toContain("nonce-123")
  })

  it("recusa valor selado com outra chave", async () => {
    const sealed = await sealState("nonce-123", "user_abc", OUTRA_KEY)

    expect(await openState(sealed, KEY)).toBeNull()
  })

  // AES-GCM é autenticado, então adulterar o ciphertext falha ao abrir em vez de
  // devolver um payload diferente.
  it("recusa valor adulterado", async () => {
    const sealed = await sealState("nonce-123", "user_abc", KEY)
    const mexido = sealed.slice(0, -6) + "AAAAAA"

    expect(await openState(mexido, KEY)).toBeNull()
  })

  it("recusa cookie ausente ou lixo, sem lançar", async () => {
    expect(await openState(null, KEY)).toBeNull()
    expect(await openState("", KEY)).toBeNull()
    expect(await openState("nao-e-nem-v1", KEY)).toBeNull()
    expect(await openState("v1.aaa", KEY)).toBeNull()
  })

  it("recusa payload expirado mesmo com a chave certa", async () => {
    const { encryptSecret } = await import("../../_shared/secret-crypto")
    const vencido = await encryptSecret(
      JSON.stringify({ s: "nonce-123", u: "user_abc", e: Math.floor(Date.now() / 1000) - 1 }),
      KEY
    )

    expect(await openState(vencido, KEY)).toBeNull()
  })

  it("recusa payload sem os campos esperados", async () => {
    const { encryptSecret } = await import("../../_shared/secret-crypto")
    const semUserId = await encryptSecret(JSON.stringify({ s: "nonce", e: Date.now() / 1000 + 60 }), KEY)

    expect(await openState(semUserId, KEY)).toBeNull()
  })

  // O valor selado é base64 e contém "="; readCookie precisa devolvê-lo inteiro,
  // senão o cookie chega mutilado e todo login pelo Steam falha no state.
  it("sobrevive à leitura do cookie, com base64 e sinais de igual", async () => {
    const sealed = await sealState("nonce-123", "user_abc", KEY)
    const request = new Request("https://x/", {
      headers: { cookie: `outro=1; steam_openid_state=${sealed}; mais=2` },
    })

    expect(readCookie(request, "steam_openid_state")).toBe(sealed)
    expect(await openState(readCookie(request, "steam_openid_state"), KEY)).toEqual({
      state: "nonce-123",
      userId: "user_abc",
    })
  })
})
