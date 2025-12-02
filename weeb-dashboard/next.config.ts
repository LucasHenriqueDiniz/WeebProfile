import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Transpilar weeb-plugins para permitir hot reload e uso direto
  transpilePackages: ['@weeb/weeb-plugins'],
  // Turbopack: marcar apenas pacotes que realmente precisam ser externos
  serverExternalPackages: [
    "image-to-base64",
    "@weeb/svg-generator", // Mantém externo (usa dist/ compilado)
    "react-dom/server",
  ],
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
