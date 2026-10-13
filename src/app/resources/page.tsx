import type { Metadata } from "next";
import ResourcesPageBody from "@/components/ResourcesPageBody";
import { RESOURCES_HERO } from "@/data/content";
import { readVideos } from "@/lib/videos";

export const metadata: Metadata = {
  title: "Resources & Support — Project CALM",
  description: RESOURCES_HERO.subline,
};

// Rendered per request so videos added from /admin show up on the next visit.
export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  return <ResourcesPageBody videos={await readVideos()} />;
}
