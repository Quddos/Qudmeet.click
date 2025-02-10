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
        ],
      },
    ]
  },
}

module.exports = nextConfig 