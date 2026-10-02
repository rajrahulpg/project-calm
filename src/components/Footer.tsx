"use client";

import { useRef } from "react";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useHorizontalTraceMask, usePrefersReducedMotion } from "@/lib/hooks";
import SiteLogo, { SiteHashtag } from "./SiteLogo";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import { ECG_D_THIN } from "./HeroBackdrop";

export default function Footer() {
  const { t } = useLanguage();
  const { UI } = t;
  const reducedMotion = usePrefersReducedMotion();
  const bandRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const traceMask = useHorizontalTraceMask(bandRef, textRef, [t]);

  return (
    <footer style={{ background: "var(--color-bg-1)", borderTop: "1px solid var(--color-line)" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-10 sm:pt-12 text-center">
        <p className="whitespace-pre-line text-xs leading-relaxed" style={{ color: "var(--color-text-muted)", opacity: 0.85 }}>
          {t.FOOTER_LEGAL_NOTICE}
        </p>
      </div>

      {/* overflow-x-auto is a safety net, not the intended path: below ~360px
          (older/smaller phones) the logo + controls no longer all fit on one
          row at readable sizes, so this lets that row scroll instead of
          breaking the page layout. Every mainstream phone width renders it
          with no scrolling. */}
      {/* Below 380px (360px Androids) the logo + hashtag stack above the
          controls instead of sharing the row. */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-8 sm:pt-10 pb-10 sm:pb-14 flex flex-row max-[379px]:flex-col items-center justify-between gap-3 max-[379px]:gap-5 sm:gap-8 overflow-x-auto">
        <Link href="/" className="inline-flex flex-col items-start max-[379px]:items-center shrink-0">
          <SiteLogo className="h-6 sm:h-10 w-auto" />
          {/* Smaller on phones so the logo + controls row still fits. */}
          <SiteHashtag className="!text-[8.5px] sm:!text-xs" />
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <LanguageToggle />
          <ThemeToggle />
          <Link
            href="/resources#talk-to-someone"
            className="btn-accent inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap px-3 sm:px-5 py-2 sm:py-3 text-[8px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.18em] font-semibold rounded-full"
          >
            <PhoneCall size={12} />
            {UI.navbar.talkToSomeone}
          </Link>
        </div>
      </div>

      <div ref={bandRef} className="band-accent relative overflow-hidden px-6 md:px-12 py-6 text-[11px] text-center">
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          style={traceMask ? { maskImage: traceMask, WebkitMaskImage: traceMask } : undefined}
          aria-hidden="true"
        >
          <path d={ECG_D_THIN} fill="none" stroke="#FFFFFF" strokeWidth={1} opacity={0.16} />
          {!reducedMotion && (
            <>
              <path d={ECG_D_THIN} pathLength={1300} className="ecg-trace" fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={0.14} />
              <path d={ECG_D_THIN} pathLength={1300} className="ecg-trace" fill="none" stroke="#FFFFFF" strokeWidth={1.25} opacity={0.6} strokeLinecap="round" />
            </>
          )}
        </svg>
        <span ref={textRef} className="relative">
          © {new Date().getFullYear()}. {UI.footer.rights}
        </span>
      </div>
    </footer>
  );
}
