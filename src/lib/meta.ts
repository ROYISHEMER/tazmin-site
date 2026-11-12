import type { Metadata } from 'next';
import { SITE, type Lang } from '@/config/site';
import { dict, href } from '@/i18n';

/** Per-page metadata with canonical + hreflang alternates. `path` is unlocalised ("/", "/about"). */
export function pageMeta(lang: Lang, path: string, title?: string, description?: string): Metadata {
  const t = dict(lang);
  const fullTitle = title ? `${title} · ${t.meta.siteName}` : t.meta.title;
  const desc = description ?? t.meta.description;
  return {
    metadataBase: new URL(SITE.url),
    title: fullTitle,
    description: desc,
    alternates: {
      canonical: href(path, lang),
      languages: { he: href(path, 'he'), en: href(path, 'en'), 'x-default': href(path, 'he') },
    },
    openGraph: {
      type: 'website',
      siteName: t.meta.siteName,
      title: fullTitle,
      description: desc,
      url: href(path, lang),
      locale: lang === 'he' ? 'he_IL' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description: desc },
  };
}

/** Next 16 hands route params as a Promise. */
export type LangParams = { params: Promise<{ lang: string }> };
export const langOf = async (params: Promise<{ lang: string }>): Promise<Lang> => ((await params).lang === 'en' ? 'en' : 'he');
