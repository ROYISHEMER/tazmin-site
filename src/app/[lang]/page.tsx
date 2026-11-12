import type { CSSProperties } from 'react';
import Link from 'next/link';
import '@/styles/home.css';
import { Motion } from '@/components/Motion';
import { Journey } from '@/components/Journey';
import { ContactForm } from '@/components/ContactForm';
import { LogoMark, Check } from '@/components/LogoMark';
import { dict, href } from '@/i18n';
import { extra } from '@/i18n/extra';
import { langOf, type LangParams } from '@/lib/meta';

const d = (n: number) => ({ '--d': n }) as CSSProperties;
const TILT = [-3, 2, -2, 3];
const VOICE = [4, 9, 14, 7, 12, 16, 8, 11, 6, 13, 9, 5];

const BENTO_ICONS = [
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="4.5" rx="2" /><rect x="3" y="10" width="18" height="4.5" rx="2" /><rect x="3" y="16" width="18" height="4.5" rx="2" /></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 11V7.5a4 4 0 018 0V11" /><rect x="5" y="11" width="14" height="10" rx="2.5" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 12a8.5 8.5 0 102.5-6" /><path d="M3 4v4h4" /><path d="M8.5 12.2l2.4 2.4 4.6-4.8" /></svg>,
];

export default async function Home({ params }: LangParams) {
  const lang = await langOf(params);
  const t = dict(lang);
  const x = extra(lang);

  return (
    <Motion>
      <div className="scroll-progress" aria-hidden="true" data-progress />

      {/* ───────── Hero ───────── */}
      <section className="hero" data-hero>
        <div className="wrap hero-copy" data-hero-copy>
          <p className="eyebrow rise" style={d(0)}>{t.hero.eyebrow}</p>
          <h1 className="h-display">
            <span className="rise" style={d(1)}>{t.hero.title[0]}</span>
            <span className="rise" style={d(2)}>{t.hero.title[1]}<span className="accent">{t.hero.title[2]}</span></span>
          </h1>
          <p className="lead rise" style={d(3)}>{t.hero.sub}</p>
          <div className="hero-actions rise" style={d(4)}>
            <a className="btn lg" href="#talk">{t.hero.cta}</a>
            <a className="btn lg ghost" href="#how">{x.nav.how}</a>
          </div>
        </div>
        <div className="hero-device rise" style={d(5)} aria-hidden="true" data-hero-device>
          <div className="phone hero-phone">
            <span className="phone-island" />
            <p className="chats-title">{t.hero.chats}</p>
            <ul className="chat-list" role="list">
              {t.hero.chatList.map((c, i) => (
                <li key={c.name} style={{ '--i': i } as CSSProperties}>
                  <span className="avatar">{c.name.slice(0, 1)}</span>
                  <span className="who"><b>{c.name}</b><small>{c.text}</small></span>
                  <span className="unread" />
                </li>
              ))}
            </ul>
          </div>
          <span className="hero-badge"><bdi>+ <span data-count="33">33</span></bdi> {t.hero.newMessages}</span>
        </div>
      </section>

      {/* ───────── Marquee of real-world message shapes ───────── */}
      <section className="marquee" aria-label={x.home.marqueeLabel}>
        <ul className="marquee-track" role="list">
          {x.home.marquee.map((m) => <li key={m}>{m}</li>)}
          {x.home.marquee.map((m) => <li key={`dup-${m}`} aria-hidden="true">{m}</li>)}
        </ul>
      </section>

      {/* ───────── Problem ───────── */}
      <section className="problem" data-problem>
        <div className="wrap">
          <p className="eyebrow" data-reveal>{t.problem.eyebrow}</p>
          <h2 className="h-section" data-reveal>{t.problem.title}</h2>
          <ul className="p-cards" role="list">
            {t.problem.cards.map((c, i) => (
              <li className={`p-card ${c.kind}`} data-p-card key={c.label} style={{ '--r': `${TILT[i]}deg` } as CSSProperties}>
                <span className="p-label">{c.label}</span>
                {c.kind === 'voice' && (
                  <span className="p-voice" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                    <span className="wave">{VOICE.map((h, k) => <i key={k} style={{ height: `${h / 10}em` }} />)}</span>
                  </span>
                )}
                <span className={c.kind === 'photo' ? 'p-text hand' : 'p-text'}>{c.text}</span>
              </li>
            ))}
          </ul>
          <p className="p-steps-title" data-reveal>{t.problem.stepsTitle}</p>
          <ol className="p-steps" role="list" data-reveal>
            {t.problem.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <p className="p-stuck" data-stuck>
            <span>{t.problem.stuck[0]}</span>
            <strong>{t.problem.stuck[1]}</strong>
          </p>
        </div>
      </section>

      {/* ───────── The journey (scrollytelling) ───────── */}
      <Journey lang={lang} />
      <div className="wrap journey-more">
        <Link className="btn ghost" href={href('/how-it-works', lang)}>{x.home.journeyMore} <span className="arrow-i" aria-hidden="true" /></Link>
      </div>

      {/* ───────── Principles ───────── */}
      <section className="principles" id="principles">
        <div className="wrap">
          <p className="eyebrow" data-reveal>{t.principles.eyebrow}</p>
          <h2 className="sr-only">{t.principles.title}</h2>
          <div className="big-lines">
            {t.principles.lines.map((l) => <p className="big-line" data-line key={l}>{l}</p>)}
          </div>
          <ul className="bento" role="list">
            {t.principles.cards.map((c, i) => (
              <li className="bento-card" data-reveal data-spot key={c.title}>
                <span className="bento-ico" aria-hidden="true">{BENTO_ICONS[i]}</span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── AI vs code ───────── */}
      <section className="ai">
        <div className="wrap">
          <p className="eyebrow" data-reveal>{t.ai.eyebrow}</p>
          <h2 className="h-section" data-reveal>{t.ai.title}</h2>
          <p className="lead" data-reveal>{t.ai.lead}</p>
          <div className="ai-grid">
            <div className="ai-col">
              <p className="ai-tag">{t.ai.aiLabel}</p>
              <ol className="ai-items" role="list">
                {t.ai.aiItems.map((it, i) => (
                  <li data-reveal data-spot key={it.title}><span className="mono">{i + 1}</span><div><h3>{it.title}</h3><p>{it.body}</p></div></li>
                ))}
              </ol>
            </div>
            <div className="ai-col code">
              <p className="ai-tag">{t.ai.codeLabel}</p>
              <ul className="code-items" role="list">
                {t.ai.codeItems.map((c) => <li key={c}><Check w={2.6} />{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Systems ───────── */}
      <section className="systems">
        <div className="wrap systems-in">
          <div>
            <p className="eyebrow" data-reveal>{t.systems.eyebrow}</p>
            <h2 className="h-section" data-reveal>{t.systems.title}</h2>
            <p className="lead" data-reveal>{t.systems.lead}</p>
          </div>
          <div className="sys-card" data-reveal>
            <div className="sys-hub" aria-hidden="true"><LogoMark /></div>
            <dl>
              <div><dt>{t.systems.nowLabel}</dt><dd>{t.systems.now.map((s) => <span className="chip on" key={s}>{s}</span>)}</dd></div>
              <div><dt>{t.systems.nextLabel}</dt><dd>{t.systems.next.map((s) => <span className="chip" key={s}>{s}</span>)}</dd></div>
              <div><dt>{t.systems.verticalsLabel}</dt><dd>{t.systems.verticals.map((s) => <span className="chip plain" key={s}>{s}</span>)}</dd></div>
            </dl>
            <p className="sys-note">{t.systems.note}</p>
          </div>
        </div>
      </section>

      {/* ───────── Benefits ───────── */}
      <section className="benefits" aria-label={t.benefits.label}>
        <div className="wrap big-lines center">
          {t.benefits.words.map((w) => <p className="big-line xl" data-line key={w}>{w}</p>)}
        </div>
      </section>

      {/* ───────── Pilot ───────── */}
      <section className="pilot">
        <div className="wrap">
          <p className="eyebrow" data-reveal>{t.pilot.eyebrow}</p>
          <h2 className="h-section" data-reveal>{t.pilot.title}</h2>
          <p className="lead" data-reveal>{t.pilot.lead}</p>
          <ol className="pilot-steps" role="list">
            {t.pilot.steps.map((s, i) => (
              <li data-reveal data-spot key={s.title}><span className="mono">{String(i + 1).padStart(2, '0')}</span><h3>{s.title}</h3><p>{s.body}</p></li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="faq" id="faq">
        <div className="wrap faq-in">
          <div>
            <p className="eyebrow">{t.faq.eyebrow}</p>
            <h2 className="h-section">{t.faq.title}</h2>
          </div>
          <div className="faq-list">
            {t.faq.items.map((it) => (
              <details key={it.q}>
                <summary><span>{it.q}</span><span className="plus" aria-hidden="true" /></summary>
                <p>{it.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Talk to us ───────── */}
      <section className="talk" id="talk">
        <div className="talk-ring" aria-hidden="true" />
        <div className="wrap talk-in">
          <div className="talk-copy">
            <span className="talk-mark" aria-hidden="true"><LogoMark /></span>
            <p className="talk-q">{t.cta.q}</p>
            <h2 className="h-section">{t.cta.title}</h2>
            <p className="talk-slogan">{t.cta.slogan}</p>
          </div>
          <div className="card talk-form">
            <ContactForm lang={lang} id="home" />
          </div>
        </div>
      </section>
    </Motion>
  );
}
