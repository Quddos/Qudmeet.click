import { NextResponse } from 'next/server';

export async function GET() {
  // Add all your dynamic routes here
  const routes = [
    '/tools/converter',
    '/tools/business-idea',
    '/tools/qrcode',
    '/tools/interview',
    '/tools/research-analysis',
    '/tools/resume-analysis',
    '/tools/ai-humanizer',
    
    

    // Add all your tool paths
    '/about',
    '/contact',
    '/dashboard',
    // Add other static routes
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${routes
        .map((route) => {
          return `
            <url>
              <loc>https://qudmeet.click${route}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>daily</changefreq>
              <priority>0.7</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
} 