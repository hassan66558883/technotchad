"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Container from "@/components/ui/Container";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "Entreprise" },
  { href: "/services", label: "Services" },
  { href: "/formations", label: "Formations" },
  { href: "/projets", label: "Projets" },
  { href: "/actualites", label: "Actualités" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between py-2">
        <Link href="/" className="flex items-center">
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
              href={link.href}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-blue"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate">
            <span className="cursor-pointer hover:text-blue">FR</span>
            <span>|</span>
            <span className="cursor-pointer hover:text-blue">EN</span>
            <span>|</span>
            <span className="cursor-pointer hover:text-blue">AR</span>
          </div>
          <Link
            href="/#contact"
            className="rounded-full bg-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue/20 transition-colors hover:bg-blue-dark"
          >
            Demander un devis
          </Link>
        </div>

        <button
          aria-label="Ouvrir le menu"
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
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-mist hover:text-blue"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-blue px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Demander un devis
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
