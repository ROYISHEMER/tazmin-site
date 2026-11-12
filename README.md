# Tazmin — marketing site

Scroll-driven marketing site for Tazmin, the order assistant for equipment distributors.
Hebrew (default, RTL) and English.

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · GSAP ScrollTrigger (`@gsap/react`) · Lenis
- **Pages:** home (scroll journey), How it works, Talk to us, About, Accessibility statement, Privacy policy, Terms of use, 404
- **Privacy:** no cookies and no ad tracking; anonymous page-view counts via Vercel Web Analytics (switch it on in the Vercel project to start collecting); fonts are self-hosted

## Run it

```bash
npm install
npm run dev        # http://localhost:4321  (redirects to /he)
npm run build      # production build
npm run start      # serve the production build
```

## Where things live

| What | Where |
|---|---|
| Business details (company name, ID, email, phone, accessibility coordinator) | `src/config/site.ts` |
| All Hebrew / English copy | `src/i18n/he.ts`, `src/i18n/en.ts`, `src/i18n/extra.ts` |
| Legal texts (accessibility, privacy, terms) | `src/i18n/legal.ts` |
| Home page sections | `src/app/[lang]/page.tsx` |
| The nine-step journey (markup) | `src/components/Journey.tsx` |
| All scroll animation | `src/components/Motion.tsx` |
| Styles | `src/styles/global.css`, `src/styles/home.css` |
| Lead form + validation | `src/components/ContactForm.tsx`, `src/lib/lead.ts` |
| Lead endpoint | `src/app/api/lead/route.server.ts` |

Demo data shown in the journey (customer, SKUs, prices) lives in the `journey.ui` block of the
dictionaries and is labelled "demo data" on screen.

## How the scroll journey works

The journey section is a tall track with a `position: sticky` stage. One GSAP timeline is scrubbed
by scroll, one unit of time per step; scenes (phone, customer lookup, quote card, outcome) change
in place. On desktop a message token travels down a dashed zigzag route on the far side of the
stage, turns into each scene along a dashed link, and the scene reacts when it arrives. On phones
the route is a dashed zigzag across the top that the token rides from stop to stop.

The animation libraries (GSAP, ScrollTrigger, Lenis) are loaded on demand after the page is
interactive; with reduced motion they are never fetched.

How much scrolling the whole journey takes is one number: the `58vh` per step in
`.journey.anim .journey-track` (`src/styles/home.css`). Lower is shorter.

With `prefers-reduced-motion`, with "Stop animations" in the accessibility menu, or without
JavaScript, the journey renders as a plain numbered list of the nine steps.

## Things you fill in when you have them

| What | Where | Until then |
|---|---|---|
| Customer quotes | `src/config/testimonials.ts` | the section is not rendered |
| Price / pilot offer line | `SITE.pricing` in `src/config/site.ts` | no pricing question in the FAQ |
| Team roles and photos | `role`, `photo` on each person in `src/config/site.ts` | name, initials and phone only |
| WhatsApp number | `SITE.whatsapp` | currently the primary contact's mobile |
| Email delivery of leads | `RESEND_API_KEY` in `.env.local` (and in Vercel) | leads go to `.data/leads.jsonl` locally |

### Sample content for local preview

`src/config/demo.ts` holds made-up customer quotes, a price line and team roles, so the layout
can be judged before the real content exists. They appear only in `npm run dev`, only while
`DEMO_CONTENT=1` is in `.env.local`, and each is labelled "sample content" on screen. Production
builds, the landing export and the deployed site never include them. Real content always replaces
the samples; once it is all in, delete `demo.ts` and its three call sites.

## Themes

Light is the default. The moon/sun button in the header switches to a dark theme and remembers
the choice (`localStorage`, key `tazmin:theme`). Tokens live at the top of `src/styles/global.css`;
pictures of light screens and paper (phones, the quote card, logo tiles) keep the light palette.

## Explainer video

