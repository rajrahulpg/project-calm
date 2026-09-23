"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { setLenis } from "@/lib/smooth-scroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Inertial wheel scrolling, driven off GSAP's ticker so the scroll-scrubbed
// hero video and ScrollTrigger stay in lockstep with the eased scroll value.
// Touch scrolling stays native (Lenis only smooths the wheel by default).
export default function SmoothScroll() {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.09 });
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", onScroll);
      setLenis(null);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return null;
}
