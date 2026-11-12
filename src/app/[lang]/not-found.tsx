'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dict, href } from '@/i18n';

export default function NotFound() {
  const lang = (usePathname() || '').startsWith('/en') ? 'en' : 'he';
  const t = dict(lang).notFound;
  return (
    <div className="page wrap">
      <header className="page-head">
        <p className="eyebrow mono">404</p>
        <h1>{t.title}</h1>
        <p className="lead">{t.body}</p>
        <p><Link className="btn lg" href={href('/', lang)}>{t.home}</Link></p>
      </header>
    </div>
  );
}
