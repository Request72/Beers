import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function HomePage() {
  return (
    <main className="bg-gradient-to-b from-cream-50 to-cream-100">
      <section className="container-page py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <Badge className="bg-white/70">✨ Discover Craft Excellence</Badge>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-ink-900 md:text-7xl">
            Beers <span className="text-brand-600">Shop</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-500 md:text-lg">
            Your ultimate guide to discovering exceptional craft beers from around the world.
            Explore unique flavors, find your perfect brew, and shop with confidence.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/beers">
              <Button>🍺 Explore Beers</Button>
            </Link>
            <a href="#about">
              <Button variant="secondary">Learn More</Button>
            </a>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 border-t border-black/5 pt-10 sm:grid-cols-3">
            <div>
              <div className="text-4xl font-extrabold text-brand-600">500+</div>
              <div className="mt-1 text-sm text-ink-500">Craft Beers</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-brand-600">50+</div>
              <div className="mt-1 text-sm text-ink-500">Breweries</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-brand-600">25+</div>
              <div className="mt-1 text-sm text-ink-500">Beer Styles</div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="container-page pb-16">
        <div className="rounded-xl2 border border-black/5 bg-white p-8 shadow-soft md:p-10">
          <h2 className="text-2xl font-bold tracking-tight">About this starter</h2>
          <p className="mt-3 max-w-3xl text-ink-500">
            This starter focuses on delivering the same premium, creamy aesthetic you showed.
            Next you can add cart + checkout + admin dashboard. If you want, I can extend it
            into a full eCommerce app.
          </p>
        </div>
      </section>
    </main>
  );
}
