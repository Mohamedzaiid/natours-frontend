"use client";

import { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '../../components/layout/PageHeader';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';
import { Map } from './Map';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  return (
    <>
      <PageHeader 
        title="Contact Us" 
        subtitle="We'd love to hear from you! Get in touch with our team for any questions or assistance."
        backgroundImage="/img/contact-header.jpg"
      />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a message</h2>
                <ContactForm 
                  isSubmitting={isSubmitting}
                  setIsSubmitting={setIsSubmitting}
                  setSubmitSuccess={setSubmitSuccess}
                  setSubmitError={setSubmitError}
                />
                
                {submitSuccess && (
                  <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    Thank you for your message! We'll get back to you as soon as possible.
                  </div>
                )}
                
                {submitError && (
                  <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {submitError}
                  </div>
                )}
              </div>
              
              {/* Contact Information */}
              <div>
                <ContactInfo />
              </div>
            </div>
          </div>

        </div>
      </section>
      
      {/* Map Section */}
      {/* <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Find us here</h2>
            <div className="h-96 rounded-lg overflow-hidden">
              <Map />
            </div>
          </div>
        </div>
      </section> */}
      
      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Find answers to the most common questions about our tours and services.</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md divide-y">
              {[
                {
                  question: "How do I book a tour?",
                  answer: "You can book tours directly through our website by navigating to the tour page and clicking the 'Book Now' button. Follow the instructions to complete your booking and payment."
                },
                {
                  question: "What is your cancellation policy?",
                  answer: "Our standard cancellation policy allows for a full refund if cancelled 30 days before the tour date. Cancellations made 15-29 days before receive a 50% refund. Cancellations less than 15 days before the tour date are non-refundable."
                },
                {
                  question: "Are meals included in the tour price?",
                  answer: "This varies by tour. Check the specific tour details page where included meals are clearly listed. Most tours include breakfast, and some include additional meals as specified."
                },
                {
                  question: "Do I need travel insurance?",
                  answer: "Yes, we strongly recommend purchasing comprehensive travel insurance that covers medical emergencies, trip cancellation, and lost luggage. This is not included in your tour price."
                },
                {
                  question: "What should I pack for my tour?",
                  answer: "Each tour has specific packing recommendations based on the destination, activities, and season. We'll send you a detailed packing list after your booking is confirmed."
                }
              ].map((faq, index) => (
                <details key={index} className="group p-6 cursor-pointer">
                  <summary className="flex justify-between items-center font-semibold text-lg text-gray-800">
                    {faq.question}
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" width="24" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}