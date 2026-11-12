'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Phones only: a bar pinned to the bottom of the screen with the two quickest ways to reach
 * us. It appears once the visitor has scrolled past the first screen and steps aside while
 * the contact form is on screen (and on the contact page itself), so it never covers it.
 *
 * Icon path and links come from the server layout, so no icon library ships to the browser.
 */
export function MobileBar({ waHref, waPath, waLabel, talkHref, talkLabel, label }: { waHref: string | null; waPath: string; waLabel: string; talkHref: string; talkLabel: string; label: string }) {
  const pathname = usePathname() || '';
  const [show, setShow] = useState(false);
  const onContact = /\/contact\/?$/.test(pathname);

  useEffect(() => {
    if (onContact) {
      setShow(false);
      return;
    }
    const form = document.getElementById('talk');
    let formVisible = false;
    const update = () => setShow(window.scrollY > window.innerHeight * 0.6 && !formVisible);
    const io = form
      ? new IntersectionObserver(([entry]) => {
          formVisible = entry.isIntersecting;
          update();
        }, { threshold: 0.05 })
      : null;
    if (form) io?.observe(form);
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', update);
    };
  }, [pathname, onContact]);

  // Lets other fixed controls (the accessibility button) move out of the bar's way.
  useEffect(() => {
    document.documentElement.classList.toggle('has-mbar', show);
    return () => document.documentElement.classList.remove('has-mbar');
  }, [show]);

  return (
    <nav className={`mbar${show ? ' show' : ''}`} aria-label={label} inert={!show}>
      {waHref && (
        <a className="btn" href={waHref} target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={waPath} fill="currentColor" /></svg>
          {waLabel}
        </a>
      )}
      <Link className="btn ghost" href={talkHref}>{talkLabel}</Link>
    </nav>
  );
}
