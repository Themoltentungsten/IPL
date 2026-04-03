import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { MobileMenu } from "@/components/shared/mobile-menu";
import { navLinks } from "@/components/shared/nav-links";
import { LiveTicker } from "@/components/shared/live-ticker";

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
    template: "%s | IPL 2026",
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
      <body className="min-h-full bg-[#0a0e1a] text-slate-100">
        <LiveTicker />

        <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#0d1b3e]/95 backdrop-blur-xl">
          <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 font-black text-sm text-[#0d1b3e]">
                IPL
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-gradient-gold">IPL 2026</span>
                <span className="ml-2 hidden text-xs text-slate-400 sm:inline">Live &amp; Predictions</span>
              </div>
            </Link>
            <nav className="hidden flex-wrap items-center gap-1 text-sm md:flex" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-1.5 text-slate-300 transition hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <MobileMenu />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6">{children}</main>

        <footer className="border-t border-white/[0.06] bg-[#0d1b3e]/80">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <div className="grid gap-8 text-sm text-slate-400 sm:grid-cols-3">
              <div>
                <p className="mb-2 text-lg font-bold text-gradient-gold">IPL 2026</p>
                <p>AI-powered match predictions, live scores, and comprehensive IPL analytics — all real-time data.</p>
              </div>
              <div>
                <p className="mb-3 font-semibold text-slate-200">Quick Links</p>
                <div className="flex flex-col gap-2">
                  <Link href="/live" className="hover:text-amber-300">Live Matches</Link>
                  <Link href="/points-table" className="hover:text-amber-300">Points Table</Link>
                  <Link href="/stats" className="hover:text-amber-300">Statistics</Link>
                  <Link href="/schedule" className="hover:text-amber-300">Schedule</Link>
                </div>
              </div>
              <div>
                <p className="mb-3 font-semibold text-slate-200">About</p>
                <p className="text-xs leading-relaxed">Fan project for IPL analytics. IPL is a trademark of BCCI. Data from CricAPI (cricketdata.org).</p>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center gap-2 border-t border-white/[0.06] pt-6">
              <div className="h-6 w-6 rounded bg-gradient-to-br from-amber-400 to-amber-600 text-center text-[8px] font-black leading-6 text-[#0d1b3e]">IPL</div>
              <p className="text-xs text-slate-500">IPL Match Predictor & Tracking Platform</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
