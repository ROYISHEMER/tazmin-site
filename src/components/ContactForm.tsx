'use client';

import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';
import { dict, href, type Lang } from '@/i18n';
import { extra } from '@/i18n/extra';
import { SITE } from '@/config/site';
import { validateLead, leadToText, type LeadErrors } from '@/lib/lead';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'ok' } | { kind: 'bad'; text: string };

/**
 * "Talk to us" form: name, company, and a phone number or an email. Everything else is asked
 * on the call. Posts JSON to /api/lead. If that endpoint is unavailable (for example
 * the single-file landing page opened from disk) it falls back to the visitor's email app.
 */
export function ContactForm({ lang, id = 'lead' }: { lang: Lang; id?: string }) {
  const f = dict(lang).contact.form;
  const x = extra(lang).form;
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const started = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const fid = (n: string) => `${id}-${n}`;
  const msg: Record<string, string> = { required: f.errorRequired, email: f.errorEmail, phone: x.errorPhone, contact: x.errorContact, consent: f.errorConsent, too_long: f.errorRequired };
  const errText = (k: keyof LeadErrors) => (errors[k] ? msg[errors[k]!] : '');

  const fail = (errs: LeadErrors) => {
    setErrors(errs);
    setStatus({ kind: 'bad', text: f.errorSummary });
    const firstBad = Object.keys(errs)[0];
    (formRef.current?.elements.namedItem(firstBad) as HTMLElement | null)?.focus();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, unknown>;
    const payload = { ...data, consent: data.consent === 'on', lang, page: window.location.pathname, elapsed: Date.now() - started.current };

    // Same rules as the server; `elapsed` is overridden so a fast typist is never blocked client-side.
    const local = validateLead({ ...payload, elapsed: 99999 });
    if (local.ok === false) return fail(local.errors);
    if (local.ok !== true) return;
    setErrors({});
    setStatus({ kind: 'sending' });

    try {
      const res = await fetch('/api/lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const out = await res.json().catch(() => null);
      if (res.ok && out?.ok) {
        form.reset();
        started.current = Date.now();
        setStatus({ kind: 'ok' });
      } else if (res.status === 422 && out?.errors) {
        fail(out.errors);
      } else {
        throw new Error(String(res.status));
      }
    } catch {
      // No working endpoint: not deployed yet, offline file, or a server error.
      if (SITE.email) {
        window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(f.mailSubject)}&body=${encodeURIComponent(leadToText(local.lead))}`;
        setStatus({ kind: 'bad', text: x.fallback });
      } else {
        setStatus({ kind: 'bad', text: x.errorServer });
      }
    }
  }

  const invalid = (k: keyof LeadErrors) => (errors[k] ? true : undefined);
  const opt = <span className="optional">({f.optional})</span>;
  const req = <span className="req" aria-hidden="true">*</span>;

  return (
    <form ref={formRef} className="form" noValidate onSubmit={onSubmit}>
      <fieldset className="form-set">
        <legend className="sr-only">{x.legend}</legend>
        <div className="row2">
          <div className="field">
            <label htmlFor={fid('name')}>{f.name} {req}</label>
            <input id={fid('name')} name="name" type="text" autoComplete="name" required aria-invalid={invalid('name')} aria-describedby={fid('name-err')} />
            <p className="err" id={fid('name-err')}>{errText('name')}</p>
          </div>
          <div className="field">
            <label htmlFor={fid('company')}>{f.company} {req}</label>
            <input id={fid('company')} name="company" type="text" autoComplete="organization" required aria-invalid={invalid('company')} aria-describedby={fid('company-err')} />
            <p className="err" id={fid('company-err')}>{errText('company')}</p>
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label htmlFor={fid('phone')}>{f.phone}</label>
            <input id={fid('phone')} name="phone" type="tel" autoComplete="tel" inputMode="tel" dir="ltr" aria-invalid={invalid('phone')} aria-describedby={`${fid('phone-err')} ${fid('contact-hint')}`} />
            <p className="err" id={fid('phone-err')}>{errText('phone')}</p>
          </div>
          <div className="field">
            <label htmlFor={fid('email')}>{f.email}</label>
            <input id={fid('email')} name="email" type="email" autoComplete="email" inputMode="email" dir="ltr" aria-invalid={invalid('email')} aria-describedby={`${fid('email-err')} ${fid('contact-hint')}`} />
            <p className="err" id={fid('email-err')}>{errText('email')}</p>
          </div>
        </div>
        <p className="hint contact-hint" id={fid('contact-hint')}>{x.contactHint}</p>
        <div className="field">
          <label htmlFor={fid('message')}>{f.message} {opt}</label>
          <textarea id={fid('message')} name="message" rows={4} aria-describedby={fid('message-hint')} />
          <p className="hint" id={fid('message-hint')}>{f.messageHint}</p>
        </div>
        {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
        <div className="hp" aria-hidden="true">
          <label htmlFor={fid('website')}>{x.hp}</label>
          <input id={fid('website')} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="field">
          <label className="check">
            <input name="consent" type="checkbox" required aria-invalid={invalid('consent')} aria-describedby={fid('consent-err')} />
            <span>{f.consent} <Link href={href('/privacy', lang)} target="_blank">{dict(lang).footer.privacy}</Link></span>
          </label>
          <p className="err" id={fid('consent-err')}>{errText('consent')}</p>
        </div>
      </fieldset>
      <div className="form-actions">
        <button className="btn lg" type="submit" disabled={status.kind === 'sending'}>{status.kind === 'sending' ? x.sending : f.submit}</button>
        <p className={`form-status ${status.kind === 'bad' ? 'bad' : 'ok'}`} role="status" aria-live="polite">
          {status.kind === 'ok' ? x.success : status.kind === 'bad' ? status.text : ''}
        </p>
      </div>
    </form>
  );
}
