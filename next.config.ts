import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '30mb' // 5 images * 5MB each + form data
    }
  }
}

export default nextConfig
