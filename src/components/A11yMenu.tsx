'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { dict, href, type Lang } from '@/i18n';

// Preferences live in localStorage only; nothing is sent anywhere.
// The same key is read by the inline script in the root layout, before first paint.
const KEY = 'tazmin:a11y';
type Prefs = { text: number; contrast: boolean; links: boolean; readable: boolean; motion: boolean };
type Toggle = 'contrast' | 'links' | 'readable' | 'motion';
const DEFAULTS: Prefs = { text: 0, contrast: false, links: false, readable: false, motion: false };

const load = (): Prefs => {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    return { ...DEFAULTS };
  }
};

const apply = (p: Prefs) => {
  const c = document.documentElement.classList;
  c.toggle('a11y-text-1', p.text === 1);
  c.toggle('a11y-text-2', p.text === 2);
  c.toggle('a11y-contrast', p.contrast);
  c.toggle('a11y-links', p.links);
  c.toggle('a11y-readable', p.readable);
  c.toggle('a11y-motion', p.motion);
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* private mode: preferences last for this page view only */
  }
};

export function A11yMenu({ lang }: { lang: Lang }) {
  const t = dict(lang).a11y;
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const fab = useRef<HTMLButtonElement>(null);
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => setPrefs(load()), []);

  useEffect(() => {
    if (!open) return;
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        fab.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const commit = (next: Prefs) => {
    const motionChanged = next.motion !== prefs.motion;
    setPrefs(next);
    apply(next);
    // Scroll animations are wired once per page load, so a motion change needs a fresh start.
    if (motionChanged) window.location.reload();
  };

  const toggles: [Toggle, string][] = [
    ['contrast', t.contrast],
    ['links', t.links],
    ['readable', t.readable],
    ['motion', t.motion],
  ];

  return (
    <>
      <button ref={fab} className="a11y-fab" type="button" aria-expanded={open} aria-controls="a11y-panel" onClick={() => setOpen((o) => !o)}>
        <span className="sr-only">{t.open}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="4.6" r="1.7" fill="currentColor" stroke="none" />
          <path d="M4.5 8.5c2.5.9 5 1.3 7.5 1.3s5-.4 7.5-1.3M12 9.8v4.7M12 14.5l-3 5.5M12 14.5l3 5.5" />
        </svg>
      </button>
      <div className="a11y-panel" id="a11y-panel" role="dialog" aria-label={t.title} hidden={!open}>
        <div className="head">
          <h2>{t.title}</h2>
          <button className="x" type="button" onClick={() => { setOpen(false); fab.current?.focus(); }}>
            <span aria-hidden="true">×</span>
            <span className="sr-only">{t.close}</span>
          </button>
        </div>
        <button ref={first} className="a11y-opt" type="button" onClick={() => commit({ ...prefs, text: (prefs.text + 1) % 3 })}>
          <span>{t.textSize}</span>
          <span className="state">{t.textSizes[prefs.text]}</span>
        </button>
        {toggles.map(([k, label]) => (
          <button key={k} className="a11y-opt" type="button" aria-pressed={prefs[k]} onClick={() => commit({ ...prefs, [k]: !prefs[k] })}>
            {label}
          </button>
        ))}
        <div className="foot">
          <Link href={href('/accessibility', lang)} onClick={() => setOpen(false)}>{t.statement}</Link>
          <button className="reset" type="button" onClick={() => commit({ ...DEFAULTS })}>{t.reset}</button>
        </div>
      </div>
    </>
  );
}
