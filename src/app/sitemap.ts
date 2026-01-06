import type { MetadataRoute } from 'next'
import { generateSitemapEntries } from '@/lib/sitemap'

export default function sitemap(): MetadataRoute.Sitemap {
  return generateSitemapEntries()
}
