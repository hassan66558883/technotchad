import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import HtmlLangSetter from "@/components/HtmlLangSetter";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <>
      <HtmlLangSetter lang={lang} />
      {children}
    </>
  );
}
