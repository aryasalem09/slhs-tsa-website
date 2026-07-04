"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/content/site";
import SearchPalette from "@/components/SearchPalette";
import { IconMenu, IconSearch, IconX } from "@/components/icons";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  // /officers lives under the About section of the site map
  if (href === "/about" && pathname.startsWith("/officers")) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const linkBase =
    "rounded-full px-3.5 py-1.5 text-[15px] font-bold transition-colors";
  const pill =
    "border-2 border-ink bg-white shadow-[2px_2px_0_0_rgb(37_50_68_/_0.9)]";

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-tsa-blue/70 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 -rotate-1"
          aria-label="SLHS TSA home"
        >
          <Image
            src="/logos/spartan-mark-512.png"
            alt=""
            width={40}
            height={40}
            priority
            className="h-10 w-10 object-contain"
          />
          <span className="font-display text-[1.35rem] font-black leading-none tracking-tight">
            <span className="text-spartan-orange">SLHS</span>{" "}
            <span className="text-tsa-blue">TSA</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1.5 lg:flex">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="mr-1.5 flex w-44 items-center gap-2 rounded-full border-2 border-ink/25 bg-card px-3 py-1.5 text-sm font-semibold text-muted-ink transition-colors hover:border-ink/60"
          >
            <IconSearch className="text-base" aria-hidden="true" />
            Search
            <kbd className="ml-auto rounded border border-ink/20 bg-cream px-1.5 font-body text-[10px] font-bold">
              ⌘K
            </kbd>
          </button>

          <nav aria-label="Main">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`${linkBase} ${active ? pill : "text-ink/80 hover:bg-cream"}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href="/join"
            className="btn-marker edge-sketch ml-2 bg-tsa-red px-4 py-1.5 font-display text-[15px] font-bold text-white"
            aria-current={pathname.startsWith("/join") ? "page" : undefined}
          >
            Join
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="rounded-full p-2.5 text-xl hover:bg-cream"
          >
            <IconSearch aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="rounded-full p-2.5 text-xl hover:bg-cream"
          >
            {menuOpen ? <IconX aria-hidden="true" /> : <IconMenu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t-2 border-ink/10 bg-paper px-4 pb-5 pt-2 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-xl px-4 py-2.5 text-lg font-bold ${
                      active ? "border-2 border-ink bg-white" : "hover:bg-cream"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <Link
                href="/join"
                onClick={closeMenu}
                className="btn-marker edge-sketch block bg-tsa-red px-4 py-2.5 text-center font-display text-lg font-bold text-white"
              >
                Join SLHS TSA
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <SearchPalette
        open={searchOpen}
        onOpen={() => setSearchOpen(true)}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  );
}
