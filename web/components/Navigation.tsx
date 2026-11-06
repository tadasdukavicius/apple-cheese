'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { CONTACT_EMAIL, CONTACT_PHONE } from '../lib/site';
import Wordmark from './Wordmark';

interface NavLink {
  href: string;
  label: string;
  /** Path prefix that marks the link as the current page. */
  match?: string;
}

const MAIN_LINKS: NavLink[] = [
  { href: '/products', label: 'Parduotuvė', match: '/products' },
  { href: '/products?category=gift_sets', label: 'Dovanų rinkiniai' },
  { href: '/about', label: 'Mūsų istorija', match: '/about' },
];

const MENU_LINKS: NavLink[] = [
  ...MAIN_LINKS,
  { href: '/contact', label: 'Kontaktai', match: '/contact' },
];

const INFO_LINKS: NavLink[] = [
  { href: '/delivery', label: 'Pristatymas ir grąžinimas', match: '/delivery' },
  { href: '/faq', label: 'DUK', match: '/faq' },
];

function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6.5a3 3 0 016 0V8" />
    </svg>
  );
}

export default function Navigation() {
  const { user, loading, signOut } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  // The menu closes automatically when the route changes
  const open = openPath === pathname;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenPath(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (link: NavLink) => !!link.match && pathname.startsWith(link.match);
  const desktopLink = (l: NavLink) => (
    <Link
      key={l.href}
      href={l.href}
      aria-current={isActive(l) ? 'page' : undefined}
      className={`text-sm tracking-wide transition-colors hover:text-brand ${
        isActive(l) ? 'text-brand underline decoration-1 underline-offset-8' : 'text-ink'
      }`}
    >
      {l.label}
    </Link>
  );

  const accountLink = !loading && (
    <Link href={user ? '/account' : '/login'} className="hidden text-sm tracking-wide text-ink transition-colors hover:text-brand md:inline">
      {user ? 'Paskyra' : 'Prisijungti'}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface">
      <nav aria-label="Pagrindinis meniu" className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-4 md:h-[72px] md:px-6">
        <div className="flex items-center">
          <button
            onClick={() => setOpenPath(open ? null : pathname)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Uždaryti meniu' : 'Atidaryti meniu'}
            className="-ml-2 p-2 text-ink md:hidden"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              {open ? <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /> : <path strokeLinecap="round" d="M4 8h16M4 16h16" />}
            </svg>
          </button>
          <Link href="/" aria-label="Obuolių sūris – į pradžią" className="hidden md:inline-flex">
            <Wordmark />
          </Link>
        </div>

        <div className="flex justify-center">
          <Link href="/" aria-label="Obuolių sūris – į pradžią" className="md:hidden">
            <Wordmark />
          </Link>
          <div className="hidden items-center gap-8 md:flex">{MAIN_LINKS.map(desktopLink)}</div>
        </div>

        <div className="flex items-center justify-end gap-6">
          {accountLink}
          <Link
            href="/cart"
            aria-label={`Krepšelis, prekių: ${count}`}
            aria-current={pathname.startsWith('/cart') ? 'page' : undefined}
            className="flex items-center gap-1.5 text-sm tracking-wide text-ink transition-colors hover:text-brand"
          >
            <BagIcon className="h-5 w-5 sm:hidden" />
            <span className="hidden sm:inline">Krepšelis</span>
            <span aria-hidden="true" className={count > 0 ? 'font-semibold text-brand' : ''}>({count})</span>
          </Link>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-surface px-4 pb-10 md:hidden">
          <ul className="border-t border-line">
            {MENU_LINKS.map((l) => (
              <li key={l.href} className="border-b border-line">
                <Link href={l.href} aria-current={isActive(l) ? 'page' : undefined} className="flex items-center justify-between py-4 font-display text-2xl text-ink">
                  {l.label}
                  <span aria-hidden="true" className="text-lg text-muted">→</span>
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-6 space-y-3 text-sm">
            {INFO_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink underline decoration-line underline-offset-4">{l.label}</Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
            {!loading && (
              user ? (
                <>
                  <p className="text-muted">{user.email}</p>
                  <div className="flex gap-6">
                    <Link href="/account" className="text-ink underline underline-offset-4">Paskyra</Link>
                    <Link href="/orders" className="text-ink underline underline-offset-4">Užsakymai</Link>
                    <button onClick={signOut} className="text-ink underline underline-offset-4">Atsijungti</button>
                  </div>
                </>
              ) : (
                <Link href="/login" className="text-ink underline underline-offset-4">Prisijungti arba registruotis</Link>
              )
            )}
            <p className="pt-2 text-muted">
              {CONTACT_EMAIL}
              <br />
              {CONTACT_PHONE}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
