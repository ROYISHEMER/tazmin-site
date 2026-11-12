import type { CSSProperties, ReactNode } from 'react';
import { LogoMark, Check } from './LogoMark';
import { dict, type Lang } from '@/i18n';
import type { Line } from '@/i18n/he';
import { JOURNEY_LENGTH } from '@/lib/journey';

/**
 * The scroll-driven story: one WhatsApp message travelling all the way to an ERP order.
 *
 * The message is the main character. Its five lines leave the rep's phone, land in one
 * card, and that same card is then parsed, matched, priced, approved and finally sent:
 * nothing is swapped for an unrelated screen along the way.
 *
 * This file is plain server-rendered markup. <Motion> (client) finds it by its data-*
 * hooks and drives it with GSAP. Without JS, with reduced motion, or with "stop
 * animations" on, it renders as a numbered list of the nine steps: the illustration is
 * hidden and the text says everything.
 */
const BARS = [5, 9, 14, 8, 12, 16, 7, 11, 15, 6, 10, 13, 5, 9, 12, 7, 4];
const BUBBLE = 'M4 5h16v11h-9l-4 3v-3H4z';
const pad = (n: number) => String(n).padStart(2, '0');

/** A voice note: play glyph, waveform, duration. */
function Voice({ time }: { time: string }) {
  return (
    <span className="vox">
      <svg className="play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
      <span className="wave">{BARS.map((h, i) => <i key={i} style={{ height: `${h / 10}em` }} />)}</span>
      <span className="mono">{time}</span>
    </span>
  );
}

/** The message line exactly as the customer sent it. */
function Original({ line, voice }: { line: Line; voice: string }): ReactNode {
  return line.src === 'voice' ? <Voice time={voice} /> : line.raw;
}

/** The same line once it is read: plain text, with the quantity picked out. */
function Parsed({ line }: { line: Line }) {
  const m = line.src === 'voice' ? null : /^(.*?)(\d+)(.*)$/.exec(line.raw);
  if (!m) return <>{line.raw}</>;
  return <>{m[1]}<mark data-num>{m[2]}</mark>{m[3]}</>;
}

