import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@weeb/weeb-plugins'],
  serverExternalPackages: [
    "image-to-base64",
    "@weeb/svg-generator",
    "react-dom/server",
  ],
  typescript: {
    ignoreBuildErrors: false,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    // Suprimir aviso do baseline-browser-mapping sobre dados desatualizados
    BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA: "true",
  },
}

export default nextConfig
