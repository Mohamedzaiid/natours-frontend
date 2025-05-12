"use client";

import { Globe, Users, Shield, Leaf, Award, Heart } from "lucide-react";
import { useState } from "react";

const ValuesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const values = [
    {
      icon: <Globe className="text-green-600" size={32} />,
      title: "Responsible Travel",
      description: "We're committed to minimizing our environmental impact and supporting local communities through sustainable tourism practices."
    },
    {
      icon: <Users className="text-green-600" size={32} />,
      title: "Small Groups",
      description: "Our tours are limited to small groups to ensure personalized experiences and reduced impact on the environments we visit."
    },
    {
      icon: <Shield className="text-green-600" size={32} />,
      title: "Safety First",
      description: "Your safety is our top priority. Our guides are certified in first aid and trained to handle emergencies in remote locations."
    },
    {
      icon: <Leaf className="text-green-600" size={32} />,
      title: "Environmental Conservation",
      description: "We actively contribute to conservation efforts and practice leave-no-trace principles in all our adventures."
    },
    {
      icon: <Award className="text-green-600" size={32} />,
      title: "Expert Knowledge",
      description: "Our guides are passionate locals with deep knowledge of the natural and cultural histories of each destination."
    },
    {
      icon: <Heart className="text-green-600" size={32} />,
      title: "Customer Satisfaction",
      description: "We go above and beyond to ensure our travelers have memorable, enriching experiences that exceed expectations."
    }
  ];

  return (
    <div className="bg-green-50 py-20">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">Our Values</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            These core principles guide everything we do at Natours, from selecting our tours to training our guides and interacting with local communities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl p-8 shadow-sm transition-all duration-300 ${
                hoveredIndex === index ? "transform -translate-y-2 shadow-md" : ""
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-slate-800">{value.title}</h3>
              <p className="text-slate-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValuesSection;
