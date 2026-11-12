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
 * Logos: marks from the CC0 simple-icons set where one exists; otherwise an official SVG
 * dropped into public/logos/<key>.svg; otherwise a neutral monogram (see public/logos/README.md).
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
  if (existsSync(join(process.cwd(), 'public', 'logos', `${id}.svg`))) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`/logos/${id}.svg`} alt="" />;
  }
  return <span className="monogram" aria-hidden="true">{name.trim().slice(0, 1)}</span>;
}

function Tile({ id, name, kind }: { id: string; name: string; kind: string }) {
  return (
    <li className="tile" data-reveal data-spot>
      <span className="tile-logo"><BrandLogo id={id} name={name} /></span>
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

        <div className="flow">
          <div className="flow-col">
            <p className="flow-label">{s.channelLabel}</p>
            <ul className="tiles single" role="list">
              {s.channel.map((c) => <Tile key={c.key} id={c.key} name={c.name} kind={c.kind} />)}
            </ul>
          </div>

          <div className="flow-hub" aria-hidden="true">
            <span className="flow-line" />
            <span className="hub"><LogoMark /></span>
            <span className="flow-line" />
          </div>

          <div className="flow-col">
            <p className="flow-label">{s.systemsLabel}</p>
            <ul className="tiles" role="list">
              {s.tools.map((c) => <Tile key={c.key} id={c.key} name={c.name} kind={c.kind} />)}
              <li className="tile other" data-reveal>
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
