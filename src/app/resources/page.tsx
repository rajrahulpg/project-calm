import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import DoctorInsights from "@/components/DoctorInsights";
import PatientStories from "@/components/PatientStories";
import CoffeeTableBook from "@/components/CoffeeTableBook";
import ToolsGrid from "@/components/ToolsGrid";
import ClosingSection from "@/components/ClosingSection";
import ReferencesSection from "@/components/ReferencesSection";
import MedicalDisclaimer from "@/components/MedicalDisclaimer";
import Footer from "@/components/Footer";
import { RESOURCES_HERO } from "@/data/content";

export const metadata: Metadata = {
  title: "Resources & Support — Project CALM",
  description: RESOURCES_HERO.subline,
};

export default function ResourcesPage() {
  return (
    <main>
      <Navbar />
      <PageHero sectionKey="RESOURCES_HERO" />
      <DoctorInsights />
      <PatientStories />
      <CoffeeTableBook />
      <ToolsGrid />
      <ClosingSection />
      <ReferencesSection />
      <MedicalDisclaimer />
      <Footer />
    </main>
  );
}
