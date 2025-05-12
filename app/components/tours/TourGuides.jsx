"use client";

import Image from "next/image";
import { Mail, Phone, Instagram, Linkedin } from "lucide-react";
import { useTheme } from "@/app/providers/theme/ThemeProvider";

export const TourGuides = ({ guides = [] }) => {
  const { theme, isDark } = useTheme();
  // Placeholder guides if none provided
  const tourGuides =
    guides.length > 0
      ? guides
      : [
          {
            id: 1,
            name: "Lisa Hoffman",
            role: "Lead Guide",
            bio: "Professional guide with over 10 years of experience leading tours around the world. Expert in local flora, fauna, and cultural history.",
            photo: "/api/placeholder/300/300?text=Guide+1",

            email: "lisa@example.com",
            phone: "+1 234 567 8901",
            instagram: "@lisahoffman",
            linkedin: "lisahoffman",
          },
          {
            id: 2,
            name: "John Doe",
            role: "Tour Guide",
            bio: "Adventure specialist with a background in environmental conservation. John brings both excitement and education to every tour.",

            email: "john@example.com",
            phone: "+1 234 567 8902",
            instagram: "@johndoe",
            linkedin: "johndoe",
          },
        ];

  return (
    <div>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : ''}`}>Meet Your Guides</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tourGuides.map((guide) => (
          <div
            key={guide._id ? guide._id : guide.id}
            className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-md overflow-hidden border`}
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 relative">
                <div className="aspect-square relative w-full">
                  <Image
                    src={
                      guide.photo?.startsWith("http")
                        ? guide.photo
                        : guide.photo
                        ? `https://natours-yslc.onrender.com/img/users/${guide.photo}`
                        : "/api/placeholder/300/300?text=Guide"
                    }
                    alt={guide.name}
                    fill
                    className="object-cover"
                    unoptimized={guide.photo?.startsWith("http")}
                  />
                </div>
              </div>
              <div className="md:w-2/3 p-6">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : ''}`}>{guide.name}</h3>
                <p className="text-green-600 font-medium mb-3">{guide.role}</p>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4 text-sm`}>{guide.bio}</p>

                <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-100'} pt-4 mt-4`}>
                  <h4 className={`font-medium mb-2 text-sm ${isDark ? 'text-gray-300' : ''}`}>
                    Contact & Social Media
                  </h4>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    {guide.email && (
                      <div className="flex flex-wrap items-center gap-2">
                        <Mail size={24} className="text-green-500 " />
                        <span className={`${isDark ? 'text-gray-300' : 'text-slate-700'} w-23`}>{guide.email}</span>
                      </div>
                    )}
                    {guide.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-500" />
                        <span className={`${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{guide.phone}</span>
                      </div>
                    )}
                    {guide.instagram && (
                      <div className="flex items-center gap-2">
                        <Instagram size={14} className="text-gray-500" />
                        <span className={`${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                          {guide.instagram}
                        </span>
                      </div>
                    )}
                    {guide.linkedin && (
                      <div className="flex items-center gap-2">
                        <Linkedin size={14} className="text-gray-500" />
                        <span className={`${isDark ? 'text-gray-300' : 'text-slate-700'}`}>{guide.linkedin}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourGuides;
