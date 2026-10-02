import Navbar from "@/components/Navbar";
import ScrollVideo from "@/components/ScrollVideo";
import HashtagReveal from "@/components/HashtagReveal";
import ConditionIntro from "@/components/ConditionIntro";
import AnatomySection from "@/components/AnatomySection";
import RiskCards from "@/components/RiskCards";
import StatBand from "@/components/StatBand";
import MythFact from "@/components/MythFact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <ScrollVideo />
      <HashtagReveal />
      <ConditionIntro />
      <AnatomySection />
      <RiskCards />
      <StatBand sectionKey="STATS_BY_NUMBERS" />
      <MythFact />
      <Footer />
    </main>
  );
}
