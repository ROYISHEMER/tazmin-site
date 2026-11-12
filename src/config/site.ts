/**
 * Business details shown across the site (footer, contact, legal pages).
 *
 * BEFORE LAUNCH: fill in every field that is `null`. While a field is `null`
 * the site prints a visible "[to complete]" marker in its place, so nothing
 * invented ever reaches a visitor.
 */
export const SITE = {
  /** Production origin, no trailing slash. Also set `site` in astro.config.mjs. */
  url: 'https://tazmin.example',

  /** Registered legal entity that operates the site. */
  legalName: { he: null as string | null, en: null as string | null },
  /** Company / dealer number (ח.פ. / ע.מ.). */
  companyId: null as string | null,
  address: { he: null as string | null, en: null as string | null },

  email: null as string | null,
  phone: null as string | null,
  /** Digits only, international format without "+", e.g. "972501234567". */
  whatsapp: null as string | null,

  /** Accessibility coordinator — required in the Israeli accessibility statement. */
  a11yCoordinator: {
    name: { he: null as string | null, en: null as string | null },
    email: null as string | null,
    phone: null as string | null,
  },

  /** Privacy contact (may be the same mailbox as `email`). */
  privacyEmail: null as string | null,

  /** Dates printed on the legal pages (ISO). Update whenever the text changes. */
  legalUpdated: '2026-11-12',
  a11yUpdated: '2026-11-12',
} as const;

export type Lang = 'he' | 'en';

const MISSING = { he: '[להשלים]', en: '[to complete]' } as const;

/** Value or a visible placeholder. */
export const val = (v: string | null | undefined, lang: Lang): string => v ?? MISSING[lang];
export const isSet = (v: string | null | undefined): v is string => typeof v === 'string' && v.length > 0;
