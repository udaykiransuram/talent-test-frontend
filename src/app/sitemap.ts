import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';
  const now = new Date();
  const routes = [
    '',
    '/product',
    '/benefits',
    '/case-study',
    '/about',
    '/contact',
    '/talent-test',
    '/terms',
  ];
  return routes.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7,
  }));
}
