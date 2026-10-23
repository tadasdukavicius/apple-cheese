'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { fetchAPI, patchAPI, deleteAPI } from '../../lib/api';
import { formatPrice } from '../../lib/format';
import { calculateTotals, usePricing } from '../../lib/pricing';
import { Product } from '../../types/product';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  products: Product;
}

export default function CartPage() {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetchAPI<CartItem[]>('cart', session.access_token)
      .then(setCartItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session, authLoading, router]);

  async function handleUpdateQuantity(productId: string, newQuantity: number) {
    if (!session) return;
    if (newQuantity < 1) {
      await handleRemove(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => item.product_id === productId ? { ...item, quantity: newQuantity } : item)
    );
    try {
      await patchAPI(`cart/${productId}`, { quantity: newQuantity }, session.access_token);
    } catch {
      fetchAPI<CartItem[]>('cart', session.access_token).then(setCartItems);
    }
  }

  async function handleRemove(productId: string) {
    if (!session) return;
    setCartItems(prev => prev.filter(item => item.product_id !== productId));
    try {
      await deleteAPI(`cart/${productId}`, session.access_token);
    } catch {
      fetchAPI<CartItem[]>('cart', session.access_token).then(setCartItems);
    }
  }

  const pricing = usePricing();
  const subtotal = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0);
  const { shipping, tax, total } = calculateTotals(subtotal, cartItems.length, pricing);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-8">Shopping Cart</h1>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8 mb-8">
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 pb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">IMG</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-black dark:text-zinc-50">{item.products.name}</h3>
                      <p className="text-zinc-600 dark:text-zinc-400">{formatPrice(item.products.price)} each</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-600 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      >
                        -
                      </button>
                      <span className="text-black dark:text-zinc-50 w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-600 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-black dark:text-zinc-50 w-20 text-right">
                      {formatPrice(item.products.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => handleRemove(item.product_id)}
                      className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition text-lg leading-none"
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400 text-center py-12">Your cart is empty</p>
          )}

          {cartItems.length > 0 && (
            <div className="flex justify-center mt-8">
              <a href="/products" className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition">
                Continue Shopping
              </a>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span className="text-zinc-700 dark:text-zinc-300">Subtotal:</span>
            <span className="text-black dark:text-zinc-50">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-zinc-700 dark:text-zinc-300">Shipping:</span>
            <span className="text-black dark:text-zinc-50">{formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between mb-4 border-b border-zinc-200 dark:border-zinc-700 pb-4">
            <span className="text-zinc-700 dark:text-zinc-300">Tax:</span>
            <span className="text-black dark:text-zinc-50">{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-black dark:text-zinc-50">Total:</span>
            <span className="text-black dark:text-zinc-50">{formatPrice(total)}</span>
          </div>
          <a
            href="/checkout"
            className="w-full mt-6 bg-black dark:bg-zinc-50 text-white dark:text-black py-2 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition inline-block text-center"
          >
            Proceed to Checkout
          </a>
        </div>
      </div>
    </div>
  );
}
