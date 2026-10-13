import { NextResponse, type NextRequest } from "next/server";
import { doctorSlug, hasQr, slugify } from "@/lib/doctor-slug";
import { checkPin, fetchYouTubeVideo, parseYouTubeId, readVideos, writeVideos, type DoctorVideo } from "@/lib/videos";

// Every method re-checks the PIN on the server — the /admin page only
// collects it, so these routes are what actually keep the list locked.
const unauthorized = () => NextResponse.json({ error: "Wrong PIN." }, { status: 401 });

const saveFailed = () =>
  NextResponse.json(
    { error: "Couldn't save the video list on this server. On hosts with a read-only disk (like Vercel), the list needs a database instead of a file." },
    { status: 500 },
  );

export async function GET(req: NextRequest) {
  if (!checkPin(req.headers.get("x-admin-pin"))) return unauthorized();
  return NextResponse.json({ videos: await readVideos() });
}

export type AddResult = { input: string; ok: boolean; title?: string; error?: string };

const MAX_BATCH = 25;

const cleanText = (s: unknown) => (typeof s === "string" ? s.trim().replace(/\s+/g, " ") : "");

// Checks and fetches each link on its own, so one bad link doesn't block the
// rest. `taken` = ids already on the site (duplicates are refused).
async function fetchLinks(inputs: string[], taken: Set<string>) {
  const batchIds = new Set<string>();
  return Promise.all(
    inputs.map(async (input): Promise<AddResult & { video?: DoctorVideo }> => {
      const id = parseYouTubeId(input);
      if (!id) return { input, ok: false, error: "Not a YouTube video link." };
      if (taken.has(id)) return { input, ok: false, error: "Already on the Resources page." };
      if (batchIds.has(id)) return { input, ok: false, error: "Listed twice in this upload." };
      batchIds.add(id);
      try {
        const video = await fetchYouTubeVideo(id);
        return { input, ok: true, title: video.title, video };
      } catch (e) {
        return { input, ok: false, error: (e as Error).message };
      }
    }),
  );
}

const fetched = (results: Awaited<ReturnType<typeof fetchLinks>>) => results.flatMap((r) => (r.video ? [r.video] : []));
const publicResults = (results: AddResult[]) => results.map(({ input, ok, title, error }) => ({ input, ok, title, error }));

// The slug a QR-enabled video should use for `doctor`: an existing QR doctor
// with the same name keeps theirs (so an already-printed QR picks the video
// up), otherwise one is made from the name.
function qrSlugFor(doctor: string, videos: DoctorVideo[], exceptId?: string) {
  const match = videos.find((v) => v.id !== exceptId && hasQr(v) && slugify(v.doctor) === slugify(doctor));
  return match ? doctorSlug(match) : slugify(doctor);
}

// Takes { urls: string[], qrDoctor?: string } — one or many links; the file
// is written once at the end with everything that succeeded.
// With "Generate QR" on, the admin sends `qrDoctor` (a name, or "" to use the
// first video's): every video in the upload is filed under that one doctor
// and slug, so the whole batch shares a single QR code. With it off, the
// videos are kept off every QR page.
export async function POST(req: NextRequest) {
  if (!checkPin(req.headers.get("x-admin-pin"))) return unauthorized();

  const { urls, qrDoctor } = (await req.json().catch(() => ({}))) as { urls?: string[]; qrDoctor?: string };
  const inputs = Array.isArray(urls) ? urls.map((u) => String(u).trim()).filter(Boolean) : [];
  if (inputs.length === 0) return NextResponse.json({ error: "Paste at least one YouTube link." }, { status: 400 });
  if (inputs.length > MAX_BATCH) return NextResponse.json({ error: `Up to ${MAX_BATCH} links at a time, please.` }, { status: 400 });

  const videos = await readVideos();
  const results = await fetchLinks(inputs, new Set(videos.map((v) => v.id)));

  let added = fetched(results);
  if (typeof qrDoctor === "string" && added.length) {
    const doctor = cleanText(qrDoctor) || added[0].doctor;
    const slug = qrSlugFor(doctor, videos);
    added = added.map((v) => ({ ...v, doctor, slug, qr: true }));
  } else {
    added = added.map((v) => ({ ...v, qr: false }));
  }
  const next = [...added, ...videos];
  if (added.length) {
    try {
      await writeVideos(next);
    } catch {
      return saveFailed();
    }
  }
  return NextResponse.json({ videos: next, results: publicResults(results) });
}

