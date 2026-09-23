"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

function subscribeToReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

const MOBILE_QUERY = "(max-width: 767px)";

function subscribeToIsMobile(callback: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getIsMobileSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function getIsMobileServerSnapshot() {
  return false;
}

export function useIsMobile() {
  return useSyncExternalStore(subscribeToIsMobile, getIsMobileSnapshot, getIsMobileServerSnapshot);
}

/** Fires `active` once an element crosses into view, then stays true. */
export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/**
 * A horizontal CSS mask that keeps a decorative line/trace from ever
 * rendering behind a piece of text sitting in front of it: fully visible
 * out at the edges, fading to fully transparent in a band centered on the
 * text's own rendered width (plus clearance), so it works regardless of
 * text length, language, or viewport width — measured live rather than
 * guessed. `textRef`'s element should size to its content (an inline
 * element, or a block one with e.g. `inline-block`) so its width reflects
 * the actual rendered text rather than the width of its container.
 */
export function useHorizontalTraceMask(
  containerRef: RefObject<HTMLElement | null>,
  textRef: RefObject<HTMLElement | null>,
  deps: unknown[],
  clearancePx = 24,
  fadeWidthPx = 36
) {
  const [mask, setMask] = useState<string | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const update = () => {
      const containerWidth = container.clientWidth;
      const textWidth = text.offsetWidth;
      if (!containerWidth || !textWidth) return;

      const deadHalfPct = Math.min(48, ((textWidth / 2 + clearancePx) / containerWidth) * 100);
      const fadeHalfPct = Math.min(50, deadHalfPct + (fadeWidthPx / containerWidth) * 100);

      setMask(
        `linear-gradient(90deg, black 0%, black ${50 - fadeHalfPct}%, transparent ${50 - deadHalfPct}%, transparent ${50 + deadHalfPct}%, black ${50 + fadeHalfPct}%, black 100%)`
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(text);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return mask;
}

/** Counts up from 0 to a numeric target once the element scrolls into view. */
export function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) return;
    startedRef.current = true;

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}
