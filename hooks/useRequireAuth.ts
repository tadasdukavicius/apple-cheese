'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

/** Redirects to /login (remembering the current page) when signed out. */
export function useRequireAuth() {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth.loading && !auth.session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [auth.loading, auth.session, router, pathname]);

  return auth;
}
