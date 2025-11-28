"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle, Copy, Download, FileJson, Image as ImageIcon, Code, Bug, Ruler, List, ExternalLink, Trash2, BookOpen } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PluginIndexModal } from "@/components/test/PluginIndexModal"
import { PLUGINS_METADATA } from "@/lib/weeb-plugins/plugins/metadata"

const DEFAULT_JSON = `{
  "style": "default",
  "size": "half",
  "mock": true,
  "plugins": {
    "github": {
      "enabled": true,
      "username": "octocat",
      "sections": ["profile", "activity"]
    },
    "lastfm": {
      "enabled": true,
      "sections": ["recent_tracks"]
    }
  },
  "pluginsOrder": ["github", "lastfm"]
}`

const BASIC_JSON_STRUCTURE = `{
  "style": "default",
  "size": "half",
  "mock": true,
  "plugins": {},
  "pluginsOrder": []
}`

// Função para encurtar URLs base64 longas
function shortenBase64Urls(text: string, maxLength = 50): string {
  // Padrão para encontrar qualquer base64 data URL
  const base64Pattern = /(data:image\/[^;]+;base64,)([A-Za-z0-9+/=]{100,})/g
  
  return text.replace(base64Pattern, (match, prefix, base64) => {
    if (base64.length > maxLength) {
      return `${prefix}${base64.substring(0, maxLength)}... [${base64.length} chars]`
    }
    return match
  })
}

