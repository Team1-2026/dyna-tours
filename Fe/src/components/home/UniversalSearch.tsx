'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, Compass, Hotel, FileText, Ship, Users, Clock, DollarSign } from 'lucide-react';

export const UniversalSearch: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'holidays' | 'hotels' | 'visa' | 'cruise' | 'group'>('holidays');

  // Holidays Form State
  const [holidayDest, setHolidayDest] = useState('');
  const [holidayType, setHolidayType] = useState('');
  const [holidayDuration, setHolidayDuration] = useState('');
  const [holidayDate, setHolidayDate] = useState('');

  // Hotels Form State
  const [hotelDest, setHotelDest] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomType, setRoomType] = useState('');
  const [guests, setGuests] = useState('2 Guests');

  // Visa Form State
  const [visaCountry, setVisaCountry] = useState('');
  const [visaType, setVisaType] = useState('Tourist');
  const [nationality, setNationality] = useState('Indian');

  // Cruise Form State
  const [cruiseDest, setCruiseDest] = useState('');
  const [cruiseLine, setCruiseLine] = useState('');

  // Group Form State
  const [groupDest, setGroupDest] = useState('');
  const [deptMonth, setDeptMonth] = useState('');

  const handleHolidaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (holidayDest) params.append('search', holidayDest);
    if (holidayType) params.append('category', holidayType);
    if (holidayDuration) params.append('duration', holidayDuration);
    if (holidayDate) params.append('date', holidayDate);
    router.push(`/holidays?${params.toString()}`);
  };

  const handleHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (hotelDest) params.append('search', hotelDest);
    if (checkIn) params.append('checkin', checkIn);
    if (checkOut) params.append('checkout', checkOut);
    if (roomType) params.append('type', roomType);
    if (guests) params.append('guests', guests);
    router.push(`/hotels?${params.toString()}`);
  };

  const handleVisaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (visaCountry) params.append('country', visaCountry);
    if (visaType) params.append('type', visaType);
    router.push(`/visa?${params.toString()}`);
  };

  const handleCruiseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (cruiseDest) params.append('destination', cruiseDest);
    if (cruiseLine) params.append('line', cruiseLine);
    router.push(`/cruise?${params.toString()}`);
  };

  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (groupDest) params.append('destination', groupDest);
    if (deptMonth) params.append('month', deptMonth);
    router.push(`/group-tours?${params.toString()}`);
  };

  const tabs = [
    { id: 'holidays', label: 'Holidays', icon: Compass },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'visa', label: 'Visa Services', icon: FileText },
    { id: 'cruise', label: 'Cruises', icon: Ship },
    { id: 'group', label: 'Group Tours', icon: Users },
  ] as const;

  return (
    <div className="relative z-30 mx-auto max-w-6xl px-4 sm:px-6 -mt-20 sm:-mt-24 pb-12">
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-100 pb-4 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-lg shadow-red-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Forms Container */}
        <div className="pt-6">
          <AnimatePresence mode="wait">
            
            {/* 1. Holiday Search Form */}
            {activeTab === 'holidays' && (
              <motion.form
                key="holidays"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleHolidaySubmit}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                    <input
                      type="text"
                      placeholder="Where to? (e.g. Europe, Bali)"
                      value={holidayDest}
                      onChange={(e) => setHolidayDest(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Holiday Type
                  </label>
                  <select
                    value={holidayType}
                    onChange={(e) => setHolidayType(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-800/70 py-3 px-3 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="">All Themes</option>
                    <option value="Honeymoon">Honeymoon</option>
                    <option value="Family">Family Package</option>
                    <option value="Adventure">Adventure & Trekking</option>
                    <option value="Luxury">Luxury Resort</option>
                    <option value="Pilgrimage">Pilgrimage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <select
                    value={holidayDuration}
                    onChange={(e) => setHolidayDuration(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-800/70 py-3 px-3 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="">Any Duration</option>
                    <option value="1-3">1 - 3 Days</option>
                    <option value="4-7">4 - 7 Days</option>
                    <option value="8-12">8 - 12 Days</option>
                    <option value="13+">13+ Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Travel Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
                    <input
                      type="date"
                      value={holidayDate}
                      onChange={(e) => setHolidayDate(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-800/70 py-3 pl-10 pr-3 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] hover:from-red-500 hover:to-rose-500 active:scale-95"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search Holidays</span>
                  </button>
                </div>
              </motion.form>
            )}

            {/* 2. Hotel Search Form */}
            {activeTab === 'hotels' && (
              <motion.form
                key="hotels"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleHotelSubmit}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 items-end"
              >
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Destination / Hotel Name
                  </label>
                  <div className="relative">
                    <Hotel className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-400" />
                    <input
                      type="text"
                      placeholder="City or Hotel Name"
                      value={hotelDest}
                      onChange={(e) => setHotelDest(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-neutral-800/70 py-3 pl-10 pr-3 text-sm text-white placeholder-neutral-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Check-In
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-800/70 py-3 px-3 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Check-Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-800/70 py-3 px-3 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Guests & Rooms
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-800/70 py-3 px-3 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="1 Guest">1 Guest, 1 Room</option>
                    <option value="2 Guests">2 Guests, 1 Room</option>
                    <option value="3 Guests">3 Guests, 1 Room</option>
                    <option value="4+ Guests">4+ Guests / Family Suite</option>
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/30 transition-all hover:scale-[1.02] hover:bg-teal-500 active:scale-95"
                  >
                    <Search className="h-4 w-4" />
                    <span>Find Hotels</span>
                  </button>
                </div>
              </motion.form>
            )}

            {/* 3. Visa Search Form */}
            {activeTab === 'visa' && (
              <motion.form
                key="visa"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleVisaSubmit}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Destination Country
                  </label>
                  <select
                    value={visaCountry}
                    onChange={(e) => setVisaCountry(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-800/70 py-3 px-3 text-sm text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="">Select Destination Country</option>
                    <option value="UAE">United Arab Emirates (UAE)</option>
                    <option value="Schengen">Schengen Countries (Europe)</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Japan">Japan</option>
                    <option value="USA">United States</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Visa Type
                  </label>
                  <select
                    value={visaType}
                    onChange={(e) => setVisaType(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-800/70 py-3 px-3 text-sm text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Tourist">Tourist Visa</option>
                    <option value="Business">Business Visa</option>
                    <option value="Express">Express eVisa</option>
                    <option value="Transit">Transit Visa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Passport Nationality
                  </label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-800/70 py-3 px-3 text-sm text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:scale-[1.02] hover:from-amber-400 hover:to-orange-500 active:scale-95"
                  >
                    <Search className="h-4 w-4" />
                    <span>Check Visa Requirements</span>
                  </button>
                </div>
              </motion.form>
            )}

            {/* 4. Cruise Search Form */}
            {activeTab === 'cruise' && (
              <motion.form
                key="cruise"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleCruiseSubmit}
                className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Cruise Destination
                  </label>
                  <select
                    value={cruiseDest}
                    onChange={(e) => setCruiseDest(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-800/70 py-3 px-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All Regions</option>
                    <option value="Singapore">Singapore & Southeast Asia</option>
                    <option value="Mediterranean">Mediterranean & Europe</option>
                    <option value="Caribbean">Caribbean Islands</option>
                    <option value="Middle East">Dubai & Arabian Gulf</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Cruise Line
                  </label>
                  <select
                    value={cruiseLine}
                    onChange={(e) => setCruiseLine(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-800/70 py-3 px-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All Cruise Lines</option>
                    <option value="Royal Caribbean">Royal Caribbean</option>
                    <option value="Costa Cruises">Costa Cruises</option>
                    <option value="MSC Cruises">MSC Cruises</option>
                    <option value="Cordelia Cruises">Cordelia Cruises (India)</option>
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] hover:bg-blue-500 active:scale-95"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search Cruises</span>
                  </button>
                </div>
              </motion.form>
            )}

            {/* 5. Group Tour Search Form */}
            {activeTab === 'group' && (
              <motion.form
                key="group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleGroupSubmit}
                className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Group Tour Destination
                  </label>
                  <input
                    type="text"
                    placeholder="Destination (e.g. Europe, Kashmir)"
                    value={groupDest}
                    onChange={(e) => setGroupDest(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-800/70 py-3 px-3 text-sm text-white placeholder-neutral-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Departure Month
                  </label>
                  <select
                    value={deptMonth}
                    onChange={(e) => setDeptMonth(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-neutral-800/70 py-3 px-3 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">Any Month</option>
                    <option value="August 2026">August 2026</option>
                    <option value="September 2026">September 2026</option>
                    <option value="October 2026">October 2026 (Diwali)</option>
                    <option value="December 2026">December 2026 (New Year)</option>
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] hover:bg-emerald-500 active:scale-95"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search Group Tours</span>
                  </button>
                </div>
              </motion.form>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
