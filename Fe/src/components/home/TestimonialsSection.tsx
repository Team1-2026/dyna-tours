'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Testimonial } from '@/data/homeData';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <section className="bg-slate-50 py-24 text-slate-900 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
            REAL EXPERIENCES
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
            What Our Travellers Say
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Read authentic reviews from couples, families, and solo explorers who traveled with Dyna Tours India.
          </p>
        </div>

        {/* Featured Testimonial Card */}
        <div className="relative mx-auto max-w-4xl rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-12 shadow-xl backdrop-blur-md">
          <Quote className="absolute top-6 right-8 h-16 w-16 text-slate-200" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-8"
            >
              {/* Photo */}
              <div className="relative shrink-0">
                <img
                  src={current.photo}
                  alt={current.name}
                  className="h-28 w-28 sm:h-36 sm:w-36 rounded-full object-cover border-4 border-amber-400/40 shadow-xl"
                />
                {current.verified && (
                  <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-teal-500 text-white shadow-md">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Review Text */}
              <div className="flex-1 text-center sm:text-left">
                {/* 5-Star Rating */}
                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 mb-3">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400" />
                  ))}
                </div>

                <p className="text-base sm:text-lg text-slate-800 font-light italic leading-relaxed">
                  "{current.review}"
                </p>

                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{current.name}</h3>
                    <span className="text-xs text-slate-500">{current.location}</span>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700 border border-amber-200">
                    <span>{current.destinationVisited}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Controls */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-7 bg-amber-400'
                      : 'w-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition hover:bg-white hover:text-black"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition hover:bg-white hover:text-black"
                aria-label="Next review"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
