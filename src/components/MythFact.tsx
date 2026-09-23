"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Sparkle, X } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { useLanguage, type ContentBundle } from "@/lib/language";
import { usePrefersReducedMotion } from "@/lib/hooks";

type MythFactUI = ContentBundle["UI"]["mythFact"];

const SPARKLE_COUNT = 16;

type SparkleSpec = { id: number; left: number; top: number; rot: number; delay: number; size: number };

// Randomness belongs in an event handler, not render — this is only ever
// called from the click handler that just completed a perfect score.
function generateSparkles(): SparkleSpec[] {
  return Array.from({ length: SPARKLE_COUNT }).map((_, i) => ({
    id: i,
    left: 5 + Math.random() * 90,
    top: 5 + Math.random() * 90,
    rot: Math.random() * 360,
    delay: Math.random() * 0.35,
    size: 10 + Math.random() * 10,
  }));
}

function SparkleBurst({ sparkles }: { sparkles: SparkleSpec[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle-pop absolute"
          style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s`, "--sparkle-rot": `${s.rot}deg` } as React.CSSProperties}
        >
          <Sparkle size={s.size} color="var(--color-coral)" fill="var(--color-coral)" />
        </span>
      ))}
    </div>
  );
}

// Every "myth" statement in the content is, by definition, false — so the
// quiz's correct answer is always "False"; picking "True" still reveals the
// real fact, just marked as a miss instead of a hit. Green/maroon rather than
// the brand accent so "right" and "wrong" don't both read as brand colour.
const CORRECT_BG = "#1E8E5A";
const INCORRECT_BG = "#8A0F1A";

function QuizCard({
  myth,
  fact,
  ui,
  answer,
  onAnswer,
}: {
  myth: string;
  fact: string;
  ui: MythFactUI;
  answer?: "true" | "false";
  onAnswer: (choice: "true" | "false") => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const answered = answer !== undefined;

  if (!answered) {
    return (
      <div
        className="w-full h-full min-h-[170px] sm:min-h-[200px] rounded-2xl p-4 sm:p-8 flex flex-col"
        style={{ background: "var(--color-card)", border: "1px solid var(--color-line)" }}
      >
        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-2 sm:mb-3" style={{ color: "var(--color-coral)" }}>
          {ui.trueOrFalse}
        </span>
        <p className="text-sm sm:text-lg font-medium leading-snug" style={{ color: "var(--color-text)" }}>
          {myth}
        </p>
        <div className="mt-auto pt-4 sm:pt-6 flex gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => onAnswer("true")}
            className="flex-1 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors"
            style={{ border: "1px solid var(--color-coral-soft)", color: "var(--color-coral)", background: "var(--color-coral-tint)" }}
          >
            {ui.true}
          </button>
          <button
            type="button"
            onClick={() => onAnswer("false")}
            className="flex-1 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-colors"
            style={{ border: "1px solid var(--color-coral-soft)", color: "var(--color-coral)", background: "var(--color-coral-tint)" }}
          >
            {ui.false}
          </button>
        </div>
      </div>
    );
  }

  const correct = answer === "false";

  return (
    <div
      className={`relative w-full h-full min-h-[170px] sm:min-h-[200px] rounded-2xl p-4 sm:p-8 flex flex-col justify-center ${
        reducedMotion ? "" : "transition-colors duration-500"
      }`}
      style={{ background: correct ? CORRECT_BG : INCORRECT_BG }}
    >
      <span
        className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center justify-center rounded-full"
        style={{ width: 22, height: 22, background: "rgba(255,255,255,0.22)" }}
        aria-hidden="true"
      >
        {correct ? <Check size={12} color="#fff" strokeWidth={3} /> : <X size={12} color="#fff" strokeWidth={3} />}
      </span>
      <span
        className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-2 sm:mb-3"
        style={{ color: "rgba(255,255,255,0.78)" }}
      >
        {ui.fact}
      </span>
      <p className="text-sm sm:text-lg font-medium leading-snug" style={{ color: "#fff" }}>
        {fact}
      </p>
    </div>
  );
}

export default function MythFact() {
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<Record<number, "true" | "false">>({});
  const [burst, setBurst] = useState<{ id: number; sparkles: SparkleSpec[] } | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const total = t.MYTH_FACTS.length;
  const correctCount = Object.values(answers).filter((a) => a === "false").length;
  const anyAnswered = Object.keys(answers).length > 0;
  const perfectScore = anyAnswered && Object.keys(answers).length === total && correctCount === total;

  const handleAnswer = (index: number, choice: "true" | "false") => {
    const nextAnswers = { ...answers, [index]: choice };
    setAnswers(nextAnswers);

    const nextCorrect = Object.values(nextAnswers).filter((a) => a === "false").length;
    const isNowPerfect = Object.keys(nextAnswers).length === total && nextCorrect === total;
    if (isNowPerfect) {
      setBurst((prev) => ({ id: (prev?.id ?? 0) + 1, sparkles: generateSparkles() }));
    }
  };

  const handleReset = () => {
    setAnswers({});
    setBurst(null);
  };

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--color-bg-0)", padding: "var(--section-py) 0" }}>
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/assets/mythfact-consult.jpg"
          alt=""
          fill
          className="object-cover object-[80%_40%]"
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
      <div className="relative max-w-5xl mx-auto px-6 md:px-12">
        <SectionReveal>
          <div className="relative mb-14">
            {perfectScore && !reducedMotion && burst && <SparkleBurst key={burst.id} sparkles={burst.sparkles} />}
            <h2 className="text-3xl sm:text-4xl md:text-[2.4rem] font-medium mb-4 text-center" style={{ color: "var(--color-heading)" }}>
              {t.MYTH_FACT_TITLE}
            </h2>
            <p className="text-sm sm:text-base text-center mb-6 max-w-xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
              {t.UI.mythFact.hint}
            </p>
            <div className="flex justify-center" style={{ marginBottom: perfectScore ? 12 : 0 }}>
              <span
                className="px-4 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: "var(--color-card)", border: "1px solid var(--color-line)", color: "var(--color-text)" }}
              >
                {t.UI.mythFact.score(correctCount, total)}
              </span>
            </div>
            {perfectScore && (
              <p
                key={`msg-${burst?.id ?? 0}`}
                className="celebrate-pop text-sm font-semibold text-center"
                style={{ color: "var(--color-coral)" }}
              >
                {t.UI.mythFact.perfect}
              </p>
            )}
          </div>
        </SectionReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 items-stretch">
          {t.MYTH_FACTS.map((mf, i) => (
            <SectionReveal
              key={mf.myth}
              delay={i * 100}
              className={`h-full ${i === 2 ? "col-span-2 md:col-span-1 mx-auto w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-1.25rem)/2)] md:w-full" : ""}`}
            >
              <QuizCard
                myth={mf.myth}
                fact={mf.fact}
                ui={t.UI.mythFact}
                answer={answers[i]}
                onAnswer={(choice) => handleAnswer(i, choice)}
              />
            </SectionReveal>
          ))}
        </div>

        {anyAnswered && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors"
              style={{ border: "1px solid var(--color-coral)", color: "var(--color-coral)" }}
            >
              {t.UI.mythFact.tryAgain}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
