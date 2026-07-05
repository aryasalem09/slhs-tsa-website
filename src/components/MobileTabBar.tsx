"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconCalendar,
  IconHome,
  IconInfo,
  IconPhoto,
  IconStar,
} from "@/components/icons";

const TABS = [
  { label: "Home", href: "/", Icon: IconHome },
  { label: "Gallery", href: "/gallery", Icon: IconPhoto },
  { label: "Join", href: "/join", Icon: IconStar, accent: true },
  { label: "Calendar", href: "/calendar", Icon: IconCalendar },
  { label: "About", href: "/about", Icon: IconInfo },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/about" && pathname.startsWith("/officers")) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** App-style bottom navigation for phones and small tablets. */
export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-tsa-blue/60 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map(({ label, href, Icon, accent }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex min-h-14 flex-col items-center justify-center gap-0.5 py-1.5"
              >
                <span
                  className={`flex h-8 w-11 items-center justify-center rounded-full text-[1.35rem] transition-colors ${
                    accent
                      ? "border-2 border-ink bg-tsa-red text-white shadow-[2px_2px_0_0_rgb(37_50_68_/_0.5)]"
                      : active
                        ? "bg-cream text-tsa-blue"
                        : "text-muted-ink"
                  }`}
                >
                  <Icon aria-hidden="true" />
                </span>
                <span
                  className={`text-[10px] font-extrabold ${
                    active ? "text-tsa-blue" : "text-muted-ink"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
