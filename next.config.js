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
  async rewrites() {
    return [
      { source: '/crm', destination: '/crm/index.html' },
      { source: '/crm/', destination: '/crm/index.html' }
    ]
  }
})
