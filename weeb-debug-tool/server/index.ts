/**
 * Debug Tool Backend Server
 *
 * Express server for generating SVG and React previews
 * Imports plugins directly from weeb-plugins/src for hot reload
 */

import express from "express"
import cors from "cors"
import { watch } from "chokidar"
import { execSync } from "child_process"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
import pluginsRouter from "./routes/plugins.js"
import generateReactRouter from "./routes/generate-react.js"
import { generateSvgRoute } from "./routes/generate-svg.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = process.env.PORT || 5001
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
const pluginsPath = resolve(__dirname, "../../weeb-plugins")
const watcher = watch([resolve(pluginsPath, "src/**/*.{ts,tsx}"), resolve(pluginsPath, "tailwind.config.js")], {
  ignored: [
    /node_modules/,
    /dist/,
    /\.git/,
    /src\/styles\/.*\.css$/, // Ignore generated CSS files
  ],
  ignoreInitial: true,
})

let regenerateTimeout: NodeJS.Timeout | null = null
watcher.on("change", (path) => {
  // Debounce: wait 500ms after last change before regenerating
  if (regenerateTimeout) {
    clearTimeout(regenerateTimeout)
  }

  regenerateTimeout = setTimeout(() => {
    console.log(`\n🔄 File changed: ${path}`)
    console.log("🎨 Regenerating Tailwind CSS...")
    try {
      execSync("pnpm generate-tailwind-css", {
        cwd: pluginsPath,
        stdio: "inherit",
      })
      console.log("✅ Tailwind CSS regenerated!\n")
    } catch (error) {
      console.error("❌ Error regenerating Tailwind CSS:", error)
    }
  }, 500)
})

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Weeb Debug Tool server running on http://localhost:${PORT}`)
  console.log("👀 Watching for file changes to regenerate Tailwind CSS...")
})

// Handle errors
app.on("error", (error: any) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Please stop the other process.`)
  } else {
    console.error("❌ Server error:", error)
  }
  process.exit(1)
})

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down...")
  process.exit(0)
})
