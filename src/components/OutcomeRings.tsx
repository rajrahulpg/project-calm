"use client";

import SectionReveal from "./SectionReveal";
import StatValue from "./StatValue";
import { useInView, usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";

const RADIUS = 64;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function Ring({ value, label, delay }: { value: string; label: string; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = usePrefersReducedMotion();
  const match = value.match(/^(\d+(?:\.\d+)?)\s*%/);
  const pct = match ? Math.min(100, parseFloat(match[1])) : 100;
  const offset = inView ? CIRCUMFERENCE * (1 - pct / 100) : CIRCUMFERENCE;

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <div className="relative w-[112px] h-[112px] sm:w-[168px] sm:h-[168px] transition-transform duration-500 hover:scale-105">
        <svg viewBox="0 0 168 168" className="w-full h-full" style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
          <circle cx={84} cy={84} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={10} />
          <circle
            cx={84}
            cy={84}
            r={RADIUS}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{
              filter: "drop-shadow(0 0 10px rgba(255,255,255,0.35))",
              transition: reducedMotion ? "none" : `stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <StatValue value={value} className="text-[1.35rem] sm:text-[2.2rem] font-semibold leading-none" style={{ color: "#FFFFFF" }} />
        </div>
      </div>
      <p className="mt-4 sm:mt-6 text-xs sm:text-[15px] leading-relaxed max-w-[18ch] sm:max-w-[24ch]" style={{ color: "rgba(255,255,255,0.86)" }}>
        {label}
      </p>
    </div>
  );
}

export default function OutcomeRings() {
  const { t } = useLanguage();
  const { title, stats, disclaimer } = t.PROVEN_OUTCOMES;

  return (
    <section className="band-accent" style={{ padding: "var(--section-py-lg) 0" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.4rem] font-medium mb-16 text-center" style={{ color: "#FFFFFF" }}>
            {title}
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-12 sm:gap-6">
          {stats.map((stat, i) => (
            <SectionReveal key={stat.label} delay={i * 120} className={i === 2 ? "col-span-2 sm:col-span-1" : undefined}>
              <Ring value={stat.value} label={stat.label} delay={i * 150} />
            </SectionReveal>
          ))}
        </div>

        {disclaimer && (
          <p className="mt-16 text-center text-[11px]" style={{ color: "rgba(255,255,255,0.7)" }}>
            {disclaimer}
          </p>
        )}
      </div>
    </section>
  );
}
