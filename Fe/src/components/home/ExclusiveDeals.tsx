'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag, ArrowRight, Clock, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ExclusiveOffer } from '@/data/homeData';

interface ExclusiveDealsProps {
  offers: ExclusiveOffer[];
}

export const ExclusiveDeals: React.FC<ExclusiveDealsProps> = ({ offers }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!offers || offers.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % offers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [offers]);

  if (!offers || offers.length === 0) return null;

  return (
    <section className="relative bg-neutral-950 py-16 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
              <Sparkles className="h-4 w-4" />
              <span>LIMITED TIME SAVINGS</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Exclusive Deals & Promotional Offers
            </h2>
            <p className="mt-2 text-sm text-neutral-400 max-w-2xl">
              Unlock extraordinary savings on handpicked luxury packages, visa assistance, and luxury cruises.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveIndex((prev) => (prev - 1 + offers.length) % offers.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-neutral-900 text-white transition hover:bg-white hover:text-black"
              aria-label="Previous Offer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % offers.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-neutral-900 text-white transition hover:bg-white hover:text-black"
              aria-label="Next Offer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Offers Grid / Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer, idx) => {
            const isFeatured = idx === activeIndex;
            const targetUrl = offer.linkTo || offer.ctaLink || '/contact';

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`group relative overflow-hidden rounded-3xl border transition-all duration-500 ${
                  isFeatured
                    ? 'border-amber-400/50 ring-2 ring-amber-400/20 scale-[1.02] shadow-2xl shadow-amber-500/10'
                    : 'border-white/10 hover:border-white/20 hover:scale-[1.01]'
                } bg-neutral-900`}
              >
                {/* Background Image with Dark Overlay */}
                <Link href={targetUrl} className="block relative h-64 w-full overflow-hidden cursor-pointer">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${offer.bgImage}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />

                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-600/40">
                    <Tag className="h-3.5 w-3.5" />
                    <span>{offer.discountBadge}</span>
                  </div>
                </Link>

                {/* Offer Details */}
                <div className="p-6 flex flex-col justify-between h-[210px]">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{offer.validity}</span>
                    </div>
                    <Link href={targetUrl} className="block">
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {offer.title}
                      </h3>
                    </Link>
                    <p className="mt-2 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/10">
                    {offer.code && (
                      <span className="text-[11px] font-mono text-neutral-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                        Use Code: <strong className="text-white">{offer.code}</strong>
                      </span>
                    )}
                    <Link
                      href={targetUrl}
                      className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <span>{offer.ctaText || 'Claim Offer'}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
