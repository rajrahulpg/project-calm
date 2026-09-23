"use client";

import Image from "next/image";
import SectionReveal from "./SectionReveal";
import StatValue from "./StatValue";
import { useLanguage } from "@/lib/language";

export default function AnatomySection() {
  const { t } = useLanguage();
  const ANATOMY = t.ANATOMY;
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--color-bg-1)", padding: "var(--section-py) 0" }}>
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/assets/anatomy-heart.jpg"
          alt=""
          fill
          className="object-cover object-[85%_50%]"
          style={{ opacity: "var(--bg-photo-opacity)", transform: "scaleX(-1)" }}
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--color-bg-1) 0%, color-mix(in srgb, var(--color-bg-1) 55%, transparent) 30%, color-mix(in srgb, var(--color-bg-1) 55%, transparent) 70%, var(--color-bg-1) 100%)",
          }}
        />
      </div>
      <div className="relative max-w-3xl mx-auto px-6 md:px-12 text-center">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.4rem] leading-[1.15] font-medium mb-6" style={{ color: "var(--color-heading)" }}>
            {ANATOMY.title}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mx-auto max-prose" style={{ color: "var(--color-text-muted)" }}>
            {ANATOMY.body}
          </p>
        </SectionReveal>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 md:px-12 mt-10 grid sm:grid-cols-2 gap-6 items-stretch">
        <SectionReveal delay={100} className="h-full">
          <div
            className="relative w-full h-full min-h-[240px] rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--color-line)" }}
          >
            <Image
              src="/assets/anatomy-plaque.jpg"
              alt="Cross-section visualization of plaque buildup inside a coronary artery near the heart — the site where calcium blockages form"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        </SectionReveal>

        <SectionReveal delay={150} className="h-full">
          <div
            className="h-full flex flex-col items-center justify-center rounded-2xl p-10 sm:p-14 text-center"
            style={{ background: "var(--color-card)", border: "1px solid var(--color-line)" }}
          >
            <StatValue
              value={ANATOMY.statValue}
              className="block text-[4.5rem] sm:text-[5.5rem] font-medium leading-none"
              style={{ color: "var(--color-coral)" }}
            />
            <p className="mt-4 text-sm sm:text-base" style={{ color: "var(--color-text-muted)" }}>
              {ANATOMY.statLabel}
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
