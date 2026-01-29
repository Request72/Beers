import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "BeersShop",
  description: "Beers eCommerce UI Starter",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <footer className="border-t border-black/5 py-10">
          <div className="container-page text-sm text-ink-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <p>© {new Date().getFullYear()} BeersShop. All rights reserved.</p>
              <p className="text-ink-500">Craft discovery, simplified.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
