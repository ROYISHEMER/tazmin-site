import { LegalPage } from '@/components/LegalPage';
import { LEGAL } from '@/i18n/legal';
import { langOf, pageMeta, type LangParams } from '@/lib/meta';

export async function generateMetadata({ params }: LangParams) {
  const lang = await langOf(params);
  const d = LEGAL.terms[lang];
  return pageMeta(lang, '/terms', d.title, d.description);
}

export default async function Page({ params }: LangParams) {
  return <LegalPage lang={await langOf(params)} doc="terms" />;
}
