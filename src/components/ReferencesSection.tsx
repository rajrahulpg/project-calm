"use client";

import SectionReveal from "./SectionReveal";
import { useLanguage } from "@/lib/language";

export default function ReferencesSection() {
  const { t } = useLanguage();

  return (
    <section style={{ background: "var(--color-bg-0)", padding: "var(--section-py-sm) 0" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 xl:px-14">
        <SectionReveal>
          <h2 className="text-xl sm:text-2xl md:text-[1.9rem] font-semibold mb-6" style={{ color: "var(--color-heading)" }}>
            {t.REFERENCES_TITLE}
          </h2>
          <ol className="flex flex-col gap-3">
            {t.REFERENCES.map((ref, i) => (
              <li key={ref} className="flex gap-3 text-xs sm:text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                <span className="shrink-0 tabular-nums" style={{ color: "var(--color-text-muted)", opacity: 0.7 }}>
                  {i + 1}.
                </span>
                <span>{ref}</span>
              </li>
            ))}
          </ol>
        </SectionReveal>
      </div>
    </section>
  );
}
