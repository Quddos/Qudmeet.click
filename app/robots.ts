import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/private/',
          '/sign-in',
          '/sign-up',
          '/dashboard/private/*'
        ],
      }
    ],
    sitemap: 'https://qudmeet.click/sitemap.xml',
  }
}
