'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Scroll-driven motion for everything rendered inside it. The children are ordinary
 * server-rendered markup; this component only finds elements by their data-* hooks.
 *
 * Nothing here runs when the visitor prefers reduced motion or has turned on
 * "stop animations" in the accessibility menu: the page then stays in its static,
 * fully readable state.
 */
export function Motion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('a11y-motion');
      if (still) return;

      const all = (s: string, within: Element = el) => gsap.utils.toArray<HTMLElement>(within.querySelectorAll(s));
      const one = (s: string, within: Element = el) => within.querySelector<HTMLElement>(s);
      const cleanups: (() => void)[] = [];

      // ── Smooth wheel scrolling (desktop pointers only; touch keeps native momentum)
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const lenis = new Lenis({ lerp: 0.11, anchors: true });
        lenis.on('scroll', ScrollTrigger.update);
        const raf = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        cleanups.push(() => {
          gsap.ticker.remove(raf);
          lenis.destroy();
        });
      }

      // ── Page progress bar
      const bar = one('[data-progress]');
      if (bar) gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

      // ── Hero: counter on load, device drifts as you scroll away
      const hero = one('[data-hero]');
      if (hero) {
        const count = one('[data-count]', hero);
        if (count) {
          const target = Number(count.dataset.count) || 0;
          const c = { v: 0 };
          gsap.to(c, { v: target, duration: 2.2, delay: 1, ease: 'power2.out', onUpdate: () => (count.textContent = String(Math.round(c.v))) });
        }
        gsap.to(one('[data-hero-device]', hero), { yPercent: -7, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to(one('[data-hero-copy]', hero), { autoAlpha: 0, y: -40, ease: 'none', scrollTrigger: { trigger: hero, start: '25% top', end: '75% top', scrub: true } });
        gsap.to(one('.scroll-hint', hero), { autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '12% top', scrub: true } });
      }

      // ── Generic reveal
      const reveals = all('[data-reveal]');
      if (reveals.length) {
        gsap.set(reveals, { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(reveals, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
        });
      }

      // ── Big statements that "ink in" as they cross the viewport
      all('[data-line]').forEach((line) => {
        gsap.fromTo(line, { opacity: 0.14 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: line, start: 'top 85%', end: 'top 52%', scrub: true } });
      });

      // ── Problem: message cards fly in, then drain of colour when "everything stalls"
      const problem = one('[data-problem]');
      if (problem) {
        const cards = all('[data-p-card]', problem);
        gsap.from(cards, {
          y: 90,
          x: (i) => (i - 1.5) * 50,
          scale: 0.85,
          autoAlpha: 0,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: cards[0], start: 'top 92%', end: 'top 45%', scrub: 0.6 },
        });
        const stuck = one('[data-stuck]', problem);
        if (stuck) {
          gsap.to(cards, { filter: 'grayscale(1) opacity(0.5)', ease: 'none', scrollTrigger: { trigger: stuck, start: 'top 85%', end: 'top 50%', scrub: true } });
          gsap.from(stuck.querySelector('strong'), { scale: 0.86, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: stuck, start: 'top 85%', end: 'top 50%', scrub: true } });
        }
      }

      // ── Cursor spotlight on cards (pointer devices only)
      if (window.matchMedia('(hover: hover)').matches) {
        all('[data-spot]').forEach((card) => {
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
          };
          card.addEventListener('pointermove', move);
          cleanups.push(() => card.removeEventListener('pointermove', move));
        });
      }

      // ── The journey
      const journey = one('[data-journey]');
      if (journey) {
        buildJourney(journey);
        cleanups.push(() => journey.classList.remove('anim'));
      }

      // Web fonts change text metrics; re-measure once they are in.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}

/**
 * One scrubbed timeline, one unit of time per step. The stage is pinned with CSS
 * `position: sticky` (see home.css), so ScrollTrigger only has to map scroll to time.
 */
