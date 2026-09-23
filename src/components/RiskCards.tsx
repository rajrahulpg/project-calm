"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Activity,
  Armchair,
  CalendarClock,
  ChevronRight,
  Cigarette,
  Droplet,
  HeartPulse,
  RotateCcw,
  Users,
  Weight,
  X,
  type LucideIcon,
} from "lucide-react";
import SectionReveal from "./SectionReveal";
import { useLanguage, type ContentBundle } from "@/lib/language";
import { usePrefersReducedMotion } from "@/lib/hooks";

const CALCULATION_DURATION_MS = 3000;
const CALCULATION_TICK_MS = 60;

const ICONS: Record<string, LucideIcon> = {
  CalendarClock,
  HeartPulse,
  Cigarette,
  Users,
  Droplet,
  Activity,
  Armchair,
  Weight,
};

type RiskFactor = ContentBundle["RISK_FACTORS"][number];

function riskTier(pct: number, ui: ContentBundle["UI"]["riskCards"]) {
  if (pct >= 67) return ui.tierHigher;
  if (pct >= 34) return ui.tierModerate;
  return ui.tierLower;
}

function RiskCard({
  risk,
  delay,
  answer,
  onOpen,
}: {
  risk: RiskFactor;
  delay: number;
  answer?: string;
  onOpen: (e: React.MouseEvent<HTMLButtonElement>, key: string) => void;
}) {
  const { t } = useLanguage();
  const Icon = ICONS[risk.icon];
  const applies = answer ? t.RISK_QUESTIONS[risk.key]?.appliesTo.includes(answer) : undefined;

  return (
    <SectionReveal as="li" delay={delay}>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={(e) => onOpen(e, risk.key)}
        className="group w-full h-full text-left flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl transition-all duration-500"
        style={{ background: "var(--color-card)", border: "1px solid var(--color-line)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.borderColor = "var(--color-coral-soft)";
          e.currentTarget.style.boxShadow = "0 20px 40px -20px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "var(--color-line)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <span
            className="flex items-center justify-center rounded-full shrink-0 w-9 h-9 sm:w-11 sm:h-11"
            style={{ background: "var(--color-coral-tint)" }}
          >
            <Icon size={17} color="var(--color-coral)" strokeWidth={1.75} className="sm:hidden" />
            <Icon size={20} color="var(--color-coral)" strokeWidth={1.75} className="hidden sm:block" />
          </span>
          <span className="text-sm sm:text-[15px]" style={{ color: "var(--color-text)" }}>
            {risk.label}
          </span>
        </div>

        <div
          className="mt-auto pt-3 flex items-center justify-between gap-3"
          style={{ borderTop: "1px solid var(--color-line)" }}
        >
          {answer ? (
            <span className="flex items-center gap-2 text-xs min-w-0" style={{ color: "var(--color-text-muted)" }}>
              <span
                className="shrink-0 rounded-full"
                style={{ width: 6, height: 6, background: applies ? "var(--color-coral)" : "var(--color-text-muted)" }}
                aria-hidden="true"
              />
              <span className="truncate">
                {answer} · {applies ? t.UI.riskCards.appliesToYou : t.UI.riskCards.doesntApply}
              </span>
            </span>
          ) : (
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {t.UI.riskCards.tapToAnswer}
            </span>
          )}

          <span
            className="flex items-center justify-center rounded-full shrink-0 transition-transform group-hover:translate-x-0.5"
            style={{ width: 24, height: 24, background: "var(--color-coral-soft)" }}
            aria-hidden="true"
          >
            <ChevronRight size={13} color="var(--color-coral)" strokeWidth={2.25} />
          </span>
        </div>
      </button>
    </SectionReveal>
  );
}

function RiskModal({
  riskKey,
  label,
  currentAnswer,
  onSelect,
  onClose,
  returnFocusRef,
}: {
  riskKey: string;
  label: string;
  currentAnswer?: string;
  onSelect: (option: string) => void;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDivElement>(null);
  const q = t.RISK_QUESTIONS[riskKey];

  useEffect(() => {
    const firstOption = dialogRef.current?.querySelector<HTMLButtonElement>("[data-option]");
    firstOption?.focus();

    const triggerToRestore = returnFocusRef.current;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      triggerToRestore?.focus();
    };
  }, [onClose, returnFocusRef]);

  if (!q) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(5,6,8,0.72)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="risk-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl p-7 sm:p-8"
        style={{ background: "var(--color-bg-1)", border: "1px solid var(--color-line)" }}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <h3 id="risk-modal-title" className="text-lg font-medium leading-snug" style={{ color: "var(--color-text)" }}>
            {label}
          </h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="shrink-0 flex items-center justify-center rounded-full"
            style={{ width: 32, height: 32, background: "var(--color-card)" }}
          >
            <X size={16} color="var(--color-text-muted)" />
          </button>
        </div>

        <p className="text-sm mb-5" style={{ color: "var(--color-text-muted)" }}>
          {q.question}
        </p>

        <div className="flex flex-col gap-2.5">
          {q.options.map((option) => {
            const selected = currentAnswer === option;
            return (
              <button
                key={option}
                type="button"
                data-option
                aria-pressed={selected}
                onClick={() => onSelect(option)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm transition-colors duration-200"
                style={{
                  background: selected ? "var(--color-coral-tint)" : "var(--color-card)",
                  border: `1px solid ${selected ? "var(--color-coral)" : "var(--color-line)"}`,
                  color: "var(--color-text)",
                }}
              >
                {option}
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-[11px] leading-relaxed" style={{ color: "var(--color-text-muted)", opacity: 0.75 }}>
          {t.UI.riskCards.modalDisclaimer}
        </p>
      </div>
    </div>
  );
}

type CalcPhase = "idle" | "calculating" | "done";

export default function RiskCards() {
  const { t } = useLanguage();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [calcPhase, setCalcPhase] = useState<CalcPhase>("idle");
  const [displayPercent, setDisplayPercent] = useState(0);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);
  const calcTimerRef = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    return () => {
      if (calcTimerRef.current !== null) window.clearInterval(calcTimerRef.current);
    };
  }, []);

  const answeredKeys = Object.keys(answers);
  const answeredCount = answeredKeys.length;
  const applicableCount = answeredKeys.filter((k) => t.RISK_QUESTIONS[k]?.appliesTo.includes(answers[k])).length;
  const percentage = answeredCount > 0 ? Math.round((applicableCount / answeredCount) * 100) : 0;

  const openModal = (e: React.MouseEvent<HTMLButtonElement>, key: string) => {
    activeTriggerRef.current = e.currentTarget;
    setOpenKey(key);
  };

  const stopCalculating = () => {
    if (calcTimerRef.current !== null) {
      window.clearInterval(calcTimerRef.current);
      calcTimerRef.current = null;
    }
  };

  const runCalculation = () => {
    if (answeredCount === 0) return;
    stopCalculating();

    if (reducedMotion) {
      setDisplayPercent(percentage);
      setCalcPhase("done");
      return;
    }

    setCalcPhase("calculating");
    const startedAt = Date.now();
    calcTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      if (elapsed >= CALCULATION_DURATION_MS) {
        stopCalculating();
        setDisplayPercent(percentage);
        setCalcPhase("done");
        return;
      }
      setDisplayPercent(Math.floor(Math.random() * 101));
    }, CALCULATION_TICK_MS);
  };

  const resetAll = () => {
    stopCalculating();
    setAnswers({});
    setCalcPhase("idle");
    setDisplayPercent(0);
  };

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--color-bg-0)", padding: "var(--section-py) 0" }}>
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/assets/risk-consult.jpg"
          alt=""
          fill
          className="object-cover object-[80%_50%]"
          style={{ opacity: "var(--bg-photo-opacity)" }}
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--color-bg-0) 0%, color-mix(in srgb, var(--color-bg-0) 55%, transparent) 30%, color-mix(in srgb, var(--color-bg-0) 55%, transparent) 70%, var(--color-bg-0) 100%)",
          }}
        />
      </div>
      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        <SectionReveal>
          {/* Hand-scrawled note beside "Risk", joined by a short leader line — sits
              in normal flow next to the heading so it reflows instead of
              overlapping at widths where the heading text is wider/narrower
              than the old fixed offset assumed. */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mb-4">
            <h2 className="text-3xl sm:text-4xl md:text-[2.4rem] font-medium text-center" style={{ color: "var(--color-heading)" }}>
              {t.RISK_SECTION_TITLE}
            </h2>
            <span className="inline-flex items-center gap-1.5 shrink-0" aria-hidden="true">
              <svg width="22" height="14" viewBox="0 0 22 14" fill="none" className="shrink-0">
                <line x1="1" y1="12" x2="20" y2="2" stroke="var(--color-coral)" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span
                className="block text-sm sm:text-lg -rotate-3 whitespace-nowrap"
                style={{ fontFamily: "var(--font-hand)", color: "var(--color-coral)" }}
              >
                {t.UI.riskCards.doodleLabel}
              </span>
            </span>
          </div>

          <p className="text-sm sm:text-base text-center mb-2 max-w-xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
            {t.RISK_SECTION_SUBTITLE}
          </p>
          <p className="text-xs sm:text-sm text-center mb-14" style={{ color: "var(--color-text-muted)", opacity: 0.7 }}>
            {t.UI.riskCards.sectionHint}
          </p>
        </SectionReveal>

        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {t.RISK_FACTORS.map((risk, i) => (
            <RiskCard key={risk.key} risk={risk} delay={i * 60} answer={answers[risk.key]} onOpen={openModal} />
          ))}
        </ul>

        {answeredCount > 0 && (
          <SectionReveal>
            <div className="mt-16 flex flex-col items-center text-center">
              {calcPhase === "idle" && (
                <button
                  type="button"
                  onClick={runCalculation}
                  className="btn-accent inline-flex items-center px-8 py-3.5 rounded-full text-[12px] font-semibold uppercase tracking-[0.14em]"
                >
                  {t.UI.riskCards.calculateCta}
                </button>
              )}

              {calcPhase !== "idle" && (
                <>
                  <p className="text-sm sm:text-base" style={{ color: "var(--color-text-muted)" }}>
                    {calcPhase === "calculating"
                      ? t.UI.riskCards.calculating
                      : t.UI.riskCards.summary(applicableCount, answeredCount)}
                  </p>

                  <p
                    className={`mt-3 text-6xl sm:text-7xl font-medium leading-none tabular-nums ${
                      calcPhase === "calculating" ? "animate-pulse" : ""
                    }`}
                    style={{ color: "var(--color-coral)" }}
                  >
                    {displayPercent}%
                  </p>

                  {calcPhase === "done" && (
                    <>
                      <span
                        className="mt-4 inline-block px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em]"
                        style={{ background: "var(--color-coral-tint)", color: "var(--color-coral)" }}
                      >
                        {t.UI.riskCards.selfCheckLevel}: {riskTier(percentage, t.UI.riskCards)}
                      </span>

                      <p className="mt-6 max-w-sm text-xs" style={{ color: "var(--color-text-muted)", opacity: 0.75 }}>
                        <span className="text-[10px] align-super" aria-hidden="true">*</span>{" "}
                        {t.UI.riskCards.selfCheckDisclaimer}
                      </p>

                      <div className="mt-6 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={runCalculation}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.14em] transition-colors"
                          style={{ border: "1px solid var(--color-line)", color: "var(--color-text-muted)" }}
                        >
                          {t.UI.riskCards.recalculate}
                        </button>
                        <button
                          type="button"
                          onClick={resetAll}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.14em] transition-colors"
                          style={{ border: "1px solid var(--color-line)", color: "var(--color-text-muted)" }}
                        >
                          <RotateCcw size={13} />
                          {t.UI.riskCards.resetAnswers}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </SectionReveal>
        )}
      </div>

      {openKey && (
        <RiskModal
          riskKey={openKey}
          label={t.RISK_FACTORS.find((r) => r.key === openKey)?.label ?? ""}
          currentAnswer={answers[openKey]}
          onSelect={(option) => {
            setAnswers((prev) => ({ ...prev, [openKey]: option }));
            setOpenKey(null);
            // A changed answer invalidates any calculated/in-progress score —
            // back to the "Know Your Score" CTA until recalculated.
            if (calcPhase !== "idle") {
              stopCalculating();
              setCalcPhase("idle");
            }
          }}
          onClose={() => setOpenKey(null)}
          returnFocusRef={activeTriggerRef}
        />
      )}
    </section>
  );
}
