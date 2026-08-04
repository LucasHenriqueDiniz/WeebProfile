import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import type { D1Database } from "@cloudflare/workers-types"
import { getUserEssentialConfigs } from "./essential-configs"

beforeEach(() => vi.spyOn(console, "log").mockImplementation(() => {}))
afterEach(() => vi.restoreAllMocks())

/**
 * D1Database é interface, então um stub cobre a lógica desta camada -- que é
 * mapear linhas, normalizar caixa, resolver aliases e decifrar. O que um D1 real
 * acrescentaria é validar o texto do SELECT, e isso já é exercido em produção a
 * cada geração autenticada.
 */
function fakeDb(rows: Array<{ plugin: string; key: string; value: string }> | Error): {
  db: D1Database
  boundTo: string[]
} {
  const boundTo: string[] = []
  const db = {
    prepare: () => ({
      bind: (...args: unknown[]) => {
        boundTo.push(String(args[0]))
        return {
          all: async () => {
            if (rows instanceof Error) throw rows
            return { results: rows }
          },
        }
      },
    }),
  } as unknown as D1Database
  return { db, boundTo }
}

const KEY = btoa(String.fromCharCode(...new Uint8Array(32).map((_, i) => i)))

/** Mesmo formato que o lado da escrita produz: "v1." + b64(iv) + "." + b64(ct+tag). */
async function encrypt(plaintext: string, keyB64 = KEY): Promise<string> {
  const raw = Uint8Array.from(atob(keyB64), (c) => c.charCodeAt(0))
  const key = await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["encrypt"])
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext))
  )
  const b64 = (b: Uint8Array) => btoa(String.fromCharCode(...b))
  return `v1.${b64(iv)}.${b64(ct)}`
}

describe("getUserEssentialConfigs", () => {
  it("decifra o valor guardado e o entrega por plugin e chave", async () => {
    const { db } = fakeDb([{ plugin: "github", key: "pat", value: await encrypt("ghp_segredo") }])

    const configs = await getUserEssentialConfigs(db, "user_1", KEY)

    expect(configs.github).toEqual({ pat: "ghp_segredo" })
  })

  it("consulta pelo userId recebido", async () => {
    const { db, boundTo } = fakeDb([])
    await getUserEssentialConfigs(db, "user_42", KEY)
    expect(boundTo).toEqual(["user_42"])
  })

  // Fail closed. Sem a chave, a versão antiga entregava a coluna crua aos plugins:
  // o erro aparecia como credencial inválida de terceiro em vez do erro de config
  // que de fato era.
  it("recusa ler sem SECRETS_ENCRYPTION_KEY em vez de devolver texto cru", async () => {
    const { db } = fakeDb([{ plugin: "github", key: "pat", value: "texto-cru" }])

    await expect(getUserEssentialConfigs(db, "user_1", undefined)).rejects.toThrow(/SECRETS_ENCRYPTION_KEY/)
  })

  it("não toca no banco quando não há userId", async () => {
    const { db, boundTo } = fakeDb([{ plugin: "github", key: "pat", value: await encrypt("x") }])

    expect(await getUserEssentialConfigs(db, "", KEY)).toEqual({})
    expect(boundTo).toEqual([])
  })

  it("normaliza plugin e chave para minúsculo", async () => {
    const { db } = fakeDb([{ plugin: "LastFM", key: "apiKey", value: await encrypt("k") }])

    expect(await getUserEssentialConfigs(db, "user_1", KEY)).toEqual({ lastfm: { apikey: "k" } })
  })

  it("descarta linha sem plugin ou sem chave em vez de criar bucket vazio", async () => {
    const { db } = fakeDb([
      { plugin: "", key: "pat", value: await encrypt("a") },
      { plugin: "github", key: "", value: await encrypt("b") },
    ])

    expect(await getUserEssentialConfigs(db, "user_1", KEY)).toEqual({})
  })

  it("faz github_repo herdar o PAT do github quando não tem o próprio", async () => {
    const { db } = fakeDb([{ plugin: "github", key: "pat", value: await encrypt("ghp_compartilhado") }])

    const configs = await getUserEssentialConfigs(db, "user_1", KEY)

    expect(configs.github_repo).toEqual({ pat: "ghp_compartilhado" })
  })

  it("não sobrescreve o segredo próprio do github_repo com o alias", async () => {
    const { db } = fakeDb([
      { plugin: "github", key: "pat", value: await encrypt("ghp_pessoal") },
      { plugin: "github_repo", key: "pat", value: await encrypt("ghp_do_repo") },
    ])

    expect((await getUserEssentialConfigs(db, "user_1", KEY)).github_repo).toEqual({ pat: "ghp_do_repo" })
  })

  // Propaga em vez de devolver {}: banco fora do ar não é "usuário sem segredos".
  // É o que permite ao worker responder 503 D1_UNREACHABLE em vez de acusar
  // segredo faltando que na verdade nunca foi consultado.
  it("propaga falha do D1 em vez de fingir que o usuário não tem segredos", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const { db } = fakeDb(new Error("D1_ERROR: no such table"))

    await expect(getUserEssentialConfigs(db, "user_1", KEY)).rejects.toThrow(/no such table/)
  })

  it("propaga valor corrompido em vez de entregar lixo ao plugin", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const { db } = fakeDb([{ plugin: "github", key: "pat", value: "nao-tem-prefixo-v1" }])

    await expect(getUserEssentialConfigs(db, "user_1", KEY)).rejects.toThrow(/not encrypted/)
  })
})
