import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResourcesPageBody from "@/components/ResourcesPageBody";
import { RESOURCES_HERO } from "@/data/content";
import { doctorSlug, hasQr } from "@/lib/doctor-slug";
import { readVideos } from "@/lib/videos";

// What a doctor's QR code (generated in /admin) opens: the full Resources
// page, with that doctor's first video featured at the top of the videos.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ doctor: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).doctor;
  const name = (await readVideos()).find((v) => hasQr(v) && doctorSlug(v) === slug)?.doctor;
  return {
    title: name ? `${name} — Resources & Support — Project CALM` : "Resources & Support — Project CALM",
    description: RESOURCES_HERO.subline,
  };
}

export default async function DoctorResourcesPage({ params }: Props) {
  const slug = (await params).doctor;
  const videos = await readVideos();
  if (!videos.some((v) => hasQr(v) && doctorSlug(v) === slug)) notFound();
  return <ResourcesPageBody videos={videos} featuredSlug={slug} />;
}
