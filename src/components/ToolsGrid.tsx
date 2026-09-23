"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, Eye, Languages, MapPin, MessageCircleHeart, type LucideIcon } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { useLanguage, type ContentBundle, type Lang } from "@/lib/language";

const ICONS: Record<string, LucideIcon> = {
  watch: Eye,
  "find-care": MapPin,
  language: Languages,
  talk: MessageCircleHeart,
};

function getExpandedContent(t: ContentBundle, lang: Lang, setLang: (l: Lang) => void): Record<string, ReactNode> {
  return {
    watch: (
      <Link href="/treatment#watch" className="text-sm underline underline-offset-4" style={{ color: "var(--color-coral)" }}>
        {t.UI.tools.watchLink}
      </Link>
    ),
    "find-care": (
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        {t.UI.tools.findCarePlaceholder}
      </p>
    ),
    language: (
      <label className="flex flex-wrap items-center gap-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
        <span>{t.UI.tools.languageLabel}</span>
        <select
          className="rounded-lg px-3 py-2 text-sm"
          style={{ background: "var(--color-bg-2)", border: "1px solid var(--color-line)", color: "var(--color-text)" }}
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
        </select>
        <span className="text-[11px]" style={{ opacity: 0.7 }}>
          {t.UI.tools.languageComingSoon}
        </span>
      </label>
    ),
    talk: (
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        {t.UI.tools.talkPlaceholder}
      </p>
    ),
  };
}

export default function ToolsGrid() {
  const { t, lang, setLang } = useLanguage();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const expandedContent = getExpandedContent(t, lang, setLang);

  return (
    <section id="tools" style={{ background: "var(--color-bg-1)", padding: "var(--section-py) 0" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.4rem] font-medium mb-14 text-center" style={{ color: "var(--color-heading)" }}>
            {t.UI.tools.title}
          </h2>
        </SectionReveal>

        <div id="talk-to-someone" className="grid sm:grid-cols-2 gap-6">
          {t.TOOLS.map((tool, i) => {
            const Icon = ICONS[tool.key];
            const isOpen = openKey === tool.key;
            const panelId = `tool-panel-${tool.key}`;
            return (
              <SectionReveal key={tool.key} delay={i * 100}>
                <div
                  className="group rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background: isOpen ? "var(--color-coral-tint)" : "var(--color-card)",
                    border: `1px solid ${isOpen ? "var(--color-coral)" : "var(--color-line)"}`,
                    boxShadow: isOpen ? "0 30px 60px -36px var(--color-coral-glow)" : "none",
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenKey(isOpen ? null : tool.key)}
                    className="w-full text-left"
                  >
                    <span className="flex items-start justify-between gap-4 mb-6">
                      <span
                        className="flex items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110"
                        style={{ width: 52, height: 52, background: isOpen ? "var(--color-coral)" : "var(--color-coral-tint)" }}
                      >
                        <Icon size={23} color={isOpen ? "var(--color-on-accent)" : "var(--color-coral)"} strokeWidth={1.75} />
                      </span>
                      <ChevronDown
                        size={18}
                        color="var(--color-coral)"
                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)" }}
                      />
                    </span>
                    <h3 className="text-lg font-medium mb-2" style={{ color: "var(--color-text)" }}>
                      {tool.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                      {tool.body}
                    </p>
                  </button>

                  <div id={panelId} className="expand-grid" data-open={isOpen} aria-hidden={!isOpen}>
                    <div>
                      <div className="mt-5 pt-5" style={{ borderTop: "1px solid var(--color-line)" }}>
                        {expandedContent[tool.key]}
                      </div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
