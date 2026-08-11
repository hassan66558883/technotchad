"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n/config";
import { rtlLocales } from "@/i18n/config";

export default function HtmlLangSetter({ lang }: { lang: Locale }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = rtlLocales.includes(lang) ? "rtl" : "ltr";
  }, [lang]);

  return null;
}
