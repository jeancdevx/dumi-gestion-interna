import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets-dumi-dev.edducode.me',
        pathname: '/**'
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '30mb' // 5 images * 5MB each + form data
    }
  }
}

export default nextConfig
