"use client";

import { MapPin, Phone, Mail, Clock, Share2 } from 'lucide-react';

export const ContactInfo = () => {
  const contactDetails = [
    {
      icon: <MapPin className="text-green-600" size={24} />,
      title: "Office Address",
      details: "123 Adventure Street, Explorer's Plaza, Wanderlust City, WL 12345"
    },
    {
      icon: <Phone className="text-green-600" size={24} />,
      title: "Phone Number",
      details: "+1 (234) 567-890",
      link: "tel:+1234567890"
    },
    {
      icon: <Mail className="text-green-600" size={24} />,
      title: "Email Address",
      details: "info@natours.com",
      link: "mailto:info@natours.com"
    },
    {
      icon: <Clock className="text-green-600" size={24} />,
      title: "Working Hours",
      details: "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed"
    }
  ];

  const socialMedia = [
    { name: "Facebook", href: "https://facebook.com" },
    { name: "Twitter", href: "https://twitter.com" },
    { name: "Instagram", href: "https://instagram.com" },
    { name: "LinkedIn", href: "https://linkedin.com" }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 h-full">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in touch</h2>
      
      <div className="space-y-8">
        {contactDetails.map((item, index) => (
          <div key={index} className="flex">
            <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              {item.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              {item.link ? (
                <a 
                  href={item.link}
                  className="text-gray-600 hover:text-green-600 transition-colors mt-1"
                >
                  {item.details}
                </a>
              ) : (
                <p className="text-gray-600 mt-1 whitespace-pre-line">{item.details}</p>
              )}
            </div>
          </div>
        ))}
        
        {/* Social Media */}
        <div className="flex">
          <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
            <Share2 className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Follow Us</h3>
            <div className="flex flex-wrap gap-3 mt-2">
              {socialMedia.map((platform) => (
                <a 
                  key={platform.name}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-600 rounded-full text-sm font-medium transition-colors"
                >
                  {platform.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};