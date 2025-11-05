import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects'

const getImageRemotePatterns = () => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL!
  const url = new URL(serverUrl)
  const protocol = url.protocol.replace(':', '') as 'http' | 'https'
  const hostname = url.hostname

  const patterns = [
    {
      protocol,
      hostname,
    },
  ]

  if (hostname !== 'localhost' && !hostname.startsWith('www.')) {
    const parts = hostname.split('.')
    if (parts.length === 2) {
      patterns.push({
        protocol,
        hostname: `www.${hostname}`,
      })
    }
  }

  return patterns
}

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: getImageRemotePatterns(),
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [100, 75, 50, 25],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development' ? { exclude: ['error', 'warn'] } : false,
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    resolveAlias: {
      underscore: 'lodash',
    },
    resolveExtensions: [
      '.mdx',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.cts',
      '.cjs',
      '.mts',
      '.mjs',
      '.json',
    ],
  },
  reactStrictMode: true,
  redirects,
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
