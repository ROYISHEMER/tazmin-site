import type { MetadataRoute } from 'next';
import { SITE } from '@/config/site';
import { LANGS, href } from '@/i18n';

export const dynamic = 'force-static';
const PATHS = ['/', '/how-it-works', '/about', '/contact', '/accessibility', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((p) =>
    LANGS.map((lang) => ({
      url: SITE.url + href(p, lang),
      alternates: { languages: Object.fromEntries(LANGS.map((l) => [l, SITE.url + href(p, l)])) },
    })),
  );
}
