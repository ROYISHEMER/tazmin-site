'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { JOURNEY_LENGTH, STEP_STARTS, STEP_WEIGHTS } from '@/lib/journey';

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
 * The journey: one scrubbed timeline that follows a single WhatsApp message.
 *
 * - The stage is pinned with CSS `position: sticky` (see home.css); ScrollTrigger only maps
 *   scroll to time, so there is no pin spacer and no layout jump.
 * - Steps have different lengths (src/lib/journey.ts): `at(k, f)` is "fraction f into step k".
 * - Continuity comes from moving the same content between places: the message lines fly
 *   from the phone into the card, quantities leave the text for their column, prices fly
 *   from the price list into the rows, and the card itself becomes the PDF the customer gets.
 * - Positions are read from layout offsets (never from transformed rects) inside
 *   function-based values, so they are re-measured on every ScrollTrigger refresh.
 */
function buildJourney(journey: HTMLElement) {
  journey.classList.add('anim');
  const all = (s: string) => gsap.utils.toArray<HTMLElement>(journey.querySelectorAll(s));
  const one = (s: string) => journey.querySelector<HTMLElement>(s)!;

  const track = one('[data-track]');
  const stage = one('[data-stage]');
  const viz = one('.viz');
  const steps = all('[data-step]');
  const stops = all('[data-stop]');
  const N = steps.length;
  const D = STEP_WEIGHTS;
  const T = STEP_STARTS;
  const at = (k: number, f: number) => T[k] + f * D[k];
  const rtl = getComputedStyle(journey).direction === 'rtl';
  const START = rtl ? 1 : -1; // x direction that points to the inline-start side
  const POP = 'back.out(2)';
  const css = getComputedStyle(document.documentElement);
  const color = (name: string) => css.getPropertyValue(name).trim();
  const CLEAR = 'rgba(0,0,0,0)';

  // ── Cast
  const phone = one('[data-phone]');
  const bubbles = all('[data-b]');
  const typing = one('[data-typing]');
  const sheet = one('[data-sheet]');
  const sheetCheck = one('[data-sheet-check]');
  const sheetSend = one('[data-sheet-send]');
  const desk = one('[data-desk]');
  const sourcesRow = one('[data-sources]');
  const source = (key: string) => one(`[data-source="${key}"]`);
  const crm = source('crm');
  const history = source('history');
  const priceList = source('prices');
  const catalog = source('catalog');
  const quote = one('[data-quote]');
  const qbg = one('[data-q-bg]');
  const logo = one('[data-q-logo]');
  const titleA = one('[data-title-a]');
  const titleB = one('[data-title-b]');
  const subA = one('[data-sub-a]');
  const cust = one('[data-cust]');
  const custBadge = one('[data-cust-badge]');
  const custMeta = one('[data-cust-meta]');
  const heads = [one('[data-item-h]'), one('[data-qty-h]')];
  const priceH = one('[data-price-h]');
  const scan = one('[data-scan]');
  const rows = all('[data-row]');
  const raws = all('[data-raw]');
  const srcTags = all('[data-src-tag]');
  const origs = all('[data-orig]');
  const parseds = all('[data-parsed]');
  const nums = rows.map((r) => r.querySelector<HTMLElement>('[data-num]'));
  const matches = all('[data-match]');
  const skus = all('[data-sku]');
  const oks = all('[data-ok]');
  const qtys = all('[data-qty]');
  const prices = all('[data-price]');
  const qmark = one('[data-qmark]');
  const ambLabel = one('[data-amb-label]');
  const opts = one('[data-opts]');
  const optEls = all('[data-opt]');
  const foot = one('[data-foot]');
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
  const done = one('[data-done]');
  const learned = one('[data-learned]');
  const flyers = all('[data-fly]');
  const pflys = all('[data-pfly]');
  const cursor = one('[data-cursor]');
  const slots = rows.map((_, i) => one(`[data-slot="${i}"]`));
  const amb = rows.findIndex((r) => r.hasAttribute('data-ambiguous'));

  // ── Geometry, from layout offsets (transforms do not affect these)
  const em = () => parseFloat(getComputedStyle(viz).fontSize) || 16;
  const box = (el: HTMLElement) => {
    let x = 0;
    let y = 0;
    let e: HTMLElement | null = el;
    while (e && e !== viz) {
      x += e.offsetLeft;
      y += e.offsetTop;
      e = e.offsetParent as HTMLElement | null;
      // offsets are measured from the parent's padding edge, so add its border back
      if (e && e !== viz) {
        x += e.clientLeft;
        y += e.clientTop;
      }
    }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  };
  /** Centre of an element, relative to the centre of the stage. */
  const centre = (el: HTMLElement) => {
    const b = box(el);
    return { x: b.x + b.w / 2 - viz.clientWidth / 2, y: b.y + b.h / 2 - viz.clientHeight / 2 };
  };
  /** Inline-start edge (where its text begins) and vertical centre. */
  const anchor = (el: HTMLElement) => {
    const b = box(el);
    return { x: (rtl ? b.x + b.w : b.x) - viz.clientWidth / 2, y: b.y + b.h / 2 - viz.clientHeight / 2 };
  };

  // ── Starting states
  gsap.set(steps, { opacity: 0, y: 28 });
  gsap.set(steps[0], { opacity: 1, y: 0 });
  gsap.set([desk, out], { autoAlpha: 0 });
  gsap.set(bubbles, { autoAlpha: 0, y: '1em', scale: 0.9, transformOrigin: rtl ? '100% 100%' : '0% 100%' });
  gsap.set(sheet, { yPercent: 105 });
  gsap.set(sheetCheck, { scale: 0 });
  gsap.set([crm, history, priceList, catalog], { autoAlpha: 0, y: '-0.8em' });
  gsap.set(logo, { autoAlpha: 0, scale: 0.4 });
  gsap.set([titleB, cust, custMeta, ...heads, priceH, scan, ...origs, ...parseds, ...matches, ...oks, ...qtys, ...prices, qmark, ambLabel, foot, approveB], { autoAlpha: 0 });
  gsap.set(srcTags, { autoAlpha: 0, scale: 0.6 });
  gsap.set(custBadge, { autoAlpha: 0, scale: 0.5 });
  gsap.set(matches, { y: '0.6em' });
  gsap.set([...oks, qmark], { scale: 0.3 });
  gsap.set(optEls, { autoAlpha: 0, y: '0.6em' });
  gsap.set([pdf, reply, erpNew, done, learned], { autoAlpha: 0 });
  gsap.set(reply, { y: '0.8em', scale: 0.9 });
  gsap.set(learned, { y: '1em' });
  gsap.set(flyers, { xPercent: rtl ? -100 : 0, yPercent: -50, transformOrigin: rtl ? '100% 50%' : '0% 50%' });
  gsap.set(pflys, { xPercent: -50, yPercent: -50 });
  // Give everything in flight an explicit hidden start. Without it, scrolling back past a
  // flight would restore GSAP's guess of the earlier state (visible) instead of the CSS one.
  gsap.set([...flyers, ...pflys, cursor], { autoAlpha: 0 });

  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: {
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const time = self.progress * JOURNEY_LENGTH;
        let idx = 0;
        while (idx < N - 1 && time >= T[idx + 1]) idx++;
        const frac = Math.min(1, Math.max(0, (time - T[idx]) / D[idx]));
        stage.style.setProperty('--p', Math.min(1, (idx + frac) / (N - 1)).toFixed(4));
        stops.forEach((s, i) => {
          s.classList.toggle('on', i === idx);
          s.classList.toggle('done', i < idx);
        });
      },
    },
  });

  // ── Step copy: cross-fade one panel per step
  steps.forEach((s, i) => {
    if (i > 0) tl.to(s, { opacity: 1, y: 0, duration: 0.18 }, T[i] + 0.02);
    if (i < N - 1) tl.to(s, { opacity: 0, y: -28, duration: 0.12, ease: 'power1.in' }, T[i + 1] - 0.12);
  });

  const tap = (target: HTMLElement, when: number) =>
    tl.fromTo(target, { scale: 0.3, autoAlpha: 0.9 }, { scale: 2.1, autoAlpha: 0, duration: 0.16, ease: 'power1.out', immediateRender: false }, when);
  /** A data source lights up while it is being used. */
  const light = (el: HTMLElement, on: number, off: number) =>
    tl
      .to(el, { backgroundColor: color('--teal-soft'), borderColor: color('--teal'), scale: 1.07, duration: 0.07 }, on)
      .to(el, { backgroundColor: color('--surface'), borderColor: color('--line'), scale: 1, duration: 0.12 }, off);

  // 0 ── The customer writes: the message arrives in the rep's phone
  tl.to(typing, { autoAlpha: 0, duration: 0.05 }, at(0, 0.12)).to(bubbles, { autoAlpha: 1, y: 0, scale: 1, duration: 0.14, stagger: 0.2, ease: POP }, at(0, 0.16));

  // 1 ── The rep forwards it. The lines themselves leave the phone and become the card.
  tl.to(sheet, { yPercent: 0, duration: 0.18 }, at(1, 0.05)).to(sheetCheck, { scale: 1, duration: 0.09, ease: POP }, at(1, 0.24));
  tap(one('[data-tap-send]'), at(1, 0.35));
  tl.to(sheetSend, { scale: 0.94, duration: 0.05, yoyo: true, repeat: 1 }, at(1, 0.35)).to(sheet, { yPercent: 105, duration: 0.12, ease: 'power2.in' }, at(1, 0.43));

  const lift = at(1, 0.53);
  const FLIGHT = 0.3;
  const land = lift + 0.03 * (flyers.length - 1) + FLIGHT;
  flyers.forEach((f, i) => {
    const s0 = f.classList.contains('hand') ? 1 : 0.95;
    // the last line leaves first: everything moves down, so nothing overtakes anything
    const go = lift + (flyers.length - 1 - i) * 0.03;
    tl.set(f, { x: () => anchor(slots[i]).x, y: () => anchor(slots[i]).y, scale: s0 }, 0)
      .fromTo(f, { x: () => anchor(slots[i]).x, scale: s0 }, { x: () => anchor(origs[i]).x, scale: 1, duration: FLIGHT, ease: 'power2.inOut', immediateRender: false }, go)
      // y eases differently from x, so each line travels on a soft arc
      .fromTo(f, { y: () => anchor(slots[i]).y }, { y: () => anchor(origs[i]).y, duration: FLIGHT, ease: 'sine.inOut', immediateRender: false }, go);
  });
  tl.set(flyers, { autoAlpha: 1 }, lift)
    .set(slots, { autoAlpha: 0 }, lift)
    // the phone lets go of the message and steps aside before the card settles in
    .to(phone, { x: `${START * 15}em`, scale: 0.72, autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, lift + 0.01)
    .fromTo(desk, { y: '2.5em', autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.24, immediateRender: false }, lift + 0.13)
    .to(logo, { autoAlpha: 1, scale: 1, duration: 0.14, ease: POP }, lift + 0.26)
    .set(origs, { autoAlpha: 1 }, land)
    .set(flyers, { autoAlpha: 0 }, land);

  // 2 ── Who is the customer? The company's own data sources dock above the card.
  tl.to([crm, history, priceList], { autoAlpha: 1, y: 0, duration: 0.14, stagger: 0.07, ease: POP }, at(2, 0.06));
  light(crm, at(2, 0.3), at(2, 0.62));
  tl.to(subA, { autoAlpha: 0, duration: 0.06 }, at(2, 0.44))
    .fromTo(cust, { y: '-1.4em', autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.16, ease: 'power3.out', immediateRender: false }, at(2, 0.46))
    .to(custBadge, { autoAlpha: 1, scale: 1, duration: 0.1, ease: POP }, at(2, 0.64))
    .to(custMeta, { autoAlpha: 1, duration: 0.12 }, at(2, 0.76));
  light(history, at(2, 0.7), at(2, 0.86));
  light(priceList, at(2, 0.76), at(2, 0.92));

  // 3 ── Parsing: a reading beam sweeps the lines; handwriting and voice become text,
  //      and each quantity leaves the sentence for its own column.
  tl.to(scan, { autoAlpha: 1, duration: 0.05 }, at(3, 0.04))
    .fromTo(scan, { yPercent: 0 }, { yPercent: 400, duration: 0.5 * D[3], ease: 'none', immediateRender: false }, at(3, 0.05))
    .to(scan, { autoAlpha: 0, duration: 0.06 }, at(3, 0.55));
  rows.forEach((_, i) => {
    const t0 = at(3, 0.08 + i * 0.1);
    tl.to(srcTags[i], { autoAlpha: 1, scale: 1, duration: 0.08, ease: POP }, t0)
      .to(parseds[i], { autoAlpha: 1, duration: 0.07 }, t0 + 0.03)
      .to(origs[i], { autoAlpha: 0, duration: 0.07 }, t0 + 0.06);
    const n = nums[i];
    if (n) tl.to(n, { backgroundColor: color('--amber-soft'), duration: 0.06 }, t0 + 0.11);
  });
  tl.to(heads, { autoAlpha: 1, duration: 0.08 }, at(3, 0.6));
  rows.forEach((_, i) => {
    const t0 = at(3, 0.63 + i * 0.055);
    const n = nums[i];
    tl.fromTo(
      qtys[i],
      { x: () => (n ? centre(n).x - centre(qtys[i]).x : 0), scale: 0.6, autoAlpha: 0 },
      { x: 0, scale: 1, autoAlpha: 1, duration: 0.14, ease: 'power2.out', immediateRender: false },
      t0,
    );
    if (n) tl.to(n, { backgroundColor: CLEAR, duration: 0.1 }, t0 + 0.16);
  });
  tl.to(titleA, { autoAlpha: 0, y: '-0.5em', duration: 0.08 }, at(3, 0.9)).fromTo(titleB, { y: '0.5em', autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.1, immediateRender: false }, at(3, 0.93));

  // 4 ── Catalog match: each line locks onto an existing SKU; the unclear one stops.
  tl.to(catalog, { autoAlpha: 1, y: 0, duration: 0.12, ease: POP }, at(4, 0.03));
  light(catalog, at(4, 0.12), at(4, 0.8));
  let k = 0;
  rows.forEach((row, i) => {
    if (i === amb) return;
    const t0 = at(4, 0.16 + k++ * 0.14);
    tl.to(row, { backgroundColor: color('--teal-soft'), duration: 0.05 }, t0)
      .to(raws[i], { autoAlpha: 0, y: '-0.6em', duration: 0.07, ease: 'power1.in' }, t0 + 0.04)
      .to(matches[i], { autoAlpha: 1, y: 0, duration: 0.09 }, t0 + 0.08)
      .fromTo(skus[i], { scale: 1.3 }, { scale: 1, duration: 0.1, ease: 'back.out(3)', immediateRender: false }, t0 + 0.1)
      .to(oks[i], { autoAlpha: 1, scale: 1, duration: 0.08, ease: 'back.out(2.5)' }, t0 + 0.13)
      .to(row, { backgroundColor: CLEAR, duration: 0.12 }, t0 + 0.18);
    // a nickname is recognised from this customer's order history
    if (row.querySelector('.alias')) light(history, t0, t0 + 0.22);
  });
  if (amb >= 0) {
    tl.to(rows[amb], { backgroundColor: color('--amber-soft'), duration: 0.1 }, at(4, 0.76))
      .to(qmark, { autoAlpha: 1, scale: 1, duration: 0.08, ease: POP }, at(4, 0.76))
      .to(ambLabel, { autoAlpha: 1, duration: 0.08 }, at(4, 0.8));

    // 5 ── No guessing: three options open, and the rep (a person) picks one.
    const opt = optEls[0];
    tl.to(opts, { gridTemplateRows: '1fr', duration: 0.14 }, at(5, 0.05)).to(optEls, { autoAlpha: 1, y: 0, duration: 0.09, stagger: 0.06 }, at(5, 0.12));
    light(history, at(5, 0.26), at(5, 0.5));
    tl.fromTo(
      cursor,
      { x: () => centre(opt).x - START * 6 * em(), y: () => centre(opt).y + 7 * em(), autoAlpha: 0 },
      { x: () => centre(opt).x, y: () => centre(opt).y + 0.3 * em(), autoAlpha: 1, duration: 0.24, ease: 'power2.out', immediateRender: false },
      at(5, 0.3),
    );
    const pick = at(5, 0.58);
    tl.to(cursor, { scale: 0.82, duration: 0.03, yoyo: true, repeat: 1 }, pick);
    tap(one('[data-tap-opt]'), pick);
    tl.to(opt, { borderColor: color('--teal'), backgroundColor: color('--teal-soft'), duration: 0.06 }, pick + 0.03)
      .to(optEls.slice(1), { autoAlpha: 0.35, duration: 0.08 }, pick + 0.06)
      .to(cursor, { autoAlpha: 0, duration: 0.08 }, at(5, 0.7))
      .to(opts, { gridTemplateRows: '0fr', duration: 0.14, ease: 'power2.inOut' }, at(5, 0.76))
      .to([ambLabel, qmark], { autoAlpha: 0, duration: 0.05 }, at(5, 0.76))
      .to(raws[amb], { autoAlpha: 0, y: '-0.6em', duration: 0.07, ease: 'power1.in' }, at(5, 0.78))
      .to(matches[amb], { autoAlpha: 1, y: 0, duration: 0.09 }, at(5, 0.82))
      .fromTo(skus[amb], { scale: 1.3 }, { scale: 1, duration: 0.1, ease: 'back.out(3)', immediateRender: false }, at(5, 0.84))
      .to(oks[amb], { autoAlpha: 1, scale: 1, duration: 0.08, ease: 'back.out(2.5)' }, at(5, 0.86))
      .to(rows[amb], { backgroundColor: CLEAR, duration: 0.1 }, at(5, 0.84));
  }

  // 6 ── Pricing: every price travels from the customer's price list into its row.
  light(priceList, at(6, 0.04), at(6, 0.7));
  tl.to(priceH, { autoAlpha: 1, duration: 0.06 }, at(6, 0.08));
  rows.forEach((_, i) => {
    const t0 = at(6, 0.12 + i * 0.1);
    const dur = 0.2;
    tl.fromTo(
      pflys[i],
      { x: () => centre(priceList).x, y: () => centre(priceList).y, scale: 0.6, autoAlpha: 0 },
      { x: () => centre(prices[i]).x, y: () => centre(prices[i]).y, scale: 1, autoAlpha: 1, duration: dur, ease: 'power2.inOut', immediateRender: false },
      t0,
    )
      .set(prices[i], { autoAlpha: 1 }, t0 + dur)
      .set(pflys[i], { autoAlpha: 0 }, t0 + dur)
      .fromTo(prices[i], { scale: 1.18 }, { scale: 1, duration: 0.08, immediateRender: false }, t0 + dur);
  });
  // the card grows a footer: total and the approve button
  const total = Number(totalEl.dataset.value) || 0;
  const counter = { v: 0 };
  tl.fromTo(qbg, { bottom: () => foot.offsetHeight }, { bottom: 0, duration: 0.16 }, at(6, 0.68))
    .to(foot, { autoAlpha: 1, duration: 0.12 }, at(6, 0.72))
    .to(counter, { v: total, duration: 0.24, ease: 'none', onUpdate: () => (totalEl.textContent = Math.round(counter.v).toLocaleString('en-US')) }, at(6, 0.74));

  // 7 ── A person approves. Nothing has left the building until now.
  tl.to(sourcesRow, { autoAlpha: 0, y: '-1em', duration: 0.14, ease: 'power2.in' }, at(7, 0.03))
    .fromTo(
      cursor,
      { x: () => centre(approve).x - START * 7 * em(), y: () => centre(approve).y - 8 * em(), autoAlpha: 0 },
      { x: () => centre(approve).x, y: () => centre(approve).y + 0.3 * em(), autoAlpha: 1, duration: 0.3, ease: 'power2.out', immediateRender: false },
      at(7, 0.12),
    )
    .to(approve, { scale: 1.07, boxShadow: '0 0 0 0.5em rgba(11,110,121,0.16)', duration: 0.14 }, at(7, 0.3));
  const ok = at(7, 0.52);
  tl.to(cursor, { scale: 0.82, duration: 0.03, yoyo: true, repeat: 1 }, ok);
  tap(one('[data-tap-approve]'), ok);
  tl.to(approve, { scale: 1, backgroundColor: color('--green-bright'), boxShadow: '0 0 0 0em rgba(11,110,121,0)', duration: 0.08 }, ok + 0.04)
    .to(approveA, { autoAlpha: 0, duration: 0.04 }, ok + 0.04)
    .to(approveB, { autoAlpha: 1, duration: 0.06 }, ok + 0.07)
    // every line confirms in turn
    .fromTo(oks, { scale: 1 }, { scale: 1.3, duration: 0.05, stagger: 0.03, yoyo: true, repeat: 1, immediateRender: false }, ok + 0.1)
    .to(cursor, { autoAlpha: 0, duration: 0.08 }, at(7, 0.68));

  // 8 ── The card itself becomes the PDF in the customer's phone; their reply becomes an ERP order.
  tl.to(out, { autoAlpha: 1, duration: 0.14 }, at(8, 0.03))
    .fromTo([mini, erp], { y: '2em' }, { y: 0, duration: 0.18, stagger: 0.04, immediateRender: false }, at(8, 0.03))
    .to(
      quote,
      { x: () => centre(pdf).x - centre(quote).x, y: () => centre(pdf).y - centre(quote).y, scale: () => pdf.offsetWidth / quote.offsetWidth, duration: 0.3, ease: 'power3.inOut' },
      at(8, 0.06),
    );
  const arrive = at(8, 0.06) + 0.28;
  tl.to(quote, { autoAlpha: 0, duration: 0.05 }, arrive)
    .fromTo(pdf, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.09, ease: POP, immediateRender: false }, arrive - 0.01)
    .to(desk, { autoAlpha: 0, duration: 0.02 }, arrive + 0.06)
    .to(reply, { autoAlpha: 1, y: 0, scale: 1, duration: 0.1, ease: POP }, at(8, 0.46))
    .to(outLink, { strokeDashoffset: 0, duration: 0.12, ease: 'none' }, at(8, 0.55))
    .fromTo(erpNew, { autoAlpha: 0, y: '-0.8em', backgroundColor: color('--green-soft') }, { autoAlpha: 1, y: 0, backgroundColor: CLEAR, duration: 0.18, immediateRender: false }, at(8, 0.64))
    .fromTo(done, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.12, ease: POP, immediateRender: false }, at(8, 0.76))
    .to(learned, { autoAlpha: 1, y: 0, duration: 0.12 }, at(8, 0.88));

  // ── The route (desktop): for every step a token comes down the dashed zigzag, turns into the
  // scene along the dashed link, and the scene answers with a small bump. Before the next step
  // it leaves the scene and carries on down the route.
  const token = one('[data-lane-token]');
  const link = one('[data-lane-link]');
  const laneRing = one('[data-lane-ring]');
  const sceneOf = (i: number) => (i < 2 ? phone : i < N - 1 ? desk : out);
  const halfWidth = (i: number) => (i < 2 ? 8.75 : i < N - 1 ? 19.5 : 20.7); // em
  const enterAt: Record<number, number> = { 0: 0, [N - 1]: at(N - 1, 0.24) };
  // Distance (em) from the route to the near edge of scene i. Scenes sit 3.5em off-centre to make room for the route.
  const reach = (i: number) => Math.max(1.5, viz.clientWidth / em() / 2 - 0.5 - halfWidth(i));
  const point = ([px, py]: number[]) => ({ x: `${(START * (px - 40)) / 10}em`, y: `${(py - 200) / 10}em` });
  const UP = [[40, 0], [64, 30], [16, 80], [64, 130], [16, 180], [40, 200]];
  const DOWN = [[40, 200], [16, 220], [64, 270], [16, 320], [64, 370], [40, 400]];
  const ride = (pts: number[][], start: number, dur: number) => {
    const len = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
    const sum = len.reduce((a, b) => a + b, 0);
    let t = start;
    len.forEach((l, i) => {
      const d = (dur * l) / sum;
      tl.fromTo(token, point(pts[i]), { ...point(pts[i + 1]), duration: d, ease: 'none', immediateRender: false }, t);
      t += d;
    });
  };
  const inside = (i: number) => `${START * (reach(i) + 1.3)}em`; // a little past the edge, hidden behind the scene

  gsap.set(token, { ...point(UP[0]), autoAlpha: 1 });
  gsap.set(laneRing, { autoAlpha: 0 });
  tl.set(link, { width: () => `${reach(0)}em` }, 0)
    .fromTo(link, { width: () => `${reach(0)}em` }, { width: () => `${reach(2)}em`, duration: 0.14, ease: 'power2.inOut', immediateRender: false }, lift + 0.1)
    .fromTo(link, { width: () => `${reach(2)}em` }, { width: () => `${reach(N - 1)}em`, duration: 0.14, ease: 'power2.inOut', immediateRender: false }, at(N - 1, 0.1));

  for (let i = 0; i < N; i++) {
    const start = enterAt[i] ?? T[i] - 0.14;
    const zig = i === 0 ? 0.08 : 0.16;
    if (i > 0) tl.fromTo(token, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.03, immediateRender: false }, start);
    ride(UP, start, zig);
    const touch = start + zig + 0.05;
    tl.fromTo(token, { x: 0, y: 0 }, { x: () => inside(i), duration: 0.05, ease: 'none', immediateRender: false }, start + zig)
      .to(token, { autoAlpha: 0, scale: 0.5, duration: 0.02 }, touch - 0.015)
      .fromTo(laneRing, { x: () => `${START * reach(i)}em`, scale: 0.5, autoAlpha: 0.9 }, { scale: 2.6, autoAlpha: 0, duration: 0.16, ease: 'power1.out', immediateRender: false }, touch)
      .fromTo(sceneOf(i), { scale: 1 }, { scale: 1.03, duration: 0.06, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, touch);
    if (i < N - 1) {
      const leave = T[i + 1] - 0.37;
      tl.fromTo(token, { x: () => inside(i), y: 0, autoAlpha: 0, scale: 0.5 }, { x: 0, autoAlpha: 1, scale: 1, duration: 0.05, ease: 'none', immediateRender: false }, leave);
      ride(DOWN, leave + 0.05, 0.15);
      tl.to(token, { autoAlpha: 0, duration: 0.03 }, leave + 0.17);
    }
  }

  // Pad to the full length so timeline time always maps one-to-one to scroll.
  tl.set({}, {}, JOURNEY_LENGTH);
}
