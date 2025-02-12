import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://qudmeet.click', lastModified: new Date() },
    { url: 'https://qudmeet.click/about', lastModified: new Date() },
    { url: 'https://qudmeet.click/contact', lastModified: new Date() },
    { url: 'https://qudmeet.click/privacy-policy', lastModified: new Date() },
    { url: 'https://qudmeet.click/terms-of-service', lastModified: new Date() },
    { url: 'https://qudmeet.click/tools/converter', lastModified: new Date() },
    { url: 'https://qudmeet.click/tools/business-idea', lastModified: new Date() },
    { url: 'https://qudmeet.click/tools/qrcode', lastModified: new Date() },
    { url: 'https://qudmeet.click/tools/research-analysis', lastModified: new Date() },
    { url: 'https://qudmeet.click/tools/resume-analysis', lastModified: new Date() },
    { url: 'https://qudmeet.click/tools/ai-humanizer', lastModified: new Date() },
    { url: 'https://qudmeet.click/opportunities/job-board', lastModified: new Date() },
    { url: 'https://qudmeet.click/dashboard', lastModified: new Date() },
  ]
}
