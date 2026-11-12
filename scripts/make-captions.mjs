#!/usr/bin/env node
/**
 * Writes WebVTT captions for the explainer videos in public/video/, from the narration
 * script and measured voice-over durations of the video project.
 *
 * Usage: node scripts/make-captions.mjs [path-to-promo-video]   (default: ~/promo-video)
 *
 * The timing mirrors src/Explainer.tsx there: each scene lasts as long as its narration
 * (plus a lead-in and a tail), scenes overlap by one transition, and the narration starts
 * a few frames into its scene. Sentences share a scene's narration time by their length.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const src = resolve(process.argv[2] ?? join(homedir(), 'promo-video'));
const script = JSON.parse(readFileSync(join(src, 'voiceover', 'script.json'), 'utf8'));
const durations = JSON.parse(readFileSync(join(src, 'src', 'vo-durations.json'), 'utf8'));

const FPS = 30, TRANSITION = 15, VO_DELAY = 12, VO_TAIL = 13, MAX_SPEED = 1.45;
const WIDE = [['S1', 240], ['S2', 360], ['S3', 240], ['S4', 450], ['S5', 360], ['S6', 330], ['S7', 210], ['S8', 210]];
const TALL = [['S1', 150], ['S3', 165], ['S4', 420], ['S5', 180], ['S6', 200], ['S8', 200]];

const stamp = (s) => {
  const ms = Math.round(s * 1000);
  const p = (n, l = 2) => String(n).padStart(l, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)}.${p(ms % 1000, 3)}`;
};
// Narration text carries pronunciation marks for the voice; captions should read normally.
const clean = (t) => t.replace(/מַקָּט/g, 'מק״ט').replace(/[֑-ׇ]/g, '').replace(/\s+/g, ' ').trim();
const sentences = (t) => clean(t).match(/[^.?!]+[.?!]+["”״']?/g)?.map((x) => x.trim()) ?? [clean(t)];

function build(key, cuts, file) {
  let frame = 0;
  const cues = [];
  cuts.forEach(([id, natural], i) => {
    const dur = durations[`${key}-${id}`];
    const frames = Math.max(Math.round(dur * FPS) + VO_DELAY + VO_TAIL, Math.ceil(natural / MAX_SPEED));
    const start = (frame + VO_DELAY) / FPS;
    const parts = sentences(script[key][id]);
    const total = parts.reduce((a, p) => a + p.length, 0);
    let t = start;
    parts.forEach((p) => {
      const d = (dur * p.length) / total;
      cues.push([t, t + d, p]);
      t += d;
    });
    frame += frames - (i < cuts.length - 1 ? TRANSITION : 0);
  });
  const vtt = 'WEBVTT\n\n' + cues.map(([a, b, text], n) => `${n + 1}\n${stamp(a)} --> ${stamp(b)}\n${text}\n`).join('\n');
  writeFileSync(file, vtt);
  console.log(`✓ ${file}  (${cues.length} cues, video length ${(frame / FPS).toFixed(1)}s)`);
}

const out = resolve(import.meta.dirname, '..', 'public', 'video');
build('he', WIDE, join(out, 'he-wide.vtt'));
build('en', WIDE, join(out, 'en-wide.vtt'));
build('he-v', TALL, join(out, 'he-tall.vtt'));
build('en-v', TALL, join(out, 'en-tall.vtt'));
