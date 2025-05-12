"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const TestimonialsAbout = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // In a real implementation, you would fetch this from your backend API
        // For now, we'll use mock data
        setTimeout(() => {
          const testimonialsData = [
            {
              id: 1,
              name: "Jessica Martinez",
              location: "San Francisco, USA",
              image: "/about/testimonial-1.jpg",
              rating: 5,
              text: "Our Patagonia trek with Natours was beyond anything I could have imagined. The guides were knowledgeable and passionate, the itinerary perfectly balanced challenge and comfort, and the landscapes were breathtaking. This was my third trip with Natours and definitely not my last!"
            },
            {
              id: 2,
              name: "Thomas Eriksen",
              location: "Oslo, Norway",
              image: "/about/testimonial-2.jpg",
              rating: 5,
              text: "The Costa Rica wildlife expedition exceeded all expectations. Our guide Carlos had an incredible ability to spot animals I would have completely missed and taught us so much about the ecosystem. The accommodations were eco-friendly yet comfortable, and the small group size made it feel very personal."
            },
            {
              id: 3,
              name: "Amara Okafor",
              location: "London, UK",
              image: "/about/testimonial-3.jpg",
              rating: 5,
              text: "My Morocco desert trek was transformative. From the moment I booked until the final goodbye, Natours provided exceptional service. The cultural experiences were authentic, not touristy, and our guide's connections with local communities gave us insights we never would have had otherwise. Worth every penny."
            },
            {
              id: 4,
              name: "Liam Chen",
              location: "Melbourne, Australia",
              image: "/about/testimonial-4.jpg",
              rating: 5,
              text: "I was initially hesitant about joining a group tour as a solo traveler, but Natours made me feel welcome and included from day one. The New Zealand adventure was perfectly paced with a great mix of hiking, cultural experiences, and free time. I've made lifelong friends from around the world."
            }
          ];
          
          setTestimonials(testimonialsData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);
  
  const handlePrev = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const handleNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  if (loading) {
    return (
      <div className="container-custom">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">What Our Travelers Say</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Don't just take our word for it. Hear from some of the thousands of travelers who have experienced the Natours difference.
        </p>
      </div>
      
      <div className="relative max-w-4xl mx-auto">
        {testimonials.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="relative w-32 h-32 flex-shrink-0">
                <Image
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center mb-2">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={18} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                
                <p className="text-slate-600 italic mb-6">
                  "{testimonials[currentIndex].text}"
                </p>
                
                <div>
                  <p className="font-semibold text-slate-800">{testimonials[currentIndex].name}</p>
                  <p className="text-slate-500 text-sm">{testimonials[currentIndex].location}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-center mt-8 space-x-4">
          <button 
            onClick={handlePrev}
            className="p-2 bg-white rounded-full shadow hover:bg-green-50 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} className="text-slate-600" />
          </button>
          
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-green-600" : "bg-slate-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={handleNext}
            className="p-2 bg-white rounded-full shadow hover:bg-green-50 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} className="text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsAbout;
