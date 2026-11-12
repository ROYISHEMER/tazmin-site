import type { CSSProperties } from 'react';
import { LogoMark, Check } from './LogoMark';
import { dict, type Lang } from '@/i18n';

/**
 * The scroll-driven story: one order travelling from a WhatsApp message to an ERP order.
 *
 * This is plain server-rendered markup. <Motion> (client) finds it by its data-* hooks and
 * drives it with GSAP. Without JS, with reduced motion, or with "stop animations" on, it
 * renders as a numbered list of the nine steps: the illustration is hidden and the text
 * says everything.
 */
const BARS = [5, 9, 14, 8, 12, 16, 7, 11, 15, 6, 10, 13, 5, 9, 12, 7, 4];
const BUBBLE = 'M4 5h16v11h-9l-4 3v-3H4z';
const pad = (n: number) => String(n).padStart(2, '0');

export function Journey({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const j = t.journey;
  const ui = j.ui;
  const n = j.steps.length;

  return (
    <section className="journey" id="how" data-journey aria-labelledby="journey-title">
      <div className="wrap journey-intro">
        <p className="eyebrow" data-reveal>{j.eyebrow}</p>
        <h2 className="h-section" id="journey-title" data-reveal>{j.title}</h2>
        <p className="lead anim-only" data-reveal>{j.lead}</p>
        <p className="lead static-only">{j.staticNote}</p>
      </div>

      <div className="journey-track" data-track style={{ '--steps': n } as CSSProperties}>
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
            {/* The travelling message: comes down a dashed zigzag route on the far side of the stage
                and turns into each station along a dashed link. Driven by <Motion>. */}
            <div className="lane" data-lane>
              <svg className="lane-svg" viewBox="0 0 80 400" fill="none">
                <path className="lane-path" d="M40 0L64 30L16 80L64 130L16 180L40 200L16 220L64 270L16 320L64 370L40 400" />
              </svg>
              <span className="lane-link" data-lane-link />
              <span className="lane-ring" data-lane-ring />
              <span className="lane-token" data-lane-token><svg viewBox="0 0 24 24" fill="currentColor"><path d={BUBBLE} /></svg></span>
            </div>

            {/* Scene 1: the rep's phone, customer message arriving */}
            <div className="sc sc-phone" data-phone>
              <div className="phone">
                <span className="phone-island" />
                <div className="chat-head">
                  <span className="avatar">{ui.initials}</span>
                  <div><b>{ui.contact}</b><small data-typing-label>{ui.online}</small></div>
                </div>
                <div className="chat-body">
                  <div className="bubble" data-b>{ui.bubble.map((l) => <span key={l}>{l}</span>)}</div>
                  <div className="bubble photo" data-b><div className="note">{ui.note.map((l) => <span key={l}>{l}</span>)}</div></div>
                  <div className="bubble voice" data-b>
                    <svg className="play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                    <span className="wave">{BARS.map((h, i) => <i key={i} style={{ height: `${h / 10}em` }} />)}</span>
                    <span className="mono">{ui.voice}</span>
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

            <span className="packet" data-packet><svg viewBox="0 0 24 24" fill="currentColor"><path d={BUBBLE} /></svg></span>

            {/* Scene 2: Tazmin looks the customer up in the company's systems */}
            <div className="sc sc-core" data-core>
              <div className="core">
                <div className="core-logo" data-core-logo><LogoMark /><span className="core-ring" data-core-ring /></div>
                <svg className="core-lines" viewBox="0 0 400 70" preserveAspectRatio="none" fill="none">
                  <path d="M200 0C200 40 67 28 67 70" pathLength={1} data-core-line />
                  <path d="M200 0V70" pathLength={1} data-core-line />
                  <path d="M200 0C200 40 333 28 333 70" pathLength={1} data-core-line />
                </svg>
                <div className="sys-row">
                  {ui.systems.map((s, i) => (
                    <div className="sys" data-sys key={s}><span className="sys-tag mono">{ui.systemTags[i]}</span><b>{s}</b></div>
                  ))}
                </div>
                <div className="cust" data-cust>
                  <div className="cust-head">
                    <span className="avatar">{ui.initials}</span>
                    <b>{ui.customer}</b>
                    <span className="badge ok" data-cust-badge><Check />{ui.identified}</span>
                  </div>
                  <div className="cust-rows">
                    {ui.customerRows.map(([k, v]) => (<div data-cust-row key={k}><span>{k}</span><b>{v}</b></div>))}
                  </div>
                </div>
              </div>
            </div>

            {/* Scene 3: the message turns into a quote, line by line */}
            <div className="sc sc-quote" data-quote-sc>
              <div className="quote" data-quote>
                <div className="q-head">
                  <div><b>{ui.draft}</b><small>{ui.customer} · {ui.awaiting}</small></div>
                  <span className="demo">{t.demoData}</span>
                </div>
                <div className="q-row q-cols">
                  <span /><span>{ui.cols.item}</span><span data-qty-h>{ui.cols.qty}</span><span data-price-h>{ui.cols.price}</span>
                </div>
                {ui.lines.map((l) => (
                  <div className="q-row" data-row data-ambiguous={l.ambiguous ? '' : undefined} key={l.sku}>
                    <span className="st">
                      <i className="st-ok" data-ok><Check w={3.2} /></i>
                      {l.ambiguous && <i className="st-q" data-qmark>?</i>}
                    </span>
                    <div className="desc">
                      <div className="raw" data-raw>
                        <span className={`src ${l.src}`}>{ui.sources[l.src]}</span>
                        <span className={l.src === 'hand' ? 'hand' : 'said'}>{l.raw}</span>
                        {l.ambiguous && <span className="amb" data-amb-label>{ui.threeOptions}</span>}
                      </div>
                      <div className="match" data-match>
                        <b>{l.name}</b>
                        <span className="sub"><span className="sku mono">{l.sku}</span>{l.alias && <span className="alias">{l.alias}</span>}</span>
                      </div>
                    </div>
                    <span className="qty" data-qty>{l.qty}</span>
                    <span className="price mono" data-price>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M8 11V7.5a4 4 0 018 0V11" /><rect x="5" y="11" width="14" height="10" rx="2.5" /></svg>
                      {l.price}
                    </span>
                  </div>
                ))}
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
                <div className="q-foot">
                  <div className="q-total">
                    <small data-price-src>{ui.priceSource}</small>
                    <p data-total-wrap><span>{ui.total}</span><b className="mono"><span data-total data-value={ui.totalValue}>0</span> <span className="cur">{ui.currency}</span></b></p>
                  </div>
                  <div className="approve" data-approve>
                    <span data-approve-a>{ui.approve}</span>
                    <span className="approve-b" data-approve-b><Check />{ui.approved}</span>
                    <span className="tap" data-tap-approve />
                  </div>
                </div>
              </div>
            </div>

            {/* Scene 4: quote goes to the customer, order lands in the ERP, alias is learned */}
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
                </div>
                <p className="learned" data-learned>
                  <span className="learned-tag">{ui.learned}</span>
                  <span>{ui.learnedFrom}</span><span className="arrow" /><span className="sku mono">INV-50K</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
