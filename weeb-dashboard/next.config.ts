import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Turbopack: marcar pacotes como externos para evitar análise
  serverExternalPackages: [
    "image-to-base64",
    "@weeb/svg-generator",
    "@weeb/weeb-plugins",
    "react-dom/server",
  ],
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig
