'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LogoMark } from './LogoMark';
import { dict, href, homeAnchor, type Lang } from '@/i18n';
import { extra } from '@/i18n/extra';

export function Header({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const x = extra(lang);
  const other: Lang = lang === 'he' ? 'en' : 'he';
  const pathname = usePathname() || `/${lang}`;
  // "/he/about" → "/about"; "/he" → "/"
  const path = pathname.replace(/^\/(he|en)(?=\/|$)/, '') || '/';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  // The theme is applied before paint by the boot script in the layout; mirror it here.
  useEffect(() => setDark(document.documentElement.dataset.theme === 'dark'), []);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.dataset.theme = 'dark';
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem('tazmin:theme', next ? 'dark' : 'light');
    } catch {
      /* private mode: the choice lasts for this page view only */
    }
  };
  const btn = useRef<HTMLButtonElement>(null);
  const home = href('/', lang);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);
  const current = (p: string) => (path === p ? ('page' as const) : undefined);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap bar">
        <Link className="logo" href={home} onClick={close}>
          <LogoMark />
          <span>{t.brand}</span>
        </Link>
        <button ref={btn} className="menu-btn" type="button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
          <span className="sr-only">{open ? t.nav.close : t.nav.menu}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
        <nav className={`nav${open ? ' open' : ''}`} id="site-nav" aria-label={t.nav.label}>
          <Link href={href('/how-it-works', lang)} aria-current={current('/how-it-works')} onClick={close}>{x.nav.how}</Link>
          <Link href={homeAnchor('principles', lang)} onClick={close}>{t.nav.principles}</Link>
          <Link href={homeAnchor('faq', lang)} onClick={close}>{t.nav.faq}</Link>
          <Link href={href('/about', lang)} aria-current={current('/about')} onClick={close}>{t.nav.about}</Link>
          <button className="theme-btn" type="button" aria-pressed={dark} aria-label={dark ? x.home.themeLight : x.home.themeDark} title={dark ? x.home.themeLight : x.home.themeDark} onClick={toggleTheme}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {dark ? (
                <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>
              ) : (
                <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />
              )}
            </svg>
          </button>
          <Link className="lang" href={href(path, other)} lang={other} hrefLang={other} aria-label={t.nav.langSwitchLabel} onClick={close}>
            {t.nav.langSwitch}
          </Link>
          <Link className="btn sm" href={href('/contact', lang)} aria-current={current('/contact')} onClick={close}>{x.nav.talk}</Link>
        </nav>
      </div>
    </header>
  );
}
