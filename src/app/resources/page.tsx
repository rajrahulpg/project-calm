import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import HashtagReveal from "@/components/HashtagReveal";
import DoctorInsights from "@/components/DoctorInsights";
import CoffeeTableBook from "@/components/CoffeeTableBook";
import ToolsGrid from "@/components/ToolsGrid";
import ClosingSection from "@/components/ClosingSection";
import ReferencesSection from "@/components/ReferencesSection";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import Footer from "@/components/Footer";
import { RESOURCES_HERO } from "@/data/content";
import { readVideos } from "@/lib/videos";

export const metadata: Metadata = {
  title: "Resources & Support — Project CALM",
  description: RESOURCES_HERO.subline,
};

// Rendered per request so videos added from /admin show up on the next visit.
export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const videos = await readVideos();
  return (
    <main>
      <Navbar />
      <PageHero sectionKey="RESOURCES_HERO" />
      <HashtagReveal />
      <DoctorInsights videos={videos} />
      <CoffeeTableBook />
      <ToolsGrid />
      <ClosingSection />
      <ReferencesSection />
      <MedicalDisclaimer />
      <Footer />
    </main>
  );
}
