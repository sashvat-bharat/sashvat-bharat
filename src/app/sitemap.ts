import type { MetadataRoute } from 'next';
import { getAllArticlesList } from '@/lib/articles';
import { getAllResearchList } from '@/lib/markdown';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sashvat.com';
  const now = new Date();

  // Core static pages with tailored priorities and frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/legal`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/legal/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Research routes with actual publication dates
  const researchPapers = getAllResearchList();
  const researchRoutes: MetadataRoute.Sitemap = researchPapers.map((paper) => ({
    url: `${baseUrl}/research/${paper.slug}`,
    lastModified: paper.frontmatter?.date ? new Date(paper.frontmatter.date) : now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Article routes with actual publication dates
  const articles = getAllArticlesList();
  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: article.frontmatter?.date ? new Date(article.frontmatter.date) : now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...researchRoutes, ...articleRoutes];
}
