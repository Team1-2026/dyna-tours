'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowRight, MapPin } from 'lucide-react';
import ResolvedImage from '@/components/ResolvedImage';

interface DestinationItem {
  id: string;
  name: string;
  type?: string | null;
  overview?: string | null;
  banner_image?: string | null;
  image?: string | null;
  packagesCount?: number;
}

interface PopularDestinationsProps {
  destinations: DestinationItem[];
  adminDescription?: string;
}

const dummyImagesByDestination: Record<string, string> = {
  'switzerland': 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80',
  'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
  'kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
  'kashmir': 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80',
  'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
  'rajasthan': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80',
  'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=80',
  'thailand': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1000&q=80',
  'maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=80',
  'europe': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
  'japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
  'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
  'vietnam': 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1000&q=80',
  'himachal': 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1000&q=80',
};

const fallbackPool = [
  'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=80',
];

const getDestinationImage = (item: DestinationItem, idx: number) => {
  const raw = item.banner_image || item.image;
  if (raw && !raw.startsWith('/images/')) {
    return raw;
  }
  const nameLower = (item.name || '').toLowerCase();
  for (const [key, val] of Object.entries(dummyImagesByDestination)) {
    if (nameLower.includes(key)) return val;
  }
  return fallbackPool[idx % fallbackPool.length];
};

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({
  destinations,
  adminDescription = 'Journey across breathtaking bucket-list destinations curated for unparalleled luxury and cultural discovery.',
}) => {
  const [activeTab, setActiveTab] = useState<'international' | 'domestic'>('international');
  const [showAll, setShowAll] = useState(false);

  const defaultDestinations: DestinationItem[] = [
    // International
    {
      id: 'switzerland',
      name: 'Switzerland & Alps',
      type: 'international',
      overview: 'Snow-capped peaks, scenic express trains, and crystal-clear mountain lakes.',
      banner_image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'bali',
      name: 'Bali & Indonesian Isles',
      type: 'international',
      overview: 'Tropical beach sanctuaries, terraced rice paddies, and ancient clifftop temples.',
      banner_image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'dubai',
      name: 'Dubai & Abu Dhabi',
      type: 'international',
      overview: 'Futuristic skylines, thrilling desert safaris, and World-class luxury shopping.',
      banner_image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'singapore',
      name: 'Singapore & Sentosa',
      type: 'international',
      overview: 'Gardens by the Bay, Marina Bay Sands skyline, and island resorts.',
      banner_image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'thailand',
      name: 'Thailand & Phuket',
      type: 'international',
      overview: 'Exotic island hopping, vibrant floating markets, and opulent golden temples.',
      banner_image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'maldives',
      name: 'Maldives Overwater Retreats',
      type: 'international',
      overview: 'Private overwater bungalows, turquoise lagoons, and pristine house reefs.',
      banner_image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'japan',
      name: 'Japan & Cherry Blossoms',
      type: 'international',
      overview: 'Historic Kyoto Shinto shrines, bullet trains, and Mount Fuji vistas.',
      banner_image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80',
    },
    // Domestic
    {
      id: 'kerala',
      name: 'Kerala Backwaters',
      type: 'domestic',
      overview: 'Serene luxury houseboats, misty Munnar tea hills, and pristine Kovalam beaches.',
      banner_image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'kashmir',
      name: 'Kashmir Valley',
      type: 'domestic',
      overview: 'Paradise on Earth with shikara rides on Dal Lake and snowy slopes of Gulmarg.',
      banner_image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'rajasthan',
      name: 'Rajasthan Heritage',
      type: 'domestic',
      overview: 'Royal palaces, desert sand dunes, and vibrant fortress cities of Jaipur & Udaipur.',
      banner_image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'goa',
      name: 'Goa Beaches & Forts',
      type: 'domestic',
      overview: 'Golden sands, Portuguese heritage architecture, and sunset river cruises.',
      banner_image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const sourceData = destinations && destinations.length >= 4 ? destinations : defaultDestinations;

  const filtered = sourceData.filter((d) => {
    if (!d.type) return true;
    return String(d.type).toLowerCase() === activeTab;
  });

  const displayList = filtered.length > 0 ? filtered : sourceData.filter((d) => String(d.type).toLowerCase() === activeTab);
  
  // 3 rows limit (6 items in alternating 2-col + 1-col asymmetric grid layout)
  const ROW_LIMIT = 6;
  const visibleList = showAll ? displayList : displayList.slice(0, ROW_LIMIT);
  const hasMore = displayList.length > ROW_LIMIT;

  return (
    <section className="bg-white py-24 text-slate-900 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal-600">
              EXPLORE INCREDIBLE DESTINATIONS
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
              Popular Destinations
            </h2>
            <p className="mt-3 text-sm text-slate-600 max-w-xl">
              {adminDescription}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center rounded-full border border-slate-200 bg-slate-100 p-1.5 self-start md:self-auto">
            <button
              onClick={() => { setActiveTab('international'); setShowAll(false); }}
              className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'international'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              International
            </button>
            <button
              onClick={() => { setActiveTab('domestic'); setShowAll(false); }}
              className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'domestic'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Domestic
            </button>
          </div>
        </div>

        {/* Mixed Masonry / Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (showAll ? '-all' : '-sliced')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[320px]"
          >
            {visibleList.map((item, idx) => {
              // Asymmetric masonry spans for 1st & 4th items
              const isLarge = idx % 5 === 0 || idx % 5 === 3;
              const colSpanClass = isLarge ? 'md:col-span-2' : 'md:col-span-1';
              const imgUrl = getDestinationImage(item, idx);

              return (
                <motion.div
                  key={item.id || idx}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className={`group relative overflow-hidden rounded-3xl border border-slate-200 ${colSpanClass} shadow-xl`}
                >
                  <ResolvedImage
                    src={imgUrl}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Multi Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Card Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-300 uppercase tracking-widest mb-1">
                      <MapPin className="h-3.5 w-3.5 text-red-500" />
                      <span>{item.type || activeTab}</span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </h3>

                    {item.overview && (
                      <p className="mt-2 text-xs text-neutral-200 line-clamp-2 max-w-lg leading-relaxed font-light">
                        {item.overview}
                      </p>
                    )}

                    <div className="mt-4">
                      <Link
                        href={`/destinations/${item.id}`}
                        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-5 py-2 text-xs font-bold text-white backdrop-blur-md transition-all group-hover:bg-white group-hover:text-black"
                      >
                        <span>Explore Destination</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* View All Button */}
        <div className="mt-12 flex items-center justify-center gap-4">
          {hasMore && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-600/30 transition-all hover:scale-105 hover:from-teal-500 hover:to-emerald-500 active:scale-95 cursor-pointer"
            >
              <span>{showAll ? 'Show Less Destinations' : 'View All Destinations'}</span>
              <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${showAll ? '-rotate-90' : ''}`} />
            </button>
          )}

          <Link
            href="/holidays"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
          >
            <span>Browse All Packages</span>
            <Compass className="h-4 w-4 text-teal-600" />
          </Link>
        </div>

      </div>
    </section>
  );
};
