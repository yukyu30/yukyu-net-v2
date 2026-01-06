import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/sitemap'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/status/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
