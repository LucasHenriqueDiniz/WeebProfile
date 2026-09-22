import react from "@vitejs/plugin-react"
import path from "node:path"
import { defineConfig } from "vite"

const BACKEND_PORT = Number(process.env.BACKEND_PORT ?? 5003)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@weeb-plugins": path.resolve(__dirname, "../weeb-plugins/src"),
    },
  },
  server: {
    port: 5000,
    strictPort: true, // NÃO deixa o Vite pular pra 5001 e quebrar tudo
    fs: {
      // Permite Vite ler arquivos fora do diretório do debug-tool
      allow: [__dirname, path.resolve(__dirname, "../weeb-plugins")],
    },
    proxy: {
      "/api": {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true,
      },
      "/health": {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    // Nome EXATO do pacote escopado
    exclude: ["@weeb/weeb-plugins"],
  },
})
