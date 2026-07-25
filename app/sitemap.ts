import { MetadataRoute } from 'next';
import { MEDIA_ITEMS, CATEGORIES_LIST } from '@/lib/data/mockData';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://elena-vance.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/explore', '/videos', '/images', '/trending', '/categories', '/creator', '/contact', '/privacy', '/terms'].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const categoryRoutes = CATEGORIES_LIST.map((c) => ({
    url: `${SITE_URL}/categories/${c.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const mediaRoutes = MEDIA_ITEMS.map((m) => ({
    url: `${SITE_URL}/media/${m.id}`,
    lastModified: new Date(m.publishedAt).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...categoryRoutes, ...mediaRoutes];
}