// Takes { order: string[] } — every video id, in the new order. This order
// is what the Resources page shows when no sort filter is selected.
export async function PUT(req: NextRequest) {
  if (!checkPin(req.headers.get("x-admin-pin"))) return unauthorized();

  const { order } = (await req.json().catch(() => ({}))) as { order?: string[] };
  const videos = await readVideos();
  const byId = new Map(videos.map((v) => [v.id, v]));
  if (!Array.isArray(order) || order.length !== videos.length || new Set(order).size !== order.length || !order.every((id) => byId.has(id))) {
    return NextResponse.json({ error: "The video list changed — refresh the page and try again." }, { status: 409 });
  }

  const next = order.map((id) => byId.get(id)!);
  try {
    await writeVideos(next);
  } catch {
    return saveFailed();
  }
  return NextResponse.json({ videos: next });
}

export async function DELETE(req: NextRequest) {
  if (!checkPin(req.headers.get("x-admin-pin"))) return unauthorized();

  const id = req.nextUrl.searchParams.get("id");
  const videos = await readVideos();
  const next = videos.filter((v) => v.id !== id);
  if (next.length === videos.length) return NextResponse.json({ error: "Video not found." }, { status: 404 });

  try {
    await writeVideos(next);
  } catch {
    return saveFailed();
  }
  return NextResponse.json({ videos: next });
}

// Edits one video. Takes { id, doctor, doctorHi?, title, qr, url?, addUrls? }:
// - url: a different YouTube link replaces the video (thumbnail, views,
//   date, length and — unless the title was edited too — title come from it).
// - qr: on/off for the doctor's QR page. Turning it on joins an existing QR
//   doctor with the same name.
// - addUrls: more links filed under the same doctor, QR setting and slug,
//   placed right after this video.
// The slug is otherwise never changed: it's the link inside a printed QR.
export async function PATCH(req: NextRequest) {
  if (!checkPin(req.headers.get("x-admin-pin"))) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as {
    id?: string; doctor?: string; doctorHi?: string; title?: string; qr?: boolean; url?: string; addUrls?: string[];
  };
  const doctor = cleanText(body.doctor);
  const doctorHi = cleanText(body.doctorHi);
  let title = cleanText(body.title);
  if (!doctor || !title) return NextResponse.json({ error: "Doctor name and title can't be empty." }, { status: 400 });

  const videos = await readVideos();
  const i = videos.findIndex((v) => v.id === body.id);
  if (i === -1) return NextResponse.json({ error: "Video not found." }, { status: 404 });
  const old = videos[i];
  const others = videos.filter((v) => v.id !== old.id);
  const taken = new Set(others.map((v) => v.id));

  // Replace the YouTube video itself.
  let base = old;
  const url = cleanText(body.url);
  if (url && parseYouTubeId(url) !== old.id) {
    const [r] = await fetchLinks([url], taken);
    if (!r.video) return NextResponse.json({ error: `New link: ${r.error}` }, { status: 400 });
    if (title === old.title) title = r.video.title;
    base = { ...r.video };
    taken.add(r.video.id);
  }

  const qr = body.qr !== false;
  const slug = qr && !hasQr(old) ? qrSlugFor(doctor, videos, old.id) : doctorSlug(old);
  const updated: DoctorVideo = { ...base, slug, qr, doctor, title, doctorHi: doctorHi || undefined };

  // More videos for this doctor.
  const addInputs = Array.isArray(body.addUrls) ? body.addUrls.map((u) => String(u).trim()).filter(Boolean) : [];
  if (addInputs.length > MAX_BATCH) return NextResponse.json({ error: `Up to ${MAX_BATCH} links at a time, please.` }, { status: 400 });
  const results = addInputs.length ? await fetchLinks(addInputs, taken) : [];
  const added = fetched(results).map((v) => ({ ...v, doctor, slug, qr }));

  const next = [...videos];
  next.splice(i, 1, updated, ...added);
  try {
    await writeVideos(next);
  } catch {
    return saveFailed();
  }
  return NextResponse.json({ videos: next, results: publicResults(results), id: updated.id });
}
