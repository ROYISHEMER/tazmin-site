import Link from 'next/link';
import { dict, href } from '@/i18n';
import { extra } from '@/i18n/extra';
import { SITE, val, formatPhone, telHref } from '@/config/site';
import { langOf, pageMeta, type LangParams } from '@/lib/meta';

export async function generateMetadata({ params }: LangParams) {
  const lang = await langOf(params);
  const a = dict(lang).about;
  return pageMeta(lang, '/about', a.title, a.metaDescription);
}

export default async function About({ params }: LangParams) {
  const lang = await langOf(params);
  const a = dict(lang).about;

  return (
    <div className="page wrap">
      <header className="page-head">
        <p className="eyebrow">{a.title}</p>
        <h1>{a.heading}</h1>
        <p className="lead">{a.lead}</p>
      </header>
      <div className="prose">
        {a.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p.map((p) => <p key={p}>{p}</p>)}
          </section>
        ))}
        <section className="card" aria-labelledby="company-title">
          <h2 id="company-title">{a.companyTitle}</h2>
          <dl className="kv">
            <dt>{a.companyRows.name}</dt>
            <dd>{val(SITE.legalName[lang], lang)}</dd>
            <dt>{a.companyRows.address}</dt>
            <dd>{val(SITE.address[lang], lang)}</dd>
            <dt>{a.companyRows.email}</dt>
            <dd>{SITE.email ? <a className="ltr" href={`mailto:${SITE.email}`}>{SITE.email}</a> : val(null, lang)}</dd>
            <dt>{a.companyRows.phone}</dt>
            <dd>
              <ul className="people">
                {SITE.people.map((p) => (
                  <li key={p.phone}>{p.name[lang]}: <a className="ltr" href={telHref(p.phone)}>{formatPhone(p.phone)}</a></li>
                ))}
              </ul>
            </dd>
          </dl>
        </section>
        <p><Link className="btn lg" href={href('/contact', lang)}>{extra(lang).nav.talk}</Link></p>
      </div>
    </div>
  );
}
