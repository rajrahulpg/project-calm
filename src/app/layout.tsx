import type { Metadata, Viewport } from "next";
import { Inter, Kalam, Montserrat } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language";
import SmoothScroll from "@/components/SmoothScroll";

// Brand spec calls for Avenir Next; it isn't available as a free/self-hostable
// Google Font, so per the fallback instruction: Montserrat for headings,
// Inter for body.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// A handwriting-style font for small doodle annotations (e.g. the sketchy
// arrow on "Know Your Risk"). Supports Devanagari too, so it still renders
// correctly when the site is switched to Hindi.
const kalam = Kalam({
  subsets: ["latin", "devanagari"],
  weight: "700",
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Project CALM — Understand Calcium in Your Arteries",
  description:
    "Clear, calm, plain-language answers about calcium blockages, treatment options, and the journey to a healthy heart.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Runs before paint so a stored light-mode preference doesn't flash dark first.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('calm-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${montserrat.variable} ${kalam.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <div className="grain-overlay" aria-hidden="true" />
        <SmoothScroll />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
