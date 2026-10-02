"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Eye, Play, Search, ThumbsUp, X } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { useLanguage } from "@/lib/language";
import type { DoctorVideo } from "@/lib/videos";

type Video = DoctorVideo;
// "default" keeps the order set in the /admin panel (the JSON file order).
type SortKey = "default" | "recent" | "views";
const SORT_KEYS: Exclude<SortKey, "default">[] = ["recent", "views"];

const byRecent = (a: Video, b: Video) => b.uploaded.localeCompare(a.uploaded);
const SORTERS: Record<SortKey, ((a: Video, b: Video) => number) | null> = {
  default: null,
  recent: byRecent,
  views: (a, b) => b.views - a.views || byRecent(a, b),
};

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const { t } = useLanguage();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-fade fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ background: "rgba(5,6,8,0.85)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={video.doctor}
        onClick={(e) => e.stopPropagation()}
        className="book-pop relative w-full max-w-4xl"
      >
        <button
          ref={closeRef}
          type="button"
          aria-label={t.UI.media.close}
          onClick={onClose}
          className="absolute -top-12 right-0 flex items-center justify-center rounded-full transition-transform hover:rotate-90"
          style={{ width: 40, height: 40, background: "var(--color-bg-1)", border: "1px solid var(--color-line)" }}
        >
          <X size={18} color="var(--color-text)" />
        </button>
        <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: "16 / 9", background: "#000" }}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            title={video.doctor}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

