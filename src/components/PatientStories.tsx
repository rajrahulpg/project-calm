"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { Quote } from "lucide-react";
import SectionReveal from "./SectionReveal";
import PlaceholderModal from "./PlaceholderModal";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";

const PULSE_D = "M0,20 L40,20 L48,20 L54,6 L60,34 L66,20 L120,20 L128,20 L134,10 L140,30 L146,20 L200,20";

export default function PatientStories() {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const PATIENT_STORIES = t.PATIENT_STORIES;
  const [open, setOpen] = useState<number | null>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
    e.currentTarget.style.boxShadow = "0 30px 60px -30px var(--color-coral-glow)";
    e.currentTarget.style.borderColor = "var(--color-coral-soft)";
  };
  const onLeave = (e: MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
    e.currentTarget.style.boxShadow = "";
    e.currentTarget.style.borderColor = "var(--color-line)";
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>, n: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(n);
    }
  };

  return (
    <section style={{ background: "var(--color-bg-1)", padding: "var(--section-py) 0" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.4rem] font-medium mb-3 text-center" style={{ color: "var(--color-heading)" }}>
            {PATIENT_STORIES.title}
          </h2>
          <p className="text-base text-center mb-14" style={{ color: "var(--color-text-muted)" }}>
            {PATIENT_STORIES.subtitle}
          </p>
        </SectionReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {PATIENT_STORIES.placeholders.map((n, i) => (
            <SectionReveal key={n} delay={i * 100}>
              <div
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`${PATIENT_STORIES.title} ${n}`}
                className="tilt-card h-full rounded-2xl p-4 sm:p-8 flex flex-col cursor-pointer"
                style={{ background: "var(--color-card)", border: "1px solid var(--color-line)" }}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                onClick={() => setOpen(n)}
                onKeyDown={(e) => onKeyDown(e, n)}
              >
                <span
                  className="inline-flex items-center justify-center rounded-full mb-3 sm:mb-6"
                  style={{ width: 40, height: 40, background: "var(--color-coral-tint)" }}
                >
                  <Quote size={18} color="var(--color-coral)" strokeWidth={1.75} />
                </span>
                <div className="flex-1 flex flex-col gap-2 sm:gap-2.5 mb-4 sm:mb-8">
                  <div className="shimmer h-2.5 w-full rounded-full" />
                  <div className="shimmer h-2.5 w-full rounded-full" style={{ animationDelay: "0.3s" }} />
                  <div className="shimmer h-2.5 w-3/4 rounded-full" style={{ animationDelay: "0.6s" }} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="shimmer rounded-full shrink-0" style={{ width: 40, height: 40 }} />
                  <div className="flex-1">
                    <div className="shimmer h-2.5 w-24 rounded-full mb-2" />
                    <svg viewBox="0 0 200 40" className="w-24 h-4" aria-hidden="true">
                      <path d={PULSE_D} fill="none" stroke="var(--color-coral)" strokeWidth={1.5} opacity={0.2} />
                      {!reducedMotion && (
                        <path d={PULSE_D} pathLength={1300} className="ecg-trace" fill="none" stroke="var(--color-coral)" strokeWidth={2} strokeLinecap="round" style={{ animationDelay: `${i * 0.8}s` }} />
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>

      {open !== null && (
        <PlaceholderModal title={PATIENT_STORIES.title} note={PATIENT_STORIES.note} icon={Quote} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}
