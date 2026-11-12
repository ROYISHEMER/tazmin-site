import type { NextConfig } from 'next';

/**
 * Two build modes:
 *  - default: a normal Next.js server build (pages are prerendered; /api/lead runs on the server).
 *  - TAZMIN_EXPORT=1: a fully static export, used only by `npm run export:landing` to produce
 *    the single-file landing page. The API route (route.server.ts) is left out of that build.
 */
const isExport = process.env.TAZMIN_EXPORT === '1';

/** Sent with every response: no framing by other sites, no MIME sniffing, lean referrers. */
const SECURITY_HEADERS = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
];

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: isExport ? ['tsx', 'ts'] : ['tsx', 'ts', 'server.ts'],
  ...(isExport
    ? { output: 'export' as const, trailingSlash: true, distDir: '.next-export' }
    : {
        async redirects() {
          // Hebrew is the default language.
          return [{ source: '/', destination: '/he', permanent: false }];
        },
        async headers() {
          return [{ source: '/:path*', headers: SECURITY_HEADERS }];
        },
      }),
};

export default config;
