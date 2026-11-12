import { siWhatsapp } from 'simple-icons';
import { SITE, isSet, type Lang } from '@/config/site';
import { extra } from '@/i18n/extra';

/** Opens a WhatsApp chat with the number in SITE.whatsapp. Renders nothing when it is not set. */
export function WhatsAppButton({ lang, className = 'btn' }: { lang: Lang; className?: string }) {
  if (!isSet(SITE.whatsapp)) return null;
  const x = extra(lang).home;
  return (
    <a className={`${className} wa-btn`} href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(x.whatsappText)}`} target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={siWhatsapp.path} fill="currentColor" /></svg>
      {x.whatsapp}
    </a>
  );
}
