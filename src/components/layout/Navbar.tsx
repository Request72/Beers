'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Beer } from "lucide-react";
import { getCart } from "@/lib/cart";

export function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const items = getCart();
      const total = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('cart_updated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cart_updated', updateCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-cream-50/70 backdrop-blur">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700 shadow-soft">
              <Beer className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Beers<span className="text-brand-600">Shop</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-ink-500 md:flex">
            <Link className="hover:text-ink-900" href="/beers">Beers</Link>
            <a className="hover:text-ink-900" href="#styles">Styles</a>
            <a className="hover:text-ink-900" href="#breweries">Breweries</a>
            <a className="hover:text-ink-900" href="#about">About</a>
            <Link className="hover:text-ink-900" href="/checkout">Checkout</Link>
            <Link className="relative hover:text-ink-900" href="/cart">
              Cart
              {cartCount > 0 && (
                <span className="absolute -right-3 -top-2 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link className="hover:text-ink-900" href="/orders">Orders</Link>
            <Link className="hover:text-ink-900" href="/admin/orders">Admin</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link className="text-sm text-ink-500 hover:text-ink-900" href="/login">
              Sign in
            </Link>
            <Link className="text-sm text-ink-500 hover:text-ink-900" href="/register">
              Register
            </Link>
            <Link className="text-sm text-ink-500 hover:text-ink-900" href="/settings/profile">
              Profile
            </Link>
            <Link
              href="/settings/security"
              className="rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold text-ink-700 hover:border-black/20"
            >
              Security
            </Link>
            <Link
              href="/beers"
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-brand-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
