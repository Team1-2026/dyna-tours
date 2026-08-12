'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MapPin, Hotel, ArrowRight } from 'lucide-react';
import ResolvedImage from '@/components/ResolvedImage';
import { formatPrice } from '@/lib/api';
import { Hotel as HotelType } from '@/lib/api';

interface FeaturedHotelsSectionProps {
  hotels: HotelType[];
}

export const FeaturedHotelsSection: React.FC<FeaturedHotelsSectionProps> = ({ hotels }) => {
  const [activeTab, setActiveTab] = useState<string>('All');

  const tabs = ['All', '5-Star', '4-Star', '3-Star'];

  const defaultHotels = [
    {
      id: 'h1',
      name: 'The Leela Palace Udaipur',
      city: 'Udaipur, Rajasthan',
      star_rating: 5,
      starting_price: 32000,
      banner_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      category: '5-Star',
    },
    {
      id: 'h2',
      name: 'Soneva Fushi Maldives',
      city: 'Baa Atoll, Maldives',
      star_rating: 5,
      starting_price: 85000,
      banner_image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      category: '5-Star',
    },
    {
      id: 'h3',
      name: 'Kumarakom Lake Resort',
      city: 'Kumarakom, Kerala',
      star_rating: 4,
      starting_price: 24000,
      banner_image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      category: '4-Star',
    },
    {
      id: 'h4',
      name: 'Taj Exotica Resort & Spa Goa',
      city: 'Benaulim, Goa',
      star_rating: 5,
      starting_price: 28000,
      banner_image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      category: '5-Star',
    },
    {
      id: 'h5',
      name: 'Grand Hyatt Kochi',
      city: 'Kochi, Kerala',
      star_rating: 4,
      starting_price: 18500,
      banner_image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      category: '4-Star',
    },
    {
      id: 'h6',
      name: 'Spice Tree Resort Munnar',
      city: 'Munnar, Kerala',
      star_rating: 3,
      starting_price: 11500,
      banner_image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      category: '3-Star',
    },
  ];

  const getHotelStarRating = (hotel: any): number => {
    if (hotel.star_rating !== undefined && hotel.star_rating !== null) {
      const parsed = parseInt(String(hotel.star_rating), 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    if (hotel.rating !== undefined && hotel.rating !== null) {
      const parsed = parseInt(String(hotel.rating), 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    if (hotel.stars !== undefined && hotel.stars !== null) {
      const parsed = parseInt(String(hotel.stars), 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    if (hotel.category && typeof hotel.category === 'string') {
      const match = hotel.category.match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    return 5;
  };

  const combinedHotels = [...(hotels || [])];
  defaultHotels.forEach((defHotel) => {
    if (!combinedHotels.some((h: any) => (h.name && h.name.toLowerCase() === defHotel.name.toLowerCase()) || h.id === defHotel.id)) {
      combinedHotels.push(defHotel as any);
    }
  });

  const sourceHotels = combinedHotels.length > 0 ? combinedHotels : (defaultHotels as any);

  const filteredHotels = sourceHotels.filter((hotel: any) => {
    if (activeTab === 'All') return true;
    const rating = getHotelStarRating(hotel);
    if (activeTab === '5-Star' || activeTab === '5 Star') return rating === 5;
    if (activeTab === '4-Star' || activeTab === '4 Star') return rating === 4;
    if (activeTab === '3-Star' || activeTab === '3 Star') return rating === 3;
    return true;
  });

  const displayHotels = filteredHotels;

  return (
    <section className="bg-slate-50 py-20 text-slate-900 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
              STAY COMFORTABLY
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
              Featured Luxury Hotels & Resorts
            </h2>
          </div>

          {/* Star Rating Tabs */}
          <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Hotel Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {displayHotels.slice(0, 4).map((hotel: any, idx: number) => {
              const imgUrl = hotel.banner_image || hotel.main_image || hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
              const price = hotel.starting_price || hotel.price || 18500;
              const rating = getHotelStarRating(hotel);
              const location = hotel.city || hotel.location || 'Luxury Destination';

              return (
                <motion.div
                  key={hotel.id || idx}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-60 w-full overflow-hidden">
                    <ResolvedImage
                      src={imgUrl}
                      alt={hotel.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    {/* Rating Tag */}
                    <div className="absolute top-4 left-4 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-amber-400 border border-white/10">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                      <span>{rating} Star</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-red-500" />
                        <span>{location}</span>
                      </div>

                      <h3 className="mt-2 text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                        {hotel.name}
                      </h3>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <span className="block text-[10px] uppercase font-semibold text-slate-500">Per Night</span>
                        <span className="text-lg font-extrabold text-slate-900">{formatPrice(price)}</span>
                      </div>

                      <Link
                        href={`/hotels/${hotel.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-black shadow-md transition-all hover:bg-amber-300 group-hover:scale-105"
                      >
                        <span>Book Now</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
