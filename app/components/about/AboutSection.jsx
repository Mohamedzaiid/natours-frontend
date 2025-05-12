"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const AboutSection = () => {
  const [stats, setStats] = useState({
    years: 0,
    tours: 0,
    customers: 0,
    countries: 0
  });
  
  // Animate statistics on component mount
  useEffect(() => {
    const targetStats = {
      years: 10,
      tours: 250,
      customers: 12000,
      countries: 42
    };
    
    const interval = 2000; // 2 seconds for animation
    const steps = 50; // Number of steps in the animation
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      
      if (currentStep >= steps) {
        setStats(targetStats);
        clearInterval(timer);
        return;
      }
      
      const progress = currentStep / steps;
      
      setStats({
        years: Math.floor(targetStats.years * progress),
        tours: Math.floor(targetStats.tours * progress),
        customers: Math.floor(targetStats.customers * progress),
        countries: Math.floor(targetStats.countries * progress)
      });
    }, interval / steps);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container-custom my-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">
            Your Adventure Travel Specialist Since 2014
          </h2>
          
          <p className="text-slate-600 mb-8 leading-relaxed">
            At Natours, we believe that exploring the world's natural wonders should be accessible to everyone. Founded in 2014 by a group of passionate travelers and outdoor enthusiasts, we've grown from a small local operation to a global adventure travel company with a mission to connect people with the transformative power of nature.
          </p>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-slate-800">Why Choose Natours?</h3>
            
            <div className="space-y-3">
              {[
                "Expertly crafted itineraries that balance adventure and comfort",
                "Small groups led by certified local guides with deep knowledge",
                "Commitment to sustainable and responsible tourism practices",
                "24/7 support throughout your journey for peace of mind"
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle2 className="text-green-600 mr-3 mt-1 flex-shrink-0" size={20} />
                  <p className="text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-slate-600 leading-relaxed">
            Whether you're looking for a challenging trek through remote mountains, a wildlife safari, or a cultural immersion experience, our team is dedicated to creating unforgettable adventures that leave a positive impact on both our travelers and the destinations we visit.
          </p>
        </div>
        
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden h-48 md:h-64 relative">
                <Image
                  src="/about/about-1.jpg"
                  alt="Adventure travel"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden h-48 md:h-64 relative">
                <Image
                  src="/about/about-2.jpg"
                  alt="Beautiful destinations"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="rounded-xl overflow-hidden h-48 md:h-64 relative">
                <Image
                  src="/about/about-3.jpg"
                  alt="Local experiences"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden h-48 md:h-64 relative">
                <Image
                  src="/about/about-4.jpg"
                  alt="Outdoor activities"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Statistics overlay */}
          <div className="absolute -bottom-10 -left-10 bg-white rounded-xl shadow-xl p-6 grid grid-cols-2 gap-4 w-64">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.years}+</p>
              <p className="text-sm text-slate-600">Years</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.tours}+</p>
              <p className="text-sm text-slate-600">Tours</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.customers.toLocaleString()}+</p>
              <p className="text-sm text-slate-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.countries}+</p>
              <p className="text-sm text-slate-600">Countries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
