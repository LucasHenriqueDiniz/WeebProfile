/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@core", "@source"],
  output: "standalone",
}

module.exports = nextConfig