`src/components/VideoShowcase.tsx` plays the narrated explainer from `public/video/`:
`<lang>-wide.mp4` (16:9) on wider screens and `<lang>-tall.mp4` (9:16) on phones, each with a
poster (`.jpg`) and captions (`.vtt`). Nothing downloads until the visitor presses play.

The files come from the separate video project (`~/promo-video/out/final/`). After re-rendering
there, copy the four MP4s over and regenerate the captions:

```bash
node scripts/make-captions.mjs
```

The closing frame shows the phone number and email set in the video project
(`s8.contact` in its `src/i18n.ts`); change it there and re-render if the details change.

## Integrations section

`src/components/Integrations.tsx` shows the channel (WhatsApp), Tazmin, and the systems an order
goes into. The list is `systems.tools` in the dictionaries. WhatsApp, SAP and Google Sheets use
the marks from the CC0 `simple-icons` package; Priority, Hashavshevet and Rivhit use the logo
files in `public/logos/`, downloaded from each company's own website (sources are listed in
`public/logos/README.md`). On scroll the section plays in order (WhatsApp, line, Tazmin, line,
systems); the drifting dashes, travelling dot and hub pulse are CSS and stop with reduced motion.

## Where "Talk to us" leads go

`POST /api/lead` validates the form and delivers each lead to every destination that is configured
(copy `.env.example` to `.env.local`):

1. **Postgres** — set `DATABASE_URL` (for example a Neon database) and run `db/schema.sql` once.
   Leads land in the `leads` table.
2. **Email** — set `RESEND_API_KEY`, `LEADS_TO`, `LEADS_FROM` to get an email per lead via Resend.

In development with neither configured, leads are appended to `.data/leads.jsonl` so the form can
be tested end to end. In production with neither configured, the endpoint answers 503 and the form
opens the visitor's email app instead (once `SITE.email` is set).

Spam protection: a honeypot field, a minimum fill time and a same-origin check. There are no user
accounts; the site does not need them.

## Send it to people

- **Single file:** `npm run export:landing` writes `export/tazmin-landing-he.html` and
  `export/tazmin-landing-en.html` (about 0.9 MB each). Styles, scripts and fonts are inlined, so the
  file opens by double-click and the animation works offline. Links to other pages point at
  `SITE.url`; the form falls back to email.
- **Live link:** https://tazmin-site.vercel.app (Vercel project `tazmin-site`). Redeploy with
  `npx vercel deploy --prod` from this folder. Lead destinations are not configured there yet:
  add the environment variables above in the Vercel project settings.

## Before going live

- [x] Contact details are filled in `src/config/site.ts` (the three founders, address, email, phones).
- [ ] Once a company is registered: put its legal name in `SITE.legalName` and add its number to the legal texts.
- [ ] Confirm the English spellings of the founders' names and who the accessibility coordinator is (defaults to the primary contact).
- [ ] Optional: set `SITE.whatsapp` to show a WhatsApp link on the contact page.
- [ ] When you have your own domain: add it in Vercel and set `NEXT_PUBLIC_SITE_URL` to it.
- [ ] Have a lawyer review `src/i18n/legal.ts` (the pages carry a "draft" banner; remove it in `LegalPage.tsx` once approved).
- [ ] Name the accessibility coordinator; consider an audit by a licensed accessibility expert.
- [ ] Configure a lead destination (database and/or email) and send a test lead.
- [ ] Confirm every system listed in the integrations section really is supported before publishing the claim.
- [ ] Third-party logos are shown without the owners' permission so far. Check each company's brand guidelines or ask before publishing; get a higher-resolution Hashavshevet logo.
- [x] Share image for WhatsApp / social previews: `public/og/he.jpg`, `public/og/en.jpg` (1200×630, the brand frame of the video).

## Snapshots

Earlier looks of the journey are kept as git tags (`git checkout <tag>` to view, `git checkout main` to come back):

- `v1-before-travelling-message`: the first look, with the station rail on the side.
- `v2-zigzag-route`: zigzag route added, desktop rail removed. **The current journey is this one**, with a shorter scroll.
- `v3-continuous-journey`: an experiment where the message lines fly into one card that evolves to the end. Not used.
