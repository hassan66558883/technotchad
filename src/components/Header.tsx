"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";
import { localeHref } from "@/lib/locale-link";
import { locales, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/dictionaries";

function stripLocale(pathname: string, lang: Locale) {
  const prefix = `/${lang}`;
  if (pathname === prefix) return "/";
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  return pathname;
}

export default function Header({ lang, nav }: { lang: Locale; nav: Dictionary["nav"] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const currentPath = stripLocale(pathname, lang);

  const navLinks = [
    { href: "/", label: nav.home },
    { href: "/a-propos", label: nav.company },
    { href: "/services", label: nav.services },
    { href: "/formations", label: nav.formations },
    { href: "/projets", label: nav.projects },
    { href: "/logiciels", label: nav.software },
    { href: "/#contact", label: nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between py-2">
        <Link href={localeHref(lang, "/")} className="flex items-center">
          <Image
            src="/logo-full.png"
            alt="TechnoTchad"
            width={900}
            height={691}
            priority
            className="h-14 w-auto sm:h-16"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={localeHref(lang, link.href)}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-blue"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate">
            {locales.map((locale, i) => (
              <span key={locale} className="flex items-center gap-1">
                <Link
                  href={`/${locale}${currentPath === "/" ? "" : currentPath}`}
                  className={`hover:text-blue ${locale === lang ? "text-blue" : ""}`}
                >
                  {locale.toUpperCase()}
                </Link>
                {i < locales.length - 1 && <span>|</span>}
              </span>
            ))}
          </div>
          <Link
            href={localeHref(lang, "/#contact")}
            className="rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue/20 transition-colors hover:bg-blue-dark"
          >
            {nav.quote}
          </Link>
        </div>

        <button
          aria-label="Menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-line lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3.5 w-4">
            <span
              className={`absolute left-0 top-0 h-0.5 w-4 bg-navy transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-4 bg-navy transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 top-3 h-0.5 w-4 bg-navy transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </Container>

      {open && (
        <div className="border-t border-line bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={localeHref(lang, link.href)}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-mist hover:text-blue"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 px-3 text-xs font-semibold text-slate">
              {locales.map((locale, i) => (
                <span key={locale} className="flex items-center gap-2">
                  <Link
                    href={`/${locale}${currentPath === "/" ? "" : currentPath}`}
                    onClick={() => setOpen(false)}
                    className={`hover:text-blue ${locale === lang ? "text-blue" : ""}`}
                  >
                    {locale.toUpperCase()}
                  </Link>
                  {i < locales.length - 1 && <span>|</span>}
                </span>
              ))}
            </div>
            <Link
              href={localeHref(lang, "/#contact")}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-blue px-5 py-3 text-center text-sm font-semibold text-white"
            >
              {nav.quote}
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
