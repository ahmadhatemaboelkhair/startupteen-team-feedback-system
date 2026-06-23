"use client";

import Image from "next/image";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:scale-[1.02]">
            <Image
              src="/startupteen-logo.png"
              alt="StartupTeen"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
              priority
            />
          </span>
          <span>
            <span className="block text-base font-black text-brand-ink sm:text-lg">StartupTeen</span>
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
              Team Feedback
            </span>
          </span>
        </Link>
        <Link
          href="/admin"
          className="secondary-button min-h-11 px-4 py-2"
        >
          <BarChart3 size={18} />
          Admin
        </Link>
      </div>
    </header>
  );
}
