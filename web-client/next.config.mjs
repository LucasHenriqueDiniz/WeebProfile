/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com", "cdn.myanimelist.net", "lastfm.freetls.fastly.net", "placecats"],
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
