"use client";

import { useLanguage } from "@/lib/language";

export default function MedicalDisclaimer() {
  const { t } = useLanguage();
  return (
    <section style={{ background: "var(--color-bg-1)" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-10 xl:px-14 py-14 text-center">
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
          {t.DISCLAIMER}
        </p>
      </div>
    </section>
  );
}
