import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { validateRequiredConfig } from "./validate-required-config"

/**
 * Este é o portão que decide se uma geração começa. Se ele deixar passar uma
 * config incompleta, o plugin falha lá na frente com erro de API de terceiro em
 * vez de "faltou sua chave" -- e o usuário não tem como saber o que fazer.
 *
 * `github` serve de cobaia por exigir os dois tipos: campo público (`username`)
 * e segredo (`pat`).
 */

const enabled = (extra: Record<string, unknown> = {}) => ({ enabled: true, sections: ["profile"], ...extra })

// Esta função ainda usa console.log direto (2+ linhas por plugin validado) em vez
// do log estruturado do resto do worker. Silenciado aqui para a saída do teste ser
// legível; a limpeza em si está fora do escopo destes testes.
beforeEach(() => vi.spyOn(console, "log").mockImplementation(() => {}))
afterEach(() => vi.restoreAllMocks())

describe("validateRequiredConfig", () => {
  it("aceita quando campo e segredo estão presentes", () => {
    const result = validateRequiredConfig({ github: enabled({ username: "someone" }) }, { github: { pat: "ghp_x" } })

    expect(result.isValid).toBe(true)
    expect(result.missing).toEqual([])
  })

  it("aponta o segredo que falta, com a label que o dashboard mostra", () => {
    const result = validateRequiredConfig({ github: enabled({ username: "someone" }) }, {})

    expect(result.isValid).toBe(false)
    expect(result.missing[0]!.pluginName).toBe("github")
    expect(result.missing[0]!.missingSecrets.map((s) => s.key)).toEqual(["pat"])
    expect(result.missing[0]!.missingSecrets[0]!.label).toBeTruthy()
    expect(result.missing[0]!.missingFields).toEqual([])
  })

  it("aponta o campo obrigatório que falta", () => {
    const result = validateRequiredConfig({ github: enabled() }, { github: { pat: "ghp_x" } })

    expect(result.missing[0]!.missingFields.map((f) => f.field)).toEqual(["username"])
    expect(result.missing[0]!.missingSecrets).toEqual([])
  })

  it("trata campo só com espaço como ausente", () => {
    const result = validateRequiredConfig({ github: enabled({ username: "   " }) }, { github: { pat: "ghp_x" } })

    expect(result.missing[0]!.missingFields.map((f) => f.field)).toEqual(["username"])
  })

  it("relata campo e segredo juntos, não só o primeiro", () => {
    const result = validateRequiredConfig({ github: enabled() }, {})

    expect(result.missing[0]!.missingSecrets).toHaveLength(1)
    expect(result.missing[0]!.missingFields).toHaveLength(1)
  })

  it("relata cada plugin incompleto separadamente", () => {
    const result = validateRequiredConfig({ github: enabled(), lastfm: enabled() }, {})

    expect(result.missing.map((m) => m.pluginName).sort()).toEqual(["github", "lastfm"])
  })

  // As três formas de "não conta": o portão só olha plugin ligado, com seção, e conhecido.
  it("ignora plugin desligado", () => {
    const result = validateRequiredConfig({ github: { enabled: false, sections: ["profile"] } }, {})
    expect(result.isValid).toBe(true)
  })

  it("ignora plugin ligado sem nenhuma seção", () => {
    const result = validateRequiredConfig({ github: { enabled: true, sections: [] } }, {})
    expect(result.isValid).toBe(true)
  })

  it("ignora plugin que não existe no metadata", () => {
    const result = validateRequiredConfig({ nao_existe: enabled() }, {})
    expect(result.isValid).toBe(true)
  })

  // Contrato de caixa: getUserEssentialConfigs grava as chaves em minúsculo, e a
  // validação procura em minúsculo. Quem entrega essentialConfigs por fora --
  // o caminho `essentialConfigs` do body em worker.ts -- precisa seguir o mesmo
  // formato, senão o segredo está lá e mesmo assim é reportado como ausente.
  it("procura o segredo em minúsculo, não no camelCase do metadata", () => {
    const comCamelCase = validateRequiredConfig({ lastfm: enabled({ username: "x" }) }, { lastfm: { apiKey: "k" } })
    expect(comCamelCase.isValid).toBe(false)

    const comMinusculo = validateRequiredConfig(
      { lastfm: enabled({ username: "x" }) },
      { lastfm: { apikey: "k", username: "x" } }
    )
    expect(comMinusculo.isValid).toBe(true)
  })

  it("trata segredo com string vazia como ausente, não como configurado", () => {
    const result = validateRequiredConfig({ github: enabled({ username: "someone" }) }, { github: { pat: "" } })

    expect(result.missing[0]!.missingSecrets.map((s) => s.key)).toEqual(["pat"])
  })
})
