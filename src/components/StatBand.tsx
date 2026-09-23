"use client";

import Image from "next/image";
import SectionReveal from "./SectionReveal";
import StatValue from "./StatValue";
import { useLanguage } from "@/lib/language";

export default function StatBand({ sectionKey }: { sectionKey: "STATS_BY_NUMBERS" | "PROVEN_OUTCOMES" }) {
  const { t } = useLanguage();
  const { title, stats, disclaimer } = t[sectionKey];

  return (
    <section className="band-accent relative overflow-hidden" style={{ padding: "var(--section-py-lg) 0" }}>
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/assets/stats-or.jpg"
          alt=""
          fill
          className="object-cover object-[75%_35%]"
          style={{ opacity: 0.58, mixBlendMode: "overlay" }}
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(0,135,184,0.55) 0%, rgba(0,169,228,0.45) 55%, rgba(63,208,245,0.35) 100%)" }}
        />
      </div>
      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.4rem] font-medium mb-16 text-center" style={{ color: "#FFFFFF" }}>
            {title}
          </h2>
        </SectionReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-12 sm:gap-6">
          {stats.map((stat, i) => (
            <SectionReveal
              key={stat.label}
              delay={i * 120}
              className={`text-center ${i === 2 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <StatValue
                value={stat.value}
                className="block text-[2.1rem] sm:text-[3.8rem] font-semibold leading-none"
                style={{ color: "#FFFFFF", textShadow: "0 12px 40px rgba(0,0,0,0.25)" }}
              />
              <p className="mt-4 sm:mt-5 text-xs sm:text-[15px] leading-relaxed max-w-[18ch] sm:max-w-[26ch] mx-auto" style={{ color: "rgba(255,255,255,0.86)" }}>
                {stat.label}
              </p>
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
