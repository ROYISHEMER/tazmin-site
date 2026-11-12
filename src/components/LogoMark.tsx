/** Brand mark: chat bubble with a check. Decorative; the wordmark next to it carries the name. */
export function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 5.5h15v10.5h-8l-4 3v-3h-3z" />
        <path d="M9 10.8l2.2 2.2 4-4.2" />
      </svg>
    </span>
  );
}

export const CHECK = 'M5 12.5l4.2 4.2L19 7';

export function Check({ w = 3 }: { w?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={CHECK} />
    </svg>
  );
}
