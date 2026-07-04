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
                  <li key={item.href} className="group relative">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      // blur, or focus-within keeps the flyout pinned open after navigating
                      onClick={(e) => e.currentTarget.blur()}
                      className={`${linkBase} ${active ? pill : "text-ink/80 hover:bg-cream"}`}
                    >
                      {item.label}
                    </Link>
                    {item.href === "/about" && (
                      <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                        <div className="edge-paper-sm w-48 -rotate-1 border-2 border-ink bg-card p-1.5 shadow-lift">
                          <Link
                            href="/officers"
                            onClick={(e) => e.currentTarget.blur()}
                            className="block rounded-lg px-3 py-2 text-sm font-bold text-ink hover:bg-cream hover:text-tsa-blue"
                          >
                            Meet the Officers →
                          </Link>
                        </div>
                      </div>
                    )}
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
                  {item.href === "/about" && (
                    <Link
                      href="/officers"
                      onClick={closeMenu}
                      className="block rounded-xl px-4 py-1.5 pl-9 font-hand text-lg font-semibold text-muted-ink hover:bg-cream"
                    >
                      ↳ Meet the Officers
                    </Link>
                  )}
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
