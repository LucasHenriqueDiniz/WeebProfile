import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

// Explicit path to avoid ambiguity and Turbopack resolution issues
// The path is relative to the project root (where next.config.ts is located)
const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const nextConfig: NextConfig = {
  // Enable Turbopack configuration for next-intl alias resolution
  // If this doesn't work, use `pnpm dev` (with --webpack) instead
  turbopack: {},
  reactStrictMode: true,
  transpilePackages: ["@weeb/weeb-plugins"],
  serverExternalPackages: ["image-to-base64", "@weeb/svg-generator", "react-dom/server"],
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.fastly.steamstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.akamai.steamstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.steampowered.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/previews/:path*",
        destination: "/api/preview/:path*",
      },
      // Allow API routes to work with locale prefix
      {
        source: "/:locale(pt|en|es)/api/:path*",
        destination: "/api/:path*",
      },
    ]
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "",
    // Suprimir aviso do baseline-browser-mapping sobre dados desatualizados
    BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA: "true",
  },
}

export default withNextIntl(nextConfig)
