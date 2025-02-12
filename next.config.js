/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'remotive.com',
      'remoteok.com',
      'assets.remoteok.com',
      'remotive.io',
      'jobs.github.com',
      'logo.clearbit.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Add your permanent redirects here
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate'
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig 