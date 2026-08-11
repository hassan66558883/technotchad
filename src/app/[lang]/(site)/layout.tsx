import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/dictionaries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Header lang={lang} nav={dict.nav} />
      <main className="flex-1">{children}</main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
