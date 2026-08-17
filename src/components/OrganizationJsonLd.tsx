import { prisma } from "@/lib/prisma";
import type { Dictionary } from "@/dictionaries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://technotchad.com";

export default async function OrganizationJsonLd({ dict }: { dict: Dictionary }) {
  const socialKeys = ["social_facebook", "social_youtube", "social_tiktok", "social_whatsapp"];
  const settings = await prisma.setting.findMany({ where: { key: { in: socialKeys } } });
  const sameAs = settings.map((s) => s.value).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#organization`,
    name: "TechnoTchad",
    url: siteUrl,
    logo: `${siteUrl}/logo-full.png`,
    image: `${siteUrl}/logo-full.png`,
    description: dict.meta.siteDescription,
    telephone: "+235 60 98 48 49",
    email: "contact@technotchad.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Quartier Amriguébé",
      addressLocality: "N'Djaména",
      addressCountry: "TD",
    },
    areaServed: "Tchad",
    ...(sameAs.length > 0 && { sameAs }),
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          serviceType: "Installation de vidéosurveillance (CCTV)",
          name: "Installation CCTV",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          serviceType: "Déploiement ERP / Odoo",
          name: "ERP & Odoo",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          serviceType: "Réseaux & infrastructure informatique",
          name: "Réseaux & Infrastructure",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          serviceType: "Formation professionnelle en informatique",
          name: "Formations IT",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
