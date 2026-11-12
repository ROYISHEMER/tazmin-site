/**
 * Business details shown across the site (footer, contact, about, legal pages).
 *
 * A field that is `null` prints a visible "[to complete]" marker wherever it is required,
 * so nothing invented ever reaches a visitor.
 */
export type Lang = 'he' | 'en';

export interface Person {
  name: Record<Lang, string>;
  /** Local format, digits only: "0524369558". */
  phone: string;
}

/** The people behind Tazmin. The first one is the primary contact. */
const PEOPLE: Person[] = [
  { name: { he: 'רועי שמר', en: 'Royi Shemer' }, phone: '0524369558' },
  { name: { he: 'גיא עקריש', en: 'Guy Akrish' }, phone: '0525292540' },
  { name: { he: 'אלעד גנבר', en: 'Elad Ganbar' }, phone: '0543121294' },
];

/**
 * Production origin, no trailing slash. Used for canonical links, hreflang and the sitemap.
 * Order: NEXT_PUBLIC_SITE_URL (set this once you have your own domain), then the Vercel
 * production domain (provided automatically on Vercel), then a placeholder for local work.
 */
const ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://tazmin.example');

export const SITE = {
  url: ORIGIN.replace(/\/$/, ''),

  /**
   * Who operates the site. There is no registered company yet, so this is the three
   * founders by name. Replace with the legal entity (and add its number to the legal
   * pages) once it is registered.
   */
  legalName: { he: 'רועי שמר, גיא עקריש ואלעד גנבר', en: 'Royi Shemer, Guy Akrish and Elad Ganbar' } as Record<Lang, string | null>,
  address: { he: 'הוד 10, חיפה', en: '10 Hod St., Haifa, Israel' } as Record<Lang, string | null>,

  email: 'vn17198royi@gmail.com' as string | null,
  people: PEOPLE,
  /** Digits only, international format without "+", e.g. "972501234567". Not set: the row is hidden. */
  whatsapp: null as string | null,

  /**
   * Accessibility coordinator — required in the Israeli accessibility statement.
   * Defaults to the primary contact; change it if someone else takes the role.
   */
  a11yCoordinator: {
    name: PEOPLE[0].name as Record<Lang, string | null>,
    email: null as string | null,
    phone: PEOPLE[0].phone as string | null,
  },

  /** Privacy contact; falls back to `email`. */
  privacyEmail: null as string | null,

  /** Dates printed on the legal pages (ISO). Update whenever the text changes. */
  legalUpdated: '2026-11-12',
  a11yUpdated: '2026-11-12',
};

const MISSING = { he: '[להשלים]', en: '[to complete]' } as const;

/** Value or a visible placeholder. */
export const val = (v: string | null | undefined, lang: Lang): string => v ?? MISSING[lang];
export const isSet = (v: string | null | undefined): v is string => typeof v === 'string' && v.length > 0;

/** "0524369558" → "052-436-9558" */
export const formatPhone = (p: string): string => p.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
/** "0524369558" → "+972524369558" for tel: links */
export const telHref = (p: string): string => `tel:+972${p.replace(/\D/g, '').replace(/^0/, '')}`;

/** Primary phone, formatted. */
export const primaryPhone = (): string | null => (SITE.people[0] ? formatPhone(SITE.people[0].phone) : null);
