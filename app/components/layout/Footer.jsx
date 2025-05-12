"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { usePathname } from "next/navigation";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const isDashboardPage = pathname === "/dashboard";
  
  return (
    <footer className={isDashboardPage? 'hidden' : "bg-gray-900 text-white pt-16 pb-8"}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <Link href="/" className="block mb-6">
              <div className="relative h-8 w-32">
                <Image 
                  src="/logo-white.png" 
                  alt="Natours Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </Link>
            <p className="text-gray-400 mb-6">
              Discover the world with Natours – your gateway to unforgettable adventures and authentic experiences in the world's most spectacular destinations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Tours', href: '/tours' },
                { name: 'Destinations', href: '/destinations' },
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'Privacy Policy', href: '/privacy' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Tour Types */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Tour Categories</h3>
            <ul className="space-y-3">
              {[
                { name: 'Adventure Tours', href: '/tours?category=adventure' },
                { name: 'Cultural Tours', href: '/tours?category=cultural' },
                { name: 'Wildlife Tours', href: '/tours?category=wildlife' },
                { name: 'Beach Vacations', href: '/tours?category=beach' },
                { name: 'Mountain Treks', href: '/tours?category=mountain' },
                { name: 'City Explorations', href: '/tours?category=city' },
              ].map((category) => (
                <li key={category.name}>
                  <Link 
                    href={category.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Adventure Street, Explorer's Plaza, Wanderlust City, WL 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-green-500 mr-3 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-green-500 mr-3 flex-shrink-0" />
                <a href="mailto:info@natours.com" className="text-gray-400 hover:text-white transition-colors">
                  info@natours.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-gray-800 my-8" />
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} Natours. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm">
            <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;