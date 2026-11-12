import type { Lang } from './site';

/**
 * Customer quotes shown on the home page. The section appears only when this list has
 * at least one entry, so nothing is shown until there is something real to show.
 *
 * Add only quotes a customer actually gave and agreed to publish, for example:
 *
 *   {
 *     quote: { he: '…', en: '…' },
 *     name: { he: 'שם מלא', en: 'Full name' },
 *     role: { he: 'מנהל מכירות, שם החברה', en: 'Sales manager, Company' },
 *   },
 */
export interface Testimonial {
  quote: Record<Lang, string>;
  name: Record<Lang, string>;
  role: Record<Lang, string>;
}

export const TESTIMONIALS: Testimonial[] = [];
