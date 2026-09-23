"use client";

import Image from "next/image";
import ArteryBlockageDiagram from "./ArteryBlockageDiagram";
import SectionReveal from "./SectionReveal";
import { useLanguage } from "@/lib/language";

export default function ConditionIntro() {
  const { t } = useLanguage();
  const CONDITION_INTRO = t.CONDITION_INTRO;
  return (
    <section id="understanding" className="relative overflow-hidden" style={{ background: "var(--color-bg-0)", padding: "var(--section-py) 0" }}>
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/assets/condition-consult.jpg"
          alt=""
          fill
          className="object-cover object-[75%_35%]"
          style={{ opacity: "var(--bg-photo-opacity)" }}
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
      <div className="relative max-w-3xl mx-auto px-6 md:px-12 text-center">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.6rem] leading-[1.12] font-medium mb-6" style={{ color: "var(--color-heading)" }}>
            {CONDITION_INTRO.subtitle}
          </h2>
        </SectionReveal>

        <SectionReveal delay={120}>
          <p className="text-base sm:text-lg leading-relaxed mx-auto max-prose" style={{ color: "var(--color-text-muted)" }}>
            {CONDITION_INTRO.body}
          </p>
        </SectionReveal>

        <SectionReveal delay={200}>
          <ArteryBlockageDiagram />
        </SectionReveal>
      </div>
    </section>
  );
}
