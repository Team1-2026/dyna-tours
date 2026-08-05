'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Compass, 
  Hotel, 
  FileText, 
  Ship, 
  Users, 
  Clock, 
  ChevronDown,
  Globe,
  Tag
} from 'lucide-react';

const fieldStyle: React.CSSProperties = {
  height: '44px',
  minHeight: '44px',
  maxHeight: '44px',
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: '0.75rem',
  border: '1px solid #cbd5e1',
  backgroundColor: '#ffffff',
  color: '#0f172a',
  fontSize: '0.875rem',
  fontWeight: 600,
  paddingLeft: '2.5rem',
  paddingRight: '2.25rem',
  outline: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  appearance: 'none',
  margin: 0,
  cursor: 'pointer',
};

const inputStyle: React.CSSProperties = {
  ...fieldStyle,
  paddingRight: '1rem',
  cursor: 'text',
};

const dateStyle: React.CSSProperties = {
  ...fieldStyle,
  paddingRight: '0.75rem',
  cursor: 'pointer',
};

const optionStyle: React.CSSProperties = {
  color: '#0f172a',
  backgroundColor: '#ffffff',
  fontSize: '14px',
  fontWeight: 500,
  padding: '10px',
};

const buttonBaseStyle: React.CSSProperties = {
  height: '44px',
  minHeight: '44px',
  maxHeight: '44px',
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: '0.75rem',
  border: 'none',
  fontSize: '0.875rem',
  fontWeight: 700,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  color: '#ffffff',
  margin: 0,
};

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
    if (holidayDest.trim()) {
      params.append('destination', holidayDest.trim());
      params.append('search', holidayDest.trim());
    }
    if (holidayType) params.append('category', holidayType);
    if (holidayDuration) params.append('duration', holidayDuration);
    if (holidayDate) params.append('date', holidayDate);
    router.push(`/holidays?${params.toString()}`);
  };

  const handleHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (hotelDest.trim()) {
      params.append('destination', hotelDest.trim());
      params.append('search', hotelDest.trim());
    }
    if (checkIn) params.append('checkin', checkIn);
    if (checkOut) params.append('checkout', checkOut);
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
    if (groupDest.trim()) {
      params.append('destination', groupDest.trim());
      params.append('search', groupDest.trim());
    }
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
    <div className="relative z-30 mx-auto max-w-6xl px-4 sm:px-6 -mt-20 sm:-mt-24 pb-6 sm:pb-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-1.5 border-b border-slate-100 pb-3 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-red-600 to-rose-600 shadow-md shadow-red-600/30'
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
        <div className="pt-3.5">
          <AnimatePresence mode="wait">
            
            {/* 1. Holiday Search Form */}
            {activeTab === 'holidays' && (
              <motion.form
                key="holidays"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                onSubmit={handleHolidaySubmit}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 items-end"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500 z-10 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Where to? (e.g. Europe, Bali)"
                      value={holidayDest}
                      onChange={(e) => setHolidayDest(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Holiday Type
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                    <select
                      value={holidayType}
                      onChange={(e) => setHolidayType(e.target.value)}
                      style={fieldStyle}
                    >
                      <option value="" style={optionStyle}>All Themes</option>
                      <option value="Honeymoon" style={optionStyle}>Honeymoon</option>
                      <option value="Family" style={optionStyle}>Family Package</option>
                      <option value="Adventure" style={optionStyle}>Adventure & Trekking</option>
                      <option value="Luxury" style={optionStyle}>Luxury Resort</option>
                      <option value="Pilgrimage" style={optionStyle}>Pilgrimage</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                    <select
                      value={holidayDuration}
                      onChange={(e) => setHolidayDuration(e.target.value)}
                      style={fieldStyle}
                    >
                      <option value="" style={optionStyle}>Any Duration</option>
                      <option value="1-3" style={optionStyle}>1 - 3 Days</option>
                      <option value="4-7" style={optionStyle}>4 - 7 Days</option>
                      <option value="8-12" style={optionStyle}>8 - 12 Days</option>
                      <option value="13+" style={optionStyle}>13+ Days</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Travel Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                    <input
                      type="date"
                      value={holidayDate}
                      onChange={(e) => setHolidayDate(e.target.value)}
                      style={dateStyle}
                    />
                  </div>
                </div>

                <div>
                  <button 
                    type="submit" 
                    style={{ ...buttonBaseStyle, background: 'linear-gradient(to right, #dc2626, #e11d48)' }}
                    className="shadow-md shadow-red-600/20 hover:shadow-lg hover:shadow-red-600/30 transition-all active:scale-95"
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
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                onSubmit={handleHotelSubmit}
                className="grid grid-cols-1 gap-3 sm:gap-3.5 sm:grid-cols-2 lg:grid-cols-5 items-end"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Destination / Hotel Name
                  </label>
                  <div className="relative">
                    <Hotel className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600 z-10 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="City or Hotel Name"
                      value={hotelDest}
                      onChange={(e) => setHotelDest(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Check-In
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      style={dateStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Check-Out
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      style={dateStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Guests & Rooms
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      style={fieldStyle}
                    >
                      <option value="1 Guest" style={optionStyle}>1 Guest, 1 Room</option>
                      <option value="2 Guests" style={optionStyle}>2 Guests, 1 Room</option>
                      <option value="3 Guests" style={optionStyle}>3 Guests, 1 Room</option>
                      <option value="4+ Guests" style={optionStyle}>4+ Guests / Family Suite</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <button 
                    type="submit" 
                    style={{ ...buttonBaseStyle, background: '#0d9488' }}
                    className="shadow-md shadow-teal-600/20 hover:shadow-lg hover:shadow-teal-600/30 transition-all active:scale-95"
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
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                onSubmit={handleVisaSubmit}
                className="grid grid-cols-1 gap-3 sm:gap-3.5 sm:grid-cols-2 lg:grid-cols-4 items-end"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Destination Country
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500 z-10 pointer-events-none" />
                    <select
                      value={visaCountry}
                      onChange={(e) => setVisaCountry(e.target.value)}
                      style={fieldStyle}
                    >
                      <option value="" style={optionStyle}>Select Destination Country</option>
                      <option value="UAE" style={optionStyle}>United Arab Emirates (UAE)</option>
                      <option value="Schengen" style={optionStyle}>Schengen Countries (Europe)</option>
                      <option value="UK" style={optionStyle}>United Kingdom</option>
                      <option value="Singapore" style={optionStyle}>Singapore</option>
                      <option value="Thailand" style={optionStyle}>Thailand</option>
                      <option value="Japan" style={optionStyle}>Japan</option>
                      <option value="USA" style={optionStyle}>United States</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Visa Type
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                    <select
                      value={visaType}
                      onChange={(e) => setVisaType(e.target.value)}
                      style={fieldStyle}
                    >
                      <option value="Tourist" style={optionStyle}>Tourist Visa</option>
                      <option value="Business" style={optionStyle}>Business Visa</option>
                      <option value="Express" style={optionStyle}>Express eVisa</option>
                      <option value="Transit" style={optionStyle}>Transit Visa</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Passport Nationality
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Indian"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <button 
                    type="submit" 
                    style={{ ...buttonBaseStyle, background: 'linear-gradient(to right, #f59e0b, #ea580c)' }}
                    className="shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 transition-all active:scale-95"
                  >
                    <Search className="h-4 w-4" />
                    <span>Check Requirements</span>
                  </button>
                </div>
              </motion.form>
            )}

            {/* 4. Cruise Search Form */}
            {activeTab === 'cruise' && (
              <motion.form
                key="cruise"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                onSubmit={handleCruiseSubmit}
                className="grid grid-cols-1 gap-3 sm:gap-3.5 sm:grid-cols-3 items-end"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Cruise Destination
                  </label>
                  <div className="relative">
                    <Ship className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 z-10 pointer-events-none" />
                    <select
                      value={cruiseDest}
                      onChange={(e) => setCruiseDest(e.target.value)}
                      style={fieldStyle}
                    >
                      <option value="" style={optionStyle}>All Regions</option>
                      <option value="Singapore" style={optionStyle}>Singapore & Southeast Asia</option>
                      <option value="Mediterranean" style={optionStyle}>Mediterranean & Europe</option>
                      <option value="Caribbean" style={optionStyle}>Caribbean Islands</option>
                      <option value="Middle East" style={optionStyle}>Dubai & Arabian Gulf</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Cruise Line
                  </label>
                  <div className="relative">
                    <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                    <select
                      value={cruiseLine}
                      onChange={(e) => setCruiseLine(e.target.value)}
                      style={fieldStyle}
                    >
                      <option value="" style={optionStyle}>All Cruise Lines</option>
                      <option value="Royal Caribbean" style={optionStyle}>Royal Caribbean</option>
                      <option value="Costa Cruises" style={optionStyle}>Costa Cruises</option>
                      <option value="MSC Cruises" style={optionStyle}>MSC Cruises</option>
                      <option value="Cordelia Cruises" style={optionStyle}>Cordelia Cruises (India)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <button 
                    type="submit" 
                    style={{ ...buttonBaseStyle, background: '#2563eb' }}
                    className="shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all active:scale-95"
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
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                onSubmit={handleGroupSubmit}
                className="grid grid-cols-1 gap-3 sm:gap-3.5 sm:grid-cols-3 items-end"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Group Tour Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 z-10 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Destination (e.g. Europe, Kashmir)"
                      value={groupDest}
                      onChange={(e) => setGroupDest(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Departure Month
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                    <select
                      value={deptMonth}
                      onChange={(e) => setDeptMonth(e.target.value)}
                      style={fieldStyle}
                    >
                      <option value="" style={optionStyle}>Any Month</option>
                      <option value="August 2026" style={optionStyle}>August 2026</option>
                      <option value="September 2026" style={optionStyle}>September 2026</option>
                      <option value="October 2026" style={optionStyle}>October 2026 (Diwali)</option>
                      <option value="December 2026" style={optionStyle}>December 2026 (New Year)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <button 
                    type="submit" 
                    style={{ ...buttonBaseStyle, background: '#059669' }}
                    className="shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all active:scale-95"
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
