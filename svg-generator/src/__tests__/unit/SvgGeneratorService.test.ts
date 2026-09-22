import { SvgGeneratorService } from "../../generator/services/SvgGeneratorService"
import type { SvgConfig } from "../../shared/types"
import { MockFactory } from "../mocks/mockInterfaces"

/**
 * Testes unitários para SvgGeneratorService
 * Demonstram o uso de mocks para testes isolados
 */

describe("SvgGeneratorService", () => {
  let mockRenderer: any
  let mockHeightMeasurer: any
  let mockCssAggregator: any
  let service: SvgGeneratorService

  beforeEach(() => {
    // Cria mocks para cada teste
    const mocks = MockFactory.createAllMocks()
    mockRenderer = mocks.renderer
    mockHeightMeasurer = mocks.heightMeasurer
    mockCssAggregator = mocks.cssAggregator

    // Cria serviço com mocks injetados
    service = new SvgGeneratorService(mockRenderer, mockHeightMeasurer, mockCssAggregator)
  })

  describe("generateSvg", () => {
    it("deve gerar SVG com sucesso", async () => {
      // Arrange
      const config: SvgConfig = {
        style: "default",
        size: "full",
        plugins: {
          github: { enabled: true, sections: ["overview"] },
          lastfm: { enabled: true, sections: ["recent"] },
        },
      }

      // Act
      const result = await service.generateSvg(config)

      // Assert
      expect(result).toBeDefined()
      expect(result.svg).toContain("<svg")
      expect(result.height).toBeGreaterThan(0)
      expect(result.width).toBe(830) // full size
      expect(result.debug).toBeDefined()
    })

    it("deve falhar quando renderer falha", async () => {
      // Arrange
      mockRenderer.setShouldFail(true, new Error("Renderer failed"))
      const config: SvgConfig = {
        style: "default",
        size: "full",
        plugins: {},
      }

      // Act & Assert
      await expect(service.generateSvg(config)).rejects.toThrow("Renderer failed")
    })

    it("deve falhar quando height measurer falha", async () => {
      // Arrange
      mockHeightMeasurer.setShouldFail(true, new Error("Height measurement failed"))
      const config: SvgConfig = {
        style: "default",
        size: "full",
        plugins: {},
      }

      // Act & Assert
      await expect(service.generateSvg(config)).rejects.toThrow("Height measurement failed")
    })

    it("deve usar half size quando configurado", async () => {
      // Arrange
      const config: SvgConfig = {
        style: "default",
        size: "half",
        plugins: {},
      }

      // Act
      const result = await service.generateSvg(config)

      // Assert
      expect(result.width).toBe(415) // half size
    })

    it("deve incluir métricas de performance", async () => {
      // Arrange
      const config: SvgConfig = {
        style: "default",
        size: "full",
        plugins: {},
      }

      // Act
      const result = await service.generateSvg(config)

      // Assert
      expect(result.debug?.metrics).toBeDefined()
      expect(result.debug?.metrics.totalTime).toBeGreaterThan(0)
    })
  })

  describe("validateConfig", () => {
    it("deve validar configuração válida", async () => {
      // Arrange
      const config: SvgConfig = {
        style: "default",
        size: "full",
        plugins: {},
      }

      // Act
      const result = await service.validateConfig(config)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("deve rejeitar configuração inválida", async () => {
      // Arrange
      const config: SvgConfig = {
        style: "invalid" as any,
        size: "full",
        plugins: {},
      }

      // Act
      const result = await service.validateConfig(config)

      // Assert
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe("getMetrics", () => {
    it("deve retornar métricas da última geração", () => {
      // Act
      const metrics = service.getMetrics()

      // Assert
      expect(metrics).toBeDefined()
      expect(typeof metrics.totalTime).toBe("number")
      expect(typeof metrics.renderTime).toBe("number")
      expect(typeof metrics.heightMeasurementTime).toBe("number")
    })

    it("deve resetar métricas", () => {
      // Act
      service.resetMetrics()
      const metrics = service.getMetrics()

      // Assert
      expect(metrics.totalTime).toBe(0)
      expect(metrics.renderTime).toBe(0)
      expect(metrics.heightMeasurementTime).toBe(0)
    })
  })
})

/**
 * Helper function para executar testes manualmente
 */
export async function runTests() {
  console.log("🧪 Executando testes unitários do SvgGeneratorService...")

  try {
    // Teste básico
    const mocks = MockFactory.createAllMocks()
    const service = new SvgGeneratorService(mocks.renderer, mocks.heightMeasurer, mocks.cssAggregator)

    const config: SvgConfig = {
      style: "default",
      size: "full",
      plugins: {
        github: { enabled: true, sections: ["overview"] },
      },
    }

    console.log("✅ Teste: geração básica")
    const result = await service.generateSvg(config)
    console.log(`   SVG gerado: ${result.svg.length} chars`)
    console.log(`   Dimensões: ${result.width}x${result.height}`)

    console.log("✅ Teste: validação de configuração")
    const validation = await service.validateConfig(config)
    console.log(`   Validação: ${validation.isValid ? "válida" : "inválida"}`)

    console.log("✅ Teste: métricas")
    const metrics = service.getMetrics()
    console.log(`   Tempo total: ${metrics.totalTime}ms`)

    console.log("🎉 Todos os testes passaram!")
  } catch (error) {
    console.error("❌ Teste falhou:", error)
    throw error
  }
}

// Executar testes se este arquivo for chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error)
}
