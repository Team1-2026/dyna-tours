'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, MapPin, X, ZoomIn } from 'lucide-react';
import { Testimonial, defaultTestimonials } from '@/data/homeData';
import { getImageUrl } from '@/lib/api';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials = defaultTestimonials }) => {
  const list = (testimonials && testimonials.length > 0) ? testimonials : defaultTestimonials;
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedModalImage, setSelectedModalImage] = useState<string | null>(null);
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-advance every 6 seconds when not hovered
  useEffect(() => {
    if (list.length <= cardsPerView || isPaused) return;
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % list.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [list.length, isPaused, cardsPerView]);

  // Compute currently visible testimonials
  const visibleTestimonials = [];
  for (let i = 0; i < Math.min(cardsPerView, list.length); i++) {
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
      id="client-reviews"
      className="bg-slate-50 py-24 text-slate-900 relative overflow-hidden scroll-mt-20 sm:scroll-mt-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Anchor alias IDs */}
      <span id="testimonials" className="absolute -top-24 pointer-events-none" />
      <span id="reviews" className="absolute -top-24 pointer-events-none" />
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
          {list.length > cardsPerView && (
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

        {/* Dynamic Responsive Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {visibleTestimonials.map((testimonial, i) => (
              <motion.div
                key={`${testimonial.id}-${(startIndex + i) % list.length}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-amber-300"
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
                  <p className="text-slate-700 text-[0.95rem] leading-relaxed italic mb-5 relative z-10 line-clamp-4">
                    "{testimonial.review}"
                  </p>

                  {/* Optional Review Content Image (e.g. WhatsApp review screenshot or customer tour photo) */}
                  {testimonial.photo && !testimonial.photo.includes('unsplash.com') && (
                    <div className="mb-4 relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm group/img">
                      <img
                        src={getImageUrl(testimonial.photo)}
                        alt={`Review by ${testimonial.name}`}
                        className="w-full h-44 object-cover object-top hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => setSelectedModalImage(getImageUrl(testimonial.photo))}
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.triedProduction && testimonial.photo?.startsWith('/storage')) {
                            target.dataset.triedProduction = 'true';
                            target.src = `https://api.dynatours.com${testimonial.photo}`;
                          } else {
                            target.style.display = 'none';
                          }
                        }}
                      />
                      <div 
                        onClick={() => setSelectedModalImage(getImageUrl(testimonial.photo))}
                        className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer gap-1.5"
                      >
                        <span className="bg-white/95 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm flex items-center gap-1.5">
                          <ZoomIn className="h-3.5 w-3.5 text-amber-500" />
                          View Image
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Reviewer Information (No avatar circle) */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 relative z-10">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-amber-600 transition-colors">
                      {testimonial.name}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Verified Customer
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Carousel Pagination Dots */}
        {list.length > cardsPerView && (
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

        {/* Full Image Preview Modal */}
        {selectedModalImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedModalImage(null)}
          >
            <div 
              className="relative max-w-3xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedModalImage(null)}
                className="absolute top-4 right-4 z-10 bg-black/70 text-white rounded-full p-2 hover:bg-black transition-colors"
                aria-label="Close Preview"
              >
                <X className="h-5 w-5" />
              </button>
              <img 
                src={selectedModalImage} 
                alt="Review attachment preview" 
                className="max-h-[82vh] w-auto max-w-full object-contain rounded-xl mx-auto" 
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
