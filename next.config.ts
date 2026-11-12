import type { NextConfig } from 'next';

/**
 * Two build modes:
 *  - default: a normal Next.js server build (pages are prerendered; /api/lead runs on the server).
 *  - TAZMIN_EXPORT=1: a fully static export, used only by `npm run export:landing` to produce
 *    the single-file landing page. The API route (route.server.ts) is left out of that build.
 */
const isExport = process.env.TAZMIN_EXPORT === '1';

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
      }),
};

export default config;
