import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://qudmeet.click',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://qudmeet.click/interview',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://qudmeet.click/opportunities/job-board',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://qudmeet.click/tools/resume-analyzer',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://qudmeet.click/tools/qr-generator',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://qudmeet.click/tools/file-converter',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Add all your important routes here
  ]
}