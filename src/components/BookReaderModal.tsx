"use client";

import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";

const SLIDE_COUNT = 16;
const SLIDES = Array.from({ length: SLIDE_COUNT }, (_, i) => `/assets/book-final/page-${String(i + 1).padStart(2, "0")}.jpg`);

// A real page: StPageFlip needs the DOM node itself (to measure and drag it),
// so the ref has to land on this div rather than being swallowed by Image.
// Every page loads eagerly — the flipbook keeps them all mounted, and a lazy
// image would only start loading mid-turn and flash blank. The shade is the
// shadow where the page curves into the spine (see .book-page-shade).
const Page = forwardRef<HTMLDivElement, { src: string; alt: string; hard?: boolean }>(({ src, alt, hard }, ref) => (
  <div ref={ref} className="relative w-full h-full overflow-hidden" style={{ background: "#F8F6F1" }} data-density={hard ? "hard" : "soft"}>
    <Image src={src} alt={alt} fill loading="eager" className="object-cover" sizes="(min-width: 1024px) 520px, 90vw" />
    <span className="book-page-shade" aria-hidden="true" />
  </div>
));
Page.displayName = "Page";

// Like a printed book: on wide screens it opens to two-page spreads, with the
// cover (and back page) on their own; phones and tablets show one page at a
// time. Pages turn with a slow, eased curl and can be dragged by the corner.
export default function BookReaderModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  // react-pageflip's exported ref type is `any` — it wraps the underlying
  // StPageFlip instance, reached via `.pageFlip()`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [spread, setSpread] = useState(false);

  const goPrev = () => bookRef.current?.pageFlip()?.flipPrev();
  const goNext = () => bookRef.current?.pageFlip()?.flipNext();

  useEffect(() => {
    closeRef.current?.focus();
    // Only the X closes this — a stray tap while turning a page (or a
    // reflexive Escape) shouldn't dismiss it mid-read.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    // The flipbook fires its "init" event before react-pageflip attaches
    // listeners, so read the starting layout once the instance exists.
    let frame = 0;
    const readLayout = () => {
      const flip = bookRef.current?.pageFlip();
      if (flip?.getOrientation) setSpread(flip.getOrientation() === "landscape");
      else frame = requestAnimationFrame(readLayout);
    };
    frame = requestAnimationFrame(readLayout);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Built once (per language / motion setting): react-pageflip reloads every
  // page whenever it re-renders, which would stutter each turn now that the
  // counter re-renders this component on every flip.
  const book = useMemo(
    () => (
      <HTMLFlipBook
        ref={bookRef}
        width={480}
        height={679}
        size="stretch"
        minWidth={260}
        maxWidth={520}
        minHeight={368}
        maxHeight={735}
        startPage={0}
        drawShadow
        flippingTime={reducedMotion ? 1 : 1000}
        usePortrait
        startZIndex={0}
        autoSize
        maxShadowOpacity={0.35}
        showCover
        mobileScrollSupport
        clickEventForward
        useMouseEvents
        swipeDistance={20}
        showPageCorners
        disableFlipByClick={false}
        onFlip={(e: { data: number }) => setPage(e.data)}
        onChangeOrientation={(e: { data: string }) => setSpread(e.data === "landscape")}
        className="book-flipbook"
        style={{}}
      >
        {SLIDES.map((src, i) => (
          <Page key={src} src={src} alt={t.UI.book.page(i + 1, SLIDE_COUNT)} hard={i === 0 || i === SLIDE_COUNT - 1} />
        ))}
      </HTMLFlipBook>
    ),
    [reducedMotion, t],
  );

  // In a spread the right-hand page is the one after `page` — except on the
  // cover and the back page, which sit alone.
  const showsTwo = spread && page > 0 && page < SLIDE_COUNT - 1;
  const counter = showsTwo ? `${page + 1}–${page + 2} / ${SLIDE_COUNT}` : `${page + 1} / ${SLIDE_COUNT}`;
  const atStart = page === 0;
  const atEnd = page >= SLIDE_COUNT - (showsTwo ? 2 : 1);
  // A closed book in a spread layout only fills one half (the cover on the
  // right, the back page on the left) — slide it to the middle, and let it
  // glide back across as the book opens.
  const shift = spread && !showsTwo ? (page === 0 ? "-25%" : "25%") : "0%";

  const navBtn =
    "flex items-center justify-center rounded-full transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100";
  const navStyle = { width: 44, height: 44, background: "var(--color-bg-1)", border: "1px solid var(--color-line)" };

  return (
    <div
      className="modal-fade fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ background: "rgba(5,6,8,0.8)", backdropFilter: "blur(6px)" }}
    >
      <div role="dialog" aria-modal="true" aria-label={t.UI.book.readerTitle} className="book-pop relative flex flex-col items-center">

        {/* The book is A4 (210 × 297): one page wide on small screens, a
            two-page spread (420 × 297) from lg up. The flipbook measures this
            box and switches between the two by itself. */}
        <div className="book-reader relative w-[min(90vw,calc(68vh/1.4142),430px)] aspect-[210/297] lg:w-[min(92vw,calc(76vh*1.4142),1040px)] lg:aspect-[420/297]" style={{ transform: `translateX(${shift})`, transition: "transform 1s cubic-bezier(0.45, 0, 0.55, 1)" }}>
          <button
            ref={closeRef}
            type="button"
            aria-label={t.UI.media.close}
            onClick={onClose}
            className="absolute -top-4 -right-4 z-20 flex items-center justify-center rounded-full transition-transform hover:rotate-90"
            style={{ width: 40, height: 40, background: "var(--color-bg-1)", border: "1px solid var(--color-line)" }}
          >
            <X size={18} color="var(--color-text)" />
          </button>
          {book}
        </div>

        <div className="mt-5 flex items-center gap-4">
          <button type="button" onClick={goPrev} disabled={atStart} aria-label={t.UI.book.prev} className={navBtn} style={navStyle}>
            <ChevronLeft size={20} color="var(--color-text)" />
          </button>
          <span className="min-w-[72px] text-center text-xs font-semibold tabular-nums tracking-[0.08em]" style={{ color: "rgba(245,245,242,0.85)" }} aria-live="polite">
            {counter}
          </span>
          <button type="button" onClick={goNext} disabled={atEnd} aria-label={t.UI.book.next} className={navBtn} style={navStyle}>
            <ChevronRight size={20} color="var(--color-text)" />
          </button>
        </div>
      </div>
    </div>
  );
}
