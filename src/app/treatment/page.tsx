import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import TreatmentExplorer from "@/components/TreatmentExplorer";
import BodyMap from "@/components/BodyMap";
import OutcomeRings from "@/components/OutcomeRings";
import JourneyTimeline from "@/components/JourneyTimeline";
import Checklist from "@/components/Checklist";
import EmotionalSection from "@/components/EmotionalSection";
import CaregiverSection from "@/components/CaregiverSection";
import QuestionsAccordion from "@/components/QuestionsAccordion";
import EmergencyCards from "@/components/EmergencyCards";
import InsuranceSection from "@/components/InsuranceSection";
import LifeAfterSection from "@/components/LifeAfterSection";
import Footer from "@/components/Footer";
import { TREATMENT_HERO } from "@/data/content";

export const metadata: Metadata = {
  title: "Treatment & Your Journey — Project CALM",
  description: TREATMENT_HERO.subline,
};

export default function TreatmentPage() {
  return (
    <main>
      <Navbar />
      <PageHero sectionKey="TREATMENT_HERO" variant="ecg" />
      <TreatmentExplorer />
      <BodyMap />
      <OutcomeRings />
      <JourneyTimeline />
      <Checklist />
      <EmotionalSection />
      <CaregiverSection />
      <QuestionsAccordion />
      <EmergencyCards />
      <InsuranceSection />
      <LifeAfterSection />
      <Footer />
    </main>
  );
}
