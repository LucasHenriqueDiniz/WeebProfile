import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@weeb-plugins': path.resolve(__dirname, '../weeb-plugins/src'),
    },
  },
  server: {
    port: 5000,
    fs: {
      // Permite Vite ler arquivos fora do diretório do debug-tool
      allow: [
        __dirname,
        path.resolve(__dirname, '../weeb-plugins'),
      ],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    // Nome EXATO do pacote escopado
    exclude: ['@weeb/weeb-plugins'],
  },
})

