import Link from "next/link";
import Container from "@/components/ui/Container";
import SocialIcons from "@/components/SocialIcons";
import { getSettings, SOCIAL_SETTING_KEYS } from "@/lib/settings";
import { localeHref } from "@/lib/locale-link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/dictionaries";

export default async function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const social = await getSettings(SOCIAL_SETTING_KEYS);

  const navigation = [
    { href: "/", label: dict.nav.home },
    { href: "/a-propos", label: dict.nav.company },
    { href: "/services", label: dict.nav.services },
    { href: "/formations", label: dict.nav.formations },
    { href: "/projets", label: dict.nav.projects },
    { href: "/actualites", label: dict.nav.news },
    { href: "/#contact", label: dict.nav.contact },
  ];

  return (
    <footer className="bg-navy text-white/80">
      <Container className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="text-lg font-bold tracking-tight text-white">
            TECHNO<span className="text-cyan">TCHAD</span>
          </span>
          <p className="mt-3 text-sm leading-relaxed text-white/60">{dict.footer.tagline}</p>
          <p className="mt-4 text-sm text-white/60">{dict.footer.description}</p>
          <SocialIcons
            facebook={social.social_facebook}
            tiktok={social.social_tiktok}
            youtube={social.social_youtube}
            whatsapp={social.social_whatsapp}
            className="mt-5"
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {dict.footer.navHeading}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={localeHref(lang, item.href)} className="hover:text-cyan">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {dict.footer.servicesHeading}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {dict.footer.servicesList.map((item) => (
              <li key={item}>
                <Link href={localeHref(lang, "/services")} className="hover:text-cyan">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
            {dict.footer.contactHeading}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li>{dict.footer.address}</li>
            <li>
              <a href="tel:+23560984849" className="hover:text-cyan">
                60 98 48 49
              </a>
            </li>
            <li>
              <a href="tel:+23590984849" className="hover:text-cyan">
                90 98 48 49
              </a>
            </li>
            <li>
              <a href="mailto:contact@technotchad.com" className="hover:text-cyan">
                contact@technotchad.com
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-white/50 sm:flex-row">
          <p>© 2026 TechnoTchad. {dict.footer.rights}</p>
          <p>{dict.footer.address}</p>
        </Container>
      </div>
    </footer>
  );
}
