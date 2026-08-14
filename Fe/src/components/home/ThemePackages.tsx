'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Heart, Users, Crown, Palmtree, Landmark, Sun, Binoculars, Briefcase, ArrowRight, Globe, MapPin, Sparkles } from 'lucide-react';
import { TravelTheme } from '@/data/homeData';

interface ThemePackagesProps {
  themes: TravelTheme[];
  packages?: any[];
  adminDescription?: string;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Compass': return Compass;
    case 'Heart': return Heart;
    case 'Users': return Users;
    case 'Crown': return Crown;
    case 'Palmtree': return Palmtree;
    case 'Landmark': return Landmark;
    case 'Sun': return Sun;
    case 'Binoculars': return Binoculars;
    case 'Briefcase': return Briefcase;
    default: return Compass;
  }
};

type FilterCategory = 'all' | 'domestic' | 'international' | 'kerala' | 'honeymoon' | 'excursions' | 'luxury';

interface CategoryTab {
  id: FilterCategory;
  label: string;
  icon: React.ReactNode;
}

const categoryTabs: CategoryTab[] = [
  { id: 'all', label: 'All Packages', icon: <Globe className="w-4 h-4" /> },
  { id: 'domestic', label: 'Domestic', icon: <MapPin className="w-4 h-4" /> },
  { id: 'international', label: 'International', icon: <Globe className="w-4 h-4" /> },
  { id: 'kerala', label: 'Kerala', icon: <Palmtree className="w-4 h-4" /> },
  { id: 'honeymoon', label: 'Honeymoon', icon: <Heart className="w-4 h-4" /> },
  { id: 'excursions', label: 'Day Excursions', icon: <Sun className="w-4 h-4" /> },
  { id: 'luxury', label: 'Luxury', icon: <Crown className="w-4 h-4" /> },
];

export const ThemePackages: React.FC<ThemePackagesProps> = ({
  themes,
  adminDescription = 'Whether seeking romantic sanctuaries, thrilling mountain ascents, or corporate retreats, find your perfect theme curated for domestic and international destinations.',
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  // Filter themes based on selected category tab
  const filteredThemes = themes.filter((theme) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'domestic') {
      return theme.category === 'domestic' || theme.link.includes('domestic') || theme.name.toLowerCase().includes('domestic');
    }
    if (activeFilter === 'international') {
      return theme.category === 'international' || theme.link.includes('international') || theme.name.toLowerCase().includes('international');
    }
    if (activeFilter === 'kerala') {
      return theme.link.includes('kerala') || theme.name.toLowerCase().includes('kerala');
    }
    if (activeFilter === 'honeymoon') {
      return theme.link.includes('honeymoon') || theme.name.toLowerCase().includes('honeymoon');
    }
    if (activeFilter === 'excursions') {
      return theme.link.includes('excursions') || theme.name.toLowerCase().includes('excursion') || theme.name.toLowerCase().includes('day');
    }
    if (activeFilter === 'luxury') {
      return theme.link.includes('luxury') || theme.name.toLowerCase().includes('luxury');
    }
    return true;
  });

  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 py-20 text-slate-900 relative overflow-hidden">
      {/* Decorative Background Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Curated Experiences
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
            Explore Holiday Themes
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            {adminDescription}
          </p>
        </div>

        {/* Category Tabs Bar */}
        <div className="flex justify-center mb-12 px-2">
          <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-slate-200/70 backdrop-blur-md rounded-2xl border border-slate-300/80 max-w-5xl shadow-inner">
            {categoryTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              // Calculate matching count for tab badge
              const tabCount = themes.filter((t) => {
                if (tab.id === 'all') return true;
                if (tab.id === 'domestic') return t.category === 'domestic' || t.link.includes('domestic') || t.name.toLowerCase().includes('domestic');
                if (tab.id === 'international') return t.category === 'international' || t.link.includes('international') || t.name.toLowerCase().includes('international');
                if (tab.id === 'kerala') return t.link.includes('kerala') || t.name.toLowerCase().includes('kerala');
                if (tab.id === 'honeymoon') return t.link.includes('honeymoon') || t.name.toLowerCase().includes('honeymoon');
                if (tab.id === 'excursions') return t.link.includes('excursions') || t.name.toLowerCase().includes('excursion') || t.name.toLowerCase().includes('day');
                if (tab.id === 'luxury') return t.link.includes('luxury') || t.name.toLowerCase().includes('luxury');
                return true;
              }).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md shadow-red-600/30 scale-[1.02]'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-slate-500'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1 text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-300/70 text-slate-700'
                    }`}
                  >
                    {tabCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Themes Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          <AnimatePresence mode="popLayout">
            {filteredThemes.map((theme, idx) => {
              const Icon = getIconComponent(theme.iconName);
              const categoryBadgeText =
                theme.category === 'domestic'
                  ? '🇮🇳 Domestic'
                  : theme.category === 'international'
                  ? '🌍 International'
                  : '✨ Domestic & Intl';

              return (
                <motion.div
                  layout
                  key={theme.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-950 h-72 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {/* Background Image with Hover Scale */}
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${theme.image}')` }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/20" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                    
                    {/* Top Row: Category Tag & Count Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold text-white bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md shadow-sm">
                        {categoryBadgeText}
                      </span>
                      <span className="text-[11px] font-extrabold text-amber-300 bg-amber-950/80 px-3 py-1.5 rounded-full border border-amber-500/30 backdrop-blur-md">
                        {theme.count}+ Packages
                      </span>
                    </div>

                    {/* Middle Icon Badge */}
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-red-500 group-hover:to-rose-600 group-hover:text-white group-hover:scale-110 shadow-lg">
                      <Icon className="w-6 h-6" />
                    </div>

                    {/* Bottom Details */}
                    <div>
                      <h3 className="text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors drop-shadow-sm">
                        {theme.name}
                      </h3>

                      {theme.subtitle && (
                        <p className="mt-1 text-xs font-medium text-slate-300 line-clamp-1">
                          📍 {theme.subtitle}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-white/15">
                        {theme.startingPrice ? (
                          <span className="text-xs font-bold text-slate-200">
                            From <span className="text-amber-400 font-extrabold text-sm">{theme.startingPrice}</span>
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-300">Custom Curated</span>
                        )}

                        <Link
                          href={theme.link}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-xs font-extrabold text-white group-hover:bg-red-600 group-hover:text-white transition-all backdrop-blur-md"
                        >
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Explore All Link Button */}
        <div className="mt-14 text-center">
          <Link
            href="/holidays"
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 px-9 py-4 text-sm font-extrabold text-white shadow-xl transition-all duration-300 hover:from-red-600 hover:to-rose-700 hover:scale-105 hover:shadow-red-600/30"
          >
            <span>View All Holiday Packages & Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
