import Link from 'next/link';
import { dict, href } from '@/i18n';
import { extra } from '@/i18n/extra';
import { SITE, val } from '@/config/site';
import { langOf, pageMeta, type LangParams } from '@/lib/meta';

export async function generateMetadata({ params }: LangParams) {
  const lang = await langOf(params);
  const a = dict(lang).about;
  return pageMeta(lang, '/about', a.title, a.metaDescription);
}

export default async function About({ params }: LangParams) {
  const lang = await langOf(params);
  const a = dict(lang).about;
  const rows: [string, string][] = [
    [a.companyRows.name, val(SITE.legalName[lang], lang)],
    [a.companyRows.id, val(SITE.companyId, lang)],
    [a.companyRows.address, val(SITE.address[lang], lang)],
    [a.companyRows.email, val(SITE.email, lang)],
    [a.companyRows.phone, val(SITE.phone, lang)],
  ];

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
            {rows.map(([k, v]) => (<div className="kv-row" key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
          </dl>
        </section>
        <p><Link className="btn lg" href={href('/contact', lang)}>{extra(lang).nav.talk}</Link></p>
      </div>
    </div>
  );
}
