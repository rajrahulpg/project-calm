// The URL slug behind each doctor's QR code, e.g. "Dr Sarita Rao" →
// "dr-sarita-rao". Kept free of server imports so the admin panel can use it.
export function slugify(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

// A video's slug is saved when it's added and never recomputed, so a printed
// QR keeps working even if the doctor's name or YouTube title is edited later.
// Videos added before slugs existed fall back to their doctor name.
export const doctorSlug = (v: { slug?: string; doctor: string }) => v.slug || slugify(v.doctor);

// Whether a video counts towards its doctor's QR page. Off for uploads made
// with "Generate QR" off; videos from before the switch existed count as on.
export const hasQr = (v: { qr?: boolean }) => v.qr !== false;

// Absolute link for a doctor's QR. NEXT_PUBLIC_SITE_URL should be set to the
// live domain; without it the current browser origin is used.
export function doctorUrl(slug: string, origin: string) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || origin).replace(/\/+$/, "");
  return `${base}/resources/${slug}`;
}
