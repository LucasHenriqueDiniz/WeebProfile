/**
 * Servidor principal do SVG Generator
 * Versão simplificada para funcionar com a nova arquitetura
 */

import { config } from "dotenv"
import { createServer } from "node:http"
import { URL } from "node:url"

// Carregar variáveis de ambiente
config({ path: `${process.cwd()}/.env` })

// Importar o novo SvgGenerator
import { SvgGenerator } from "./generator/svg-generator"

// Railway usa PORT, mas também suporta SVG_GENERATOR_PORT para desenvolvimento local
const PORT = process.env.PORT || process.env.SVG_GENERATOR_PORT || 3001

// Criar servidor simples
const server = createServer(async (req, res) => {
  // Configurar CORS
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    res.writeHead(200)
    res.end()
    return
  }

  try {
    const url = new URL(req.url || "/", `http://localhost:${PORT}`)

    // Rota principal de geração de SVG
    if (url.pathname === "/" && req.method === "POST") {
      const body = await new Promise<string>((resolve, reject) => {
        let data = ""
        req.on("data", (chunk) => (data += chunk))
        req.on("end", () => resolve(data))
        req.on("error", reject)
      })

      const config = JSON.parse(body)
      const svgGenerator = new SvgGenerator()

      const result = await svgGenerator.generateSvg(config)

      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify(result))
      return
    }

    // Rota de health check
    if (url.pathname === "/health" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(
        JSON.stringify({
          status: "ok",
          timestamp: new Date().toISOString(),
          version: "2.0.0",
        })
      )
      return
    }

    // Rota de informações
    if (url.pathname === "/info" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(
        JSON.stringify({
          name: "Weeb Profile SVG Generator",
          version: "2.0.0",
          description: "SVG Generator com arquitetura refatorada",
          endpoints: {
            generate: "POST /",
            health: "GET /health",
            info: "GET /info",
          },
        })
      )
      return
    }

    // Rota não encontrada
    res.writeHead(404, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: "Not found" }))
  } catch (error) {
    console.error("Server error:", error)
    res.writeHead(500, { "Content-Type": "application/json" })
    res.end(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    )
  }
})

server.listen(PORT, () => {
  console.log(`🚀 SVG Generator v2.0.0 running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`ℹ️  Info: http://localhost:${PORT}/info`)
  console.log(`🎯 Generate: POST http://localhost:${PORT}/`)
})
