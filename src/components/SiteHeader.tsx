"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { moreNav, nav, site } from "@/content/site";
import {
  IconDiscord,
  IconInstagram,
  IconMenu,
  IconRemind,
  IconX,
} from "@/components/icons";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  // /officers lives under the About section of the site map
  if (href === "/about" && pathname.startsWith("/officers")) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLLIElement>(null);
  const closeMenu = () => setMenuOpen(false);
  const moreActive = moreNav.some((item) => isActive(pathname, item.href));

  // Close the "More" menu on Escape or a click outside it.
  useEffect(() => {
    if (!moreOpen) return;
    function onDown(e: PointerEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMoreOpen(false);
    }
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  const linkBase =
    "rounded-full px-3.5 py-1.5 text-[15px] font-bold transition-colors";
  const pill =
    "border-2 border-ink bg-white shadow-[2px_2px_0_0_rgb(37_50_68_/_0.9)]";

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-tsa-blue/70 bg-paper/95 backdrop-blur">
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
          <span className="flex items-center gap-1.5">
            <span className="font-display text-[1.35rem] font-black leading-none tracking-tight text-spartan-orange">
              SLHS
            </span>
            <Image
              src="/logos/tsa-mark.png"
              alt="TSA"
              width={44}
              height={28}
              className="h-[30px] w-auto"
            />
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1.5 lg:flex">
          <nav aria-label="Main">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const active = isActive(pathname, item.href);
                const hasFlyout = item.href === "/about";
                return (
                  <li key={item.href} className="group relative">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      // blur, or focus-within keeps the flyout pinned open after navigating
                      onClick={(e) => e.currentTarget.blur()}
                      className={`${linkBase} inline-flex items-center gap-1 ${active ? pill : "text-ink/80 hover:bg-cream"}`}
                    >
                      {item.label}
                      {hasFlyout && (
                        <span aria-hidden="true" className="text-[10px] leading-none">
                          ▼
                        </span>
                      )}
                    </Link>
                    {hasFlyout && (
                      <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                        <div className="edge-paper-sm w-52 -rotate-1 border-2 border-ink bg-card p-1.5 shadow-lift">
                          <Link
                            href="/about"
                            onClick={(e) => e.currentTarget.blur()}
                            className="block rounded-lg px-3 py-2 text-sm font-bold text-ink hover:bg-cream hover:text-tsa-blue"
                          >
                            About SLHS TSA →
                          </Link>
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

              {/* More → Gallery / Contact */}
              <li className="relative" ref={moreRef}>
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={moreOpen}
                  onClick={() => setMoreOpen((v) => !v)}
                  className={`${linkBase} inline-flex items-center gap-1 ${
                    moreActive ? pill : "text-ink/80 hover:bg-cream"
                  }`}
                >
                  More
                  <span
                    aria-hidden="true"
                    className={`text-[10px] leading-none transition-transform ${
                      moreOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {moreOpen && (
                  <div className="absolute right-0 top-full z-50 pt-2">
                    <div className="edge-paper-sm w-44 -rotate-1 border-2 border-ink bg-card p-1.5 shadow-lift">
                      {moreNav.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreOpen(false)}
                          aria-current={isActive(pathname, item.href) ? "page" : undefined}
                          className="block rounded-lg px-3 py-2 text-sm font-bold text-ink hover:bg-cream hover:text-tsa-blue"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
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
          className="max-h-[calc(100dvh-4rem-4.5rem-env(safe-area-inset-bottom))] overflow-y-auto border-t-2 border-ink/10 bg-paper px-4 pb-5 pt-2 lg:hidden"
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
            {moreNav.map((item) => {
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
          <div className="mt-4 flex items-center justify-center gap-6 border-t-2 border-ink/10 pt-4">
            <a
              href={site.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full bg-cream p-3 text-xl text-tsa-blue"
            >
              <IconInstagram aria-hidden="true" />
            </a>
            <a
              href={site.socials.discord}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="rounded-full bg-cream p-3 text-xl text-tsa-blue"
            >
              <IconDiscord aria-hidden="true" />
            </a>
            <a
              href={site.socials.remind}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Remind"
              className="rounded-full bg-cream p-3 text-xl text-tsa-blue"
            >
              <IconRemind aria-hidden="true" />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
