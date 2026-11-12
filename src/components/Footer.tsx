import Link from 'next/link';
import { LogoMark } from './LogoMark';
import { dict, href, homeAnchor, type Lang } from '@/i18n';
import { extra } from '@/i18n/extra';
import { SITE, isSet, formatPhone, telHref } from '@/config/site';

export function Footer({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const x = extra(lang);
  const home = href('/', lang);
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="cols">
          <div className="brand-col">
            <Link className="logo" href={home}><LogoMark /><span>{t.brand}</span></Link>
            <p className="tagline">{t.footer.tagline}</p>
          </div>
          <nav aria-label={t.footer.product}>
            <h2>{t.footer.product}</h2>
            <ul>
              <li><Link href={href('/how-it-works', lang)}>{x.nav.how}</Link></li>
              <li><Link href={homeAnchor('principles', lang)}>{t.nav.principles}</Link></li>
              <li><Link href={homeAnchor('faq', lang)}>{t.nav.faq}</Link></li>
            </ul>
          </nav>
          <nav aria-label={t.footer.company}>
            <h2>{t.footer.company}</h2>
            <ul>
              <li><Link href={href('/about', lang)}>{t.nav.about}</Link></li>
              <li><Link href={href('/contact', lang)}>{x.nav.talk}</Link></li>
              {isSet(SITE.email) && <li><a href={`mailto:${SITE.email}`} className="ltr">{SITE.email}</a></li>}
              {SITE.people[0] && <li><a href={telHref(SITE.people[0].phone)} className="ltr">{formatPhone(SITE.people[0].phone)}</a></li>}
            </ul>
          </nav>
          <nav aria-label={t.footer.legal}>
            <h2>{t.footer.legal}</h2>
            <ul>
              <li><Link href={href('/accessibility', lang)}>{t.footer.accessibility}</Link></li>
              <li><Link href={href('/privacy', lang)}>{t.footer.privacy}</Link></li>
              <li><Link href={href('/terms', lang)}>{t.footer.terms}</Link></li>
            </ul>
          </nav>
        </div>
        <div className="fine">
          <p>© {year} {t.brand}. {t.footer.rights}{SITE.address[lang] ? ` ${SITE.address[lang]}.` : ''}</p>
          <p>{t.footer.demoNote}</p>
          <p>{t.footer.trademarks}</p>
        </div>
      </div>
    </footer>
  );
}
