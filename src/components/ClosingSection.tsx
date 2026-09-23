"use client";

import Link from "next/link";
import { PhoneCall } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { AuroraBlobs } from "./HeroBackdrop";
import { useLanguage } from "@/lib/language";

export default function ClosingSection() {
  const { t } = useLanguage();
  const CLOSING = t.CLOSING;
  return (
    <section
      className="relative overflow-hidden flex items-center justify-center text-center"
      style={{ background: "var(--color-bg-0)", minHeight: "90vh", padding: "var(--section-py-sm) 24px" }}
    >
      <AuroraBlobs intensity={0.2} />
      <div className="relative z-10 max-w-2xl mx-auto">
        <SectionReveal>
          <h2 className="text-gradient-accent text-4xl sm:text-5xl md:text-[3.4rem] font-medium leading-tight pb-1">
            {CLOSING.headline}
          </h2>
        </SectionReveal>

        <SectionReveal delay={150}>
          <p className="mt-8 text-base sm:text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            {CLOSING.body}
          </p>
        </SectionReveal>

        <SectionReveal delay={300}>
          <div className="mt-11 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/"
              className="btn-accent inline-flex items-center px-8 py-3.5 rounded-full text-[12px] font-semibold uppercase tracking-[0.14em]"
            >
              {CLOSING.cta}
            </Link>
            <Link
              href="#talk-to-someone"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[12px] font-semibold uppercase tracking-[0.14em] transition-all hover:-translate-y-0.5"
              style={{ border: "1px solid var(--color-line)", color: "var(--color-text)", background: "var(--color-card)" }}
            >
              <PhoneCall size={14} />
              {CLOSING.secondaryCta}
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
