import { notFound } from 'next/navigation';

// Any unknown path under /he or /en renders the localised not-found page.
export const dynamic = 'force-static';
export function generateStaticParams() {
  return [];
}
export default function CatchAll() {
  notFound();
}
