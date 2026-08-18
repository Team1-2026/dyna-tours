'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, MapPin } from 'lucide-react';
import { Testimonial, defaultTestimonials } from '@/data/homeData';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials = defaultTestimonials }) => {
  const list = (testimonials && testimonials.length > 0) ? testimonials : defaultTestimonials;
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const CARDS_PER_VIEW = 3;

  // Auto-advance every 6 seconds when not hovered
  useEffect(() => {
    if (list.length <= CARDS_PER_VIEW || isPaused) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % list.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [list.length, isPaused]);

  // Compute the 3 currently visible testimonials
  const visibleTestimonials = [];
  for (let i = 0; i < Math.min(CARDS_PER_VIEW, list.length); i++) {
    const idx = (startIndex + i) % list.length;
    visibleTestimonials.push(list[idx]);
  }

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % list.length);
  };

  return (
    <section 
      className="bg-slate-50 py-24 text-slate-900 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Decorative Subtle Gradient Accents */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-red-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with Title & Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              REAL EXPERIENCES
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
              What Our Travellers Say
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-xl">
              Read authentic reviews from couples, families, and solo explorers who traveled with Dyna Tours India.
            </p>
          </div>

          {/* Navigation Controls */}
          {list.length > CARDS_PER_VIEW && (
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-amber-400 hover:text-black hover:border-amber-400 hover:scale-105 active:scale-95"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-amber-400 hover:text-black hover:border-amber-400 hover:scale-105 active:scale-95"
                aria-label="Next testimonials"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* 3-Cards in a Row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {visibleTestimonials.map((testimonial, i) => (
              <motion.div
                key={`${testimonial.id}-${(startIndex + i) % list.length}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-amber-300"
              >
                {/* Background Quote Watermark */}
                <Quote className="absolute top-6 right-6 h-12 w-12 text-slate-100 transition-colors group-hover:text-amber-100 pointer-events-none" />

                <div>
                  {/* Top Bar: 5-Star Rating & Verified Badge */}
                  <div className="flex items-center justify-between gap-2 mb-5 relative z-10">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(testimonial.rating || 5)].map((_, starIdx) => (
                        <Star key={starIdx} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>

                    {testimonial.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Verified Trip</span>
                      </span>
                    )}
                  </div>

                  {/* Destination Tag */}
                  {testimonial.destinationVisited && (
                    <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 mb-4 max-w-full truncate">
                      <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                      <span className="truncate">{testimonial.destinationVisited}</span>
                    </div>
                  )}

                  {/* Review Text */}
                  <p className="text-slate-700 text-[0.95rem] leading-relaxed italic mb-6 relative z-10 line-clamp-4">
                    "{testimonial.review}"
                  </p>
                </div>

                {/* Bottom User Profile */}
                <div className="pt-5 border-t border-slate-100 flex items-center gap-4 relative z-10">
                  <div className="relative shrink-0">
                    <img
                      src={testimonial.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-amber-600 transition-colors">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {testimonial.location} {testimonial.date ? `• ${testimonial.date}` : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Carousel Pagination Dots */}
        {list.length > CARDS_PER_VIEW && (
          <div className="mt-12 flex justify-center items-center gap-2">
            {list.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStartIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === startIndex
                    ? 'w-8 bg-amber-400'
                    : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
