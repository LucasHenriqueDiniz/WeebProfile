import React from "react"
import type { CssAggregationResult, ICssAggregator } from "../../generator/interfaces/ICssAggregator"
import type {
  HeightMeasurementOptions,
  HeightMeasurementResult,
  IHeightMeasurer,
} from "../../generator/interfaces/IHeightMeasurer"
import type { HtmlAndCss, IRenderer, PluginValidationResult, RenderResult } from "../../generator/interfaces/IRenderer"
import type { GenerationMetrics, ISvgGenerator, ValidationResult } from "../../generator/interfaces/ISvgGenerator"
import type { SvgConfig, SvgGenerationResult } from "../../shared/types"

/**
 * Mock implementation de ISvgGenerator
 */
export class MockSvgGenerator implements ISvgGenerator {
  private shouldFail = false
  private failError: Error | null = null
  private mockResult: SvgGenerationResult | null = null
  private mockValidation: ValidationResult | null = null
  private mockMetrics: GenerationMetrics | null = null

  constructor(options?: {
    shouldFail?: boolean
    failError?: Error
    mockResult?: SvgGenerationResult
    mockValidation?: ValidationResult
    mockMetrics?: GenerationMetrics
  }) {
    this.shouldFail = options?.shouldFail || false
    this.failError = options?.failError || null
    this.mockResult = options?.mockResult || null
    this.mockValidation = options?.mockValidation || null
    this.mockMetrics = options?.mockMetrics || null
  }

  async generateSvg(_config: SvgConfig): Promise<SvgGenerationResult> {
    if (this.shouldFail) {
      throw this.failError || new Error("Mock generation failed")
    }

    return (
      this.mockResult || {
        svg: '<svg><rect width="415" height="200" fill="red"/></svg>',
        height: 200,
        width: 415,
        debug: {
          pluginsData: {},
          pluginsErrors: {},
          metrics: this.mockMetrics || this.getDefaultMetrics(),
        },
      }
    )
  }

  async validateConfig(_config: SvgConfig): Promise<ValidationResult> {
    return (
      this.mockValidation || {
        isValid: true,
        errors: [],
        warnings: [],
      }
    )
  }

  getMetrics(): GenerationMetrics {
    return this.mockMetrics || this.getDefaultMetrics()
  }

  private getDefaultMetrics(): GenerationMetrics {
    return {
      totalTime: 100,
      renderTime: 30,
      heightMeasurementTime: 40,
      cssLoadTime: 20,
      svgCreationTime: 10,
      pluginCount: 2,
      errorsCount: 0,
      warningsCount: 0,
    }
  }

  // Métodos de configuração do mock
  setShouldFail(shouldFail: boolean, error?: Error): void {
    this.shouldFail = shouldFail
    this.failError = error || null
  }

  setMockResult(result: SvgGenerationResult): void {
    this.mockResult = result
  }

  setMockValidation(validation: ValidationResult): void {
    this.mockValidation = validation
  }

  setMockMetrics(metrics: GenerationMetrics): void {
    this.mockMetrics = metrics
  }
}

/**
 * Mock implementation de IRenderer
 */
export class MockRenderer implements IRenderer {
  private shouldFail = false
  private failError: Error | null = null
  private mockRenderResult: RenderResult | null = null
  private mockHtmlResult: HtmlAndCss | null = null
  private mockValidationResult: PluginValidationResult | null = null

  constructor(options?: {
    shouldFail?: boolean
    failError?: Error
    mockRenderResult?: RenderResult
    mockHtmlResult?: HtmlAndCss
    mockValidationResult?: PluginValidationResult
  }) {
    this.shouldFail = options?.shouldFail || false
    this.failError = options?.failError || null
    this.mockRenderResult = options?.mockRenderResult || null
    this.mockHtmlResult = options?.mockHtmlResult || null
    this.mockValidationResult = options?.mockValidationResult || null
  }

  async renderPlugins(_config: SvgConfig): Promise<RenderResult> {
    if (this.shouldFail) {
      throw this.failError || new Error("Mock render failed")
    }

    return (
      this.mockRenderResult || {
        element: React.createElement("div", { className: "mock-plugins" }, "Mock Content"),
        pluginsData: { github: { name: "test" }, lastfm: { name: "test" } },
        pluginsErrors: {},
        renderTime: 50,
      }
    )
  }

  async reactToHtml(_element: React.ReactElement, _config: SvgConfig, _width: number): Promise<HtmlAndCss> {
    if (this.shouldFail) {
      throw this.failError || new Error("Mock HTML conversion failed")
    }

    return (
      this.mockHtmlResult || {
        html: '<div class="mock-plugins">Mock Content</div>',
        css: ".mock-plugins { color: red; }",
      }
    )
  }

  async validatePlugin(_pluginName: string, _config: Record<string, unknown>): Promise<PluginValidationResult> {
    return (
      this.mockValidationResult || {
        canRender: true,
        errors: [],
        warnings: [],
      }
    )
  }

  // Métodos de configuração do mock
  setShouldFail(shouldFail: boolean, error?: Error): void {
    this.shouldFail = shouldFail
    this.failError = error || null
  }

  setMockRenderResult(result: RenderResult): void {
    this.mockRenderResult = result
  }

