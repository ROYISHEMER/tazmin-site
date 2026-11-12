import { existsSync } from 'node:fs';
import { join } from 'node:path';
import Link from 'next/link';
import { siGooglesheets, siSap, siWhatsapp } from 'simple-icons';
import { LogoMark } from './LogoMark';
import { dict, href, type Lang } from '@/i18n';

/**
 * "Works with the software you already use": the channel orders come from, Tazmin in the
 * middle, and the systems the approved order goes into.
 *
 * Logos: marks from the CC0 simple-icons set where one exists; otherwise the official file
 * in public/logos/<key>.(svg|png|webp); otherwise a neutral monogram (see public/logos/README.md).
 *
 * Motion: the entrance is driven by <Motion> through the data-flow-* hooks; the flowing
 * dashes, the travelling dot and the hub pulse are CSS (home.css) and stop with reduced motion.
 */
const MARKS: Record<string, { path: string; hex: string }> = {
  whatsapp: siWhatsapp,
  sap: siSap,
  sheets: siGooglesheets,
};

function BrandLogo({ id, name }: { id: string; name: string }) {
  const mark = MARKS[id];
  if (mark) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ color: `#${mark.hex}` }}>
        <path d={mark.path} fill="currentColor" />
      </svg>
    );
  }
  const ext = ['svg', 'png', 'webp'].find((e) => existsSync(join(process.cwd(), 'public', 'logos', `${id}.${e}`)));
  if (ext) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`/logos/${id}.${ext}`} alt="" />;
  }
  return <span className="monogram" aria-hidden="true">{name.trim().slice(0, 1)}</span>;
}

/** Logos drawn in white for dark backgrounds: shown unchanged, on a dark plate. */
const ON_DARK = new Set(['rivhit']);

function Tile({ id, name, kind, hook }: { id: string; name: string; kind: string; hook: 'in' | 'tile' }) {
  return (
    <li className="tile" data-spot {...(hook === 'in' ? { 'data-flow-in': '' } : { 'data-flow-tile': '' })}>
      <span className={`tile-logo${ON_DARK.has(id) ? ' on-dark' : ''}`}><BrandLogo id={id} name={name} /></span>
      <b>{name}</b>
      <small>{kind}</small>
    </li>
  );
}

export function Integrations({ lang }: { lang: Lang }) {
  const s = dict(lang).systems;
  return (
    <section className="systems" id="integrations">
      <div className="wrap">
        <div className="systems-head">
          <p className="eyebrow" data-reveal>{s.eyebrow}</p>
          <h2 className="h-section" data-reveal>{s.title}</h2>
          <p className="lead" data-reveal>{s.lead}</p>
        </div>

        <div className="flow" data-flow>
          <div className="flow-col">
            <p className="flow-label">{s.channelLabel}</p>
            <ul className="tiles single" role="list">
              {s.channel.map((c) => <Tile key={c.key} id={c.key} name={c.name} kind={c.kind} hook="in" />)}
            </ul>
          </div>

          <div className="flow-hub" aria-hidden="true">
            <span className="flow-line" data-flow-line><i /></span>
            <span className="hub" data-flow-hub><LogoMark /></span>
            <span className="flow-line" data-flow-line><i /></span>
          </div>

          <div className="flow-col">
            <p className="flow-label">{s.systemsLabel}</p>
            <ul className="tiles" role="list">
              {s.tools.map((c) => <Tile key={c.key} id={c.key} name={c.name} kind={c.kind} hook="tile" />)}
              <li className="tile other" data-flow-tile>
                <b>{s.other}</b>
                <Link href={href('/contact', lang)}>{s.otherCta} <span className="arrow-i" aria-hidden="true" /></Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="systems-foot">
          <p className="verticals"><span>{s.verticalsLabel}</span>{s.verticals.map((v) => <span className="chip plain" key={v}>{v}</span>)}</p>
          <p className="sys-note">{s.note}</p>
        </div>
      </div>
    </section>
  );
}
