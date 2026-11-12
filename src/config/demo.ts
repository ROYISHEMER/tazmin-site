import type { Lang } from './site';
import type { Testimonial } from './testimonials';

/**
 * SAMPLE CONTENT FOR LOCAL PREVIEW ONLY. Everything in this file is made up.
 *
 * It is shown only by the development server (`npm run dev`) and only when DEMO_CONTENT=1 is
 * set in .env.local, which never leaves this computer. Every piece is labelled "sample
 * content" on screen. Production builds, the landing-page export and the deployed site never
 * include it, so none of this can reach visitors by accident.
 *
 * When there is real content, put it in testimonials.ts / site.ts; real content always
 * wins over the samples. This file can then be deleted together with its three call sites.
 */
// Development server only: a production build never includes the samples, even on this computer.
export const DEMO = process.env.NODE_ENV !== 'production' && process.env.DEMO_CONTENT === '1';

export const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    quote: {
      he: 'הנציגים שלנו הפסיקו להקליד הזמנות שורה אחרי שורה. הם מעבירים את ההודעה ומקבלים טיוטה מוכנה לבדיקה.',
      en: 'Our reps stopped retyping orders line by line. They forward the message and get a draft ready to review.',
    },
    name: { he: 'שם לדוגמה', en: 'Sample name' },
    role: { he: 'מנהל מכירות, מפיץ חשמל', en: 'Sales manager, electrical distributor' },
  },
  {
    quote: {
      he: 'מה ששכנע אותי הוא שהמערכת לא מנחשת. כשמשהו לא ברור היא עוצרת, והנציג מחליט.',
      en: 'What convinced me is that it does not guess. When something is unclear it stops, and the rep decides.',
    },
    name: { he: 'שם לדוגמה', en: 'Sample name' },
    role: { he: 'בעלים, מפיץ ציוד סולארי', en: 'Owner, solar equipment distributor' },
  },
  {
    quote: {
      he: 'גם כשהנציג הוותיק בחופש, ההזמנות ממשיכות לצאת. הכינויים של הלקוחות כבר שמורים במערכת.',
      en: 'Even when our veteran rep is away, orders keep going out. The customers’ nicknames are already in the system.',
    },
    name: { he: 'שם לדוגמה', en: 'Sample name' },
    role: { he: 'מנהלת תפעול, מפיץ אינסטלציה', en: 'Operations manager, plumbing distributor' },
  },
];

export const DEMO_PRICING: Record<Lang, string> = {
  he: 'פיילוט של שבועיים ללא עלות. אחריו מנוי חודשי קבוע, לפי מספר הנציגים, בלי התחייבות לשנה.',
  en: 'A two-week pilot at no cost. After that a fixed monthly subscription per rep, with no annual commitment.',
};

/** Sample roles, in the order of SITE.people. */
export const DEMO_ROLES: Record<Lang, string>[] = [
  { he: 'מנכ״ל ומוצר', en: 'CEO & product' },
  { he: 'טכנולוגיה', en: 'Technology' },
  { he: 'מכירות ולקוחות', en: 'Sales & customers' },
];
