import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Scrolls so `el` lands `offset` px below the top of the viewport. */
export function scrollToElement(el: HTMLElement, offset = 0) {
  if (instance) {
    instance.scrollTo(el, { offset: -offset, duration: 1.2 });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

/** Scrolls to an absolute document-Y position. */
export function scrollToY(y: number) {
  if (instance) {
    instance.scrollTo(y, { duration: 1.2 });
    return;
  }
  window.scrollTo({ top: y, behavior: "smooth" });
}
