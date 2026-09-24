"use client";

import { useState } from "react";
import { Check, Landmark, Receipt, type LucideIcon } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { useLanguage } from "@/lib/language";

function QuestionList({ title, questions, icon: Icon, asked, onToggle, askedLabel }: {
  title: string;
  questions: string[];
  icon: LucideIcon;
  asked: Record<number, boolean>;
  onToggle: (i: number) => void;
  askedLabel: (n: number, total: number) => string;
}) {
  const askedCount = Object.values(asked).filter(Boolean).length;
  return (
    <div className="rounded-2xl p-4 sm:p-9 h-full flex flex-col" style={{ background: "var(--color-card)", border: "1px solid var(--color-line)" }}>
      <div className="flex items-center gap-2.5 sm:gap-4 mb-3 sm:mb-6">
        <span className="shrink-0 flex items-center justify-center rounded-full" style={{ width: 36, height: 36, background: "var(--color-coral-tint)" }}>
          <Icon size={17} color="var(--color-coral)" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-lg font-medium leading-snug" style={{ color: "var(--color-text)" }}>
            {title}
          </h3>
          <span className="text-[11px] sm:text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>
            {askedLabel(askedCount, questions.length)}
          </span>
        </div>
      </div>

      <div className="h-1 rounded-full overflow-hidden mb-3 sm:mb-6" style={{ background: "var(--color-line)" }}>
        <div className="h-full rounded-full" style={{ width: `${(askedCount / questions.length) * 100}%`, background: "var(--color-coral)", transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }} />
      </div>

      <ul className="flex flex-col gap-1.5 sm:gap-2.5">
        {questions.map((q, i) => {
          const isAsked = !!asked[i];
          return (
            <li key={q}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isAsked}
                onClick={() => onToggle(i)}
                className="w-full flex items-start gap-2 sm:gap-3.5 p-2 sm:p-3.5 rounded-xl text-left transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: isAsked ? "var(--color-coral-tint)" : "transparent", border: `1px solid ${isAsked ? "var(--color-coral-soft)" : "transparent"}` }}
              >
                <span
                  className="shrink-0 mt-0.5 flex items-center justify-center rounded-full transition-colors duration-300"
                  style={{ width: 18, height: 18, border: `1.5px solid ${isAsked ? "var(--color-coral)" : "var(--color-text-muted)"}`, background: isAsked ? "var(--color-coral)" : "transparent" }}
                >
                  {isAsked && <Check size={11} color="var(--color-on-accent)" strokeWidth={3} className="check-pop" />}
                </span>
                <span className="text-xs sm:text-[15px] leading-relaxed" style={{ color: isAsked ? "var(--color-text-muted)" : "var(--color-text)", textDecoration: isAsked ? "line-through" : "none" }}>
                  {q}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function InsuranceSection() {
  const { t } = useLanguage();
  const INSURANCE_SECTION = t.INSURANCE_SECTION;
  const [askedInsurer, setAskedInsurer] = useState<Record<number, boolean>>({});
  const [askedBilling, setAskedBilling] = useState<Record<number, boolean>>({});

  return (
    <section style={{ background: "var(--color-bg-0)", padding: "var(--section-py) 0" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.2rem] font-medium mb-4 text-center" style={{ color: "var(--color-heading)" }}>
            {INSURANCE_SECTION.title}
          </h2>
          <p className="text-sm sm:text-base text-center mb-14" style={{ color: "var(--color-text-muted)", opacity: 0.8 }}>
            {t.UI.insurance.hint}
          </p>
        </SectionReveal>

        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          <SectionReveal>
            <QuestionList
              title={INSURANCE_SECTION.insurer.title}
              questions={[...INSURANCE_SECTION.insurer.questions]}
              icon={Landmark}
              asked={askedInsurer}
              onToggle={(i) => setAskedInsurer((prev) => ({ ...prev, [i]: !prev[i] }))}
              askedLabel={t.UI.insurance.asked}
            />
          </SectionReveal>
          <SectionReveal delay={120}>
            <QuestionList
              title={INSURANCE_SECTION.billing.title}
              questions={[...INSURANCE_SECTION.billing.questions]}
              icon={Receipt}
              asked={askedBilling}
              onToggle={(i) => setAskedBilling((prev) => ({ ...prev, [i]: !prev[i] }))}
              askedLabel={t.UI.insurance.asked}
            />
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
