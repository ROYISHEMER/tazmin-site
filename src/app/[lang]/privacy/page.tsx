import { LegalPage } from '@/components/LegalPage';
import { LEGAL } from '@/i18n/legal';
import { langOf, pageMeta, type LangParams } from '@/lib/meta';

export async function generateMetadata({ params }: LangParams) {
  const lang = await langOf(params);
  const d = LEGAL.privacy[lang];
  return pageMeta(lang, '/privacy', d.title, d.description);
}

export default async function Page({ params }: LangParams) {
  return <LegalPage lang={await langOf(params)} doc="privacy" />;
}
