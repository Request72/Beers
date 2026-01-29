// Security summary (student note): checkout uses Stripe Elements and backend order creation
// so prices are validated server-side and payment data never hits our server.
'use client';

import { useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { createOrderCheckout, confirmOrder } from '@/lib/ordersApi';
import { clearCart, getCart } from '@/lib/cart';
import { fetchMe } from '@/lib/authApi';
import Link from 'next/link';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

function CheckoutForm({ amount, onSuccess }: { amount: number; onSuccess: (paymentIntentId: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      setError(result.error.message || 'Payment failed.');
    } else if (result.paymentIntent?.status === 'succeeded') {
      setMessage('Payment successful.');
      onSuccess(result.paymentIntent.id);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-rose-600">{error}</p>}
      {message && <p className="text-sm text-emerald-600">{message}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const [amount, setAmount] = useState(0);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const cart = useMemo(() => getCart(), []);
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setAmount(Math.round(total * 100));
  }, [cart]);

  useEffect(() => {
    // Security note: checkout requires auth to prevent unauthorized orders.
    fetchMe()
      .then(() => setIsAuthed(true))
      .catch(() => setIsAuthed(false));
  }, []);

  const options = useMemo(() => {
    if (!clientSecret) return undefined;
    return { clientSecret };
  }, [clientSecret]);

  const startPayment = async () => {
    setError(null);
    setLoading(true);
    try {
      // Security note: only send ids/quantities; prices are validated on server.
      const items = cart.map((item) => ({ beerId: item.id, quantity: item.quantity }));
      const data = await createOrderCheckout(items);
      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setAmount(Math.round(total * 100));
    } catch (err) {
      setError('Unable to start payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream-50/60">
      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-black/10 bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-semibold text-ink-900">Checkout</h1>
          <p className="mt-2 text-sm text-ink-500">
            Secure payments are processed by Stripe in test mode.
          </p>

          <div className="mt-6 space-y-4">
            {cart.length === 0 ? (
              <p className="text-sm text-ink-500">Your cart is empty.</p>
            ) : (
              <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm text-ink-700">
                <p className="font-semibold text-ink-900">Order summary</p>
                {cart.map((item) => (
                  <div key={item.id} className="mt-2 flex items-center justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="mt-3 flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>${(amount / 100).toFixed(2)}</span>
                </div>
              </div>
            )}

            <button
              onClick={startPayment}
              disabled={loading || cart.length === 0 || isAuthed === false}
              className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-ink-700 hover:border-black/20 disabled:opacity-60"
            >
              {loading ? 'Creating payment...' : 'Create payment intent'}
            </button>

            {error && <p className="text-sm text-rose-600">{error}</p>}
            {isAuthed === false && (
              <p className="text-sm text-ink-500">
                Please <Link href="/login" className="text-brand-600">sign in</Link> before checking out.
              </p>
            )}
          </div>

          {!stripeKey && (
            <p className="mt-6 text-sm text-rose-600">Stripe publishable key is not configured.</p>
          )}

          {clientSecret && stripePromise && orderId && (
            <div className="mt-6">
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm
                  amount={amount}
                  onSuccess={async (paymentIntentId) => {
                    await confirmOrder(orderId, paymentIntentId);
                    clearCart();
                  }}
                />
              </Elements>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
