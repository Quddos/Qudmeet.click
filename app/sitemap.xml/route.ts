import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://qudmeet.click'
  
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/tools/converter',
    '/tools/business-idea',
    '/tools/interview',
    '/tools/qrcode',
    '/tools/research-analysis',
    '/tools/resume-analysis',
    '/tools/ai-humanizer'
  ]

  const currentDate = new Date().toISOString()

  // Remove any whitespace between XML tags for cleaner output
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticRoutes.map(route => `<url>
  <loc>${baseUrl}${route}</loc>
  <lastmod>${currentDate}</lastmod>
  <changefreq>daily</changefreq>
  <priority>${route === '' ? '1.0' : '0.8'}</priority>
</url>`).join('')}
</urlset>`.trim()

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'x-robots-tag': 'index, follow',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600'
    }
  })
} 