"use client";

import Image from "next/image";
import { CalendarCheck, Footprints, Pill, Salad, Users, type LucideIcon } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { useLanguage } from "@/lib/language";

const ICONS: LucideIcon[] = [Pill, CalendarCheck, Footprints, Salad, Users];

export default function LifeAfterSection() {
  const { t } = useLanguage();
  const LIFE_AFTER = t.LIFE_AFTER;
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--color-bg-1)", padding: "var(--section-py) 0" }}>
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/assets/lifeafter-walk.jpg"
          alt=""
          fill
          className="object-cover object-[80%_45%]"
          style={{ opacity: "var(--bg-photo-opacity)" }}
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
      <div className="relative max-w-3xl mx-auto px-6 md:px-12">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.4rem] font-medium mb-14 text-center" style={{ color: "var(--color-heading)" }}>
            {LIFE_AFTER.title}
          </h2>
        </SectionReveal>

        <ul className="flex flex-col gap-4">
          {LIFE_AFTER.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <SectionReveal as="li" key={item} delay={i * 80}>
                <div
                  className="group flex items-center gap-5 p-5 sm:p-6 rounded-2xl transition-all duration-500 hover:translate-x-2"
                  style={{ background: "var(--color-card)", border: "1px solid var(--color-line)" }}
                >
                  <span
                    className="relative shrink-0 flex items-center justify-center rounded-full transition-colors duration-500 group-hover:bg-[var(--color-coral)]"
                    style={{ width: 52, height: 52, background: "var(--color-coral-tint)" }}
                  >
                    <Icon size={22} strokeWidth={1.75} className="transition-colors duration-500 text-[var(--color-coral)] group-hover:text-[var(--color-on-accent)]" />
                    <span
                      className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[9px] font-semibold tabular-nums"
                      style={{ width: 18, height: 18, background: "var(--color-bg-0)", color: "var(--color-coral)", border: "1px solid var(--color-coral-soft)" }}
                    >
                      {i + 1}
                    </span>
                  </span>
                  <p className="text-base sm:text-lg leading-relaxed" style={{ color: "var(--color-text)" }}>
                    {item}
                  </p>
                </div>
              </SectionReveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
