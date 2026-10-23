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
  refresh: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const token = session?.access_token;
  // Items are stored with the token they were fetched for, so a different
  // (or signed-out) user never sees a previous user's cart.
  const [state, setState] = useState<{ token: string; items: CartItem[] } | null>(null);
  const items = useMemo(
    () => (token && state?.token === token ? state.items : []),
    [token, state]
  );
  const loading = authLoading || (!!token && state?.token !== token);

  const setItems = useCallback(
    (update: (prev: CartItem[]) => CartItem[]) => {
      if (!token) return;
      setState((prev) => ({ token, items: update(prev?.token === token ? prev.items : []) }));
    },
    [token]
  );

  const refresh = useCallback(async () => {
    if (!token) return;
    const fetched = await fetchAPI<CartItem[]>('cart', token);
    setState({ token, items: fetched });
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetchAPI<CartItem[]>('cart', token)
      .then((fetched) => !cancelled && setState({ token, items: fetched }))
      .catch((err) => {
        console.error(err);
        if (!cancelled) setState({ token, items: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      if (!token) throw new Error('Please sign in to add items to your cart.');
      await postAPI('cart', { productId, quantity }, token);
      await refresh();
    },
    [token, refresh]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!token) return;
      const previous = items;
      setItems((prev) =>
        prev.map((i) => (i.product_id === productId ? { ...i, quantity } : i))
      );
      try {
        await patchAPI(`cart/${productId}`, { quantity }, token);
      } catch (err) {
        setItems(() => previous);
        throw err;
      }
    },
    [token, items, setItems]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!token) return;
      const previous = items;
      setItems((prev) => prev.filter((i) => i.product_id !== productId));
      try {
        await deleteAPI(`cart/${productId}`, token);
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
      subtotal: items.reduce((sum, i) => sum + i.products.price * i.quantity, 0),
      loading,
      refresh,
      addItem,
      updateQuantity,
      removeItem,
    }),
    [items, loading, refresh, addItem, updateQuantity, removeItem]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
