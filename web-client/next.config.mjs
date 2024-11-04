/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  transpilePackages: ["@core", "@source"],
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "cdn.myanimelist.net" },
      { hostname: "lastfm.freetls.fastly.net" },
      { hostname: "placecats" },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          stream: false,
          zlib: false,
          perf_hooks: false,
          assert: false,
          util: false,
          fs: false,
          net: false,
          dns: false,
          tls: false,
          request: false,
          document: false,
          "image-to-base64": false,
        },
      }
    }
    return config
  },
  rewrites() {
    return [
      { source: "/healthz", destination: "/api/health" },
      { source: "/api/healthz", destination: "/api/health" },
      { source: "/health", destination: "/api/health" },
      { source: "/ping", destination: "/api/health" },
    ]
  },
}

export default config
