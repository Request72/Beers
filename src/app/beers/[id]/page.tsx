'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Beer } from "@/lib/mock/beers";
import { fetchBeerById } from "@/lib/api";
import { RatingStars } from "@/components/ui/RatingStars";
import { Button } from "@/components/ui/Button";
import Link from 'next/link';
import Image from 'next/image';
import { addToCart } from '@/lib/cart';

export default function BeerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [beer, setBeer] = useState<Beer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadBeer = async () => {
      try {
        setLoading(true);
        const data = await fetchBeerById(id);
        setBeer(data);
      } catch (err) {
        setError('Failed to load beer details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBeer();
  }, [id]);

  if (loading) {
    return (
      <main className="bg-gradient-to-b from-cream-50 to-cream-100 min-h-screen">
        <div className="container-page py-10 text-center">
          <p className="text-ink-500">Loading beer details...</p>
        </div>
      </main>
    );
  }

  if (error || !beer) {
    return (
      <main className="bg-gradient-to-b from-cream-50 to-cream-100 min-h-screen">
        <div className="container-page py-10">
          <div className="rounded-lg bg-red-50 p-4 text-red-700 mb-6">
            {error || 'Beer not found'}
          </div>
          <Link href="/beers">
            <Button>← Back to Beers</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-cream-50 to-cream-100 min-h-screen">
      <section className="container-page py-10 md:py-12">
        <Link href="/beers" className="text-brand-500 hover:text-brand-600 mb-6 inline-block">
          ← Back to Beers
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {/* Image */}
          <div className="flex items-center justify-center bg-white rounded-2xl p-8">
            <div className="relative w-48 h-64">
              <Image
                src={beer.image}
                alt={beer.name}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">{beer.name}</h1>
            <p className="text-ink-500 text-lg mb-4">{beer.brewery}</p>

            {/* Rating and ABV */}
            <div className="flex items-center gap-6 mb-6">
              <div>
                <p className="text-sm text-ink-500 mb-1">Rating</p>
                <RatingStars value={beer.rating} />
                <p className="text-sm text-ink-400 mt-1">{beer.rating}/5.0</p>
              </div>
              <div>
                <p className="text-sm text-ink-500 mb-1">ABV</p>
                <p className="text-2xl font-bold">{beer.abv}%</p>
              </div>
              <div>
                <p className="text-sm text-ink-500 mb-1">Style</p>
                <p className="text-lg font-semibold">{beer.style}</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-ink-600 text-lg leading-relaxed mb-8">
              {beer.description}
            </p>

            {/* Price and Add to Cart */}
            <div className="border-t border-black/10 pt-6">
              <div className="flex items-center justify-between mb-6">
                <p className="text-3xl font-extrabold text-brand-500">
                  ${beer.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-2 bg-white rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-cream-100"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-cream-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() =>
                  addToCart(
                    { id: beer.id, name: beer.name, price: beer.price, image: beer.image },
                    quantity
                  )
                }
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
