/**
 * POST /api/lead — receives the "Talk to us" form.
 *
 * Every valid lead is delivered to each destination that is configured:
 *   1. Postgres  (DATABASE_URL, table `leads` — see db/schema.sql)
 *   2. Email     (RESEND_API_KEY + LEADS_TO + LEADS_FROM, sent through Resend)
 * In development, when neither is configured, leads are appended to .data/leads.jsonl
 * so the form can be tested end to end. In production with nothing configured the route
 * answers 503 and the form falls back to the visitor's email app.
 *
 * (The file is named route.server.ts so the static landing-page export can leave it out;
 * see next.config.ts.)
 */
import { appendFile, mkdir } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';
import { validateLead, leadToText, type Lead } from '@/lib/lead';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'cache-control': 'no-store' } });

async function toPostgres(url: string, lead: Lead) {
  const sql = neon(url);
  await sql`
    INSERT INTO leads (name, company, role, email, phone, vertical, erp, volume, message, lang, page)
    VALUES (${lead.name}, ${lead.company}, ${lead.role}, ${lead.email}, ${lead.phone}, ${lead.vertical},
            ${lead.erp}, ${lead.volume}, ${lead.message}, ${lead.lang}, ${lead.page})`;
}

async function toEmail(key: string, to: string, from: string, lead: Lead) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to: [to], reply_to: lead.email, subject: `New lead: ${lead.company} (${lead.name})`, text: leadToText(lead) }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}

async function toLocalFile(lead: Lead) {
  await mkdir('.data', { recursive: true });
  await appendFile('.data/leads.jsonl', JSON.stringify({ created_at: new Date().toISOString(), ...lead }) + '\n');
}

export async function POST(request: Request) {
  // Same-origin only: a form on another site cannot post here.
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host && new URL(origin).host !== host) return json({ ok: false, error: 'forbidden' }, 403);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'bad_request' }, 400);
  }

  const result = validateLead(body);
  if (result.ok === 'spam') return json({ ok: true });
  if (!result.ok) return json({ ok: false, errors: result.errors }, 422);
  const lead = result.lead;

  const { DATABASE_URL, RESEND_API_KEY, LEADS_TO, LEADS_FROM } = process.env;
  const jobs: Promise<void>[] = [];
  if (DATABASE_URL) jobs.push(toPostgres(DATABASE_URL, lead));
  if (RESEND_API_KEY && LEADS_TO && LEADS_FROM) jobs.push(toEmail(RESEND_API_KEY, LEADS_TO, LEADS_FROM, lead));
  if (!jobs.length) {
    if (process.env.NODE_ENV === 'production') return json({ ok: false, error: 'not_configured' }, 503);
    jobs.push(toLocalFile(lead));
  }

  const done = await Promise.allSettled(jobs);
  // The lead counts as received if it reached at least one destination.
  if (done.every((d) => d.status === 'rejected')) {
    console.error('lead delivery failed:', done.map((d) => (d.status === 'rejected' ? String(d.reason) : 'ok')).join(' | '));
    return json({ ok: false, error: 'delivery_failed' }, 502);
  }
  return json({ ok: true });
}
