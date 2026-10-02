"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PhoneCall, X } from "lucide-react";
import { useLanguage } from "@/lib/language";
import SiteLogo, { SiteHashtag } from "./SiteLogo";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";

export default function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // True only while the navbar is transparent AND sitting over the home
  // page's dark scroll-video hero (#story) — that's the one case where its
  // text needs to stay light regardless of the page theme. Every other page
  // (and the home page once past the video) has a normal theme-colored
  // background behind the transparent nav, so theme-reactive colors apply.
  const [overDarkHero, setOverDarkHero] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // On the home page, the scroll-scrubbed video section (#story) can run
    // for several screen heights — keep the navbar transparent/light-forced
    // for all of it, and only switch to the solid/theme-reactive style once
    // it has fully scrolled past. Other pages have no #story section, so
    // this falls back to the original "solid after a small scroll" behavior.
    const storyEl = document.getElementById("story");
    // Cache the section's document-relative bottom edge instead of calling
    // getBoundingClientRect() on every scroll event — that forces a
    // synchronous layout reflow on each tick, which was fighting with GSAP's
    // own scroll-driven video scrubbing and causing the scroll jank.
    let storyBottom = 0;
    const measure = () => {
      if (storyEl) storyBottom = storyEl.offsetTop + storyEl.offsetHeight;
    };
    const onScroll = () => {
      const isScrolled = storyEl ? window.scrollY >= storyBottom : window.scrollY > 24;
      setScrolled(isScrolled);
      setOverDarkHero(!!storyEl && !isScrolled);
    };
    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    // #story settles its height after hydration (it shrinks on mobile), so
    // re-measure when the page's size changes, not just on window resize.
    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  const navFg = overDarkHero ? "#F5F5F2" : "var(--color-text)";
  const navFgMuted = overDarkHero ? "#A8ADB3" : "var(--color-text-muted)";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "color-mix(in srgb, var(--color-bg-0) 72%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid var(--color-line)" : "1px solid transparent",
      }}
    >
      <nav className="flex items-center justify-between px-6 md:px-12 py-5" aria-label="Primary">
        <Link href="/" className="inline-flex flex-col items-start">
          <SiteLogo color={navFg} priority />
          <SiteHashtag />
        </Link>

        <ul className="hidden lg:flex items-center gap-9">
          {t.NAV_LINKS.map((link) => {
            const isActive = pathname === link.href.split("#")[0];
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block py-3 text-[11px] uppercase tracking-[0.16em] transition-colors"
                  style={{ color: isActive ? navFg : navFgMuted, fontWeight: isActive ? 700 : 500 }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = navFg;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = navFgMuted;
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageToggle forceLight={overDarkHero} />
          <ThemeToggle forceLight={overDarkHero} />
          <Link
            href="/resources#talk-to-someone"
            className="btn-accent inline-flex items-center gap-1.5 px-5 py-3 text-[10px] uppercase tracking-[0.18em] font-semibold rounded-full"
          >
            <PhoneCall size={13} />
            {t.UI.navbar.talkToSomeone}
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <LanguageToggle forceLight={overDarkHero} />
          <ThemeToggle forceLight={overDarkHero} />
          <button
            className="flex items-center justify-center rounded-full -mr-2.5"
            style={{ width: 44, height: 44, color: navFg }}
            aria-label={open ? t.UI.navbar.closeMenu : t.UI.navbar.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="lg:hidden px-6 pb-8 pt-2 flex flex-col gap-1 max-h-[calc(100dvh-72px)] overflow-y-auto"
          style={{ background: "color-mix(in srgb, var(--color-bg-0) 96%, transparent)", backdropFilter: "blur(18px)" }}
        >
          {t.NAV_LINKS.map((link) => {
            const isActive = pathname === link.href.split("#")[0];
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-base uppercase tracking-[0.16em]"
                style={{ color: "var(--color-text)", fontWeight: isActive ? 700 : 400 }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/resources#talk-to-someone"
            onClick={() => setOpen(false)}
            className="btn-accent mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 text-[11px] uppercase tracking-[0.18em] font-semibold rounded-full"
          >
            <PhoneCall size={14} />
            {t.UI.navbar.talkToSomeone}
          </Link>
        </div>
      )}
    </header>
  );
}
