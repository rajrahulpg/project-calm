import { NextResponse, type NextRequest } from "next/server";
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

// Takes { urls: string[] } — one or many links. Each link is checked and
// fetched on its own, so one bad link doesn't block the rest; the file is
// written once at the end with everything that succeeded.
export async function POST(req: NextRequest) {
  if (!checkPin(req.headers.get("x-admin-pin"))) return unauthorized();

  const { urls } = (await req.json().catch(() => ({}))) as { urls?: string[] };
  const inputs = Array.isArray(urls) ? urls.map((u) => String(u).trim()).filter(Boolean) : [];
  if (inputs.length === 0) return NextResponse.json({ error: "Paste at least one YouTube link." }, { status: 400 });
  if (inputs.length > MAX_BATCH) return NextResponse.json({ error: `Up to ${MAX_BATCH} links at a time, please.` }, { status: 400 });

  const videos = await readVideos();
  const seen = new Set(videos.map((v) => v.id));
  const batchIds = new Set<string>();

  const results: AddResult[] = await Promise.all(
    inputs.map(async (input): Promise<AddResult & { video?: DoctorVideo }> => {
      const id = parseYouTubeId(input);
      if (!id) return { input, ok: false, error: "Not a YouTube video link." };
      if (seen.has(id)) return { input, ok: false, error: "Already on the Resources page." };
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

  const added = results.flatMap((r) => ("video" in r && r.video ? [r.video as DoctorVideo] : []));
  const next = [...added, ...videos];
  if (added.length) {
    try {
      await writeVideos(next);
    } catch {
      return saveFailed();
    }
  }
  return NextResponse.json({
    videos: next,
    results: results.map(({ input, ok, title, error }) => ({ input, ok, title, error })),
  });
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
