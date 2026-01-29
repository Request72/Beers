'use client';

import React, { useState, useEffect } from 'react';
import type { Beer } from "@/lib/mock/beers";
import { fetchBeers } from "@/lib/api";
import { BeerCard } from "@/components/beers/BeerCard";
import { Badge } from "@/components/ui/Badge";

export default function BeersPage() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [filteredBeers, setFilteredBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadBeers = async () => {
      try {
        setLoading(true);
        const data = await fetchBeers();
        setBeers(data);
        setFilteredBeers(data);
      } catch (err) {
        setError('Failed to load beers. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBeers();
  }, []);

  // Filter beers based on search query
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = beers.filter(beer =>
      beer.name.toLowerCase().includes(query) ||
      beer.brewery.toLowerCase().includes(query) ||
      beer.style.toLowerCase().includes(query)
    );
    setFilteredBeers(filtered);
  }, [searchQuery, beers]);

  return (
    <main className="bg-gradient-to-b from-cream-50 to-cream-100">
      <section className="container-page py-10 md:py-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2">
              <Badge className="bg-white/70">🍻 Curated selection</Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Beers</h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-500 md:text-base">
              Discover craft beers by style, brewery, and taste.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm outline-none placeholder:text-ink-500 focus:border-brand-300 md:w-72"
              placeholder="Search beers..."
            />
          </div>
        </div>

        {loading && (
          <div className="mt-8 text-center">
            <p className="text-ink-500">Loading beers...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && filteredBeers.length === 0 && (
          <div className="mt-8 text-center">
            <p className="text-ink-500">No beers found matching your search.</p>
          </div>
        )}

        {!loading && !error && filteredBeers.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBeers.map((beer) => (
              <BeerCard key={String(beer.id)} beer={beer} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
