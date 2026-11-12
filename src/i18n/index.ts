import { SITE, val, formatPhone, primaryPhone, type Lang } from '../config/site';
import { he, type Dict } from './he';
import { en } from './en';

export type { Lang, Dict };
export const LANGS: Lang[] = ['he', 'en'];
export const DEFAULT_LANG: Lang = 'he';

export const dict = (lang: Lang): Dict => (lang === 'en' ? en : he);
export const dirOf = (lang: Lang): 'rtl' | 'ltr' => (lang === 'he' ? 'rtl' : 'ltr');

export const isLang = (v: string): v is Lang => v === 'he' || v === 'en';

/** generateStaticParams for the `[lang]` segment. */
export const langParams = () => LANGS.map((lang) => ({ lang }));

/** Localised path: href('/about', 'en') → '/en/about'; href('/', 'he') → '/he'. */
// In the single-file landing export (see scripts/export-landing.mjs) there is no site around
// the page: other pages become absolute links to the live site, home anchors stay in-page.
const STANDALONE = process.env.NEXT_PUBLIC_TAZMIN_EXPORT === '1';

export const href = (path: string, lang: Lang): string => {
  if (STANDALONE) return path === '/' ? '#' : `${SITE.url}/${lang}${path}`;
  return `/${lang}${path === '/' ? '' : path}`;
};

/** Link to a section of the home page. */
export const homeAnchor = (id: string, lang: Lang): string => (STANDALONE ? `#${id}` : `/${lang}#${id}`);

/** Fill {tokens} in legal text from site config; missing values print a visible marker. */
export const fill = (text: string, lang: Lang): string => {
  const map: Record<string, string | null> = {
    legalName: SITE.legalName[lang],
    address: SITE.address[lang],
    email: SITE.email,
    phone: primaryPhone(),
    privacyEmail: SITE.privacyEmail ?? SITE.email,
    a11yName: SITE.a11yCoordinator.name[lang],
    a11yEmail: SITE.a11yCoordinator.email ?? SITE.email,
    a11yPhone: SITE.a11yCoordinator.phone ? formatPhone(SITE.a11yCoordinator.phone) : primaryPhone(),
  };
  return text.replace(/\{(\w+)\}/g, (_, k: string) => val(map[k], lang));
};

export const formatDate = (iso: string, lang: Lang): string =>
  new Intl.DateTimeFormat(lang === 'he' ? 'he-IL' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
