import { MetadataRoute } from 'next'

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
          '/reset-password',
          '/dashboard/private/*'
        ],
      }
    ],
    sitemap: 'https://qudmeet.click/sitemap.xml',
    host: 'https://qudmeet.click',
  }
}