export function Journey({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const j = t.journey;
  const ui = j.ui;
  const n = j.steps.length;
  const lines = ui.lines;
  // Where each line sits in the phone, top to bottom: text lines, a voice note, a handwritten note.
  // The card keeps the same order, so lines never cross on their way over.
  const typed = lines.map((l, i) => ({ l, i })).filter((x) => x.l.src === 'text');
  const noted = lines.map((l, i) => ({ l, i })).filter((x) => x.l.src === 'hand');
  const spoken = lines.map((l, i) => ({ l, i })).filter((x) => x.l.src === 'voice');
  const sources = [
    { key: 'crm', tag: ui.systemTags[0], name: ui.systems[0] },
    { key: 'history', tag: ui.systemTags[1], name: ui.systems[1] },
    { key: 'prices', tag: ui.systemTags[2], name: ui.systems[2] },
    { key: 'catalog', tag: 'ERP', name: ui.catalog },
  ];

  return (
    <section className="journey" id="how" data-journey aria-labelledby="journey-title">
      <div className="wrap journey-intro">
        <p className="eyebrow" data-reveal>{j.eyebrow}</p>
        <h2 className="h-section" id="journey-title" data-reveal>{j.title}</h2>
        <p className="lead anim-only" data-reveal>{j.lead}</p>
        <p className="lead static-only">{j.staticNote}</p>
      </div>

      <div className="journey-track" data-track style={{ '--steps': n, '--len': JOURNEY_LENGTH } as CSSProperties}>
        <div className="journey-stage" data-stage>
          <div className="rail" aria-hidden="true">
            <div className="rail-line"><span className="rail-fill" /></div>
            <span className="rail-msg"><svg viewBox="0 0 24 24" fill="currentColor"><path d={BUBBLE} /></svg></span>
            <ol className="rail-stops" role="list">
              {j.steps.map((s, i) => (
                <li key={s.station} data-stop style={{ '--at': i / (n - 1) } as CSSProperties}>
                  <span className="tick" /><span className="name">{s.station}</span>
                </li>
              ))}
            </ol>
          </div>

          <ol className="steps" role="list">
            {j.steps.map((s, i) => (
              <li className="step" data-step key={s.station}>
                <p className="step-k"><span className="mono">{pad(i + 1)}</span><span>{s.station}</span></p>
                <h3>{s.title}</h3>
                <p className="step-body">{s.body}</p>
              </li>
            ))}
          </ol>

          <div className="viz" aria-hidden="true">
            {/* The route: a dashed zigzag on the far side of the stage. A token rides it down
                to every next step and turns into the scene along a dashed link. */}
            <div className="lane" data-lane>
              <svg className="lane-svg" viewBox="0 0 80 400" fill="none">
                <path className="lane-path" d="M40 0L64 30L16 80L64 130L16 180L40 200L16 220L64 270L16 320L64 370L40 400" />
              </svg>
              <span className="lane-link" data-lane-link />
              <span className="lane-ring" data-lane-ring />
              <span className="lane-token" data-lane-token><svg viewBox="0 0 24 24" fill="currentColor"><path d={BUBBLE} /></svg></span>
            </div>

            {/* 1 ── The rep's phone: where the message arrives and is forwarded from */}
            <div className="sc sc-phone" data-phone>
              <div className="phone">
                <span className="phone-island" />
                <div className="chat-head">
                  <span className="avatar">{ui.initials}</span>
                  <div><b>{ui.contact}</b><small>{ui.online}</small></div>
                </div>
                <div className="chat-body">
                  <div className="bubble" data-b>
                    {typed.map(({ l, i }) => <span key={i} data-slot={i}>{l.raw}</span>)}
                  </div>
                  {spoken.map(({ i }) => (
                    <div className="bubble voice" data-b key={i}><span data-slot={i}><Voice time={ui.voice} /></span></div>
                  ))}
                  <div className="bubble photo" data-b>
                    <div className="note">{noted.map(({ l, i }) => <span key={i} data-slot={i}>{l.raw}</span>)}</div>
                  </div>
                  <div className="typing" data-typing><i /><i /><i /></div>
                </div>
                <div className="sheet" data-sheet>
                  <span className="grab" />
                  <p className="sheet-title">{ui.forwardTo}</p>
                  <div className="sheet-row sel">
                    <LogoMark />
                    <div><b>{t.brand}</b><small>{ui.assistant}</small></div>
                    <span className="sheet-check" data-sheet-check><Check /></span>
                  </div>
                  {ui.others.map((o) => (
                    <div className="sheet-row" key={o}><span className="avatar sm">{o.slice(0, 1)}</span><div><b>{o}</b></div></div>
                  ))}
                  <div className="sheet-send" data-sheet-send>{ui.send}<span className="tap" data-tap-send /></div>
                </div>
              </div>
            </div>

            {/* 2 ── The desk: the message as one card that is read, matched, priced and approved,
                with the company's own data sources docked above it */}
            <div className="sc sc-desk" data-desk>
              <div className="desk">
                <div className="sources" data-sources>
                  {sources.map((s) => (
                    <div className="source" data-source={s.key} key={s.key}><span className="sys-tag mono">{s.tag}</span><b>{s.name}</b></div>
                  ))}
                </div>

                <div className="quote" data-quote>
                  <span className="q-bg" data-q-bg />
                  <div className="q-head">
                    <span className="q-logo" data-q-logo><LogoMark /></span>
                    <div className="q-titles">
                      <div className="q-title"><b data-title-a>{ui.newMessage}</b><b data-title-b>{ui.draft}</b></div>
                      <div className="q-sub">
                        <span className="q-sub-a" data-sub-a>{ui.identifying}</span>
                        <span className="q-cust" data-cust>
                          <span className="avatar">{ui.initials}</span>
                          <b>{ui.customer}</b>
                          <span className="badge ok" data-cust-badge><Check />{ui.identified}</span>
                        </span>
                      </div>
                      <div className="q-meta" data-cust-meta>
                        <span>{ui.customerRows[1][0]}: <b>{ui.customerRows[1][1]}</b></span>
                        <span>{ui.customerRows[2][0]}: <b>{ui.customerRows[2][1]}</b></span>
                      </div>
                    </div>
                    <span className="demo">{t.demoData}</span>
                  </div>

                  <div className="q-row q-cols">
                    <span /><span data-item-h>{ui.cols.item}</span><span data-qty-h>{ui.cols.qty}</span><span data-price-h>{ui.cols.price}</span>
                  </div>

                  <div className="q-rows">
                    <span className="scan" data-scan />
                    {lines.map((l) => (
                      <div className="q-row" data-row data-ambiguous={l.ambiguous ? '' : undefined} key={l.sku}>
                        <span className="st">
                          <i className="st-ok" data-ok><Check w={3.2} /></i>
                          {l.ambiguous && <i className="st-q" data-qmark>?</i>}
                        </span>
                        <div className="desc">
                          <div className="raw" data-raw>
                            <span className={`src ${l.src}`} data-src-tag>{ui.sources[l.src]}</span>
                            <span className="raw-text">
                              <span className={`orig ${l.src}`} data-orig><Original line={l} voice={ui.voice} /></span>
                              <span className="parsed" data-parsed><Parsed line={l} /></span>
                            </span>
                            {l.ambiguous && <span className="amb" data-amb-label>{ui.threeOptions}</span>}
                          </div>
                          <div className="match" data-match>
                            <b>{l.name}</b>
                            <span className="sub"><span className="sku mono" data-sku>{l.sku}</span>{l.alias && <span className="alias">{l.alias}</span>}</span>
                          </div>
                        </div>
                        <span className="qty" data-qty>{l.qty}</span>
                        <span className="price mono" data-price>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M8 11V7.5a4 4 0 018 0V11" /><rect x="5" y="11" width="14" height="10" rx="2.5" /></svg>
                          {l.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="opts" data-opts>
                    <div className="opts-in">
                      {ui.options.map((o, i) => (
                        <div className="opt" data-opt key={o.sku}>
                          <b>{o.name}</b><span className="sku mono">{o.sku}</span>
                          {o.tag && <small>{o.tag}</small>}
                          {i === 0 && <span className="tap" data-tap-opt />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="q-foot" data-foot>
                    <div className="q-total">
                      <small data-price-src>{ui.priceSource}</small>
                      <p><span>{ui.total}</span><b className="mono"><span data-total data-value={ui.totalValue}>0</span> <span className="cur">{ui.currency}</span></b></p>
                    </div>
                    <div className="approve" data-approve>
                      <span data-approve-a>{ui.approve}</span>
                      <span className="approve-b" data-approve-b><Check />{ui.approved}</span>
                      <span className="tap" data-tap-approve />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 ── The outcome: the quote at the customer, the order in the ERP */}
            <div className="sc sc-out" data-out>
              <div className="out">
                <div className="mini" data-mini>
                  <p className="mini-head">{ui.customerPhone}</p>
                  <div className="pdf" data-pdf>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></svg>
                    <div><b>{ui.pdfName}</b><small className="mono">{ui.totalValue.toLocaleString('en-US')} <span className="cur">{ui.currency}</span></small></div>
                  </div>
                  <div className="bubble reply" data-reply>{ui.customerReply}</div>
                </div>
                <svg className="out-link" viewBox="0 0 100 20" preserveAspectRatio="none" fill="none"><path d="M0 10H100" pathLength={1} data-out-link /></svg>
                <div className="erp" data-erp>
                  <p className="erp-head">{ui.erpTitle}</p>
                  <div className="erp-new" data-erp-new><div className="erp-row"><b>{ui.customer}</b><span className="pill">{ui.erpNew}</span></div></div>
                  {ui.erpRows.map(([name, st]) => (<div className="erp-row" key={name}><span>{name}</span><span className="erp-st">{st}</span></div>))}
                  <p className="erp-done" data-done><Check />{ui.orderIn}</p>
                </div>
                <p className="learned" data-learned>
                  <span className="learned-tag">{ui.learned}</span>
                  <span>{ui.learnedFrom}</span><span className="arrow" /><span className="sku mono">INV-50K</span>
                </p>
              </div>
            </div>

            {/* Things in flight between scenes: the message lines, prices, the rep's pointer */}
            <div className="fly-layer">
              {lines.map((l, i) => (
                <span className={`fly ${l.src}`} data-fly key={i}><Original line={l} voice={ui.voice} /></span>
              ))}
              {lines.map((l, i) => <span className="pfly mono" data-pfly key={i}>{l.price}</span>)}
              <span className="cursor" data-cursor>
                <svg viewBox="0 0 24 24"><path d="M5 3l14 7.5-6 1.6-2.4 6z" fill="currentColor" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                <i>{ui.rep}</i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
