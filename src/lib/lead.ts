/**
 * Lead ("Talk to us") contract, shared by the browser form, the local dev endpoint
 * and the Cloudflare Pages Function. Keep it dependency-free.
 */
export interface Lead {
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  vertical: string;
  erp: string;
  volume: string;
  message: string;
  lang: 'he' | 'en';
  page: string;
}

export type LeadErrorCode = 'required' | 'email' | 'phone' | 'consent' | 'too_long';
export type LeadErrors = Partial<Record<keyof Lead | 'consent', LeadErrorCode>>;
export type LeadResult =
  | { ok: true; lead: Lead }
  | { ok: false; errors: LeadErrors }
  /** Honeypot or impossible timing: answer 200 to the bot, store nothing. */
  | { ok: 'spam' };

const MAX: Record<keyof Lead, number> = {
  name: 120, company: 160, role: 120, email: 200, phone: 40, vertical: 80, erp: 80, volume: 40, message: 4000, lang: 2, page: 200,
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d][\d\s()+\-.]{6,}$/;

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

export function validateLead(input: unknown): LeadResult {
  const src = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;

  // Bots fill the hidden "website" field, or submit faster than a person can type.
  if (str(src.website) !== '') return { ok: 'spam' };
  const elapsed = Number(src.elapsed);
  if (Number.isFinite(elapsed) && elapsed < 1500) return { ok: 'spam' };

  const lead: Lead = {
    name: str(src.name),
    company: str(src.company),
    role: str(src.role),
    email: str(src.email),
    phone: str(src.phone),
    vertical: str(src.vertical),
    erp: str(src.erp),
    volume: str(src.volume),
    message: str(src.message),
    lang: src.lang === 'en' ? 'en' : 'he',
    page: str(src.page),
  };

  const errors: LeadErrors = {};
  (['name', 'company', 'email'] as const).forEach((k) => {
    if (!lead[k]) errors[k] = 'required';
  });
  if (lead.email && !EMAIL.test(lead.email)) errors.email = 'email';
  if (lead.phone && !PHONE.test(lead.phone)) errors.phone = 'phone';
  (Object.keys(MAX) as (keyof Lead)[]).forEach((k) => {
    if (lead[k].length > MAX[k]) errors[k] = 'too_long';
  });
  if (src.consent !== true) errors.consent = 'consent';

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, lead };
}

/** Plain-text summary used for the notification email and the mailto fallback. */
export function leadToText(lead: Lead): string {
  const rows: [string, string][] = [
    ['Name', lead.name],
    ['Company', lead.company],
    ['Role', lead.role],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Industry', lead.vertical],
    ['ERP', lead.erp],
    ['Orders/day', lead.volume],
    ['Language', lead.lang],
    ['Page', lead.page],
  ];
  return rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n') + (lead.message ? `\n\n${lead.message}` : '');
}
