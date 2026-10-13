import Navbar from "./Navbar";
import PageHero from "./PageHero";
import HashtagReveal from "./HashtagReveal";
import DoctorInsights from "./DoctorInsights";
import CoffeeTableBook from "./CoffeeTableBook";
import ToolsGrid from "./ToolsGrid";
import ClosingSection from "./ClosingSection";
import ReferencesSection from "./ReferencesSection";
import MedicalDisclaimer from "./MedicalDisclaimer";
import Footer from "./Footer";
import type { DoctorVideo } from "@/lib/videos";

// The Resources page, shared by /resources and /resources/<doctor> (what a
// doctor's QR code opens) so the two never drift apart. The only difference:
// a doctor's page puts that doctor's first video up front, larger.
export default function ResourcesPageBody({ videos, featuredSlug }: { videos: DoctorVideo[]; featuredSlug?: string }) {
  return (
    <main>
      <Navbar />
      <PageHero sectionKey="RESOURCES_HERO" />
      <HashtagReveal />
      <DoctorInsights videos={videos} featuredSlug={featuredSlug} />
      <CoffeeTableBook />
      <ToolsGrid />
      <ClosingSection />
      <ReferencesSection />
      <MedicalDisclaimer />
      <Footer />
    </main>
  );
}
