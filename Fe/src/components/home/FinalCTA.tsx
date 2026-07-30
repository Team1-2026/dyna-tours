'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, PhoneCall, ArrowRight, Sparkles } from 'lucide-react';

interface FinalCTAProps {
  heading?: string;
  description?: string;
  bgImage?: string;
  whatsappNumber?: string;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  heading = 'Ready to Plan Your Next Adventure?',
  description = 'Connect with our expert travel consultants for tailor-made itineraries, VIP hotel upgrades, and instant visa assistance.',
  bgImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85',
  whatsappNumber = '919876543210',
}) => {
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Dyna Tours India! I would like to inquire about a holiday package.')}`;

  return (
    <section className="relative py-28 text-white overflow-hidden bg-[#0C2745]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      
      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/70" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-5 py-2 text-xs font-bold tracking-widest text-amber-300 uppercase backdrop-blur-md mb-6">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>LET'S CRAFT YOUR DREAM TRIP</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
            {heading}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-neutral-300 font-light max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-9 py-4 text-sm font-semibold text-white shadow-2xl shadow-red-600/40 transition-all hover:scale-105 hover:from-red-500 hover:to-rose-500"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Get Free Quote</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/40 bg-emerald-600/90 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-emerald-600/30 backdrop-blur-md transition-all hover:scale-105 hover:bg-emerald-500"
            >
              <MessageSquare className="h-4 w-4 fill-white" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          <div className="mt-8 text-xs text-neutral-400 font-medium">
            ⚡ Instant Response within 15 Minutes • No Booking Fees • Best Rates Guaranteed
          </div>

        </motion.div>

      </div>
    </section>
  );
};
