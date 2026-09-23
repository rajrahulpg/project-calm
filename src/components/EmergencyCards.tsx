"use client";

import { useState } from "react";
import { CheckCircle2, PhoneCall, TriangleAlert, X } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { useLanguage } from "@/lib/language";

const META: Record<string, { icon: typeof CheckCircle2; accent: string }> = {
  normal: { icon: CheckCircle2, accent: "#5E9A64" },
  call: { icon: PhoneCall, accent: "#D9962E" },
  // Deep maroon, deliberately darker than the brand accent so "emergency" stays
  // distinguishable from ordinary accent elements around it.
  emergency: { icon: TriangleAlert, accent: "#8A0F1A" },
};

const LEVELS = ["normal", "call", "emergency"];

export default function EmergencyCards() {
  const { t } = useLanguage();
  const ui = t.UI.symptomChecker;
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // Interleave the columns so the chip cloud doesn't give away the grouping.
  const chips: Array<{ id: string; text: string; level: string }> = [];
  const longest = Math.max(...t.WATCH_CARDS.map((c) => c.items.length));
  for (let j = 0; j < longest; j++) {
    t.WATCH_CARDS.forEach((card) => {
      const text = card.items[j];
      if (text) chips.push({ id: `${card.key}:${text}`, text, level: card.key });
    });
  }

  const selectedChips = chips.filter((c) => selected[c.id]);
  const highestIdx = selectedChips.reduce((max, c) => Math.max(max, LEVELS.indexOf(c.level)), -1);
  const highestKey = highestIdx >= 0 ? LEVELS[highestIdx] : null;
  const highestCard = highestKey ? t.WATCH_CARDS.find((c) => c.key === highestKey) : null;
  const HighestIcon = highestKey ? META[highestKey].icon : null;

  return (
    <section id="watch" style={{ background: "var(--color-bg-1)", padding: "var(--section-py) 0" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.2rem] font-medium mb-4 text-center max-w-2xl mx-auto" style={{ color: "var(--color-heading)" }}>
            {t.WATCH_TITLE}
          </h2>
          <p className="text-sm sm:text-base text-center mb-10" style={{ color: "var(--color-text-muted)", opacity: 0.85 }}>
            {ui.hint}
          </p>
        </SectionReveal>

        <SectionReveal delay={80}>
          <div className="rounded-2xl p-6 sm:p-8 mb-8" style={{ background: "var(--color-card)", border: "1px solid var(--color-line)" }}>
            <div className="flex flex-wrap justify-center gap-2.5">
              {chips.map((chip) => {
                const isOn = !!selected[chip.id];
                const accent = META[chip.level].accent;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    aria-pressed={isOn}
                    onClick={() => setSelected((prev) => ({ ...prev, [chip.id]: !prev[chip.id] }))}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${isOn ? "chip-pop" : "hover:-translate-y-0.5"}`}
                    style={{
                      background: isOn ? `${accent}22` : "var(--color-bg-1)",
                      border: `1px solid ${isOn ? accent : "var(--color-line)"}`,
                      color: "var(--color-text)",
                    }}
                  >
                    {chip.text}
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              <div className="flex gap-1.5" aria-hidden="true">
                {LEVELS.map((level, i) => (
                  <span
                    key={level}
                    className="flex-1 h-2 rounded-full transition-colors duration-500"
                    style={{ background: i <= highestIdx ? META[level].accent : "var(--color-line)" }}
                  />
                ))}
              </div>
              <div className="mt-2 flex gap-1.5">
                {t.WATCH_CARDS.map((card) => {
                  const isHighest = card.key === highestKey;
                  return (
                    <span
                      key={card.key}
                      className="flex-1 text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-center transition-all duration-300"
                      style={{ color: isHighest ? META[card.key].accent : "var(--color-text-muted)", fontWeight: isHighest ? 700 : 500, opacity: isHighest ? 1 : 0.7 }}
                    >
                      {card.title}
                    </span>
                  );
                })}
              </div>

              <div className="mt-6 min-h-[44px] flex flex-wrap items-center justify-center gap-3">
                {highestCard && HighestIcon && highestKey ? (
                  <>
                    <span
                      key={highestKey}
                      className="celebrate-pop inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold"
                      style={{ background: `${META[highestKey].accent}1f`, color: META[highestKey].accent, border: `1px solid ${META[highestKey].accent}66` }}
                    >
                      <HighestIcon size={16} strokeWidth={2} />
                      {ui.fallsUnder}: {highestCard.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelected({})}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] uppercase tracking-[0.12em]"
                      style={{ border: "1px solid var(--color-line)", color: "var(--color-text-muted)" }}
                    >
                      <X size={12} />
                      {ui.clear}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </SectionReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {t.WATCH_CARDS.map((card, i) => {
            const { icon: Icon, accent } = META[card.key];
            const isHighest = card.key === highestKey;
            const dimmed = highestKey !== null && !isHighest;
            return (
              <SectionReveal key={card.key} delay={i * 100}>
                <div
                  className="h-full rounded-2xl p-8 transition-all duration-500"
                  style={{
                    background: "var(--color-card)",
                    border: `1px solid ${isHighest ? accent : card.key === "emergency" ? accent + "55" : "var(--color-line)"}`,
                    transform: isHighest ? "translateY(-6px)" : "translateY(0)",
                    boxShadow: isHighest ? `0 30px 60px -32px ${accent}` : "none",
                    opacity: dimmed ? 0.6 : 1,
                  }}
                >
                  <span className="flex items-center justify-center rounded-full mb-6 transition-colors duration-500" style={{ width: 44, height: 44, background: isHighest ? accent : `${accent}1f` }}>
                    <Icon size={20} color={isHighest ? "#fff" : accent} strokeWidth={1.75} />
                  </span>
                  <h3 className="text-lg font-medium mb-4" style={{ color: "var(--color-text)" }}>
                    {card.title}
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {card.items.map((item) => {
                      const isOn = !!selected[`${card.key}:${item}`];
                      return (
                        <li key={item} className="text-sm leading-relaxed flex gap-2.5 transition-all duration-300" style={{ color: isOn ? "var(--color-text)" : "var(--color-text-muted)", fontWeight: isOn ? 600 : 400 }}>
                          <span aria-hidden="true" style={{ color: accent }}>•</span>
                          {item}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
