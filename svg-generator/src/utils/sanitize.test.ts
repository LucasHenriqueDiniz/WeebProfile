import { describe, it, expect } from "vitest"
import { sanitizeConfig, sanitizeEssentialConfigs } from "./sanitize"

describe("sanitizeEssentialConfigs", () => {
  // Regressão. sanitizeEssentialConfigs delegava ao sanitizeConfig, que decide por
  // substring de nome ("token", "apikey", "secret"...). `pat` e `steamid` não casam
  // com nenhuma -- e são exatamente os segredos de github, github_repo e steam, ou
  // seja, a lista errava justo nos que existem de verdade. Agora censura tudo.
  it("censura chaves cujo nome não parece sensível", () => {
    const out = sanitizeEssentialConfigs({
      github: { pat: "ghp_tokenrealdousuario" },
      steam: { steamid: "76561198000000000" },
    })

    expect(out.github.pat).not.toContain("tokenrealdousuario")
    expect(out.steam.steamid).not.toContain("61198000000000")
  })

  it("censura todo valor de todo plugin, sem exceção", () => {
    const out = sanitizeEssentialConfigs({
      lastfm: { apikey: "chave", username: "nome_do_usuario" },
      lyfta: { apikey: "outra" },
    })

    for (const plugin of Object.values(out)) {
      for (const value of Object.values(plugin as Record<string, string>)) {
        expect(value).toMatch(/\*/)
      }
    }
  })

  it("mantém o prefixo curto para dar o que reconhecer no debug", () => {
    const out = sanitizeEssentialConfigs({ github: { pat: "ghp_abcdefghijklmnop" } })

    expect(out.github.pat.startsWith("ghp")).toBe(true)
    expect(out.github.pat).not.toContain("abcdef")
  })

  it("não deixa passar valor que não é string", () => {
    const out = sanitizeEssentialConfigs({ x: { n: 12345, nested: { deep: "segredo" } } as never })

    expect(JSON.stringify(out)).not.toContain("12345")
    expect(JSON.stringify(out)).not.toContain("segredo")
  })

  it("censura o plugin inteiro quando o valor vem como string solta", () => {
    expect(sanitizeEssentialConfigs({ steam: "76561198000000000" as never }).steam).not.toContain("61198")
  })

  it("devolve objeto vazio para entrada que não é objeto", () => {
    expect(sanitizeEssentialConfigs(null as never)).toEqual({})
    expect(sanitizeEssentialConfigs("texto" as never)).toEqual({})
  })
})

describe("sanitizeConfig", () => {
  it("censura chaves de nome sensível em qualquer profundidade", () => {
    const out = sanitizeConfig({ plugins: { github: { accessToken: "tok_secreto", username: "publico" } } })

    expect(out.plugins.github.accessToken).not.toContain("secreto")
    expect(out.plugins.github.username).toBe("publico")
  })

  it("preserva o que não é sensível para o debug continuar servindo", () => {
    const out = sanitizeConfig({ style: "terminal", size: "full", plugins: { devto: { enabled: true } } })

    expect(out).toEqual({ style: "terminal", size: "full", plugins: { devto: { enabled: true } } })
  })

  it("percorre arrays em vez de devolvê-los intactos", () => {
    const out = sanitizeConfig([{ token: "abc123def" }])

    expect(out[0].token).not.toContain("123def")
  })
})
