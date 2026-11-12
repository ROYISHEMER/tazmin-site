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
        <section aria-labelledby="team-title">
          <h2 id="team-title">{extra(lang).home.team}</h2>
          <ul className="team" role="list">
            {SITE.people.map((p) => (
              <li className="team-card" key={p.phone}>
                {p.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="team-photo" src={p.photo} alt="" loading="lazy" />
                ) : (
                  <span className="team-photo initials" aria-hidden="true">{p.name[lang].split(' ').map((w) => w.slice(0, 1)).join('')}</span>
                )}
                <b>{p.name[lang]}</b>
                {p.role && <span className="team-role">{p.role[lang]}</span>}
                <a className="ltr" href={telHref(p.phone)}>{formatPhone(p.phone)}</a>
              </li>
            ))}
          </ul>
        </section>
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