function buildJourney(journey: HTMLElement) {
  journey.classList.add('anim');
  const all = (s: string) => gsap.utils.toArray<HTMLElement>(journey.querySelectorAll(s));
  const one = (s: string) => journey.querySelector<HTMLElement>(s)!;

  const track = one('[data-track]');
  const stage = one('[data-stage]');
  const steps = all('[data-step]');
  const stops = all('[data-stop]');
  const N = steps.length;
  const TOTAL = N + 0.4; // a short hold on the last step before the stage releases
  const rtl = getComputedStyle(journey).direction === 'rtl';
  const START = rtl ? 1 : -1; // x direction that points to the inline-start side
  const POP = 'back.out(2)';

  const phone = one('[data-phone]');
  const bubbles = all('[data-b]');
  const typing = one('[data-typing]');
  const sheet = one('[data-sheet]');
  const sheetCheck = one('[data-sheet-check]');
  const sheetSend = one('[data-sheet-send]');
  const packet = one('[data-packet]');
  const core = one('[data-core]');
  const coreLogo = one('[data-core-logo]');
  const coreRing = one('[data-core-ring]');
  const coreLines = all('[data-core-line]');
  const sys = all('[data-sys]');
  const cust = one('[data-cust]');
  const custRows = all('[data-cust-row]');
  const custBadge = one('[data-cust-badge]');
  const quoteSc = one('[data-quote-sc]');
  const quote = one('[data-quote]');
  const rows = all('[data-row]');
  const raws = all('[data-raw]');
  const matches = all('[data-match]');
  const oks = all('[data-ok]');
  const qtys = all('[data-qty]');
  const prices = all('[data-price]');
  const qmark = one('[data-qmark]');
  const ambLabel = one('[data-amb-label]');
  const opts = one('[data-opts]');
  const optEls = all('[data-opt]');
  const priceSrc = one('[data-price-src]');
  const totalWrap = one('[data-total-wrap]');
  const totalEl = one('[data-total]');
  const approve = one('[data-approve]');
  const approveA = one('[data-approve-a]');
  const approveB = one('[data-approve-b]');
  const out = one('[data-out]');
  const mini = one('[data-mini]');
  const pdf = one('[data-pdf]');
  const reply = one('[data-reply]');
  const outLink = one('[data-out-link]');
  const erp = one('[data-erp]');
  const erpNew = one('[data-erp-new]');
  const learned = one('[data-learned]');
  const amb = rows.findIndex((r) => r.hasAttribute('data-ambiguous'));
  const css = getComputedStyle(document.documentElement);
  const color = (name: string) => css.getPropertyValue(name).trim();

  // ── Starting states
  gsap.set(steps, { opacity: 0, y: 28 });
  gsap.set(steps[0], { opacity: 1, y: 0 });
  gsap.set([core, quoteSc, out, packet], { autoAlpha: 0 });
  gsap.set(bubbles, { autoAlpha: 0, y: '1em', scale: 0.9, transformOrigin: rtl ? '100% 100%' : '0% 100%' });
  gsap.set(sheet, { yPercent: 105 });
  gsap.set(sheetCheck, { scale: 0 });
  gsap.set(coreLogo, { scale: 0.4, autoAlpha: 0 });
  gsap.set(sys, { autoAlpha: 0, y: '1em', scale: 0.9 });
  gsap.set(cust, { autoAlpha: 0, y: '2em' });
  gsap.set(custRows, { autoAlpha: 0, y: '0.5em' });
  gsap.set(custBadge, { autoAlpha: 0, scale: 0.5 });
  gsap.set(quote, { y: '3em', scale: 0.96 });
  gsap.set(rows, { autoAlpha: 0, y: '1em' });
  gsap.set([one('[data-qty-h]'), one('[data-price-h]'), ...qtys, ...prices, ...matches, ...oks, qmark, ambLabel, priceSrc, totalWrap, approveB], { autoAlpha: 0 });
  gsap.set(matches, { y: '0.6em' });
  gsap.set([...oks, qmark], { scale: 0.3 });
  gsap.set(qtys, { scale: 0.6 });
  gsap.set(optEls, { autoAlpha: 0, y: '0.6em' });
  gsap.set([mini, erp], { autoAlpha: 0, y: '2em' });
  gsap.set(pdf, { autoAlpha: 0, y: '-2em', scale: 0.8 });
  gsap.set(reply, { autoAlpha: 0, y: '0.8em', scale: 0.9 });
  gsap.set(erpNew, { autoAlpha: 0 });
  gsap.set(learned, { autoAlpha: 0, y: '1em' });

  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: {
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const time = self.progress * TOTAL;
        stage.style.setProperty('--p', Math.min(1, time / (N - 1)).toFixed(4));
        const idx = Math.min(N - 1, Math.floor(time));
        stops.forEach((s, i) => {
          s.classList.toggle('on', i === idx);
          s.classList.toggle('done', i < idx);
        });
      },
    },
  });

  // ── Step copy: cross-fade one panel per unit of time
  steps.forEach((s, i) => {
    if (i > 0) tl.to(s, { opacity: 1, y: 0, duration: 0.18 }, i + 0.02);
    if (i < N - 1) tl.to(s, { opacity: 0, y: -28, duration: 0.12, ease: 'power1.in' }, i + 0.88);
  });

  const tap = (target: HTMLElement, at: number) =>
    tl.fromTo(target, { scale: 0.3, autoAlpha: 0.9 }, { scale: 2.1, autoAlpha: 0, duration: 0.16, ease: 'power1.out', immediateRender: false }, at);

  // 0 ── The customer writes
  tl.to(typing, { autoAlpha: 0, duration: 0.05 }, 0.12).to(bubbles, { autoAlpha: 1, y: 0, scale: 1, duration: 0.14, stagger: 0.2, ease: POP }, 0.15);

  // 1 ── The rep forwards to Tazmin
  tl.to(sheet, { yPercent: 0, duration: 0.2 }, 1.08).to(sheetCheck, { scale: 1, duration: 0.1, ease: POP }, 1.34);
  tap(one('[data-tap-send]'), 1.5);
  tl.to(sheetSend, { scale: 0.94, duration: 0.05, yoyo: true, repeat: 1 }, 1.5)
    .to(phone, { x: `${START * 13}em`, scale: 0.7, autoAlpha: 0, duration: 0.22, ease: 'power2.in' }, 1.62)
    .fromTo(packet, { autoAlpha: 0, x: `${START * 3}em`, y: '5em', scale: 0.5 }, { autoAlpha: 1, x: 0, y: '-12em', scale: 1, duration: 0.2 }, 1.64)
    .to(core, { autoAlpha: 1, duration: 0.01 }, 1.8)
    .to(coreLogo, { scale: 1, autoAlpha: 1, duration: 0.14, ease: 'back.out(1.6)' }, 1.82)
    .to(packet, { autoAlpha: 0, scale: 0.3, duration: 0.08 }, 1.86)
    .fromTo(coreRing, { scale: 0.9, autoAlpha: 0.8 }, { scale: 2.4, autoAlpha: 0, duration: 0.24, immediateRender: false }, 1.88);

  // 2 ── Identify the customer
  tl.to(coreLines, { strokeDashoffset: 0, duration: 0.16, stagger: 0.05, ease: 'none' }, 2.05)
    .to(sys, { autoAlpha: 1, y: 0, scale: 1, duration: 0.14, stagger: 0.07, ease: POP }, 2.2)
    .to(cust, { autoAlpha: 1, y: 0, duration: 0.18 }, 2.45)
    .to(custRows, { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.06 }, 2.55)
    .to(custBadge, { autoAlpha: 1, scale: 1, duration: 0.1, ease: POP }, 2.76);

  // 3 ── The message becomes lines
  tl.to(core, { autoAlpha: 0, scale: 0.85, y: '-3em', duration: 0.16, ease: 'power2.in' }, 3.0)
    .to(quoteSc, { autoAlpha: 1, duration: 0.12 }, 3.1)
    .to(quote, { y: 0, scale: 1, duration: 0.2 }, 3.1)
    .to(rows, { autoAlpha: 1, y: 0, duration: 0.1, stagger: 0.07 }, 3.24)
    .to(one('[data-qty-h]'), { autoAlpha: 1, duration: 0.06 }, 3.62)
    .to(qtys, { autoAlpha: 1, scale: 1, duration: 0.08, stagger: 0.05, ease: POP }, 3.62);

  // 4 ── Each line locks onto a SKU (the ambiguous one stops and asks)
  let k = 0;
  rows.forEach((_, i) => {
    if (i === amb) return;
    const at = 4.1 + k++ * 0.13;
    tl.to(raws[i], { autoAlpha: 0, y: '-0.6em', duration: 0.07, ease: 'power1.in' }, at)
      .to(matches[i], { autoAlpha: 1, y: 0, duration: 0.09 }, at + 0.05)
      .to(oks[i], { autoAlpha: 1, scale: 1, duration: 0.08, ease: 'back.out(2.5)' }, at + 0.08);
  });
  if (amb >= 0) {
    tl.to(qmark, { autoAlpha: 1, scale: 1, duration: 0.08, ease: POP }, 4.68)
      .to(ambLabel, { autoAlpha: 1, duration: 0.08 }, 4.7)
      .to(rows[amb], { backgroundColor: color('--amber-soft'), duration: 0.1 }, 4.68);

    // 5 ── No guessing: three options, the rep picks
    tl.to(opts, { gridTemplateRows: '1fr', duration: 0.14 }, 5.08).to(optEls, { autoAlpha: 1, y: 0, duration: 0.09, stagger: 0.06 }, 5.16);
    tap(one('[data-tap-opt]'), 5.46);
    tl.to(optEls[0], { borderColor: color('--teal'), backgroundColor: color('--teal-soft'), duration: 0.06 }, 5.5)
      .to(optEls.slice(1), { autoAlpha: 0.35, duration: 0.08 }, 5.54)
      .to(opts, { gridTemplateRows: '0fr', duration: 0.14, ease: 'power2.inOut' }, 5.7)
      .to([ambLabel, qmark], { autoAlpha: 0, duration: 0.05 }, 5.7)
      .to(raws[amb], { autoAlpha: 0, y: '-0.6em', duration: 0.07, ease: 'power1.in' }, 5.72)
      .to(matches[amb], { autoAlpha: 1, y: 0, duration: 0.09 }, 5.77)
      .to(oks[amb], { autoAlpha: 1, scale: 1, duration: 0.08, ease: 'back.out(2.5)' }, 5.8)
      .to(rows[amb], { backgroundColor: 'rgba(0,0,0,0)', duration: 0.1 }, 5.78);
  }

  // 6 ── Prices from the price list
  const total = Number(totalEl.dataset.value) || 0;
  const counter = { v: 0 };
  tl.to(one('[data-price-h]'), { autoAlpha: 1, duration: 0.06 }, 6.08)
    .fromTo(prices, { x: `${START * 0.8}em` }, { autoAlpha: 1, x: 0, duration: 0.09, stagger: 0.07 }, 6.1)
    .to(priceSrc, { autoAlpha: 1, duration: 0.1 }, 6.46)
    .to(totalWrap, { autoAlpha: 1, duration: 0.08 }, 6.5)
    .to(counter, { v: total, duration: 0.3, ease: 'none', onUpdate: () => (totalEl.textContent = Math.round(counter.v).toLocaleString('en-US')) }, 6.5);

  // 7 ── The rep approves
  tl.to(approve, { scale: 1.07, boxShadow: '0 0 0 0.5em rgba(11,110,121,0.16)', duration: 0.14 }, 7.1);
  tap(one('[data-tap-approve]'), 7.36);
  tl.to(approve, { scale: 1, backgroundColor: color('--green-bright'), boxShadow: '0 0 0 0em rgba(11,110,121,0)', duration: 0.08 }, 7.42)
    .to(approveA, { autoAlpha: 0, duration: 0.04 }, 7.42)
    .to(approveB, { autoAlpha: 1, duration: 0.06 }, 7.45);

  // 8 ── Quote to the customer, order into the ERP, nickname learned
  tl.to(quote, { scale: 0.5, y: '-5em', duration: 0.2, ease: 'power2.in' }, 8.02)
    .to(quoteSc, { autoAlpha: 0, duration: 0.14, ease: 'power2.in' }, 8.08)
    .to(out, { autoAlpha: 1, duration: 0.01 }, 8.16)
    .to(mini, { autoAlpha: 1, y: 0, duration: 0.15 }, 8.16)
    .to(pdf, { autoAlpha: 1, y: 0, scale: 1, duration: 0.14, ease: 'back.out(1.4)' }, 8.3)
    .to(reply, { autoAlpha: 1, y: 0, scale: 1, duration: 0.1, ease: POP }, 8.47)
    .to(erp, { autoAlpha: 1, y: 0, duration: 0.15 }, 8.5)
    .to(outLink, { strokeDashoffset: 0, duration: 0.12, ease: 'none' }, 8.58)
    .fromTo(erpNew, { backgroundColor: color('--green-soft') }, { autoAlpha: 1, backgroundColor: 'rgba(0,0,0,0)', duration: 0.16 }, 8.7)
    .to(learned, { autoAlpha: 1, y: 0, duration: 0.12 }, 8.86);

  // ── The travelling message (desktop). For every step it comes down the zigzag route from the
  // previous station, turns into this station along the dashed link, and the station reacts.
  // Before the next step it leaves the station and carries on down the route.
  const viz = one('.viz');
  const token = one('[data-lane-token]');
  const link = one('[data-lane-link]');
  const laneRing = one('[data-lane-ring]');
  const WRAP = [phone, phone, core, quoteSc, quoteSc, quoteSc, quoteSc, quoteSc, out];
  const HALF_WIDTH = [8.75, 8.75, 18, 19.5, 19.5, 19.5, 19.5, 19.5, 20.7]; // em, half the width of each station
  const ENTER_AT: Record<number, number> = { 0: 0, 3: 2.98, 8: 8.02 }; // stations that appear a little after their step starts
  // Distance (em) from the route to the near edge of station k. Scenes sit 3.5em off-centre to make room for the route.
  const reach = (k: number) => {
    const em = parseFloat(getComputedStyle(viz).fontSize) || 16;
    return Math.max(1.5, viz.clientWidth / em / 2 - 0.5 - HALF_WIDTH[k]);
  };
  const at = ([px, py]: number[]) => ({ x: `${(START * (px - 40)) / 10}em`, y: `${(py - 200) / 10}em` });
  const UP = [[40, 0], [64, 30], [16, 80], [64, 130], [16, 180], [40, 200]];
  const DOWN = [[40, 200], [16, 220], [64, 270], [16, 320], [64, 370], [40, 400]];
  const ride = (pts: number[][], start: number, dur: number) => {
    const len = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
    const total = len.reduce((a, b) => a + b, 0);
    let t = start;
    len.forEach((l, i) => {
      const d = (dur * l) / total;
      tl.fromTo(token, at(pts[i]), { ...at(pts[i + 1]), duration: d, ease: 'none', immediateRender: false }, t);
      t += d;
    });
  };
  const inside = (k: number) => `${START * (reach(k) + 1.3)}em`; // a little past the edge, hidden behind the station

  gsap.set(token, { ...at(UP[0]), autoAlpha: 1 });
  gsap.set(laneRing, { autoAlpha: 0 });
  tl.set(link, { width: () => `${reach(0)}em` }, 0);
  ([[2, 1.82], [3, 3.1], [8, 8.14]] as const).forEach(([k, when]) =>
    tl.fromTo(link, { width: () => `${reach(k - 1)}em` }, { width: () => `${reach(k)}em`, duration: 0.12, ease: 'power2.inOut', immediateRender: false }, when),
  );

  for (let k = 0; k < N; k++) {
    // arrive
    const start = ENTER_AT[k] ?? k - 0.14;
    const zig = k === 0 ? 0.08 : 0.16;
    if (k > 0) tl.fromTo(token, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.03, immediateRender: false }, start);
    ride(UP, start, zig);
    const land = start + zig + 0.05;
    tl.fromTo(token, { x: 0, y: 0 }, { x: () => inside(k), duration: 0.05, ease: 'none', immediateRender: false }, start + zig)
      .to(token, { autoAlpha: 0, scale: 0.5, duration: 0.02 }, land - 0.015)
      .fromTo(laneRing, { x: () => `${START * reach(k)}em`, scale: 0.5, autoAlpha: 0.9 }, { scale: 2.6, autoAlpha: 0, duration: 0.16, ease: 'power1.out', immediateRender: false }, land)
      .fromTo(WRAP[k], { scale: 1 }, { scale: 1.035, duration: 0.06, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, land);
    // leave
    if (k < N - 1) {
      const leave = k + 1 - 0.37;
      tl.fromTo(token, { x: () => inside(k), y: 0, autoAlpha: 0, scale: 0.5 }, { x: 0, autoAlpha: 1, scale: 1, duration: 0.05, ease: 'none', immediateRender: false }, leave);
      ride(DOWN, leave + 0.05, 0.15);
      tl.to(token, { autoAlpha: 0, duration: 0.03 }, leave + 0.17);
    }
  }

  // Pad to the full length so one unit of time always equals one step of scroll.
  tl.set({}, {}, TOTAL);
}
