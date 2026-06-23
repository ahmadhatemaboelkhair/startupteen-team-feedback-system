"use client";

import Image from "next/image";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

const ischoolLogoUrl = "https://i.postimg.cc/Tw5kzBkT/655a7c231e772cae143dec27-i-School-Logo-colors.webp";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={ischoolLogoUrl}
            alt="iSchool"
            width={190}
            height={58}
            className="h-12 w-auto object-contain"
            priority
          />
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
