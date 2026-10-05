"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import BookReaderModal from "./BookReaderModal";
import SectionReveal from "./SectionReveal";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";

const COVER_SRC = "/assets/book-pages/page-01.jpg";
const PDF_SRC = "/assets/Coffe%20Table%20Book_Single%20page_v2.pdf";

function Book({ onOpen }: { onOpen: () => void }) {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const hint = t.UI.book.openHint;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const book = e.currentTarget.querySelector<HTMLDivElement>(".book");
    if (book) book.style.transform = `rotateX(${-y * 10}deg) rotateY(${x * 14 - 10}deg)`;
  };
  const onLeave = (e: MouseEvent<HTMLDivElement>) => {
    const book = e.currentTarget.querySelector<HTMLDivElement>(".book");
    if (book) book.style.transform = "";
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* A slow, gentle glow — just enough to invite a click without feeling gimmicky. */}
      <span
        className="breathe-shape absolute rounded-full pointer-events-none"
        style={{ width: 220, height: 220, top: 20, background: "radial-gradient(circle, var(--color-coral-glow) 0%, transparent 70%)", filter: "blur(6px)" }}
        aria-hidden="true"
      />
      <div className="relative book-scene cursor-pointer select-none" onMouseMove={onMove} onMouseLeave={onLeave} onClick={onOpen} style={{ padding: 20 }}>
        <div className="book" style={{ width: 280, height: 431, transform: "rotateY(-10deg)" }} role="button" aria-label={hint}>
          <div
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={{ boxShadow: "0 30px 60px -30px rgba(0,0,0,0.6)" }}
          >
            <Image src={COVER_SRC} alt="" fill className="object-cover" sizes="280px" />
            <span className="absolute left-0 top-0 bottom-0 w-3" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.35), transparent)" }} aria-hidden="true" />
          </div>
        </div>
      </div>
      <span className="mt-2 text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--color-text-muted)", opacity: 0.75 }}>
        {hint}
      </span>

      <a
        href={PDF_SRC}
        download="Project-CALM-Coffee-Table-Book.pdf"
        onClick={(e) => e.stopPropagation()}
        className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-colors"
        style={{ background: "var(--color-coral-tint)", color: "var(--color-coral)", border: "1px solid var(--color-coral-soft)" }}
      >
        <Download size={14} />
        {t.UI.book.downloadCta}
      </a>
      <span className="mt-2 text-[10px]" style={{ color: "var(--color-text-muted)", opacity: 0.65 }}>
        {t.UI.book.downloadHint}
      </span>
    </div>
  );
}

export default function CoffeeTableBook() {
  const { t } = useLanguage();
  const COFFEE_TABLE_BOOK = t.COFFEE_TABLE_BOOK;
  const [readerOpen, setReaderOpen] = useState(false);

  return (
    <section style={{ background: "var(--color-bg-1)", padding: "var(--section-py) 0" }}>
      <div className="max-w-2xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.4rem] font-medium mb-6 leading-tight" style={{ color: "var(--color-heading)" }}>
            {COFFEE_TABLE_BOOK.title}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed max-prose mx-auto" style={{ color: "var(--color-text-muted)" }}>
            {COFFEE_TABLE_BOOK.body}
          </p>
        </SectionReveal>

        <SectionReveal delay={150} className="mt-12">
          <Book onOpen={() => setReaderOpen(true)} />
        </SectionReveal>
      </div>

      {readerOpen && <BookReaderModal onClose={() => setReaderOpen(false)} />}
    </section>
  );
}
