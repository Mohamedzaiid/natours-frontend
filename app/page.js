"use client";

import { Hero } from "./components/Hero";
import { FeaturedTours } from "./components/tours/FeaturedTours";
import { TourCategories } from "./components/tours/TourCategories";
import { Testimonials } from "./components/Testimonials";
import { CTASection } from "./components/CTASection";
import AnimatedLayout from "./components/layout/AnimatedLayout";
import PageTransition from "./components/layout/PageTransition";

import { useTheme } from './providers/theme/ThemeProvider';

export default function Home() {
  const { isDark } = useTheme();
  return (
    <AnimatedLayout>
      <PageTransition>
        <Hero 
          title="Discover Your Perfect Adventure" 
          subtitle="Unforgettable outdoor experiences in the world's most stunning locations"
          ctaText="Explore Tours"
          ctaLink="/tours"
        />
        
        <div className="container-custom my-20">
          <TourCategories />
        </div>
        
        <div className={`bg-slate-50 py-20 ${isDark ? 'dark-featured-section' : ''}`}>
          <div className="container-custom">
            
            <FeaturedTours />
          </div>
        </div>
        
        <div className="container-custom my-20">
          <Testimonials />
        </div>
        
        <CTASection 
          title="Ready for your next adventure?"
          subtitle="Join thousands of satisfied travelers exploring the world with Natours"
          ctaText="Start Your Journey"
          ctaLink="/tours"
        />
      </PageTransition>
    </AnimatedLayout>
  );
}
