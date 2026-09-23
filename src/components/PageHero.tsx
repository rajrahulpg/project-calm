"use client";

import { useRef } from "react";
import Image from "next/image";
import HeroBackdrop, { type HeroVariant } from "./HeroBackdrop";
import { useHorizontalTraceMask } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";

const HERO_BACKGROUNDS: Record<string, { src: string; position: string; opacity: string }> = {
  TREATMENT_HERO: { src: "/assets/treatment-hero-hallway.jpg", position: "78% 50%", opacity: "calc(var(--bg-photo-opacity) + 0.16)" },
  RESOURCES_HERO: { src: "/assets/resources-hero-consult.jpg", position: "80% 55%", opacity: "calc(var(--bg-photo-opacity) + 0.34)" },
};

export default function PageHero({
  sectionKey,
  eyebrowNavHref,
  variant,
}: {
  sectionKey: "TREATMENT_HERO" | "RESOURCES_HERO";
  eyebrowNavHref?: string;
  variant?: HeroVariant;
}) {
  const { t } = useLanguage();
  const { headline, subline } = t[sectionKey];
  const eyebrow = eyebrowNavHref ? t.NAV_LINKS.find((l) => l.href === eyebrowNavHref)?.label : undefined;
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  // Keeps the ecg backdrop's trace from ever running behind the headline —
  // the h1 is inline-block (see below) so its measured width is the widest
  // rendered line, not the full column width.
  const mask = useHorizontalTraceMask(sectionRef, headlineRef, [t], 16, 60);
  const bg = HERO_BACKGROUNDS[sectionKey];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex items-center"
      style={{ minHeight: "70vh", background: "var(--color-bg-0)", paddingTop: 96 }}
    >
      {bg && (
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={bg.src}
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: bg.position, opacity: bg.opacity }}
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, var(--color-bg-0) 0%, color-mix(in srgb, var(--color-bg-0) 55%, transparent) 30%, color-mix(in srgb, var(--color-bg-0) 55%, transparent) 70%, var(--color-bg-0) 100%)",
            }}
          />
        </div>
      )}
      {variant && <HeroBackdrop variant={variant} mask={variant === "ecg" ? mask : undefined} />}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-[0.3em] mb-5" style={{ color: "var(--color-coral)" }}>
            {eyebrow}
          </p>
        )}
        <h1
          ref={headlineRef}
          className="text-gradient-accent inline-block whitespace-pre-line text-[2.2rem] sm:text-[3rem] md:text-[3.4rem] leading-[1.1] font-medium pb-1"
        >
          {headline}
        </h1>
        <p className="mt-6 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
          {subline}
        </p>
      </div>
    </section>
  );
}
