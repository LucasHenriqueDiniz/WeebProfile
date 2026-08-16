import { describe, it, expect } from "vitest"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { resolveBannerText, type GithubRepoConfig, type GithubRepoData } from "./types"
import { Banner } from "./components/Banner"
import { githubRepoPlugin } from "./index"

const repo = {
  name: "WeebProfile",
  nameWithOwner: "LucasHenriqueDiniz/WeebProfile",
  description: "Generate SVG stat cards",
  url: "https://github.com/LucasHenriqueDiniz/WeebProfile",
  owner: { login: "LucasHenriqueDiniz", avatarUrl: null },
  primaryLanguage: { name: "TypeScript", color: "#3178c6" },
  stargazerCount: 42,
  forkCount: 3,
  openIssuesCount: 1,
  watcherCount: 9,
  licenseInfo: null,
  topics: [],
  languages: [],
  starHistory: [],
} as unknown as GithubRepoData

function config(overrides: Partial<GithubRepoConfig> = {}): GithubRepoConfig {
  return { enabled: true, sections: ["banner"], owner: "LucasHenriqueDiniz", repo: "WeebProfile", ...overrides }
}

describe("resolveBannerText", () => {
  it("cai para o que veio do GitHub quando nada foi digitado", () => {
    expect(resolveBannerText(config(), repo)).toEqual({
      title: "WeebProfile",
      description: "Generate SVG stat cards",
      eyebrow: null,
    })
  })

  it("usa o texto custom quando existe", () => {
    const text = resolveBannerText(
      config({ banner_title: "Sora", banner_description: "Meu projeto", banner_eyebrow: "side project" }),
      repo
    )
    expect(text).toEqual({ title: "Sora", description: "Meu projeto", eyebrow: "side project" })
  })

  // Um campo que o usuário limpou (ou onde só sobrou espaço) tem que voltar ao
  // padrão -- senão o card fica com título vazio e ninguém entende por quê.
  it("trata campo em branco como 'usa o padrão'", () => {
    const text = resolveBannerText(config({ banner_title: "   ", banner_description: "", banner_eyebrow: " " }), repo)
    expect(text).toEqual({ title: "WeebProfile", description: "Generate SVG stat cards", eyebrow: null })
  })

  it("apara os espaços das pontas do texto custom", () => {
    expect(resolveBannerText(config({ banner_title: "  Sora  " }), repo).title).toBe("Sora")
  })

  // Repo sem descrição e sem texto custom não pode virar uma linha vazia no card.
  it("mantém description null quando o repo não tem descrição", () => {
    const semDescricao = { ...repo, description: null }
    expect(resolveBannerText(config(), semDescricao).description).toBeNull()
  })

  it("deixa um repo sem descrição ganhar uma pelo campo custom", () => {
    const semDescricao = { ...repo, description: null }
    expect(resolveBannerText(config({ banner_description: "Escrito à mão" }), semDescricao).description).toBe(
      "Escrito à mão"
    )
  })
})

