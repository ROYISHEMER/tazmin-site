import Link from 'next/link';
import '@/styles/home.css';
import { Motion } from '@/components/Motion';
import { Check } from '@/components/LogoMark';
import { dict, href } from '@/i18n';
import { extra } from '@/i18n/extra';
import { langOf, pageMeta, type LangParams } from '@/lib/meta';

export async function generateMetadata({ params }: LangParams) {
  const lang = await langOf(params);
  const h = extra(lang).how;
  return pageMeta(lang, '/how-it-works', h.title, h.metaDescription);
}

export default async function HowItWorks({ params }: LangParams) {
  const lang = await langOf(params);
  const t = dict(lang);
  const x = extra(lang);
  const h = x.how;

  return (
    <Motion>
      <div className="scroll-progress" aria-hidden="true" data-progress />
      <div className="page wrap">
        <header className="page-head">
          <p className="eyebrow">{h.title}</p>
          <h1>{h.heading}</h1>
          <p className="lead">{h.lead}</p>
        </header>

        <ol className="how-steps" role="list">
          {t.journey.steps.map((s, i) => (
            <li className="how-step" data-reveal key={s.station}>
              <p className="how-num"><small>{h.stepLabel}</small>{String(i + 1).padStart(2, '0')}</p>
              <div>
                <p className="eyebrow">{s.station}</p>
                <h2>{s.title}</h2>
                <p className="sum">{s.body}</p>
                <ul>
                  {h.details[i].map((line) => <li key={line}><Check w={2.6} /><span>{line}</span></li>)}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <section className="how-block" aria-labelledby="how-states">
          <h2 className="h-section" id="how-states" data-reveal>{h.states.title}</h2>
          <p className="lead" data-reveal>{h.states.lead}</p>
          <ul className="states" role="list">
            {h.states.items.map((it) => (
              <li className={it.k} data-reveal key={it.k}><h3>{it.title}</h3><p>{it.body}</p></li>
            ))}
          </ul>
        </section>

        <section className="how-block" aria-labelledby="how-build">
          <h2 className="h-section" id="how-build" data-reveal>{h.build.title}</h2>
          <p className="lead" data-reveal>{h.build.lead}</p>
          <ul className="build" role="list">
            {h.build.items.map((it) => (
              <li data-reveal data-spot key={it.title}><h3>{it.title}</h3><p>{it.body}</p></li>
            ))}
          </ul>
        </section>

        <section className="how-block" aria-labelledby="how-need">
          <h2 className="h-section" id="how-need" data-reveal>{h.need.title}</h2>
          <p className="lead" data-reveal>{h.need.lead}</p>
          <ul className="need" role="list">
            {h.need.items.map((it) => <li key={it}><Check w={2.6} /><span>{it}</span></li>)}
          </ul>
        </section>

        <div className="cta-band">
          <h2>{h.cta}</h2>
          <Link className="btn lg on-dark" href={href('/contact', lang)}>{x.nav.talk}</Link>
        </div>
      </div>
    </Motion>
  );
}
