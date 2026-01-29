'use client';

import { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/axios';
import { getRememberedUserId } from '@/lib/authApi';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(getRememberedUserId());
    axiosInstance
      .get('/api/admin/orders')
      .then((response) => setOrders(response.data.orders))
      .catch((err) => {
        if (err?.response?.status === 403) {
          setError('Access denied. Admins only.');
        } else {
          setError('Unable to load orders.');
        }
      });
  }, []);

  return (
    <main className="min-h-screen bg-cream-50/60">
      <section className="container-page py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-black/10 bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-semibold text-ink-900">Admin Orders</h1>
          <p className="mt-2 text-sm text-ink-500">Review all customer orders.</p>
          {userId && (
            <p className="mt-2 text-xs text-ink-400">Current user ID: {userId}</p>
          )}

          {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

          <div className="mt-6 space-y-4">
            {orders.length === 0 ? (
              <p className="text-sm text-ink-500">No orders found.</p>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="rounded-2xl border border-black/10 px-4 py-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-ink-900">Order {order._id}</span>
                    <span className="text-xs text-ink-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-ink-600">User: {order.userId}</p>
                  <p className="text-ink-600">Status: {order.status}</p>
                  <p className="text-ink-600">Total: ${order.subtotal.toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
