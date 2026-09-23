"use client";

import { useState } from "react";
import { Check, Sparkle } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";

type SparkleSpec = { id: number; left: number; top: number; rot: number; delay: number; size: number };

function generateSparkles(): SparkleSpec[] {
  return Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    top: Math.random() * 100,
    rot: Math.random() * 360,
    delay: Math.random() * 0.3,
    size: 10 + Math.random() * 8,
  }));
}

export default function Checklist() {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [burst, setBurst] = useState<{ id: number; sparkles: SparkleSpec[] } | null>(null);

  const total = t.CHECKLIST_ITEMS.length;
  const done = Object.values(checked).filter(Boolean).length;
  const complete = done === total;

  const toggle = (i: number) => {
    const next = { ...checked, [i]: !checked[i] };
    setChecked(next);
    if (Object.values(next).filter(Boolean).length === total) {
      setBurst((prev) => ({ id: (prev?.id ?? 0) + 1, sparkles: generateSparkles() }));
    }
  };

  return (
    <section style={{ background: "var(--color-bg-1)", padding: "var(--section-py) 0" }}>
      <div className="max-w-2xl mx-auto px-6 md:px-12">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.4rem] font-medium mb-8 text-center" style={{ color: "var(--color-heading)" }}>
            {t.CHECKLIST_TITLE}
          </h2>

          <div className="relative mb-10">
            {complete && burst && !reducedMotion && (
              <div key={burst.id} className="pointer-events-none absolute -inset-x-6 -inset-y-10" aria-hidden="true">
                {burst.sparkles.map((s) => (
                  <span
                    key={s.id}
                    className="sparkle-pop absolute"
                    style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s`, "--sparkle-rot": `${s.rot}deg` } as React.CSSProperties}
                  >
                    <Sparkle size={s.size} color="var(--color-coral)" fill="var(--color-coral)" />
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between text-xs mb-2.5" style={{ color: "var(--color-text-muted)" }}>
              <span>{t.UI.checklist.progress(done, total)}</span>
              <span className="tabular-nums">{Math.round((done / total) * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-line)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(done / total) * 100}%`,
                  background: "var(--color-coral)",
                  transition: reducedMotion ? "none" : "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </div>
            {complete && (
              <p key={`msg-${burst?.id ?? 0}`} className="celebrate-pop mt-4 text-sm font-semibold text-center" style={{ color: "var(--color-coral)" }}>
                {t.UI.checklist.complete}
              </p>
            )}
          </div>
        </SectionReveal>

        <ul className="flex flex-col gap-3">
          {t.CHECKLIST_ITEMS.map((item, i) => {
            const isChecked = !!checked[i];
            return (
              <SectionReveal as="li" key={item} delay={i * 60}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  onClick={() => toggle(i)}
                  className="w-full flex items-center gap-4 p-5 rounded-xl text-left transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: isChecked ? "var(--color-coral-tint)" : "var(--color-card)",
                    border: `1px solid ${isChecked ? "var(--color-coral-soft)" : "var(--color-line)"}`,
                  }}
                >
                  <span
                    className="shrink-0 flex items-center justify-center rounded-full transition-colors duration-300"
                    style={{
                      width: 26,
                      height: 26,
                      border: `1.5px solid ${isChecked ? "var(--color-coral)" : "var(--color-text-muted)"}`,
                      background: isChecked ? "var(--color-coral)" : "transparent",
                    }}
                  >
                    {isChecked && <Check key={i} size={15} color="var(--color-on-accent)" strokeWidth={3} className="check-pop" />}
                  </span>
                  <span
                    className="text-[15px] leading-snug transition-opacity"
                    style={{ color: "var(--color-text)", opacity: isChecked ? 0.6 : 1, textDecoration: isChecked ? "line-through" : "none" }}
                  >
                    {item}
                  </span>
                </button>
              </SectionReveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
