"use client";

import { forwardRef, useEffect, useRef } from "react";
import Image from "next/image";
import HTMLFlipBook from "react-pageflip";
import { X } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";

const SLIDE_COUNT = 16;
const SLIDES = Array.from({ length: SLIDE_COUNT }, (_, i) => `/assets/book-pages/page-${String(i + 1).padStart(2, "0")}.jpg`);

// A real page: StPageFlip needs the DOM node itself (to measure and drag it),
// so the ref has to land on this div rather than being swallowed by Image.
const Page = forwardRef<HTMLDivElement, { src: string; alt: string }>(({ src, alt }, ref) => (
  <div ref={ref} className="relative w-full h-full" style={{ background: "#F4F1EC" }}>
    <Image src={src} alt={alt} fill className="object-contain" sizes="460px" />
  </div>
));
Page.displayName = "Page";

export default function BookReaderModal({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  // react-pageflip's exported ref type is `any` — it wraps the underlying
  // StPageFlip instance, reached via `.pageFlip()`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);

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
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      className="modal-fade fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ background: "rgba(5,6,8,0.8)", backdropFilter: "blur(6px)" }}
    >
      <div role="dialog" aria-modal="true" aria-label={t.UI.book.readerTitle} className="book-pop relative">
        <button
          ref={closeRef}
          type="button"
          aria-label={t.UI.media.close}
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 flex items-center justify-center rounded-full transition-transform hover:rotate-90"
          style={{ width: 40, height: 40, background: "var(--color-bg-1)", border: "1px solid var(--color-line)" }}
        >
          <X size={18} color="var(--color-text)" />
        </button>

        <div style={{ width: "min(84vh, 90vw, 430px)", aspectRatio: "396 / 612" }}>
          <HTMLFlipBook
            ref={bookRef}
            width={380}
            height={587}
            size="stretch"
            minWidth={280}
            maxWidth={430}
            minHeight={433}
            maxHeight={665}
            startPage={0}
            drawShadow
            flippingTime={reducedMotion ? 1 : 700}
            usePortrait
            startZIndex={0}
            autoSize
            maxShadowOpacity={0.5}
            showCover={false}
            mobileScrollSupport
            clickEventForward
            useMouseEvents
            swipeDistance={20}
            showPageCorners
            disableFlipByClick={false}
            className="book-flipbook"
            style={{}}
          >
            {SLIDES.map((src, i) => (
              <Page key={src} src={src} alt={t.UI.book.page(i + 1, SLIDE_COUNT)} />
            ))}
          </HTMLFlipBook>
        </div>
      </div>
    </div>
  );
}
