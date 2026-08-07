'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileCheck, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { VisaCountryCard } from '@/data/homeData';
import { formatPrice } from '@/lib/api';

interface VisaServicesSectionProps {
  countries: VisaCountryCard[];
  adminDescription?: string;
}

export const getCountryFlagUrl = (countryName: string, code?: string): string => {
  const name = (countryName || '').toLowerCase();
  const c = (code || '').toLowerCase();

  if (c === 'ae' || name.includes('uae') || name.includes('united arab emirates') || name.includes('dubai')) return 'https://flagcdn.com/w160/ae.png';
  if (c === 'gb' || c === 'uk' || name.includes('uk') || name.includes('united kingdom') || name.includes('britain') || name.includes('england')) return 'https://flagcdn.com/w160/gb.png';
  if (c === 'sg' || name.includes('singapore')) return 'https://flagcdn.com/w160/sg.png';
  if (c === 'th' || name.includes('thailand')) return 'https://flagcdn.com/w160/th.png';
  if (c === 'my' || name.includes('malaysia')) return 'https://flagcdn.com/w160/my.png';
  if (c === 'eu' || name.includes('schengen') || name.includes('europe')) return 'https://flagcdn.com/w160/eu.png';
  if (c === 'jp' || name.includes('japan')) return 'https://flagcdn.com/w160/jp.png';
  if (c === 'us' || name.includes('usa') || name.includes('united states') || name.includes('america')) return 'https://flagcdn.com/w160/us.png';
  if (c === 'ca' || name.includes('canada')) return 'https://flagcdn.com/w160/ca.png';
  if (c === 'au' || name.includes('australia')) return 'https://flagcdn.com/w160/au.png';
  if (c === 'vn' || name.includes('vietnam')) return 'https://flagcdn.com/w160/vn.png';
  if (c === 'kh' || name.includes('cambodia')) return 'https://flagcdn.com/w160/kh.png';
  if (c === 'cn' || name.includes('china')) return 'https://flagcdn.com/w160/cn.png';
  if (c === 'kr' || name.includes('korea')) return 'https://flagcdn.com/w160/kr.png';
  if (c === 'id' || name.includes('indonesia') || name.includes('bali')) return 'https://flagcdn.com/w160/id.png';
  if (c === 'tr' || name.includes('turkey')) return 'https://flagcdn.com/w160/tr.png';
  if (c === 'eg' || name.includes('egypt')) return 'https://flagcdn.com/w160/eg.png';
  if (c === 'lk' || name.includes('sri lanka')) return 'https://flagcdn.com/w160/lk.png';
  if (c === 'mv' || name.includes('maldives')) return 'https://flagcdn.com/w160/mv.png';
  if (c === 'az' || name.includes('azerbaijan')) return 'https://flagcdn.com/w160/az.png';
  if (c === 'ge' || name.includes('georgia')) return 'https://flagcdn.com/w160/ge.png';

  if (c.length === 2 && c !== 'gl') {
    return `https://flagcdn.com/w160/${c}.png`;
  }

  return 'https://flagcdn.com/w160/un.png';
};

export const VisaServicesSection: React.FC<VisaServicesSectionProps> = ({
  countries,
  adminDescription = 'Hassle-free international visa processing with 99.4% approval rate and dedicated visa concierge.',
}) => {
  return (
    <section className="bg-white py-20 text-slate-900 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-red-600">
              <ShieldCheck className="h-4 w-4 text-red-600" />
              <span>TRAVEL WITHOUT WORRIES</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl text-[#0C2745]">
              Visa Services
            </h2>
            <p className="mt-3 text-sm text-slate-600 max-w-xl">
              {adminDescription}
            </p>
          </div>

          <Link
            href="/visa"
            className="inline-flex items-center gap-2 rounded-full border border-[#0C2745]/30 bg-blue-50/80 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#0C2745] backdrop-blur-md transition-all hover:bg-[#0C2745] hover:text-white shadow-sm"
          >
            <span>Explore more visa services</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Visa Countries Responsive Grid (Limited to 2 rows / 6 cards max) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.slice(0, 6).map((item, idx) => {
            const flagUrl = getCountryFlagUrl(item.country, item.code);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#0C2745]/20 bg-[#0C2745] p-6 text-white shadow-xl transition-all duration-300 hover:border-red-500/50 hover:shadow-2xl hover:shadow-[#0C2745]/20"
              >
                <div>
                  {/* Flag & Popular Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={flagUrl}
                        alt={`${item.country} flag`}
                        className="h-9 w-12 rounded-lg object-cover shadow-sm border border-white/20"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                          {item.country}
                        </h3>
                        <span className="text-xs font-medium text-slate-300">
                          {item.visaType}
                        </span>
                      </div>
                    </div>
                    {item.popular && (
                      <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold text-white shadow-md">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Info List */}
                  <div className="mt-6 space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="h-3.5 w-3.5 text-amber-400" />
                        Processing Time
                      </span>
                      <span className="font-semibold text-white">{item.processingTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        Documentation
                      </span>
                      <span className="font-semibold text-emerald-400">Assistance Included</span>
                    </div>
                  </div>
                </div>

                {/* Price & Apply Button */}
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <span className="block text-[10px] uppercase font-semibold text-slate-400">Starting From</span>
                    <span className="text-xl font-extrabold text-white">{formatPrice(item.startingPrice)}</span>
                  </div>

                  <Link
                    href={`/visa?country=${encodeURIComponent(item.country)}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/30 transition-all hover:from-red-500 hover:to-rose-500 group-hover:scale-105"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Explore More Visa Services Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/visa"
            className="inline-flex items-center gap-2 rounded-full bg-[#0C2745] px-8 py-3.5 text-sm font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:bg-red-600 hover:scale-105"
          >
            <span>Explore more visa services</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
