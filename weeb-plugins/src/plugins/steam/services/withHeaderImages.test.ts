import { describe, it, expect } from "vitest"
import { withHeaderImages } from "./fetchData"
import type { SteamConfig, SteamGame } from "../types"

/**
 * A capa de cada jogo vira uma requisição própria na conversão para base64. Uma
 * biblioteca real tem centenas de jogos, então preencher `header_image` sem recorte
 * transformaria uma geração em centenas de downloads em série.
 */

const config = (extra: Record<string, unknown> = {}) => ({ enabled: true, sections: [], ...extra }) as SteamConfig

function biblioteca(n: number): SteamGame[] {
  return Array.from({ length: n }, (_, i) => ({
    appid: 1000 + i,
    name: `Jogo ${i}`,
    // Decrescente: o índice 0 é o mais jogado, em ambos os critérios.
    playtime_forever: (n - i) * 10,
    playtime_2weeks: i < 30 ? (30 - i) * 5 : 0,
  }))
}

const comCapa = (games: SteamGame[]) => games.filter((g) => g.header_image)

describe("withHeaderImages", () => {
  it("preenche só a janela renderizada, não a biblioteca inteira", () => {
    const resultado = withHeaderImages(biblioteca(800), config({ recent_games_max: 5, top_games_max: 5 }))

    // Os dois recortes se sobrepõem aqui (mesma ordem), então <= 10 e nunca 800.
    expect(comCapa(resultado).length).toBeLessThanOrEqual(10)
    expect(resultado).toHaveLength(800)
  })

  it("respeita os limites configurados em vez do máximo possível", () => {
    const poucos = comCapa(withHeaderImages(biblioteca(200), config({ recent_games_max: 1, top_games_max: 1 })))
    const muitos = comCapa(withHeaderImages(biblioteca(200), config({ recent_games_max: 20, top_games_max: 20 })))

    expect(poucos.length).toBeLessThan(muitos.length)
    expect(muitos.length).toBeLessThanOrEqual(40)
  })

  it("usa 5 como padrão quando o limite não vem configurado", () => {
    const resultado = comCapa(withHeaderImages(biblioteca(200), config()))

    expect(resultado.length).toBeGreaterThan(0)
    expect(resultado.length).toBeLessThanOrEqual(10)
  })

  // Index signature `unknown` no SteamConfig: sem coerção, um valor estranho
  // viraria um slice gigante e a geração baixaria imagem demais.
  it("ignora limite que não é número em vez de propagá-lo para o slice", () => {
    const resultado = comCapa(
      withHeaderImages(biblioteca(200), config({ recent_games_max: "muitos", top_games_max: -3 }))
    )

    expect(resultado.length).toBeLessThanOrEqual(10)
  })

  // O card de destaque em Statistics mostra o mais jogado das 2 semanas mesmo com a
  // seção Recent Games desligada, então ele nunca pode ficar sem capa.
  it("sempre cobre o jogo em destaque das últimas 2 semanas", () => {
    const games = biblioteca(50)
    const maisRecente = [...games].sort((a, b) => (b.playtime_2weeks || 0) - (a.playtime_2weeks || 0))[0]!

    const resultado = withHeaderImages(games, config({ recent_games_max: 0, top_games_max: 0 }))

    expect(resultado.find((g) => g.appid === maisRecente.appid)?.header_image).toBeTruthy()
  })

  it("não inventa capa para jogo nunca jogado", () => {
    const games: SteamGame[] = [
      { appid: 1, name: "Jogado", playtime_forever: 100, playtime_2weeks: 10 },
      { appid: 2, name: "Nunca aberto", playtime_forever: 0, playtime_2weeks: 0 },
    ]

    const resultado = withHeaderImages(games, config())

    expect(resultado.find((g) => g.appid === 1)?.header_image).toBeTruthy()
    expect(resultado.find((g) => g.appid === 2)?.header_image).toBeUndefined()
  })

  it("monta a URL de capa a partir do appid", () => {
    const resultado = withHeaderImages(
      [{ appid: 730, name: "CS2", playtime_forever: 100, playtime_2weeks: 5 }],
      config()
    )

    // Sozinho na lista, ele é o destaque -- por isso a variante grande.
    expect(resultado[0]!.header_image).toBe("https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg")
  })

  // A imagem entra no SVG como base64, que ainda infla ~33%. A `header` (35 KB) está
  // superdimensionada para células de ~125px e para fundo desfocado; só o card de
  // destaque aparece grande. Usar a pequena (17 KB) no resto corta metade do peso.
  it("usa a capa pequena na lista e a grande só no destaque", () => {
    const games: SteamGame[] = [
      { appid: 1, name: "Destaque", playtime_forever: 50, playtime_2weeks: 100 },
      { appid: 2, name: "Outro recente", playtime_forever: 40, playtime_2weeks: 10 },
      { appid: 3, name: "Só top", playtime_forever: 999, playtime_2weeks: 0 },
    ]

    const r = withHeaderImages(games, config())
    const capa = (appid: number) => r.find((g) => g.appid === appid)!.header_image

    expect(capa(1)).toContain("/header.jpg")
    expect(capa(2)).toContain("/capsule_231x87.jpg")
    expect(capa(3)).toContain("/capsule_231x87.jpg")
  })

  it("não usa a variante grande quando não há jogo recente", () => {
    const games: SteamGame[] = [{ appid: 9, name: "Antigo", playtime_forever: 500, playtime_2weeks: 0 }]

    expect(withHeaderImages(games, config())[0]!.header_image).toContain("/capsule_231x87.jpg")
  })

  it("não altera a lista original", () => {
    const games = biblioteca(10)
    withHeaderImages(games, config())

    expect(games.every((g) => g.header_image === undefined)).toBe(true)
  })
})