  setMockHtmlResult(result: HtmlAndCss): void {
    this.mockHtmlResult = result
  }

  setMockValidationResult(result: PluginValidationResult): void {
    this.mockValidationResult = result
  }
}

/**
 * Mock implementation de IHeightMeasurer
 */
export class MockHeightMeasurer implements IHeightMeasurer {
  private shouldFail = false
  private failError: Error | null = null
  private mockHeightResult: HeightMeasurementResult | null = null
  private mockValidationResult: any = null

  constructor(options?: {
    shouldFail?: boolean
    failError?: Error
    mockHeightResult?: HeightMeasurementResult
    mockValidationResult?: any
  }) {
    this.shouldFail = options?.shouldFail || false
    this.failError = options?.failError || null
    this.mockHeightResult = options?.mockHeightResult || null
    this.mockValidationResult = options?.mockValidationResult || null
  }

  async measureHeight(options: HeightMeasurementOptions): Promise<HeightMeasurementResult> {
    if (this.shouldFail) {
      throw this.failError || new Error("Mock height measurement failed")
    }

    return (
      this.mockHeightResult || {
        height: 200,
        measurementTime: 30,
        strategy: "mock",
        metadata: { width: options.width },
      }
    )
  }

  async validateHtml(
    _html: string
  ): Promise<import("../../generator/interfaces/IHeightMeasurer").HtmlValidationResult> {
    return (
      this.mockValidationResult || {
        isValid: true,
        errors: [],
        warnings: [],
        estimatedComplexity: "low",
      }
    )
  }

  getAvailableStrategies(): import("../../generator/interfaces/IHeightMeasurer").MeasurementStrategy[] {
    return [
      {
        name: "mock",
        description: "Mock strategy for testing",
        isAvailable: true,
        priority: 1,
        measure: async (options) => ({
          height: 200,
          measurementTime: 30,
          strategy: "mock",
          metadata: { width: options.width },
        }),
      },
    ]
  }

  // Métodos de configuração do mock
  setShouldFail(shouldFail: boolean, error?: Error): void {
    this.shouldFail = shouldFail
    this.failError = error || null
  }

  setMockHeightResult(result: HeightMeasurementResult): void {
    this.mockHeightResult = result
  }

  setMockValidationResult(result: any): void {
    this.mockValidationResult = result
  }
}

/**
 * Mock implementation de ICssAggregator
 */
export class MockCssAggregator implements ICssAggregator {
  private shouldFail = false
  private failError: Error | null = null
  private mockAggregationResult: CssAggregationResult | null = null
  private mockValidationResult: any = null

  constructor(options?: {
    shouldFail?: boolean
    failError?: Error
    mockAggregationResult?: CssAggregationResult
    mockValidationResult?: any
  }) {
    this.shouldFail = options?.shouldFail || false
    this.failError = options?.failError || null
    this.mockAggregationResult = options?.mockAggregationResult || null
    this.mockValidationResult = options?.mockValidationResult || null
  }

  async loadCss(config: SvgConfig): Promise<CssAggregationResult> {
    if (this.shouldFail) {
      throw this.failError || new Error("Mock CSS aggregation failed")
    }

    return (
      this.mockAggregationResult || {
        cssDefs: ".mock { color: red; }",
        loadTime: 20,
        pluginCount: 2,
        warnings: [],
      }
    )
  }

  async loadPluginCss(_pluginName: string, _config: Record<string, unknown>): Promise<string> {
    return `.plugin-mock { color: blue; }`
  }

  async validateCss(
    css: string,
    _pluginName?: string
  ): Promise<import("../../generator/interfaces/ICssAggregator").CssValidationResult> {
    return (
      this.mockValidationResult || {
        isValid: true,
        errors: [],
        warnings: [],
        size: css.length,
        hasExternalResources: false,
      }
    )
  }

  clearCache(pluginName?: string): void {
    // Mock implementation - no cache to clear
  }

  // Métodos de configuração do mock
  setShouldFail(shouldFail: boolean, error?: Error): void {
    this.shouldFail = shouldFail
    this.failError = error || null
  }

  setMockAggregationResult(result: CssAggregationResult): void {
    this.mockAggregationResult = result
  }

  setMockValidationResult(result: any): void {
    this.mockValidationResult = result
  }
}

/**
 * Factory para criar mocks com configurações padrão
 */
export class MockFactory {
  static createSvgGenerator(overrides?: any): MockSvgGenerator {
    return new MockSvgGenerator(overrides)
  }

  static createRenderer(overrides?: any): MockRenderer {
    return new MockRenderer(overrides)
  }

  static createHeightMeasurer(overrides?: any): MockHeightMeasurer {
    return new MockHeightMeasurer(overrides)
  }

  static createCssAggregator(overrides?: any): MockCssAggregator {
    return new MockCssAggregator(overrides)
  }

  static createAllMocks(): {
    svgGenerator: MockSvgGenerator
    renderer: MockRenderer
    heightMeasurer: MockHeightMeasurer
    cssAggregator: MockCssAggregator
  } {
    return {
      svgGenerator: this.createSvgGenerator(),
      renderer: this.createRenderer(),
      heightMeasurer: this.createHeightMeasurer(),
      cssAggregator: this.createCssAggregator(),
    }
  }
}
