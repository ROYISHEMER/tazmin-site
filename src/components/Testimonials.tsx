import { TESTIMONIALS } from '@/config/testimonials';
import { DEMO, DEMO_TESTIMONIALS } from '@/config/demo';
import type { Lang } from '@/config/site';
import { extra } from '@/i18n/extra';

/** Customer quotes. Renders nothing until src/config/testimonials.ts has real entries
 *  (or, in a local preview with DEMO_CONTENT=1, labelled samples from src/config/demo.ts). */
export function Testimonials({ lang }: { lang: Lang }) {
  // Real quotes always win; the made-up ones show only in a local preview and are labelled.
  const sample = !TESTIMONIALS.length && DEMO;
  const quotes = sample ? DEMO_TESTIMONIALS : TESTIMONIALS;
  if (!quotes.length) return null;
  const x = extra(lang).proof;
  return (
    <section className="proof" aria-labelledby="proof-title">
      <div className="wrap">
        <p className="eyebrow" data-reveal>{x.eyebrow}</p>
        <h2 className="h-section" id="proof-title" data-reveal>{x.title}{sample && <span className="sample-tag">{extra(lang).home.sample}</span>}</h2>
        <ul className="quotes" role="list">
          {quotes.map((q, i) => (
            <li className="quote-card" data-reveal data-spot key={i}>
              <blockquote>{q.quote[lang]}</blockquote>
              <p className="quote-by"><b>{q.name[lang]}</b><span>{q.role[lang]}</span></p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
