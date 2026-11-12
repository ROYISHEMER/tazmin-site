import { TESTIMONIALS } from '@/config/testimonials';
import type { Lang } from '@/config/site';
import { extra } from '@/i18n/extra';

/** Customer quotes. Renders nothing until src/config/testimonials.ts has real entries. */
export function Testimonials({ lang }: { lang: Lang }) {
  if (!TESTIMONIALS.length) return null;
  const x = extra(lang).proof;
  return (
    <section className="proof" aria-labelledby="proof-title">
      <div className="wrap">
        <p className="eyebrow" data-reveal>{x.eyebrow}</p>
        <h2 className="h-section" id="proof-title" data-reveal>{x.title}</h2>
        <ul className="quotes" role="list">
          {TESTIMONIALS.map((q) => (
            <li className="quote-card" data-reveal data-spot key={q.name.he}>
              <blockquote>{q.quote[lang]}</blockquote>
              <p className="quote-by"><b>{q.name[lang]}</b><span>{q.role[lang]}</span></p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
