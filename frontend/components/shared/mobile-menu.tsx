"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { navLinks } from "./nav-links";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <nav className="absolute left-0 right-0 top-full z-30 border-b border-white/[0.06] bg-[#0d1b3e]/98 px-4 pb-4 pt-2 backdrop-blur-xl">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-slate-200 transition hover:bg-white/[0.06] hover:text-amber-300 active:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
