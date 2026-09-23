"use client";

import { useEffect, useState } from "react";
import { Check, ClipboardList, Copy, Plus } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { useLanguage } from "@/lib/language";

export default function QuestionsAccordion() {
  const { t } = useLanguage();
  const ui = t.UI.questions;
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [listed, setListed] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  const listedQuestions = t.QUESTIONS.filter((_, i) => listed[i]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const toggleOpen = (i: number) => setOpen((prev) => ({ ...prev, [i]: !prev[i] }));
  const toggleListed = (i: number) => setListed((prev) => ({ ...prev, [i]: !prev[i] }));

  const copyList = async () => {
    const text = listedQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // clipboard blocked — the list is still visible on screen
    }
  };

  return (
    <section style={{ background: "var(--color-bg-0)", padding: "var(--section-py) 0" }}>
      <div className="max-w-2xl mx-auto px-6 md:px-12">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.2rem] font-medium mb-12 text-center" style={{ color: "var(--color-heading)" }}>
            {t.QUESTIONS_TITLE}
          </h2>
        </SectionReveal>

        <div className="flex flex-col">
          {t.QUESTIONS.map((q, i) => {
            const isOpen = !!open[i];
            const isListed = !!listed[i];
            const panelId = `question-panel-${i}`;
            return (
              <SectionReveal key={q} delay={i * 60}>
                <div style={{ borderBottom: "1px solid var(--color-line)" }}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleOpen(i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className="shrink-0 rounded-full transition-all duration-300"
                        style={{ width: 8, height: 8, background: isListed ? "var(--color-coral)" : "var(--color-line)", transform: isListed ? "scale(1.3)" : "scale(1)" }}
                        aria-hidden="true"
                      />
                      <span className="text-base sm:text-lg transition-colors group-hover:opacity-80" style={{ color: "var(--color-text)" }}>
                        {q}
                      </span>
                    </span>
                    <Plus
                      size={18}
                      color="var(--color-coral)"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.35s ease" }}
                      className="shrink-0"
                    />
                  </button>
                  <div id={panelId} role="region" className="expand-grid" data-open={isOpen}>
                    <div>
                      <div className="pb-6 pl-6 flex flex-col sm:flex-row sm:items-center gap-4">
                        <p className="flex-1 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                          {ui.hint}
                        </p>
                        <button
                          type="button"
                          aria-pressed={isListed}
                          onClick={() => toggleListed(i)}
                          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.12em] transition-all"
                          style={
                            isListed
                              ? { background: "var(--color-coral)", color: "var(--color-on-accent)" }
                              : { border: "1px solid var(--color-coral)", color: "var(--color-coral)" }
                          }
                        >
                          {isListed ? <Check size={13} strokeWidth={3} /> : <Plus size={13} strokeWidth={2.5} />}
                          {isListed ? ui.added : ui.addToList}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>

        <div className="expand-grid" data-open={listedQuestions.length > 0}>
          <div>
            <div className="mt-10 rounded-2xl p-6 sm:p-7" style={{ background: "var(--color-card)", border: "1px solid var(--color-coral-soft)" }}>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--color-coral)" }}>
                  <ClipboardList size={15} />
                  {listedQuestions.length}
                </span>
                <button
                  type="button"
                  onClick={copyList}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.12em] transition-all hover:-translate-y-0.5"
                  style={{ background: "var(--color-coral)", color: "var(--color-on-accent)" }}
                >
                  {copied ? <Check size={13} strokeWidth={3} /> : <Copy size={13} />}
                  {copied ? ui.copied : ui.copy}
                </button>
              </div>
              <ol className="flex flex-col gap-2.5">
                {listedQuestions.map((q, i) => (
                  <li key={q} className="flex gap-3 text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
                    <span className="tabular-nums shrink-0" style={{ color: "var(--color-coral)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {q}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
