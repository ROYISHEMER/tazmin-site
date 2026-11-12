import { ContactForm } from '@/components/ContactForm';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { dict } from '@/i18n';
import { extra } from '@/i18n/extra';
import { SITE, isSet, val, formatPhone, telHref } from '@/config/site';
import { langOf, pageMeta, type LangParams } from '@/lib/meta';

export async function generateMetadata({ params }: LangParams) {
  const lang = await langOf(params);
  return pageMeta(lang, '/contact', extra(lang).nav.talk, dict(lang).contact.metaDescription);
}

export default async function Contact({ params }: LangParams) {
  const lang = await langOf(params);
  const c = dict(lang).contact;
  const x = extra(lang);

  return (
    <div className="page wrap">
      <header className="page-head">
        <p className="eyebrow">{x.nav.talk}</p>
        <h1>{c.heading}</h1>
        <p className="lead">{c.lead}</p>
      </header>
      <div className="contact-grid">
        <div className="card">
          <ContactForm lang={lang} id="contact" />
        </div>
        <aside className="card contact-side" aria-labelledby="direct-title">
          <h2 id="direct-title">{c.direct}</h2>
          <dl className="kv">
            <dt>{c.email}</dt>
            <dd>{isSet(SITE.email) ? <a className="ltr" href={`mailto:${SITE.email}`}>{SITE.email}</a> : val(null, lang)}</dd>
            <dt>{c.phone}</dt>
            <dd>
              <ul className="people">
                {SITE.people.map((p) => (
                  <li key={p.phone}>{p.name[lang]}: <a className="ltr" href={telHref(p.phone)}>{formatPhone(p.phone)}</a></li>
                ))}
              </ul>
            </dd>
            {isSet(SITE.whatsapp) && (
              <>
                <dt>{c.whatsapp}</dt>
                <dd><a className="ltr" href={`https://wa.me/${SITE.whatsapp}`} rel="noopener">+{SITE.whatsapp}</a></dd>
              </>
            )}
            <dt>{dict(lang).about.companyRows.address}</dt>
            <dd>{val(SITE.address[lang], lang)}</dd>
          </dl>
          <WhatsAppButton lang={lang} className="btn" />
        </aside>
      </div>
    </div>
  );
}
