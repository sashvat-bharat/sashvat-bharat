import { MetadataRoute } from 'next';
import { getResearchSlugs } from '@/lib/markdown';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sashvat.com';

  // Base routes
  const routes = [
    '',
    '/research',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // Research routes
  const researchSlugs = getResearchSlugs();
  const researchRoutes = researchSlugs.map((slug) => ({
    url: `${baseUrl}/research/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...researchRoutes];
}