// O bug que motivou tudo isso em outra seção: o campo existe, o usuário digita, e o
// card continua mostrando o valor antigo. Aqui cada variante é renderizada de fato.
describe("Banner renderiza o texto custom em todas as variantes", () => {
  const variants = ["hero", "minimal", "split", "display", "centered", "centered_dark", "centered_gradient", "dark"]
  // "display" é só eyebrow + nome gigante + meta row; nunca teve linha de descrição
  // (o toggle "Show description" também não faz nada lá). Comportamento anterior a
  // esta feature, deixado como está.
  const comDescricao = variants.filter((v) => v !== "display")

  it.each(variants)("%s mostra o título custom", (variant) => {
    const html = renderToStaticMarkup(
      createElement(Banner, {
        config: config({ banner_variant: variant as never, banner_title: "Sora" }),
        data: repo,
      })
    )
    expect(html).toContain("Sora")
    expect(html).not.toContain("WeebProfile")
  })

  it.each(comDescricao)("%s mostra a descrição custom", (variant) => {
    const html = renderToStaticMarkup(
      createElement(Banner, {
        config: config({ banner_variant: variant as never, banner_description: "Meu projeto" }),
        data: repo,
      })
    )
    expect(html).toContain("Meu projeto")
    expect(html).not.toContain("Generate SVG stat cards")
  })

  it("também no estilo terminal", () => {
    const html = renderToStaticMarkup(
      createElement(Banner, {
        config: config({ banner_title: "Sora", banner_description: "Meu projeto" }),
        data: repo,
        style: "terminal",
      })
    )
    expect(html).toContain("Sora")
    expect(html).toContain("Meu projeto")
    expect(html).not.toContain("Generate SVG stat cards")
  })

  // O owner continua sendo controlado pelo próprio toggle -- título custom não o
  // remove nem o traz de volta.
  it("mantém o prefixo do owner ao lado do título custom", () => {
    const html = renderToStaticMarkup(
      createElement(Banner, { config: config({ banner_variant: "minimal", banner_title: "Sora" }), data: repo })
    )
    expect(html).toContain("LucasHenriqueDiniz/Sora")
  })

  it.each(["split", "display", "centered", "centered_dark"])("%s aceita label custom", (variant) => {
    const html = renderToStaticMarkup(
      createElement(Banner, {
        config: config({ banner_variant: variant as never, banner_eyebrow: "side project" }),
        data: repo,
      })
    )
    expect(html).toContain("side project")
  })

  // Digitar um label e não ver nada seria o mesmo bug de novo, só que causado por
  // um toggle vizinho.
  it.each(["centered", "centered_dark"])("%s mostra o label custom mesmo com show owner desligado", (variant) => {
    const html = renderToStaticMarkup(
      createElement(Banner, {
        config: config({ banner_variant: variant as never, banner_eyebrow: "side project", banner_show_owner: false }),
        data: repo,
      })
    )
    expect(html).toContain("side project")
  })
})

// A altura do SVG é estática: se ela ignorar o texto custom, o conteúdo é cortado.
describe("calculateHeight enxerga o texto custom", () => {
  const semDescricao = { ...repo, description: null } as GithubRepoData
  const height = (cfg: GithubRepoConfig, data: GithubRepoData = repo) =>
    githubRepoPlugin.calculateHeight!(cfg as never, data as never, "half")

  it.each(["hero", "split", "centered", "centered_dark", "centered_gradient", "dark"])(
    "%s: descrição custom num repo sem descrição reserva espaço",
    (variant) => {
      const cfg = config({ banner_variant: variant as never })
      const comTexto = config({ banner_variant: variant as never, banner_description: "Escrito à mão" })
      expect(height(comTexto, semDescricao)).toBeGreaterThan(height(cfg, semDescricao))
    }
  )

  it.each(["centered", "centered_dark"])("%s: label custom reserva a linha mesmo sem owner", (variant) => {
    const semNada = config({ banner_variant: variant as never, banner_show_owner: false })
    const comLabel = config({ banner_variant: variant as never, banner_show_owner: false, banner_eyebrow: "side" })
    expect(height(comLabel)).toBeGreaterThan(height(semNada))
  })

  // Campo em branco tem que ser indistinguível de campo ausente, senão o card de
  // quem abriu as opções e não digitou nada muda de tamanho sozinho.
  it.each(["hero", "minimal", "split", "display", "centered", "centered_dark", "centered_gradient", "dark"])(
    "%s: campo vazio não altera a altura",
    (variant) => {
      const ausente = config({ banner_variant: variant as never })
      const vazio = config({
        banner_variant: variant as never,
        banner_title: "",
        banner_description: "  ",
        banner_eyebrow: "",
      })
      expect(height(vazio)).toBe(height(ausente))
      expect(height(vazio, semDescricao)).toBe(height(ausente, semDescricao))
    }
  )

  // Título e label são linhas de altura fixa (truncam), então trocar o texto não
  // pode mexer no total -- só a existência da descrição/label muda.
  it.each(["hero", "minimal", "split", "display", "centered", "centered_dark", "centered_gradient", "dark"])(
    "%s: trocar só o título não altera a altura",
    (variant) => {
      const padrao = config({ banner_variant: variant as never })
      const custom = config({ banner_variant: variant as never, banner_title: "Sora" })
      expect(height(custom)).toBe(height(padrao))
    }
  )
})
