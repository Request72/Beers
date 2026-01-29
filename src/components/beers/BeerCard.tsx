'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import type { Beer } from "@/lib/mock/beers";
import { addToCart } from "@/lib/cart";

export function BeerCard({ beer }: { beer: Beer }) {
  const [added, setAdded] = useState(false);

  const handleAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    addToCart(
      {
        id: beer.id,
        name: beer.name,
        price: beer.price,
        image: beer.image,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="overflow-hidden rounded-xl2 border border-black/5 bg-white shadow-soft hover:shadow-md transition-shadow">
      <Link href={`/beers/${beer.id}`}>
        <div className="relative">
          <Image
            src={beer.image}
            alt={beer.name}
            width={1200}
            height={800}
            className="h-44 w-full object-cover"
            priority={false}
          />
          <div className="absolute left-4 top-4">
            <Badge>{beer.style}</Badge>
          </div>
          <div className="absolute right-4 top-4">
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-ink-700 backdrop-blur">
              {beer.abv}% ABV
            </span>
          </div>
        </div>
      </Link>

      <div className="space-y-2 p-5">
        <Link href={`/beers/${beer.id}`}>
          <h3 className="text-xl font-semibold tracking-tight">{beer.name}</h3>
        </Link>
        <p className="text-sm text-ink-500">{beer.brewery}</p>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-700">
          {beer.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <RatingStars value={beer.rating} />
          <span className="text-sm font-semibold text-ink-900">
            ${beer.price.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleAdd}
          className="mt-2 w-full rounded-xl bg-ink-900 px-3 py-2 text-xs font-semibold text-white hover:bg-ink-800"
        >
          {added ? "Added to cart" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
