'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import { deleteAPI, fetchAPI, patchAPI, postAPI } from '../lib/api';
import type { CartItem } from '../types/cart';

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  loading: boolean;
  /** Set when the cart could not be loaded, so the UI can offer a retry instead of showing "empty". */
  error: string | null;
  refresh: () => Promise<void>;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const token = session?.access_token;
  // Items are stored with the token they were fetched for, so a different
  // (or signed-out) user never sees a previous user's cart.
  const [state, setState] = useState<{ token: string; items: CartItem[]; error: string | null } | null>(null);
  const items = useMemo(
    () => (token && state?.token === token ? state.items : []),
    [token, state]
  );
  const error = token && state?.token === token ? state.error : null;
  const loading = authLoading || (!!token && state?.token !== token);

  const setItems = useCallback(
    (update: (prev: CartItem[]) => CartItem[]) => {
      if (!token) return;
      setState((prev) => ({ token, items: update(prev?.token === token ? prev.items : []), error: null }));
    },
    [token]
  );

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      const fetched = await fetchAPI<CartItem[]>('cart', token);
      setState({ token, items: fetched, error: null });
    } catch (err) {
      setState((prev) => ({
        token,
        items: prev?.token === token ? prev.items : [],
        error: err instanceof Error ? err.message : 'Nepavyko įkelti krepšelio.',
      }));
      throw err;
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetchAPI<CartItem[]>('cart', token)
      .then((fetched) => !cancelled && setState({ token, items: fetched, error: null }))
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
          setState({ token, items: [], error: err instanceof Error ? err.message : 'Nepavyko įkelti krepšelio.' });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      if (!token) throw new Error('Prisijunkite, kad galėtumėte dėti prekes į krepšelį.');
      await postAPI('cart', { variantId, quantity }, token);
      await refresh();
    },
    [token, refresh]
  );

  const updateQuantity = useCallback(
    async (variantId: string, quantity: number) => {
      if (!token) return;
      const previous = items;
      setItems((prev) =>
        prev.map((i) => (i.variant_id === variantId ? { ...i, quantity } : i))
      );
      try {
        await patchAPI(`cart/${variantId}`, { quantity }, token);
      } catch (err) {
        setItems(() => previous);
        throw err;
      }
    },
    [token, items, setItems]
  );

  const removeItem = useCallback(
    async (variantId: string) => {
      if (!token) return;
      const previous = items;
      setItems((prev) => prev.filter((i) => i.variant_id !== variantId));
      try {
        await deleteAPI(`cart/${variantId}`, token);
      } catch (err) {
        setItems(() => previous);
        throw err;
      }
    },
    [token, items, setItems]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.product_variants.price * i.quantity, 0),
      loading,
      error,
      refresh,
      addItem,
      updateQuantity,
      removeItem,
    }),
    [items, loading, error, refresh, addItem, updateQuantity, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