export default function SvgGeneratorTestPage() {
  const [json, setJson] = useState(DEFAULT_JSON)
  const [svg, setSvg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [serverUrl, setServerUrl] = useState("http://localhost:3001")
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)
  const [svgBlobUrl, setSvgBlobUrl] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [actualDimensions, setActualDimensions] = useState<{ width: number; height: number } | null>(null)
  const [mockData, setMockData] = useState(true)
  const [pluginIndexOpen, setPluginIndexOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("svg")
  const svgContainerRef = useRef<HTMLDivElement>(null)
  const svgImageRef = useRef<HTMLImageElement>(null)
  

  async function handleTest() {
    setLoading(true)
    setError(null)
    setSvg(null)
    setDimensions(null)
    setDebugInfo(null)
    setActualDimensions(null)
    // Limpar blob URL anterior se existir
    if (svgBlobUrl) {
      URL.revokeObjectURL(svgBlobUrl)
      setSvgBlobUrl(null)
    }

    try {
      // Validar JSON
      let config = JSON.parse(json)
      
      // Aplicar mock data do switch (sempre sobrescrever qualquer valor existente)
      // IMPORTANTE: Sempre usar o valor do switch, não o que está no JSON
      config.mock = mockData
      if (mockData) {
        config.debug = true
      } else {
        // Remover debug se mock estiver desligado
        delete config.debug
      }

      console.log("📤 [TEST] Enviando configuração:", {
        mock: config.mock,
        mockData: mockData,
        mockDataType: typeof mockData,
        hasEssentialConfigs: !!config.essentialConfigs,
        bodyPreview: JSON.stringify(config).substring(0, 200),
      })

      const res = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `HTTP ${res.status}: ${res.statusText}` }))
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()
      
      console.log("📦 Resposta do servidor:", {
        success: data.success,
        hasSvg: !!data.svg,
        svgLength: data.svg?.length,
        width: data.width,
        height: data.height,
        svgPreview: data.svg?.substring(0, 500),
        fullSvg: data.svg,
      })
      
      if (data.success && data.svg) {
        // Verificar se o SVG é válido
        const svgString = String(data.svg)
        if (!svgString.includes("<svg")) {
          console.error("❌ SVG inválido - não contém <svg")
          console.error("Conteúdo recebido:", svgString.substring(0, 500))
          throw new Error("SVG inválido retornado pelo servidor")
        }
        
        console.log("✅ SVG válido detectado, tamanho:", svgString.length)
        console.log("🔍 Primeiros 1000 chars do SVG:", svgString.substring(0, 1000))
        
        // Verificar se o SVG tem conteúdo visível
        if (svgString.length < 100) {
          console.warn("⚠️ SVG muito pequeno, pode estar vazio")
        }
        
        setSvg(svgString)
        setDimensions({
          width: data.width || 415,
          height: data.height || 600,
        })
        
        // Salvar informações de debug se disponíveis
        if (data.debug) {
          setDebugInfo(data.debug)
          console.log("🐛 Debug info recebida:", data.debug)
        } else {
          setDebugInfo(null)
        }
        
        // Criar blob URL para renderizar SVG como imagem
        const blob = new Blob([svgString], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        setSvgBlobUrl(url)
        
        console.log("🖼️ Blob URL criado:", url)
      } else {
        throw new Error(data.error || "Failed to generate SVG")
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError(`JSON inválido: ${err.message}`)
      } else {
        setError(err instanceof Error ? err.message : "Unknown error")
      }
    } finally {
      setLoading(false)
    }
  }

  function handleCopySvg() {
    if (svg) {
      navigator.clipboard.writeText(svg)
    }
  }

  function handleDownloadSvg() {
    if (svg) {
      const blob = new Blob([svg], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "generated.svg"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  function handleOpenSvgInNewTab() {
    if (svgBlobUrl) {
      window.open(svgBlobUrl, "_blank")
    }
  }

  function handleClean() {
    setJson(BASIC_JSON_STRUCTURE)
    setSvg(null)
    setDimensions(null)
    setDebugInfo(null)
    setActualDimensions(null)
    if (svgBlobUrl) {
      URL.revokeObjectURL(svgBlobUrl)
      setSvgBlobUrl(null)
    }
  }

  function measureActualSvgSize() {
    if (!svg || !svgContainerRef.current) {
      console.warn("⚠️ SVG não disponível para medição")
      return
    }

    // Tentar medir via imagem carregada
    if (svgImageRef.current && svgImageRef.current.complete) {
      const img = svgImageRef.current
      const actualWidth = img.naturalWidth || img.offsetWidth
      const actualHeight = img.naturalHeight || img.offsetHeight
      
      setActualDimensions({ width: actualWidth, height: actualHeight })
      
      console.log("📏 [MEDIÇÃO] Tamanho real do SVG (via img):")
      console.log(`   └─ Largura: ${actualWidth}px`)
      console.log(`   └─ Altura: ${actualHeight}px`)
      
      if (dimensions) {
        const widthDiff = actualWidth - dimensions.width
        const heightDiff = actualHeight - dimensions.height
        console.log(`   └─ Diferença calculada vs real:`)
        console.log(`      └─ Largura: ${widthDiff > 0 ? '+' : ''}${widthDiff}px`)
        console.log(`      └─ Altura: ${heightDiff > 0 ? '+' : ''}${heightDiff}px (${((heightDiff / dimensions.height) * 100).toFixed(1)}%)`)
      }
      
      return
    }

    // Fallback: tentar criar um SVG element temporário
    try {
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(svg, "image/svg+xml")
      const svgElement = svgDoc.documentElement
      
      if (svgElement) {
        const viewBox = svgElement.getAttribute("viewBox")
        const width = svgElement.getAttribute("width")
        const height = svgElement.getAttribute("height")
        
        if (viewBox) {
          const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number)
          setActualDimensions({ width: vbWidth, height: vbHeight })
          console.log("📏 [MEDIÇÃO] Tamanho real do SVG (via viewBox):")
          console.log(`   └─ Largura: ${vbWidth}px`)
          console.log(`   └─ Altura: ${vbHeight}px`)
        } else if (width && height) {
          const w = parseFloat(width.replace("px", ""))
          const h = parseFloat(height.replace("px", ""))
          setActualDimensions({ width: w, height: h })
          console.log("📏 [MEDIÇÃO] Tamanho real do SVG (via width/height):")
          console.log(`   └─ Largura: ${w}px`)
          console.log(`   └─ Altura: ${h}px`)
        }
      }
    } catch (err) {
      console.error("❌ Erro ao medir SVG:", err)
    }
  }

  function logAllComponents() {
    if (!svg) {
      console.warn("⚠️ SVG não disponível para log")
      return
    }

    try {
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(svg, "image/svg+xml")
      const svgElement = svgDoc.documentElement
      
      if (!svgElement) {
        console.error("❌ Não foi possível parsear o SVG")
        return
      }

      console.log("\n📋 [LOG] Todos os componentes do SVG:")
      console.log("=" .repeat(60))
      
      function traverseElement(element: Element, depth = 0) {
        const indent = "  ".repeat(depth)
        const tagName = element.tagName.toLowerCase()
        const id = element.getAttribute("id") || ""
        const className = element.getAttribute("class") || ""
        
        const style = element.getAttribute("style") || ""
        
        const info: any = {
          tag: tagName,
          id: id || undefined,
          class: className || undefined,
        }
        
        // Extrair dimensões do style se existir
        const widthMatch = style.match(/width:\s*([\d.]+)px/)
        const heightMatch = style.match(/height:\s*([\d.]+)px/)
        if (widthMatch) info.width = `${widthMatch[1]}px`
        if (heightMatch) info.height = `${heightMatch[1]}px`
        
        // Extrair dimensões de atributos
        const attrWidth = element.getAttribute("width")
        const attrHeight = element.getAttribute("height")
        if (attrWidth) info.width = attrWidth
        if (attrHeight) info.height = attrHeight
        
        // Extrair viewBox se for SVG
        if (tagName === "svg") {
          const viewBox = element.getAttribute("viewBox")
          if (viewBox) info.viewBox = viewBox
        }
        
        // Extrair texto se for elemento de texto
        if (element.textContent && element.textContent.trim()) {
          const text = element.textContent.trim().substring(0, 50)
          if (text) info.text = text + (element.textContent.trim().length > 50 ? "..." : "")
        }
        
        console.log(`${indent}${tagName}${id ? `#${id}` : ""}${className ? `.${className.split(" ")[0]}` : ""}`, info)
        
        // Recursivamente processar filhos
        Array.from(element.children).forEach(child => {
          traverseElement(child, depth + 1)
        })
      }
      
      traverseElement(svgElement)
      
      console.log("=" .repeat(60))
      console.log(`\n📊 [RESUMO] Total de elementos: ${svgDoc.querySelectorAll("*").length}`)
      
      // Estatísticas por tag
      const tagCounts: Record<string, number> = {}
      svgDoc.querySelectorAll("*").forEach(el => {
        const tag = el.tagName.toLowerCase()
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
      
      console.log("\n📈 [ESTATÍSTICAS] Elementos por tag:")
      Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([tag, count]) => {
          console.log(`   └─ ${tag}: ${count}`)
        })
      
    } catch (err) {
      console.error("❌ Erro ao fazer log dos componentes:", err)
    }
  }

  // Medir tamanho real quando SVG carregar
  useEffect(() => {
    if (svgImageRef.current && svgImageRef.current.complete && svg) {
      setTimeout(() => {
        measureActualSvgSize()
      }, 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svg, svgBlobUrl])


  function addPluginToJson(pluginName: string, config: Record<string, any>) {
    try {
      let currentJson
      try {
        currentJson = JSON.parse(json)
      } catch {
        // Se JSON está vazio ou inválido, criar estrutura básica
        currentJson = JSON.parse(BASIC_JSON_STRUCTURE)
      }
      
      if (!currentJson.plugins) {
        currentJson.plugins = {}
      }
      
      // Se o plugin já existe, mesclar configurações
      if (currentJson.plugins[pluginName]) {
        currentJson.plugins[pluginName] = {
          ...currentJson.plugins[pluginName],
          ...config,
          sections: [
            ...(currentJson.plugins[pluginName].sections || []),
            ...(config.sections || []),
          ].filter((v, i, a) => a.indexOf(v) === i), // Remove duplicatas
        }
      } else {
        currentJson.plugins[pluginName] = config
      }
      
      // Adicionar ao pluginsOrder se não existir
      if (!currentJson.pluginsOrder) {
        currentJson.pluginsOrder = []
      }
      if (!currentJson.pluginsOrder.includes(pluginName)) {
        currentJson.pluginsOrder.push(pluginName)
      }
      
      // Criar essentialConfigs automaticamente se o plugin tiver essentialConfigKeys
      const pluginMetadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
      if (pluginMetadata && pluginMetadata.essentialConfigKeys.length > 0) {
        if (!currentJson.essentialConfigs) {
          currentJson.essentialConfigs = {}
        }
        
        // Criar estrutura do essentialConfigs para o plugin se não existir
        if (!currentJson.essentialConfigs[pluginName]) {
          currentJson.essentialConfigs[pluginName] = {}
        }
        
        // Adicionar campos vazios para cada essentialConfigKey que não existir
        // Totalmente dinâmico - usa metadata do plugin
        pluginMetadata.essentialConfigKeys.forEach((key: string) => {
          if (!(key in currentJson.essentialConfigs[pluginName])) {
            // Se for username e o config já tem username, usar esse valor
            if (key === "username" && config.username) {
              currentJson.essentialConfigs[pluginName][key] = config.username
            } else {
              // Para outros campos (tokens, API keys), deixar vazio
              currentJson.essentialConfigs[pluginName][key] = ""
            }
          }
        })
      }
      
      setJson(JSON.stringify(currentJson, null, 2))
    } catch (err) {
      console.error("Erro ao adicionar plugin:", err)
    }
  }

  function addSectionToPlugin(pluginName: string, sectionId: string) {
    try {
      let currentJson
      try {
        currentJson = JSON.parse(json)
      } catch {
        // Se JSON está vazio ou inválido, criar estrutura básica
        currentJson = JSON.parse(BASIC_JSON_STRUCTURE)
      }
      
      if (!currentJson.plugins) {
        currentJson.plugins = {}
      }
      
      if (!currentJson.plugins[pluginName]) {
        // Criar plugin se não existir
        currentJson.plugins[pluginName] = {
          enabled: true,
          sections: [],
        }
      }
      
      // Adicionar seção se não existir
      if (!currentJson.plugins[pluginName].sections) {
        currentJson.plugins[pluginName].sections = []
      }
      
      if (!currentJson.plugins[pluginName].sections.includes(sectionId)) {
        currentJson.plugins[pluginName].sections.push(sectionId)
      }
      
      // Adicionar ao pluginsOrder se não existir
      if (!currentJson.pluginsOrder) {
        currentJson.pluginsOrder = []
      }
      if (!currentJson.pluginsOrder.includes(pluginName)) {
        currentJson.pluginsOrder.push(pluginName)
      }
      
      // Criar essentialConfigs automaticamente se o plugin tiver essentialConfigKeys
      const pluginMetadata = PLUGINS_METADATA[pluginName as keyof typeof PLUGINS_METADATA]
      if (pluginMetadata && pluginMetadata.essentialConfigKeys.length > 0) {
        if (!currentJson.essentialConfigs) {
          currentJson.essentialConfigs = {}
        }
        
        // Criar estrutura do essentialConfigs para o plugin se não existir
        if (!currentJson.essentialConfigs[pluginName]) {
          currentJson.essentialConfigs[pluginName] = {}
        }
        
        // Adicionar campos vazios para cada essentialConfigKey que não existir
        // Totalmente dinâmico - usa metadata do plugin
        pluginMetadata.essentialConfigKeys.forEach((key: string) => {
          if (!(key in currentJson.essentialConfigs[pluginName])) {
            // Se for username e o plugin já tem username no config, usar esse valor
            if (key === "username" && currentJson.plugins[pluginName]?.username) {
              currentJson.essentialConfigs[pluginName][key] = currentJson.plugins[pluginName].username
            } else {
              // Para outros campos (tokens, API keys), deixar vazio
              currentJson.essentialConfigs[pluginName][key] = ""
            }
          }
        })
      }
      
      setJson(JSON.stringify(currentJson, null, 2))
    } catch (err) {
      console.error("Erro ao adicionar seção:", err)
    }
  }

  function loadExample(example: string) {
    switch (example) {
      case "github":
        setJson(`{
  "style": "default",
  "size": "half",
  "mock": true,
  "plugins": {
    "github": {
      "enabled": true,
      "username": "octocat",
      "sections": ["profile", "activity", "repositories"]
    }
  }
}`)
        break
      case "multiple":
        setJson(DEFAULT_JSON)
        break
      case "terminal":
        setJson(`{
  "style": "terminal",
  "size": "half",
  "mock": true,
  "plugins": {
    "github": {
      "enabled": true,
      "username": "octocat",
      "sections": ["profile"]
    }
  },
  "terminalTheme": "dracula"
}`)
        break
      case "full":
        setJson(`{
  "style": "default",
  "size": "full",
  "mock": true,
  "plugins": {
    "github": {
      "enabled": true,
      "username": "octocat",
      "sections": ["profile", "activity", "repositories", "languages"]
    },
    "lastfm": {
      "enabled": true,
      "sections": ["recent_tracks", "top_artists"]
    },
    "myanimelist": {
      "enabled": true,
      "username": "mock",
      "sections": ["statistics", "anime_favorites"]
    }
  },
  "pluginsOrder": []
}`)
        break
    }
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Configuração */}
        <Card className="h-full flex-1 min-w-0 flex flex-col border-r rounded-none">
          <CardHeader className="pb-3 flex-shrink-0">
            <CardTitle>Configuração</CardTitle>
            <CardDescription>
              Configure o JSON e o servidor para testar
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col space-y-4">
            <div className="space-y-2 flex-shrink-0">
              <Label htmlFor="server-url">URL do Servidor</Label>
              <Input
                id="server-url"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="http://localhost:3001"
              />
              <p className="text-xs text-muted-foreground">
                Local: http://localhost:3001 | Railway: https://seu-projeto.railway.app
              </p>
            </div>

            <div className="space-y-2 flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between flex-shrink-0">
                <Label htmlFor="json">JSON Config</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample("github")}
                  >
                    GitHub
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample("multiple")}
                  >
                    Múltiplos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample("terminal")}
                  >
                    Terminal
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample("full")}
                  >
                    Full
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClean}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clean
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Switch
                    id="mock-data"
                    checked={mockData}
                    onCheckedChange={(checked) => {
                      console.log("🔄 [SWITCH] Mock Data mudou:", checked)
                      setMockData(checked)
                    }}
                  />
                  <Label htmlFor="mock-data" className="cursor-pointer">
                    Mock Data {mockData ? "(ON)" : "(OFF)"}
                  </Label>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPluginIndexOpen(true)}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Índice
                </Button>
              </div>
              <Textarea
                id="json"
                value={json}
                onChange={(e) => setJson(e.target.value)}
                className="font-mono text-sm flex-1 min-h-0"
                placeholder='{"style": "default", "size": "half", ...}'
              />
            </div>

            <div className="flex-shrink-0">
              <Button
                onClick={handleTest}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  "Gerar SVG"
                )}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="flex-shrink-0">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {svg && (
              <Alert className="flex-shrink-0">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  SVG gerado com sucesso! {dimensions && `(${dimensions.width}x${dimensions.height}px)`}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Right Column - Resultado */}
        <Card className="h-full flex-1 min-w-0 flex flex-col rounded-none">
          <CardHeader className="pb-3 flex-shrink-0">
            <CardTitle>Resultado</CardTitle>
            <CardDescription>
              Visualize o JSON recebido, SVG gerado e código
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col min-h-0">
            {svg ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
                  <TabsTrigger value="json">
                    <FileJson className="mr-2 h-4 w-4" />
                    JSON Recebido
                  </TabsTrigger>
                  <TabsTrigger value="svg">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    SVG
                  </TabsTrigger>
                  <TabsTrigger value="code">
                    <Code className="mr-2 h-4 w-4" />
                    Código
                  </TabsTrigger>
                  <TabsTrigger value="debug" disabled={!debugInfo}>
                    <Bug className="mr-2 h-4 w-4" />
                    Debug
                  </TabsTrigger>
                </TabsList>

                {activeTab === "json" && (
                <TabsContent value="json" className="flex-1 overflow-hidden flex flex-col mt-4 min-h-0">
                  <div className="flex items-center justify-between flex-shrink-0 mb-2">
                    <Label>JSON Enviado ao Servidor</Label>
                    <div className="text-xs text-muted-foreground">
                      {json.length.toLocaleString()} caracteres
                    </div>
                  </div>
                  <Textarea
                    value={json}
                    className="font-mono text-xs flex-1 min-h-0 resize-none"
                    readOnly
                  />
                </TabsContent>
                )}

                {activeTab === "svg" && (
                <TabsContent value="svg" className="flex-1 overflow-y-auto mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="text-sm space-y-1">
                        <div className="text-muted-foreground">
                          Calculado: {dimensions && `${dimensions.width} × ${dimensions.height}px`}
                        </div>
                        {actualDimensions && (
                          <div className={`font-semibold ${
                            dimensions && actualDimensions.height !== dimensions.height
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}>
                            Real: {actualDimensions.width} × {actualDimensions.height}px
                            {dimensions && actualDimensions.height !== dimensions.height && (
                              <span className="ml-2 text-xs">
                                (diferença: {actualDimensions.height - dimensions.height > 0 ? '+' : ''}
                                {actualDimensions.height - dimensions.height}px)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleOpenSvgInNewTab}
                          title="Abrir SVG em nova aba"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Abrir
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={measureActualSvgSize}
                          title="Medir tamanho real do SVG renderizado"
                        >
                          <Ruler className="mr-2 h-4 w-4" />
                          Medir SVG
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={logAllComponents}
                          title="Fazer log de todos os componentes no console"
                        >
                          <List className="mr-2 h-4 w-4" />
                          Log Componentes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopySvg}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copiar SVG
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownloadSvg}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-white overflow-auto min-w-0">
                      <div
                        ref={svgContainerRef}
                        className="flex items-start justify-center w-full min-w-0"
                        style={{
                          minHeight: dimensions?.height ? `${Math.min(dimensions.height + 40, 600)}px` : "400px",
                          padding: "20px",
                          backgroundColor: "#f9fafb",
                        }}
                      >
                        {svg && svgBlobUrl ? (
                          <div
                            className="svg-container min-w-0"
                            style={{
                              width: "100%",
                              maxWidth: dimensions?.width ? `${dimensions.width}px` : "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              margin: "0 auto",
                            }}
                          >
                            <div style={{ width: "100%", height: "100%" }}>
                              <img
                                ref={svgImageRef}
                                src={svgBlobUrl}
                                alt="Generated SVG"
                                style={{
                                  width: dimensions?.width ? `${dimensions.width}px` : "100%",
                                  height: dimensions?.height ? `${dimensions.height}px` : "auto",
                                  maxWidth: "100%",
                                  display: "block",
                                  margin: "0 auto",
                                }}
                                onLoad={() => {
                                  measureActualSvgSize()
                                }}
                                onError={(e) => {
                                  console.error("❌ Erro ao carregar SVG como img:", e)
                                  const target = e.currentTarget.parentElement
                                  if (target && svg) {
                                    target.innerHTML = svg
                                  }
                                }}
                              />
                              <div
                                style={{ display: "none" }}
                                dangerouslySetInnerHTML={{ __html: svg }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin mb-2" />
                            <p>Carregando SVG...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                )}

                {activeTab === "code" && (
                <TabsContent value="code" className="flex-1 overflow-hidden flex flex-col mt-4 min-h-0">
                  <div className="flex items-center justify-between flex-shrink-0 mb-2">
                    <Label>SVG Code</Label>
                    <div className="text-xs text-muted-foreground">
                      {svg.length.toLocaleString()} caracteres
                    </div>
                  </div>
                  <Textarea
                    value={shortenBase64Urls(svg)}
                    className="font-mono text-xs flex-1 min-h-0 resize-none"
                    readOnly
                  />
                </TabsContent>
                )}

                {activeTab === "debug" && (
                <TabsContent value="debug" className="flex-1 overflow-hidden flex flex-col mt-4 min-h-0">
                  {debugInfo ? (
                    <div className="flex-1 overflow-hidden flex flex-col space-y-4 min-h-0">
                      <div className="flex-1 overflow-hidden flex flex-col space-y-2 min-h-0">
                        <div className="flex items-center justify-between flex-shrink-0">
                          <Label>Config JSON Usada</Label>
                          <div className="text-xs text-muted-foreground">
                            Configuração sanitizada (sem API keys/tokens)
                          </div>
                        </div>
                        <Textarea
                          value={shortenBase64Urls(JSON.stringify(debugInfo.config, null, 2))}
                          className="font-mono text-xs flex-1 min-h-0 resize-none"
                          readOnly
                        />
                      </div>
                      
                      <div className="flex-1 overflow-hidden flex flex-col space-y-2 min-h-0">
                        <div className="flex items-center justify-between flex-shrink-0">
                          <Label>Dados dos Plugins</Label>
                          <div className="text-xs text-muted-foreground">
                            Dados usados para gerar o SVG
                          </div>
                        </div>
                        <Textarea
                          value={shortenBase64Urls(JSON.stringify(debugInfo.pluginsData, null, 2))}
                          className="font-mono text-xs flex-1 min-h-0 resize-none"
                          readOnly
                        />
                      </div>
                      
                      {debugInfo.pluginsErrors && Object.keys(debugInfo.pluginsErrors).length > 0 && (
                        <div className="flex-1 overflow-hidden flex flex-col space-y-2 min-h-0">
                          <div className="flex items-center justify-between flex-shrink-0">
                            <Label className="text-destructive">Erros dos Plugins</Label>
                            <div className="text-xs text-muted-foreground">
                              Erros ocorridos durante a busca de dados
                            </div>
                          </div>
                          <Textarea
                            value={shortenBase64Urls(JSON.stringify(debugInfo.pluginsErrors, null, 2))}
                            className="font-mono text-xs border-destructive flex-1 min-h-0 resize-none"
                            readOnly
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Bug className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">
                        Nenhuma informação de debug disponível
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Ative &quot;Mock Data&quot; para ver informações de debug
                      </p>
                    </div>
                  )}
                </TabsContent>
                )}
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <FileJson className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">Nenhum SVG gerado</p>
                <p className="text-sm mt-2">
                  Configure o JSON e clique em &quot;Gerar SVG&quot; para começar
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Índice de Plugins */}
      <PluginIndexModal
        open={pluginIndexOpen}
        onOpenChange={setPluginIndexOpen}
        onAddPlugin={addPluginToJson}
        onAddSection={addSectionToPlugin}
      />
    </div>
  )
}
