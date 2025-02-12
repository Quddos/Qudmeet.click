export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/'], 
      }
    ],
    sitemap: 'https://qudmeet.click/sitemap.xml',
    host: 'https://qudmeet.click',
  }
}