export default function DoctorInsights({ videos }: { videos: Video[] }) {
  const { t, lang } = useLanguage();
  const DOCTOR_INSIGHTS = t.DOCTOR_INSIGHTS;
  const [open, setOpen] = useState<Video | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("default");
  const filtered = sort !== "default" || query.trim() !== "";

  // Every word typed must appear somewhere in the title or doctor name (in
  // either language), so "sarita", "har blockage" or "dr rao" all work.
  // Matching is substring, so "blockage" also finds the joined-up hashtag.
  const shown = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const list = videos.filter((v) => {
      const haystack = `${v.title} ${v.doctor} ${v.doctorHi ?? ""}`.toLowerCase();
      return words.every((w) => haystack.includes(w.replace(/^#/, "")));
    });
    const sorter = SORTERS[sort];
    return (sorter ? [...list].sort(sorter) : list)
      .map((v) => ({ ...v, doctor: lang === "hi" && v.doctorHi ? v.doctorHi : v.doctor }));
  }, [videos, query, sort, lang]);

  const dateFmt = new Intl.DateTimeFormat(DOCTOR_INSIGHTS.dateLocale, { day: "numeric", month: "short", year: "numeric" });

  return (
    <section style={{ background: "var(--color-bg-0)", padding: "var(--section-py) 0" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.4rem] font-medium mb-3 text-center" style={{ color: "var(--color-heading)" }}>
            {DOCTOR_INSIGHTS.title}
          </h2>
          <p className="text-base text-center mb-10" style={{ color: "var(--color-text-muted)" }}>
            {DOCTOR_INSIGHTS.subtitle}
          </p>
        </SectionReveal>

        <SectionReveal className="mb-8 sm:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4 lg:justify-between">
            <label
              className="flex items-center gap-2.5 w-full lg:max-w-sm rounded-full px-4 transition-colors border border-[var(--color-line)] focus-within:border-[var(--color-coral)] focus-within:shadow-[0_0_0_3px_var(--color-coral-tint)]"
              style={{ height: 46, background: "var(--color-card)" }}
            >
              <Search size={16} color="var(--color-text-muted)" className="shrink-0" />
              {/* Plain text input (not type="search") to avoid the browser's own
                  clear button doubling up with ours. The global :focus-visible
                  outline is unlayered so it beats Tailwind classes — the focus
                  ring lives on the pill instead, hence the inline outline. */}
              <input
                type="text"
                role="searchbox"
                inputMode="search"
                enterKeyHint="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={DOCTOR_INSIGHTS.searchPlaceholder}
                aria-label={DOCTOR_INSIGHTS.searchPlaceholder}
                className="flex-1 min-w-0 bg-transparent text-sm"
                style={{ color: "var(--color-text)", outline: "none" }}
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label={DOCTOR_INSIGHTS.clearSearch} className="shrink-0">
                  <X size={15} color="var(--color-text-muted)" />
                </button>
              )}
            </label>

            <div className="flex flex-col lg:flex-row lg:items-center gap-2">
            <div role="radiogroup" aria-label={DOCTOR_INSIGHTS.sortLabel} className="grid grid-cols-2 lg:flex gap-2">
              {SORT_KEYS.map((key) => {
                const active = sort === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSort(active ? "default" : key)}
                    className="shrink-0 px-2 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-[0.06em] sm:tracking-[0.08em] leading-tight lg:whitespace-nowrap transition-colors"
                    style={{
                      background: active ? "var(--color-coral)" : "var(--color-card)",
                      color: active ? "var(--color-on-accent)" : "var(--color-text-muted)",
                      border: `1px solid ${active ? "var(--color-coral)" : "var(--color-line)"}`,
                    }}
                  >
                    {DOCTOR_INSIGHTS.sorts[key]}
                  </button>
                );
              })}
            </div>
            {/* Back to the order arranged in /admin, with search cleared. */}
            {filtered && (
              <button
                type="button"
                onClick={() => { setSort("default"); setQuery(""); }}
                className="modal-fade self-center lg:self-auto inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-[0.06em] sm:tracking-[0.08em] whitespace-nowrap transition-colors hover:bg-[var(--color-coral-tint)]"
                style={{ color: "var(--color-coral)" }}
              >
                <X size={13} />
                {DOCTOR_INSIGHTS.clearFilter}
              </button>
            )}
            </div>
          </div>
        </SectionReveal>

        {shown.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>{DOCTOR_INSIGHTS.noResults}</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.1em]"
              style={{ background: "var(--color-coral-tint)", color: "var(--color-coral)", border: "1px solid var(--color-coral-soft)" }}
            >
              {DOCTOR_INSIGHTS.clearSearch}
            </button>
          </div>
        )}

        {/* Flex-wrap rather than a grid so a short last row (3 + 2, 2 + 1,
            a single search hit…) always sits centered, whatever the count. */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
          {shown.map((video, i) => (
            <SectionReveal
              key={video.id}
              delay={i * 90}
              className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.625rem)] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <button
                type="button"
                aria-haspopup="dialog"
                aria-label={video.doctor}
                onClick={() => setOpen(video)}
                className="group w-full h-full text-left rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
                style={{ background: "var(--color-card)", border: "1px solid var(--color-line)" }}
              >
                <div className="relative flex items-center justify-center overflow-hidden" style={{ aspectRatio: "16 / 9", background: "var(--color-bg-2)" }}>
                  <Image
                    src={video.thumbnail}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 1024px) 360px, 50vw"
                  />
                  <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.35) 100%)" }} aria-hidden="true" />
                  <span
                    className="relative flex items-center justify-center rounded-full transition-all duration-500 group-hover:scale-110"
                    style={{ width: 52, height: 52, background: "var(--color-coral)", boxShadow: "0 16px 32px -12px var(--color-coral-glow)" }}
                  >
                    <Play size={18} color="var(--color-on-accent)" fill="var(--color-on-accent)" className="translate-x-px" />
                  </span>
                  {video.duration && (
                    <span
                      className="absolute right-2 bottom-2 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold tabular-nums"
                      style={{ background: "rgba(0,0,0,0.75)", color: "#FFFFFF" }}
                    >
                      {video.duration}
                    </span>
                  )}
                </div>
                <div className="p-3 sm:p-5">
                  <p className="text-sm sm:text-base font-medium leading-snug" style={{ color: "var(--color-text)" }}>
                    {video.doctor}
                  </p>
                  <p className="mt-1 text-[9px] sm:text-xs font-semibold break-all" style={{ color: "var(--color-coral)" }}>
                    {DOCTOR_INSIGHTS.hashtag}
                  </p>
                  <p className="mt-2 sm:mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                    <span className="inline-flex items-center gap-1"><Eye size={12} />{DOCTOR_INSIGHTS.views(video.views)}</span>
                    <span className="inline-flex items-center gap-1"><ThumbsUp size={12} />{DOCTOR_INSIGHTS.likes(video.likes)}</span>
                    <span>{dateFmt.format(new Date(`${video.uploaded}T00:00:00`))}</span>
                  </p>
                </div>
              </button>
            </SectionReveal>
          ))}
        </div>
      </div>

      {open && <VideoModal video={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
