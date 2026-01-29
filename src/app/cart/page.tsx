'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getCart, updateQuantity, removeFromCart, clearCart, type CartItem } from '@/lib/cart';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const handleQty = (id: string, qty: number) => {
    setItems(updateQuantity(id, qty));
  };

  const handleRemove = (id: string) => {
    setItems(removeFromCart(id));
  };

  const handleClear = () => {
    setItems(clearCart());
  };

  return (
    <main className="min-h-screen bg-cream-50/60">
      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-black/10 bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-semibold text-ink-900">Your cart</h1>
          <p className="mt-2 text-sm text-ink-500">Review your beers before checkout.</p>

          {items.length === 0 ? (
            <div className="mt-6">
              <p className="text-ink-500">Your cart is empty.</p>
              <Link href="/beers" className="mt-4 inline-block text-sm text-brand-600">
                Browse beers
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{item.name}</p>
                    <p className="text-xs text-ink-500">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => handleQty(item.id, Number(event.target.value))}
                      className="w-16 rounded-xl border border-black/10 px-2 py-1 text-sm"
                    />
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-xs text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-black/10 pt-4 text-sm">
                <span className="font-semibold text-ink-900">Subtotal</span>
                <span className="font-semibold text-ink-900">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleClear}
                  className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-semibold text-ink-700"
                >
                  Clear cart
                </button>
                <Link
                  href="/checkout"
                  className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Go to checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
