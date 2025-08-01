/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações para produção
  compress: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configuração para Puppeteer no Vercel
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core"],
  },
  // Configuração específica para Vercel
  output: "standalone",
}

module.exports = nextConfig
