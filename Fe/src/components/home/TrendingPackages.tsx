'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Sparkles, ArrowRight, Star, Heart } from 'lucide-react';
import ResolvedImage from '@/components/ResolvedImage';
import { formatPrice } from '@/lib/api';

interface PackageItem {
  id: string;
  name: string;
  destinationName?: string;
  location?: string;
  duration?: string;
  nightsDays?: string;
  citiesCovered?: string;
  price?: number;
  startingPrice?: string;
  bannerImage?: string;
  image?: string;
  badge?: string;
  offerBadge?: string;
  holidayCategory?: string;
  category?: string;
  slug?: string;
}

interface TrendingPackagesProps {
  packages: PackageItem[];
  adminDescription?: string;
}

export const TrendingPackages: React.FC<TrendingPackagesProps> = ({
  packages,
  adminDescription = 'Explore our handpicked collection of luxury holiday itineraries across top global and Indian destinations.',
}) => {
  const [activeTab, setActiveTab] = useState<string>('International');

  const tabs = ['International', 'Domestic', 'Kerala', 'Honeymoon', 'Family', 'Group Tours'];

  // Filter packages by active category
  const filteredPackages = packages.filter((pkg) => {
    if (!pkg) return false;
    const catRaw = pkg.holidayCategory || pkg.category || '';
    const cat = Array.isArray(catRaw) ? catRaw.join(' ').toLowerCase() : String(catRaw).toLowerCase();
    const dest = String(pkg.destinationName || pkg.location || '').toLowerCase();
    const name = String(pkg.name || '').toLowerCase();
    
    if (activeTab === 'International') {
      return cat.includes('international') || dest.includes('europe') || dest.includes('bali') || dest.includes('maldives') || dest.includes('dubai') || dest.includes('thailand') || dest.includes('singapore');
    }
    if (activeTab === 'Domestic') {
      return cat.includes('domestic') || dest.includes('kerala') || dest.includes('kashmir') || dest.includes('rajasthan') || dest.includes('goa') || dest.includes('himachal');
    }
    if (activeTab === 'Kerala') {
      return dest.includes('kerala') || name.includes('kerala') || cat.includes('kerala');
    }
    if (activeTab === 'Honeymoon') {
      return cat.includes('honeymoon') || name.includes('honeymoon') || name.includes('romantic');
    }
    if (activeTab === 'Family') {
      return cat.includes('family') || name.includes('family');
    }
    if (activeTab === 'Group Tours') {
      return cat.includes('group') || name.includes('group');
    }
    return true;
  });

  const displayList = filteredPackages.length > 0 ? filteredPackages.slice(0, 6) : packages.slice(0, 6);

  return (
    <section className="bg-slate-50 py-20 text-slate-900 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">
            DISCOVER EXTRAORDINARY JOURNEYS
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
            Trending Holiday Packages
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            {adminDescription}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mt-10 flex overflow-x-auto justify-center gap-2 pb-4 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-6 py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Package Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {displayList.map((item, idx) => {
              const imgUrl = item.bannerImage || item.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
              const priceText = formatPrice(item.startingPrice || item.price || 24999);
              const durationText = item.duration || item.nightsDays || '5 Nights / 6 Days';
              const locationText = item.destinationName || item.location || 'Exotic Destination';
              const citiesText = item.citiesCovered || 'Multiple Scenic Destinations';
              const badgeText = item.offerBadge || item.badge || 'Featured Special';

              return (
                <motion.div
                  key={item.id || idx}
                  whileHover={{ y: -8 }}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-lg transition-all duration-500 hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-600/10"
                >
                  {/* Image Container */}
                  <div className="relative h-64 w-full overflow-hidden">
                    <ResolvedImage
                      src={imgUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    {/* Offer Badge */}
                    <div className="absolute top-4 left-4 rounded-full bg-red-600 px-3.5 py-1 text-xs font-bold text-white shadow-md">
                      {badgeText}
                    </div>

                    {/* Wishlist Button */}
                    <button className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-red-600 hover:scale-110">
                      <Heart className="h-4 w-4" />
                    </button>

                    {/* Location Pill */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-amber-300 border border-white/10">
                      <MapPin className="h-3.5 w-3.5 text-red-500" />
                      <span>{locationText}</span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-teal-600" />
                        <span>{durationText}</span>
                      </div>
                      
                      <h3 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-xs text-slate-500 line-clamp-1">
                        <span className="font-semibold text-slate-700">Cities:</span> {citiesText}
                      </p>
                    </div>

                    {/* Price and CTA */}
                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <span className="block text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                          Starting From
                        </span>
                        <span className="text-xl font-extrabold text-slate-900">
                          {priceText}
                          <span className="text-xs font-normal text-slate-500"> / person</span>
                        </span>
                      </div>

                      <Link
                        href={`/tours/${item.slug || item.id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-300 hover:scale-105 group-hover:from-red-500 group-hover:to-rose-500"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/holidays"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-900 hover:text-white hover:scale-105"
          >
            <span>Explore All Holiday Packages</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
