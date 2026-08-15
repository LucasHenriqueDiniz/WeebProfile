import { describe, it, expect, vi } from "vitest"
import { parseSteamInput, resolveSteamId } from "./steam-id"

const ID = "76561198056590170"

describe("parseSteamInput", () => {
  it("aceita o SteamID64 puro", () => {
    expect(parseSteamInput(ID)).toEqual({ kind: "id", steamId: ID })
    expect(parseSteamInput(`  ${ID}  `)).toEqual({ kind: "id", steamId: ID })
  })

  // A forma /profiles/ ja traz o numero: nao ha o que resolver, e chamar a Steam
  // seria uma ida a rede para descobrir algo que estava na propria string.
  it("extrai o id da URL /profiles/ sem precisar de rede", () => {
    expect(parseSteamInput(`https://steamcommunity.com/profiles/${ID}`)).toEqual({ kind: "id", steamId: ID })
    expect(parseSteamInput(`https://steamcommunity.com/profiles/${ID}/`)).toEqual({ kind: "id", steamId: ID })
    expect(parseSteamInput(`steamcommunity.com/profiles/${ID}`)).toEqual({ kind: "id", steamId: ID })
  })

  it("reconhece a URL /id/ como vanity", () => {
    expect(parseSteamInput("https://steamcommunity.com/id/amayacrab")).toEqual({ kind: "vanity", vanity: "amayacrab" })
    expect(parseSteamInput("https://steamcommunity.com/id/amayacrab/games/?tab=all")).toEqual({
      kind: "vanity",
      vanity: "amayacrab",
    })
  })

  it("aceita o nome de vanity solto", () => {
    expect(parseSteamInput("amayacrab")).toEqual({ kind: "vanity", vanity: "amayacrab" })
    expect(parseSteamInput("algum_nome-2")).toEqual({ kind: "vanity", vanity: "algum_nome-2" })
  })

  // A ordem importa: o teste de ID64 vem antes do de vanity, senao 17 digitos
  // virariam um "nome" e a gente iria perguntar a Steam por ele.
  it("nunca trata 17 digitos como nome de vanity", () => {
    expect(parseSteamInput(ID)).toEqual({ kind: "id", steamId: ID })
  })

  it("recusa entrada vazia ou sem forma reconhecivel", () => {
    expect(parseSteamInput("")).toBeNull()
    expect(parseSteamInput("   ")).toBeNull()
    expect(parseSteamInput("com espaco no meio")).toBeNull()
    expect(parseSteamInput("a")).toBeNull()
  })

  // Numero fora da faixa de conta individual nao vira "id". Vira vanity, e isso e
  // proposital: nome de vanity so com digitos e permitido pela Steam, e mandar para
  // a resolucao rende "a Steam nao encontrou esse perfil" -- mensagem melhor do que
  // recusar de cara alguem que so errou um digito.
  it("nao aceita como id um numero fora da faixa de conta individual", () => {
    for (const fora of ["12345678901234567", "7656119805659017", "765611980565901700"]) {
      expect(parseSteamInput(fora)).not.toEqual({ kind: "id", steamId: fora })
    }
  })

  it("recusa URL do steamcommunity sem perfil dentro", () => {
    expect(parseSteamInput("https://steamcommunity.com/market/")).toBeNull()
    expect(parseSteamInput("https://steamcommunity.com/profiles/123")).toBeNull()
  })
})

describe("resolveSteamId", () => {
  it("nao chama a Steam quando o id ja veio na entrada", async () => {
    const resolver = vi.fn()

    expect(await resolveSteamId(`https://steamcommunity.com/profiles/${ID}`, resolver)).toEqual({ steamId: ID })
    expect(resolver).not.toHaveBeenCalled()
  })

  it("resolve o vanity pelo resolvedor injetado", async () => {
    const resolver = vi.fn(async () => ID)

    expect(await resolveSteamId("amayacrab", resolver)).toEqual({ steamId: ID })
    expect(resolver).toHaveBeenCalledWith("amayacrab")
  })

  it("informa quando a Steam nao acha o perfil", async () => {
    const r = await resolveSteamId("nome-que-nao-existe", async () => null)

    expect(r.steamId).toBeUndefined()
    expect(r.error).toMatch(/não encontrou/i)
  })

  // Rede fora do ar e "perfil inexistente" mandam o usuario fazer coisas
  // diferentes, entao nao podem compartilhar mensagem.
  it("separa falha de rede de perfil inexistente", async () => {
    const r = await resolveSteamId("amayacrab", async () => {
      throw new Error("offline")
    })

    expect(r.error).toMatch(/falar com a Steam/i)
    expect(r.error).not.toMatch(/não encontrou/i)
  })

  it("recusa entrada invalida sem ir a rede", async () => {
    const resolver = vi.fn()
    const r = await resolveSteamId("!!!", resolver)

    expect(r.error).toMatch(/URL do seu perfil/i)
    expect(resolver).not.toHaveBeenCalled()
  })

  // Defesa contra o resolvedor devolver lixo: o que for gravado tem que ser um
  // SteamID64 de verdade, senao o erro so aparece la na geracao.
  it("recusa resposta do resolvedor que nao e um SteamID64", async () => {
    expect((await resolveSteamId("amayacrab", async () => "nao-e-id")).error).toBeTruthy()
    expect((await resolveSteamId("amayacrab", async () => "")).error).toBeTruthy()
  })
})
