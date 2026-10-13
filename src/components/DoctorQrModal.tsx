"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { AlertTriangle, Check, Copy, Download, ExternalLink, X } from "lucide-react";
import { doctorUrl } from "@/lib/doctor-slug";

const HASHTAG = "#HarBlockageSameNahiHota";
const RED = "#EA052B";

// Draws the printable card: QR on top, doctor's name and hashtag beneath,
// on white so it prints and scans the same whatever the admin's theme.
async function drawCard(url: string, doctor: string) {
  const W = 1000, PAD = 80, QR = W - PAD * 2;
  const qr = document.createElement("canvas");
  await QRCode.toCanvas(qr, url, { width: QR, margin: 0, errorCorrectionLevel: "M", color: { dark: "#111111", light: "#FFFFFF" } });

  const c = document.createElement("canvas");
  c.width = W;
  c.height = PAD + QR + 210;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(qr, PAD, PAD);

  ctx.textAlign = "center";
  ctx.fillStyle = "#111111";
  let size = 64;
  do ctx.font = `600 ${size}px Arial, Helvetica, sans-serif`;
  while (ctx.measureText(doctor).width > QR && --size > 28);
  ctx.fillText(doctor, W / 2, PAD + QR + 100);

  ctx.font = "600 36px Arial, Helvetica, sans-serif";
  ctx.fillStyle = RED;
  ctx.fillText(HASHTAG, W / 2, PAD + QR + 160);
  return c.toDataURL("image/png");
}

export default function DoctorQrModal({ doctor, slug, videoCount, onClose }: { doctor: string; slug: string; videoCount: number; onClose: () => void }) {
  const [png, setPng] = useState("");
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const url = doctorUrl(slug, window.location.origin);
  const isLocal = /^https?:\/\/(localhost|127\.|192\.168\.|10\.)/.test(url);

  useEffect(() => {
    drawCard(url, doctor).then(setPng);
  }, [url, doctor]);

  // onClose is a fresh function on every admin re-render; reading it through
  // a ref keeps this effect (and the focus jump) to mount only.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btn = "inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.12em]";

  return (
    <div
      className="modal-fade fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(5,6,8,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`QR code for ${doctor}`}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm max-h-full overflow-y-auto rounded-2xl p-5 sm:p-6"
        style={{ background: "var(--color-bg-1)", border: "1px solid var(--color-line)" }}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h2 className="text-base font-medium truncate" style={{ color: "var(--color-text)" }}>{doctor}</h2>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Opens {videoCount} {videoCount === 1 ? "video" : "videos"} from this doctor
            </p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close">
            <X size={18} color="var(--color-text-muted)" />
          </button>
        </div>

        <div className="rounded-xl overflow-hidden mb-4" style={{ background: "#FFFFFF", border: "1px solid var(--color-line)", aspectRatio: "1000 / 1130" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- generated data URL */}
          {png && <img src={png} alt={`QR code linking to ${url}`} className="w-full h-full" />}
        </div>

        <p className="text-xs font-mono break-all mb-3" style={{ color: "var(--color-text-muted)" }}>{url}</p>

        {isLocal && (
          <p className="flex gap-2 text-xs rounded-xl px-3 py-2.5 mb-4" style={{ background: "var(--color-coral-tint)", color: "var(--color-text)" }}>
            <AlertTriangle size={14} className="shrink-0 mt-px" color="var(--color-coral)" />
            <span>This QR points to a local address and won&apos;t open on other phones. Set <code>NEXT_PUBLIC_SITE_URL</code> to the live domain before printing.</span>
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <a href={png || undefined} download={`qr-${slug}.png`} aria-disabled={!png} className={`btn-accent col-span-2 ${btn} py-3`}>
            <Download size={14} />
            Download PNG
          </a>
          <button type="button" onClick={copy} className={btn} style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-line)" }}>
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy link"}
          </button>
          <a href={url} target="_blank" rel="noreferrer" className={btn} style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-line)" }}>
            <ExternalLink size={13} />
            Open
          </a>
        </div>
      </div>
    </div>
  );
}
