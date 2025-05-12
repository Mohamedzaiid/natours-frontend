"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Linkedin, Twitter, Instagram } from "lucide-react";

const TeamSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        // In a real implementation, you'd fetch this data from your backend API
        // For now, we'll simulate an API call with a timeout
        setTimeout(() => {
          const teamData = [
            {
              id: 1,
              name: "Mohamed Zaid",
              role: "Founder & CEO",
              bio: "With over 15 years of experience in adventure travel, Sarah founded Natours with a vision to create sustainable travel experiences that connect people with nature.",
              image: "/about/team-1.jpg",
              social: {
                linkedin: "https://linkedin.com",
                twitter: "https://twitter.com",
                instagram: "https://instagram.com"
              }
            },
            {
              id: 2,
              name: "Sarah Chen",
              role: "Head of Operations",
              bio: "Michael ensures all our tours run smoothly, from logistics to emergency protocols. He's climbed peaks on six continents and is passionate about responsible tourism.",
              image: "/about/team-2.jpg",
              social: {
                linkedin: "https://linkedin.com",
                twitter: "https://twitter.com",
                instagram: "https://instagram.com"
              }
            },
            {
              id: 3,
              name: "Micheal Rodriguez",
              role: "Lead Tour Designer",
              bio: "Elena creates our unique itineraries, balancing adventure with comfort. Her background in environmental conservation influences her approach to responsible tour planning.",
              image: "/about/team-3.jpg",
              social: {
                linkedin: "https://linkedin.com",
                twitter: "https://twitter.com",
                instagram: "https://instagram.com"
              }
            },
            {
              id: 4,
              name: "James Wilson",
              role: "Marketing Director",
              bio: "James brings our adventures to life through compelling storytelling. A former travel journalist, he's visited over 50 countries and is always seeking new experiences.",
              image: "/about/team-4.jpg",
              social: {
                linkedin: "https://linkedin.com",
                twitter: "https://twitter.com",
                instagram: "https://instagram.com"
              }
            }
          ];
          
          setTeam(teamData);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load team data");
        setIsLoading(false);
      }
    };
    
    fetchTeam();
  }, []);
  
  return (
    <div className="container-custom my-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">Meet Our Team</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Our passionate team of travel experts is dedicated to creating unforgettable adventures while promoting sustainable tourism practices.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div 
              key={member.id} 
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800">{member.name}</h3>
                <p className="text-green-600 mb-3">{member.role}</p>
                <p className="text-slate-600 text-sm mb-4">{member.bio}</p>
                
                <div className="flex space-x-3">
                  <a href={member.social.linkedin} className="text-slate-500 hover:text-green-600 transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href={member.social.twitter} className="text-slate-500 hover:text-green-600 transition-colors">
                    <Twitter size={18} />
                  </a>
                  <a href={member.social.instagram} className="text-slate-500 hover:text-green-600 transition-colors">
                    <Instagram size={18} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamSection;
