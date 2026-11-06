'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

/**
 * Keeps signed-out visitors off private pages. A visitor who arrives signed out is sent to /login and
 * returned afterwards; someone who signs out while on the page goes home instead.
 */
export function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hadSession = useRef(false);

  useEffect(() => {
    if (auth.loading) return;
    if (auth.session) {
      hadSession.current = true;
      return;
    }
    router.replace(hadSession.current ? '/' : `/login?next=${encodeURIComponent(pathname)}`);
  }, [auth.loading, auth.session, router, pathname]);

  return auth;
}
