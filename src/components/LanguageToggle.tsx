"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/language";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const next = lang === "en" ? "hi" : "en";

  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={next === "hi" ? "Switch to Hindi" : "Switch to English"}
      className="flex items-center justify-center gap-1.5 rounded-full w-10 sm:w-auto px-3 transition-colors"
      style={{
        height: 40,
        border: "1px solid var(--color-line)",
        color: "var(--color-text)",
      }}
    >
      <Languages size={14} />
      <span className="hidden sm:inline text-[11px] font-semibold leading-none">{next === "hi" ? "हिं" : "EN"}</span>
    </button>
  );
}
