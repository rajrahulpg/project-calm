"use client";

import { useEffect, useRef, useState } from "react";
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
  // Solid from the first paint on home so the bar never flashes transparent
  // (and then solid) while the page loads.
  const [scrolled, setScrolled] = useState(pathname === "/");
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // The home page's scroll video (#story) starts below the navbar, so the
    // bar is solid there from the very top. Other pages turn solid after a
    // small scroll.
    const isHome = !!document.getElementById("story");
    const onScroll = () => setScrolled(isHome || window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Publish the bar's height as --nav-h (it changes with screen width) so
    // the home video can sit exactly beneath it.
    const header = headerRef.current;
    const ro = new ResizeObserver(() => {
      if (header) document.documentElement.style.setProperty("--nav-h", `${header.offsetHeight}px`);
    });
    if (header) ro.observe(header);
    return () => {
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const navFg = "var(--color-text)";
  const navFgMuted = "var(--color-text-muted)";

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "color-mix(in srgb, var(--color-bg-0) 72%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid var(--color-line)" : "1px solid transparent",
        // Faint brand-red glow under the bar so it reads as a distinct header.
        boxShadow: "0 6px 18px -6px rgba(234, 5, 43, 0.22)",
      }}
    >
      <nav className="flex items-center justify-between px-6 md:px-12 py-3" aria-label="Primary">
        <Link href="/" className="inline-flex flex-col items-start">
          <SiteLogo color={navFg} priority />
          <SiteHashtag />
        </Link>

        <ul className="hidden lg:flex items-center gap-10 xl:gap-12">
          {t.NAV_LINKS.map((link) => {
            const base = link.href.split("#")[0];
            const isActive = pathname === base || (base !== "/" && pathname.startsWith(`${base}/`));
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="relative block py-3 text-[16px] xl:text-[17px] uppercase tracking-[0.16em] transition-colors"
                  style={{ color: isActive ? navFg : navFgMuted, fontWeight: isActive ? 700 : 500 }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = navFg;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = navFgMuted;
                  }}
                >
                  {link.label}
                  {isActive && (
                    // Right inset matches the letter-spacing trailing the last glyph.
                    <span
                      aria-hidden="true"
                      className="absolute left-0 bottom-1.5 h-[2px] rounded-full"
                      style={{ right: "0.16em", background: "var(--color-coral)" }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <Link
            href="/resources#talk-to-someone"
            className="btn-accent inline-flex items-center gap-1.5 px-5 py-3 text-[10px] uppercase tracking-[0.18em] font-semibold rounded-full"
          >
            <PhoneCall size={13} />
            {t.UI.navbar.talkToSomeone}
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
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
            const base = link.href.split("#")[0];
            const isActive = pathname === base || (base !== "/" && pathname.startsWith(`${base}/`));
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
