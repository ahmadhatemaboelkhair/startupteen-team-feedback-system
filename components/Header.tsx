"use client";

import Link from "next/link";
import { BarChart3, GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-orange text-white shadow-lg shadow-orange-200">
            <GraduationCap size={24} />
          </span>
          <span>
            <span className="block text-base font-black text-brand-ink sm:text-lg">StartupTeen</span>
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
              Team Feedback
            </span>
          </span>
        </Link>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-brand-orange hover:text-brand-orange"
        >
          <BarChart3 size={18} />
          Admin
        </Link>
      </div>
    </header>
  );
}
