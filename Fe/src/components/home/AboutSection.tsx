'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Award, Smile, Globe, ThumbsUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { VideoModal } from './VideoModal';
import { StatCounter } from '@/data/homeData';

interface AboutSectionProps {
  stats: StatCounter[];
  title?: string;
  subtitle?: string;
  description1?: string;
  description2?: string;
  videoThumbnail?: string;
  youtubeUrl?: string;
  yearsExperience?: number;
}

const getStatIcon = (iconName: string) => {
  switch (iconName) {
    case 'Award': return Award;
    case 'Smile': return Smile;
    case 'Globe': return Globe;
    case 'ThumbsUp': return ThumbsUp;
    default: return Award;
  }
};

export const AboutSection: React.FC<AboutSectionProps> = ({
  stats,
  title = 'About Dyna Tours India',
  subtitle = 'EXCELLENCE IN TRAVEL SINCE 2010',
  description1 = 'Dyna Tours India is a premier luxury travel management company dedicated to curating extraordinary, customized international holidays, heritage domestic tours, express visas, and corporate travel experiences.',
  description2 = 'With a passionate team of travel architects, 24/7 global concierge support, and direct partnerships with world-class airlines and luxury resorts, we ensure every journey is effortless, unforgettable, and tailored to your exact desires.',
  videoThumbnail = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  yearsExperience = 16,
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <section className="bg-[#0C2745] py-24 text-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Side: Video Thumbnail with Circular Play Button */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl group">
                <div
                  className="h-[420px] sm:h-[500px] w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${videoThumbnail}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/30 to-transparent" />

                {/* Circular Play Button */}
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-600/90 text-white shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-115 hover:bg-red-500 group-hover:shadow-red-600/40"
                  aria-label="Play Brand Video"
                >
                  <Play className="h-8 w-8 fill-white ml-1" />
                </button>

                {/* Experience Badge */}
                <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-neutral-900/90 p-4 border border-white/10 backdrop-blur-md">
                  <span className="text-4xl font-extrabold text-amber-400">{yearsExperience}+</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300 leading-snug">
                    Years of Travel<br />Excellence
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Content & Animated Counter Stats */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 flex flex-col justify-center"
            >
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-red-500">
                {subtitle}
              </span>

              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl text-white leading-tight">
                {title}
              </h2>

              <p className="mt-4 text-base text-neutral-300 leading-relaxed font-light">
                {description1}
              </p>

              <p className="mt-3 text-sm text-neutral-400 leading-relaxed font-light">
                {description2}
              </p>

              {/* Highlights */}
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-medium text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  <span>Customized Itineraries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  <span>24/7 On-Trip Assistance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  <span>Best Price Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-400" />
                  <span>Handpicked Luxury Stays</span>
                </div>
              </div>

              {/* Counter Statistics Grid */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                {stats.map((stat) => {
                  const Icon = getStatIcon(stat.iconName);
                  return (
                    <motion.div
                      key={stat.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="text-center p-3 rounded-2xl bg-neutral-900/60 border border-white/5"
                    >
                      <Icon className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                      <div className="text-2xl font-extrabold text-white">
                        {stat.number}{stat.suffix}
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5 leading-tight">
                        {stat.label}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-red-600/30 transition-all hover:scale-105 hover:from-red-500 hover:to-rose-500"
                >
                  <span>Read More About Us</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

            </motion.div>

          </div>

        </div>
      </section>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={youtubeUrl}
      />
    </>
  );
};
