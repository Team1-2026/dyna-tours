'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, Heart, Users, Crown, Palmtree, Landmark, Sun, Binoculars, Briefcase, ArrowRight } from 'lucide-react';
import { TravelTheme } from '@/data/homeData';

interface ThemePackagesProps {
  themes: TravelTheme[];
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

export const ThemePackages: React.FC<ThemePackagesProps> = ({
  themes,
  adminDescription = 'Whether seeking romantic sanctuaries, thrilling mountain ascents, or corporate retreats, find your perfect theme.',
}) => {
  return (
    <section className="bg-slate-50 py-20 text-slate-900 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">
            TRAVEL YOUR WAY
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
            Explore Holiday Themes
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            {adminDescription}
          </p>
        </div>

        {/* Themes Grid (Limited to 2 rows / 6 cards max) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.slice(0, 6).map((theme, idx) => {
            const Icon = getIconComponent(theme.iconName);
            return (
              <motion.div
                key={theme.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 h-56 shadow-lg"
              >
                {/* Background Image */}
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${theme.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  {/* Top Pill Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-black/40 text-amber-400 backdrop-blur-md transition-all group-hover:bg-amber-400 group-hover:text-black">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-neutral-300 bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                      {theme.count}+ Packages
                    </span>
                  </div>

                  {/* Bottom Text & CTA */}
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {theme.name}
                    </h3>
                    <Link
                      href={theme.link}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-neutral-300 group-hover:text-white transition-colors"
                    >
                      <span>Explore Packages</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Explore All Holiday Themes Button */}
        <div className="mt-12 text-center">
          <Link
            href="/holidays"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-3.5 text-sm font-bold text-slate-900 shadow-sm transition-all hover:bg-slate-900 hover:text-white hover:scale-105"
          >
            <span>Explore All Holiday Themes</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
