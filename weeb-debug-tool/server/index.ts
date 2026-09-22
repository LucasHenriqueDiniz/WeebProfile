/**
 * Debug Tool Backend Server
 *
 * Express server for generating SVG and React previews
 * Imports plugins directly from weeb-plugins/src for hot reload
 */

// import { execSync } from "child_process"
// import { watch } from "chokidar"
import cors from "cors"
import express from "express"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"
import generateReactRouter from "./routes/generate-react"
import { generateSvgRoute } from "./routes/generate-svg"
import pluginsRouter from "./routes/plugins"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = Number(process.env.PORT) || 5001
const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: "50mb" })) // Increase limit for HTML/CSS payloads
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// Routes
app.use("/api/plugins", pluginsRouter)
app.use("/api/generate-react", generateReactRouter)
app.post("/api/generate-svg", generateSvgRoute)

// Health check with server start time for detecting restarts
const serverStartTime = Date.now()

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: Date.now(),
    serverStartTime, // Timestamp de quando o servidor iniciou (muda a cada restart)
  })
})

// Root route - informativo
app.get("/", (req, res) => {
  res.json({
    message: "Weeb Debug Tool API",
    version: "0.1.0",
    endpoints: {
      health: "/health",
      plugins: "/api/plugins",
      generateReact: "/api/generate-react",
      generateSvg: "/api/generate-svg",
    },
  })
})

// Watch for changes in weeb-plugins and regenerate Tailwind CSS
// Temporarily disabled to debug server startup issues

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Weeb Debug Tool server running on http://localhost:${PORT}`)
  console.log("👀 Watching for file changes to regenerate Tailwind CSS...")
})

// Handle server errors
server.on("error", (error: Error & { code?: string }) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Please stop the other process.`)
  } else {
    console.error("❌ Server error:", error)
  }
  process.exit(1)
})

// Graceful shutdown
let disposeFns: Array<() => Promise<void>> = []

function onShutdown(fn: () => Promise<void>) {
  disposeFns.push(fn)
}

async function shutdown() {
  console.log("\n🛑 Shutting down...")
  for (const fn of disposeFns.reverse()) {
    try {
      await fn()
    } catch {}
  }
  process.exit(0)
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
