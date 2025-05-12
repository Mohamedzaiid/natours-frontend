import AboutHero from "../../components/about/AboutHero";
import AboutSection from "../../components/about/AboutSection";
import TeamSection from "../../components/about/TeamSection";
import ValuesSection from "../../components/about/ValuesSection";
import TestimonialsAbout from "../../components/about/TestimonialsAbout";
import { CTASection } from "../../components/CTASection";

export const metadata = {
  title: "About Natours | Your Adventure Travel Specialist",
  description: "Learn about our mission, values, and the passionate team behind Natours, dedicated to providing you with unforgettable travel experiences."
};

export default function AboutPage() {
  return (
    <>
      <AboutHero 
        title="About Natours" 
        subtitle="Discover our story, mission, and the passion that drives us to create unforgettable adventures around the world"
      />
      
      <AboutSection />
      
      <ValuesSection />
      
      <TeamSection />
      
      <div className="bg-slate-50 py-20">
        <TestimonialsAbout />
      </div>
      
      <CTASection 
        title="Ready to embark on your next adventure?"
        subtitle="Join thousands of satisfied travelers exploring the world with Natours"
        ctaText="Browse Our Tours"
        ctaLink="/tours"
      />
    </>
  );
}
