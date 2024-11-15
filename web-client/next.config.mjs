/**
 * @type {import('next').NextConfig}
 */

const config = {
  reactStrictMode: true,
  transpilePackages: ["@core", "@source"],
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    config.cache = false

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
  compiler: {
    removeConsole: false,
  },
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "cdn.myanimelist.net" },
      { hostname: "lastfm.freetls.fastly.net" },
      { hostname: "placecats" },
    ],
  },
  headers:
    process.env.NODE_ENV === "development"
      ? () => [
          {
            source: "/_next/static/css/_app-client_src_app_globals_css.css",
            headers: [{ key: "Vary", value: "*" }],
          },
        ]
      : undefined,
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
