"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/language";

// `forceLight`: for use over the transparent, still-dark hero video (before
// the navbar has a solid background) — the icon needs to stay light-toned
// regardless of the page theme, since it isn't sitting on the page bg yet.
export default function LanguageToggle({ forceLight = false }: { forceLight?: boolean }) {
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
        border: forceLight ? "1px solid rgba(245,245,242,0.35)" : "1px solid var(--color-line)",
        color: forceLight ? "#F5F5F2" : "var(--color-text)",
      }}
    >
      <Languages size={14} />
      <span className="hidden sm:inline text-[11px] font-semibold leading-none">{next === "hi" ? "हिं" : "EN"}</span>
    </button>
  );
}
