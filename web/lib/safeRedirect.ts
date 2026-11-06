/** Only allow same-site relative paths, to avoid open redirects via ?next=. */
export function safeRedirect(next: string | null, fallback = '/products'): string {
  if (next && next.startsWith('/') && !next.startsWith('//') && !next.includes('\\')) return next;
  return fallback;
}
