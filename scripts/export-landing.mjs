#!/usr/bin/env node
/**
 * Builds a single self-contained HTML file per language from the home page:
 *   export/tazmin-landing-he.html, export/tazmin-landing-en.html
 *
 * Styles, scripts and the Hebrew/Latin fonts are inlined, so the file can be sent by
 * email or WhatsApp and opened by double-click, with the scroll animation working offline.
 * Links to other pages point at the live site (SITE.url in src/config/site.ts).
 *
 * Usage: npm run export:landing
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const outDir = join(root, 'export');

console.log('› Building static export…');
rmSync(join(root, '.next-export'), { recursive: true, force: true });
execSync('npx next build', { cwd: root, stdio: 'inherit', env: { ...process.env, TAZMIN_EXPORT: '1', NEXT_PUBLIC_TAZMIN_EXPORT: '1' } });

const site = ['.next-export', 'out'].map((d) => join(root, d)).find((d) => existsSync(join(d, 'he', 'index.html')));
if (!site) throw new Error('Static export not found (expected he/index.html in .next-export or out).');

const asset = (url) => join(site, decodeURIComponent(url.split('?')[0]));
const mime = { woff2: 'font/woff2', woff: 'font/woff', svg: 'image/svg+xml', png: 'image/png' };
const dataUri = (url) => {
  const ext = url.split('?')[0].split('.').pop();
  return `data:${mime[ext] ?? 'application/octet-stream'};base64,${readFileSync(asset(url)).toString('base64')}`;
};

/** Keep only the font subsets the page uses (Hebrew + basic Latin), as woff2, inlined. */
function inlineCss(css, cssUrl) {
  const base = cssUrl.slice(0, cssUrl.lastIndexOf('/') + 1);
  const abs = (u) => (u.startsWith('/') ? u : base + u).replace(/\/[^/]+\/\.\.\//g, '/');
  return css
    .replace(/@font-face\s*{[^}]*}/g, (block) => {
      const range = /unicode-range:([^;}]*)/.exec(block)?.[1] ?? '';
      const wanted = !range || /U\+0590/i.test(range) || /U\+0000-00FF/i.test(range);
      if (!wanted) return '';
      // drop legacy .woff fallbacks; every browser that runs this page supports woff2
      return block.replace(/,\s*url\([^)]*\.woff\)\s*format\(["']woff["']\)/g, '');
    })
    .replace(/url\((["']?)([^"')]+\.(?:woff2|woff|svg|png))\1\)/g, (_, _q, u) => `url(${dataUri(abs(u))})`);
}

function build(lang) {
  let html = readFileSync(join(site, lang, 'index.html'), 'utf8');

  // Stylesheets → <style>
  html = html.replace(/<link[^>]+rel="stylesheet"[^>]*>/g, (tag) => {
    const href = /href="([^"]+)"/.exec(tag)?.[1];
    return href ? `<style>${inlineCss(readFileSync(asset(href), 'utf8'), href)}</style>` : '';
  });

  // Scripts → inline, in document order
  html = html.replace(/<script([^>]*)\ssrc="(\/_next\/[^"]+)"([^>]*)><\/script>/g, (_, a, src, b) => {
    const attrs = `${a}${b}`.replace(/\s(async|defer)(="[^"]*")?/g, '').replace(/\snoModule(="[^"]*")?/i, ' nomodule');
    // The bundler runtime identifies each chunk by its <script src>. An inline script has none,
    // so each one first reports the path it was built with.
    const identify = `(function(s,u){s.getAttribute=function(n){return n==='src'?u:Element.prototype.getAttribute.call(s,n)};Object.defineProperty(s,'src',{get:function(){return new URL(u,location.href).href}})})(document.currentScript,${JSON.stringify(src)});`;
    return `<script${attrs}>${identify}${readFileSync(asset(src), 'utf8').replace(/<\/script/gi, '<\\/script')}</script>`;
  });

  // Nothing left to fetch from /_next: drop preloads, inline the icon
  html = html.replace(/<link[^>]+rel="(?:preload|modulepreload|prefetch)"[^>]*>/g, '');
  html = html.replace(/href="\/favicon\.svg"/g, () => `href="${dataUri('/favicon.svg')}"`);

  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, `tazmin-landing-${lang}.html`);
  writeFileSync(file, html);
  const left = (html.match(/["'(]\/_next\//g) || []).length;
  console.log(`✓ ${file}  (${(html.length / 1024).toFixed(0)} KB${left ? `, ${left} unresolved /_next references` : ''})`);
}

['he', 'en'].forEach(build);
