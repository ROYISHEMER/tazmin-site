import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import '@fontsource-variable/heebo';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/amatic-sc/700.css';
import '@/styles/global.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { A11yMenu } from '@/components/A11yMenu';
import { dict, dirOf, isLang, langParams } from '@/i18n';
import { SITE, isSet } from '@/config/site';
import { pageMeta, type LangParams } from '@/lib/meta';

export const generateStaticParams = langParams;
export const dynamicParams = false;
export const viewport: Viewport = { themeColor: '#f5f5f7', width: 'device-width', initialScale: 1 };

export async function generateMetadata({ params }: LangParams) {
  const { lang } = await params;
  return { ...pageMeta(isLang(lang) ? lang : 'he', '/'), icons: { icon: '/favicon.svg' } };
}

// Applies saved accessibility preferences before first paint (no flash of the default look).
const A11Y_BOOT = `(function(){var c=document.documentElement.classList;c.add('js');try{var p=JSON.parse(localStorage.getItem('tazmin:a11y')||'{}');if(p.text===1)c.add('a11y-text-1');if(p.text===2)c.add('a11y-text-2');if(p.contrast)c.add('a11y-contrast');if(p.links)c.add('a11y-links');if(p.readable)c.add('a11y-readable');if(p.motion)c.add('a11y-motion');}catch(e){}})();`;

export default async function RootLayout({ children, params }: { children: ReactNode } & LangParams) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t.meta.siteName,
    url: SITE.url,
    description: t.meta.description,
    ...(isSet(SITE.email) ? { email: SITE.email } : {}),
  };
  return (
    // The boot script adds classes to <html> before hydration, hence suppressHydrationWarning.
    <html lang={lang} dir={dirOf(lang)} suppressHydrationWarning>
      <head>
        <Script id="a11y-boot" strategy="beforeInteractive">{A11Y_BOOT}</Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </head>
      <body>
        <a className="skip" href="#main">{t.skip}</a>
        <Header lang={lang} />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer lang={lang} />
        <A11yMenu lang={lang} />
      </body>
    </html>
  );
}
