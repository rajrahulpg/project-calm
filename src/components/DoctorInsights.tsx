"use client";

import { useState } from "react";
import { Play, Stethoscope } from "lucide-react";
import SectionReveal from "./SectionReveal";
import PlaceholderModal from "./PlaceholderModal";
import { useLanguage } from "@/lib/language";

const EQ_HEIGHTS = [14, 22, 30, 18, 26];

export default function DoctorInsights() {
  const { t } = useLanguage();
  const DOCTOR_INSIGHTS = t.DOCTOR_INSIGHTS;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{ background: "var(--color-bg-0)", padding: "var(--section-py) 0" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.4rem] font-medium mb-3 text-center" style={{ color: "var(--color-heading)" }}>
            {DOCTOR_INSIGHTS.title}
          </h2>
          <p className="text-base text-center mb-14" style={{ color: "var(--color-text-muted)" }}>
            {DOCTOR_INSIGHTS.subtitle}
          </p>
        </SectionReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DOCTOR_INSIGHTS.placeholders.map((n, i) => (
            <SectionReveal key={n} delay={i * 90}>
              <button
                type="button"
                aria-haspopup="dialog"
                aria-label={`${DOCTOR_INSIGHTS.title} ${n}`}
                onClick={() => setOpen(n)}
                className="group w-full text-left rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
                style={{ background: "var(--color-card)", border: "1px solid var(--color-line)" }}
              >
                <div
                  className="relative flex items-center justify-center overflow-hidden"
                  style={{
                    aspectRatio: "4 / 5",
                    background: `linear-gradient(${140 + i * 25}deg, var(--color-bg-2) 0%, color-mix(in srgb, var(--color-coral) 18%, var(--color-bg-2)) 100%)`,
                  }}
                >
                  <span
                    className="absolute rounded-full transition-transform duration-700 group-hover:scale-125"
                    style={{ width: "85%", aspectRatio: "1", background: "radial-gradient(circle, var(--color-coral) 0%, transparent 70%)", opacity: 0.16 }}
                    aria-hidden="true"
                  />
                  <Stethoscope size={30} color="var(--color-text-muted)" strokeWidth={1.25} style={{ opacity: 0.55 }} className="relative transition-transform duration-700 group-hover:-translate-y-3" />

                  <span
                    className="absolute flex items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110"
                    style={{ width: 52, height: 52, background: "var(--color-coral)", boxShadow: "0 16px 32px -16px var(--color-coral-glow)" }}
                  >
                    <Play size={18} color="var(--color-on-accent)" fill="var(--color-on-accent)" className="translate-x-px" />
                  </span>

                  <span className="absolute left-4 bottom-4 flex items-end gap-1" style={{ height: 30 }} aria-hidden="true">
                    {EQ_HEIGHTS.map((h, j) => (
                      <span
                        key={j}
                        className="eq-bar w-1 rounded-full"
                        style={{ height: h, background: "var(--color-coral)", opacity: 0.7, animationDelay: `${j * 0.15 + i * 0.1}s` }}
                      />
                    ))}
                  </span>
                </div>
                <div className="p-5">
                  <div className="shimmer h-3 w-2/3 rounded-full mb-2" />
                  <div className="shimmer h-2.5 w-1/2 rounded-full" style={{ animationDelay: "0.4s" }} />
                </div>
              </button>
            </SectionReveal>
          ))}
        </div>
      </div>

      {open !== null && (
        <PlaceholderModal title={DOCTOR_INSIGHTS.title} note={DOCTOR_INSIGHTS.note} icon={Play} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}
