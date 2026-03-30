// next.config.js — Oracle Compass unified config
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  publicExcludes: ['!crm/**/*']
})

module.exports = withPWA({
  reactStrictMode: true,
  serverExternalPackages: ['googleapis'],
  async headers() {
    return [
      {
        // Force fresh fetch on geo files — bypass SW cache and CDN cache entirely
        source: '/geo/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      { source: '/crm', destination: '/crm/index.html' },
      { source: '/crm/', destination: '/crm/index.html' }
    ]
  }
})

