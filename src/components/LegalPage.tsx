import { dict, fill, formatDate, type Lang } from '@/i18n';
import { LEGAL } from '@/i18n/legal';
import { SITE } from '@/config/site';

type Doc = keyof typeof LEGAL;

/** Shared renderer for the accessibility statement, privacy policy and terms of use. */
export function LegalPage({ lang, doc }: { lang: Lang; doc: Doc }) {
  const d = LEGAL[doc][lang];
  const c = dict(lang).legalCommon;
  const updated = doc === 'accessibility' ? SITE.a11yUpdated : SITE.legalUpdated;
  const f = (s: string) => fill(s, lang);

  return (
    <div className="page wrap">
      <header className="page-head">
        <h1>{d.title}</h1>
        <p className="meta">{c.updated}: <time dateTime={updated}>{formatDate(updated, lang)}</time></p>
      </header>
      <div className="prose">
        <p className="draft" role="note">{c.draftBanner}</p>
        {d.intro.map((p) => <p key={p}>{f(p)}</p>)}
        <nav className="toc" aria-labelledby="toc-title">
          <h2 id="toc-title">{c.toc}</h2>
          <ol>
            {d.sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.h}</a></li>)}
          </ol>
        </nav>
        {d.sections.map((s) => (
          <section id={s.id} key={s.id}>
            <h2>{s.h}</h2>
            {s.p?.map((p) => <p key={p}>{f(p)}</p>)}
            {s.list && <ul>{s.list.map((li) => <li key={li}>{f(li)}</li>)}</ul>}
            {s.after?.map((p) => <p key={p}>{f(p)}</p>)}
          </section>
        ))}
      </div>
    </div>
  );
}
