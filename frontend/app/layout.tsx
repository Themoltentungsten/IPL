import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { MobileMenu } from "@/components/shared/mobile-menu";
import { navLinks } from "@/components/shared/nav-links";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IPL 2026 Live Score, Predictions & Statistics",
    template: "%s | IPL Predictor",
  },
  description:
    "Real-time IPL match predictions, live scores, points table, and comprehensive statistics for all teams and players.",
  keywords: ["IPL", "cricket", "live score", "predictions", "statistics", "points table"],
  openGraph: {
    title: "IPL 2026 Live Score & AI Predictions",
    description: "AI-powered match predictions, live scores, and analytics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full bg-slate-950 text-slate-100">
        {/* Live ticker bar */}
        <div className="overflow-hidden border-b border-slate-800/60 bg-slate-900/80 py-1 text-xs text-slate-300">
          <div className="animate-marquee whitespace-nowrap">
            MI 176/5 (18.4) vs CSK — Target 201 • RR qualified for playoffs • Orange Cap: V Kohli 642 • Purple Cap: J Bumrah 23 wkts • Next: RCB vs KKR Apr 4
          </div>
        </div>

        <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur">
          <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="text-lg font-bold tracking-tight text-amber-300">
              IPL Predictor
            </Link>
            <nav className="hidden flex-wrap items-center gap-4 text-sm text-slate-300 md:flex" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded">
                  {link.label}
                </Link>
              ))}
            </nav>
            <MobileMenu />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6">{children}</main>

        <footer className="border-t border-slate-800 bg-slate-950 py-6">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-6 text-sm text-slate-400 sm:grid-cols-3">
              <div>
                <p className="mb-2 font-semibold text-slate-200">IPL Predictor</p>
                <p>AI-powered match predictions, live scores, and comprehensive IPL analytics.</p>
              </div>
              <div>
                <p className="mb-2 font-semibold text-slate-200">Quick Links</p>
                <div className="flex flex-col gap-1">
                  <Link href="/live" className="hover:text-white">Live Matches</Link>
                  <Link href="/points-table" className="hover:text-white">Points Table</Link>
                  <Link href="/stats" className="hover:text-white">Statistics</Link>
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-slate-200">Legal</p>
                <p>This is a demonstration project. IPL is a trademark of BCCI.</p>
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-slate-500">IPL Match Predictor & Tracking Platform</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
