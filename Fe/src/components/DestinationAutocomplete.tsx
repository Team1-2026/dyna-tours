'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Globe, 
  Search, 
  X, 
  Sparkles, 
  Check, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { api, getPackages, Destination } from '@/lib/api';

export interface DestinationSuggestion {
  id: string;
  name: string;
  type: 'domestic' | 'international';
  country?: string;
  state?: string;
  city?: string;
  parentName?: string;
  subtitle?: string;
  tag?: string;
  popular?: boolean;
}

// Built-in curated popular & comprehensive destination catalog
const FALLBACK_DESTINATIONS: DestinationSuggestion[] = [
  // Domestic Popular
  { id: 'kerala', name: 'Kerala', type: 'domestic', country: 'India', subtitle: "God's Own Country • Backwaters & Hills", tag: 'Popular', popular: true },
  { id: 'munnar', name: 'Munnar', type: 'domestic', country: 'India', state: 'Kerala', parentName: 'Kerala', subtitle: 'Munnar, Kerala • Tea Gardens & Mist', tag: 'Hill Station', popular: true },
  { id: 'kochi', name: 'Kochi', type: 'domestic', country: 'India', state: 'Kerala', parentName: 'Kerala', subtitle: 'Kochi, Kerala • Historic Port & Fort Kochi', tag: 'Culture', popular: true },
  { id: 'alleppey', name: 'Alleppey', type: 'domestic', country: 'India', state: 'Kerala', parentName: 'Kerala', subtitle: 'Alleppey, Kerala • Houseboats & Serene Backwaters', tag: 'Backwaters', popular: true },
  { id: 'wayanad', name: 'Wayanad', type: 'domestic', country: 'India', state: 'Kerala', parentName: 'Kerala', subtitle: 'Wayanad, Kerala • Waterfalls & Wildlife', tag: 'Nature', popular: true },
  { id: 'thekkady', name: 'Thekkady', type: 'domestic', country: 'India', state: 'Kerala', parentName: 'Kerala', subtitle: 'Thekkady, Kerala • Periyar Wildlife & Spices', tag: 'Wildlife', popular: false },
  { id: 'kovalam', name: 'Kovalam', type: 'domestic', country: 'India', state: 'Kerala', parentName: 'Kerala', subtitle: 'Kovalam, Kerala • Crescent Beaches & Lighthouse', tag: 'Beach', popular: false },
  { id: 'goa', name: 'Goa', type: 'domestic', country: 'India', subtitle: 'Sun, Sand & Coastal Culture', tag: 'Popular', popular: true },
  { id: 'kashmir', name: 'Kashmir', type: 'domestic', country: 'India', subtitle: 'Paradise on Earth • Gulmarg, Pahalgam, Srinagar', tag: 'Himalayas', popular: true },
  { id: 'himachal', name: 'Himachal Pradesh', type: 'domestic', country: 'India', subtitle: 'Manali, Shimla & Scenic Valleys', tag: 'Mountains', popular: true },
  { id: 'delhi', name: 'Delhi', type: 'domestic', country: 'India', subtitle: 'Historic Capital & Cultural Heritage', tag: 'Heritage', popular: false },
  { id: 'golden-triangle', name: 'Delhi - Agra - Jaipur', type: 'domestic', country: 'India', subtitle: 'The Iconic Golden Triangle Circuit', tag: 'Popular', popular: true },
  { id: 'rajasthan', name: 'Rajasthan', type: 'domestic', country: 'India', subtitle: 'Jaipur, Udaipur & Royal Palaces', tag: 'Heritage', popular: true },
  { id: 'tamil-nadu', name: 'Tamil Nadu', type: 'domestic', country: 'India', subtitle: 'Dravidian Temples, Ooty & Heritage', tag: 'Heritage', popular: false },
  { id: 'karnataka', name: 'Karnataka', type: 'domestic', country: 'India', subtitle: 'Coorg, Mysore & Western Ghats', tag: 'Nature', popular: false },
  { id: 'north-india', name: 'North India', type: 'domestic', country: 'India', subtitle: 'Heritage, Golden Temple & Himalayas', tag: 'Circuit', popular: false },

  // International Popular
  { id: 'dubai', name: 'Dubai', type: 'international', country: 'UAE', subtitle: 'Dubai, UAE • Futuristic Skyline & Luxury', tag: 'Popular', popular: true },
  { id: 'uae', name: 'UAE', type: 'international', country: 'UAE', subtitle: 'United Arab Emirates • Dubai & Abu Dhabi', tag: 'Luxury', popular: false },
  { id: 'thailand', name: 'Thailand', type: 'international', country: 'Thailand', subtitle: 'Tropical Beaches, Islands & Nightlife', tag: 'Popular', popular: true },
  { id: 'bangkok', name: 'Bangkok', type: 'international', country: 'Thailand', parentName: 'Thailand', subtitle: 'Bangkok, Thailand • Temples, Shopping & Street Food', tag: 'City', popular: true },
  { id: 'phuket', name: 'Phuket', type: 'international', country: 'Thailand', parentName: 'Thailand', subtitle: 'Phuket, Thailand • Exotic Islands & Beaches', tag: 'Island', popular: true },
  { id: 'krabi', name: 'Krabi', type: 'international', country: 'Thailand', parentName: 'Thailand', subtitle: 'Krabi, Thailand • Limestone Cliffs & Emerald Waters', tag: 'Beach', popular: false },
  { id: 'pattaya', name: 'Pattaya', type: 'international', country: 'Thailand', parentName: 'Thailand', subtitle: 'Pattaya, Thailand • Coastal Resort City', tag: 'Coastal', popular: false },
  { id: 'chiang-mai', name: 'Chiang Mai', type: 'international', country: 'Thailand', parentName: 'Thailand', subtitle: 'Chiang Mai, Thailand • Mountain Temples & Elephants', tag: 'Culture', popular: false },
  { id: 'singapore', name: 'Singapore', type: 'international', country: 'Singapore', subtitle: 'Marina Bay Sands, Sentosa & Gardens', tag: 'Popular', popular: true },
  { id: 'malaysia', name: 'Malaysia', type: 'international', country: 'Malaysia', subtitle: 'Kuala Lumpur, Penang & Rainforests', tag: 'Popular', popular: true },
  { id: 'bali', name: 'Bali', type: 'international', country: 'Indonesia', subtitle: 'Bali, Indonesia • Tropical Paradise & Rice Terraces', tag: 'Popular', popular: true },
  { id: 'maldives', name: 'Maldives', type: 'international', country: 'Maldives', subtitle: 'Private Islands & Overwater Luxury Villas', tag: 'Luxury', popular: true },
  { id: 'europe', name: 'Europe', type: 'international', country: 'Europe', subtitle: 'Switzerland, France, Italy & Grand Tours', tag: 'Popular', popular: true },
  { id: 'switzerland', name: 'Switzerland', type: 'international', country: 'Switzerland', subtitle: 'Swiss Alps, Zurich, Lucerne & Interlaken', tag: 'Scenic', popular: true },
  { id: 'bhutan', name: 'Bhutan', type: 'international', country: 'Bhutan', subtitle: 'Land of Thunder Dragon • Monasteries & Dzongs', tag: 'Culture', popular: false },
  { id: 'vietnam', name: 'Vietnam', type: 'international', country: 'Vietnam', subtitle: 'Ha Long Bay, Da Nang & Ancient Hoi An', tag: 'Trending', popular: true },
  { id: 'japan', name: 'Japan', type: 'international', country: 'Japan', subtitle: 'Tokyo, Kyoto, Mount Fuji & Cherry Blossoms', tag: 'Trending', popular: false },
];

export interface DestinationAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  onSelect?: (val: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  className?: string;
  icon?: React.ReactNode;
  id?: string;
  name?: string;
  required?: boolean;
  autoFocus?: boolean;
  filterType?: 'all' | 'domestic' | 'international';
}

export const DestinationAutocomplete: React.FC<DestinationAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Where to? (e.g. Europe, Bali)',
  style,
  className = '',
  icon,
  id,
  name,
  required = false,
  autoFocus = false,
  filterType = 'all',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState<'all' | 'domestic' | 'international'>(filterType);
  const [allDestinations, setAllDestinations] = useState<DestinationSuggestion[]>(FALLBACK_DESTINATIONS);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load live destinations from server
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [destList, pkgList] = await Promise.all([
          api.getDestinations().catch(() => []),
          getPackages().catch(() => []),
        ]);

        if (!isMounted) return;

        const mergedMap = new Map<string, DestinationSuggestion>();

        // 1. Add curated fallbacks
        FALLBACK_DESTINATIONS.forEach(d => {
          mergedMap.set(d.name.toLowerCase().trim(), d);
        });

        // Helper to check valid names
        const isValidName = (str?: string | null) => {
          if (!str) return false;
          const s = str.trim().toLowerCase();
          if (s.length < 2) return false;
          if (['dsfds', 'sdfsd', 'test', 'asdf'].includes(s)) return false;
          return true;
        };

        // 2. Add API Destinations
        if (Array.isArray(destList)) {
          destList.forEach((d: Destination) => {
            if (!isValidName(d.name)) return;
            const normName = d.name.trim();
            const key = normName.toLowerCase();
            const isIntl = d.type === 'international';

            if (!mergedMap.has(key)) {
              mergedMap.set(key, {
                id: d.id || key,
                name: normName,
                type: isIntl ? 'international' : 'domestic',
                country: d.country || (isIntl ? 'International' : 'India'),
                state: d.state || undefined,
                city: d.city || undefined,
                subtitle: d.country 
                  ? `${d.country} • ${isIntl ? 'International' : 'Domestic'}`
                  : (isIntl ? 'International Destination' : 'Domestic Destination, India'),
                tag: isIntl ? 'International' : 'Domestic',
                popular: d.show_on_home || false,
              });
            }

            // Sub-destinations
            if (Array.isArray(d.sub_destinations)) {
              d.sub_destinations.forEach(sub => {
                if (!isValidName(sub.name)) return;
                const subNorm = sub.name.trim();
                const subKey = subNorm.toLowerCase();
                if (!mergedMap.has(subKey)) {
                  mergedMap.set(subKey, {
                    id: sub.id || subKey,
                    name: subNorm,
                    type: isIntl ? 'international' : 'domestic',
                    parentName: normName,
                    country: sub.country || d.country || (isIntl ? 'International' : 'India'),
                    state: sub.state || d.state || undefined,
                    city: sub.city || subNorm,
                    subtitle: `${subNorm}, ${normName}${d.country ? ` • ${d.country}` : ''}`,
                    tag: normName,
                    popular: false,
                  });
                }
              });
            }
          });
        }

        // 3. Add Package Destinations
        if (Array.isArray(pkgList)) {
          pkgList.forEach((p: any) => {
            if (!isValidName(p.destination)) return;
            const destStr = p.destination.trim();
            const destKey = destStr.toLowerCase();
            if (!mergedMap.has(destKey)) {
              const isIntl = destKey.includes('bhutan') || destKey.includes('dubai') || destKey.includes('bali') || destKey.includes('europe');
              mergedMap.set(destKey, {
                id: p.id || destKey,
                name: destStr,
                type: isIntl ? 'international' : 'domestic',
                subtitle: p.title ? `Featured in "${p.title}"` : 'Holiday Destination',
                tag: 'Tour Package',
                popular: true,
              });
            }
          });
        }

        setAllDestinations(Array.from(mergedMap.values()));
      } catch (err) {
        console.warn('Destination autocomplete using fallback data:', err);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter destinations based on query & active tab
  const suggestions = useMemo(() => {
    const q = (value || '').trim().toLowerCase();

    let list = allDestinations;

    // Filter by tab if specified
    if (activeTab !== 'all') {
      list = list.filter(d => d.type === activeTab);
    }

    if (!q) {
      // Empty query: prioritize popular destinations
      const popular = list.filter(d => d.popular);
      const others = list.filter(d => !d.popular);
      return [...popular, ...others].slice(0, 10);
    }

    // Filter matching query
    const exactMatches: DestinationSuggestion[] = [];
    const prefixMatches: DestinationSuggestion[] = [];
    const containMatches: DestinationSuggestion[] = [];
    const subtitleMatches: DestinationSuggestion[] = [];

    list.forEach(item => {
      const nameLower = item.name.toLowerCase();
      const subLower = (item.subtitle || '').toLowerCase();
      const parentLower = (item.parentName || '').toLowerCase();
      const countryLower = (item.country || '').toLowerCase();

      if (nameLower === q) {
        exactMatches.push(item);
      } else if (nameLower.startsWith(q)) {
        prefixMatches.push(item);
      } else if (nameLower.includes(q)) {
        containMatches.push(item);
      } else if (parentLower.includes(q) || countryLower.includes(q) || subLower.includes(q)) {
        subtitleMatches.push(item);
      }
    });

    return [...exactMatches, ...prefixMatches, ...containMatches, ...subtitleMatches].slice(0, 12);
  }, [allDestinations, value, activeTab]);

  // Handle outside click to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-autocomplete-item]');
      const activeEl = items[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (destName: string) => {
    onChange(destName);
    if (onSelect) onSelect(destName);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex].name);
      } else if (suggestions.length === 1 && value.trim()) {
        e.preventDefault();
        handleSelect(suggestions[0].name);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;

    return (
      <>
        {text.slice(0, idx)}
        <span className="text-red-600 font-extrabold underline decoration-red-300">
          {text.slice(idx, idx + query.length)}
        </span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  const hasValue = Boolean(value && value.trim().length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Field with Left & Right Icons */}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          required={required}
          autoFocus={autoFocus}
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          style={style}
          className={`${className} ${hasValue ? 'pr-9' : ''}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />

        {/* Clear Button */}
        {hasValue && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
              inputRef.current?.focus();
              setIsOpen(true);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
            title="Clear destination"
            aria-label="Clear destination"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Floating Autocomplete Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 top-full mt-2 w-full min-w-[300px] sm:min-w-[340px] max-w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-[100] overflow-hidden backdrop-blur-md"
            style={{
              boxShadow: '0 20px 35px -5px rgba(15, 23, 42, 0.2), 0 8px 16px -6px rgba(15, 23, 42, 0.15)',
            }}
          >
            {/* Header & Category Filter Tabs */}
            <div className="bg-slate-50/80 px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Sparkles className="h-3.5 w-3.5 text-red-500" />
                <span>{!value.trim() ? 'Top Destinations' : 'Suggested Destinations'}</span>
              </div>

              {/* Tabs: All / Domestic / International */}
              <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    activeTab === 'all'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('domestic')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    activeTab === 'domestic'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  India
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('international')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    activeTab === 'international'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Global
                </button>
              </div>
            </div>

            {/* Suggestions List */}
            <div
              ref={listRef}
              role="listbox"
              className="max-h-[300px] overflow-y-auto divide-y divide-slate-100/80 overscroll-contain py-1"
            >
              {suggestions.length > 0 ? (
                suggestions.map((item, index) => {
                  const isHighlighted = highlightedIndex === index;
                  const isSelected = value.trim().toLowerCase() === item.name.toLowerCase();
                  const isIntl = item.type === 'international';

                  return (
                    <div
                      key={`${item.id}-${index}`}
                      data-autocomplete-item
                      role="option"
                      aria-selected={isSelected}
                      onMouseDown={(e) => {
                        // Use onMouseDown instead of onClick to prevent blur before click
                        e.preventDefault();
                        handleSelect(item.name);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`group flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-colors ${
                        isHighlighted
                          ? 'bg-rose-50/80 text-rose-950'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Icon badge */}
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${
                            isIntl
                              ? 'bg-blue-50 text-blue-600 border border-blue-200/60'
                              : 'bg-rose-50 text-red-600 border border-red-200/60'
                          }`}
                        >
                          {isIntl ? (
                            <Globe className="h-4 w-4" />
                          ) : (
                            <MapPin className="h-4 w-4" />
                          )}
                        </div>

                        {/* Name & Subtitle */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-slate-900 truncate">
                              {highlightMatch(item.name, value.trim())}
                            </span>
                            {item.tag && (
                              <span
                                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                                  isIntl
                                    ? 'bg-blue-100/70 text-blue-700'
                                    : 'bg-rose-100/70 text-rose-700'
                                }`}
                              >
                                {item.tag}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right indicator */}
                      <div className="flex-shrink-0 ml-2">
                        {isSelected ? (
                          <Check className="h-4 w-4 text-emerald-600 font-bold" />
                        ) : (
                          <ArrowRight
                            className={`h-3.5 w-3.5 text-slate-300 transition-transform ${
                              isHighlighted ? 'text-red-500 translate-x-0.5' : ''
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                /* No matching results fallback */
                <div className="p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                    <Search className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    No predefined destination for &ldquo;{value}&rdquo;
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    You can still search for holiday packages matching this name.
                  </p>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(value.trim());
                    }}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95"
                  >
                    <Search className="h-3 w-3" />
                    <span>Search for &ldquo;{value.trim()}&rdquo;</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Quick Suggestion Pills */}
            {!value.trim() && (
              <div className="bg-slate-50/90 px-3.5 py-2 border-t border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <Compass className="h-3 w-3" />
                  <span>Quick Picks</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Kerala', 'Munnar', 'Dubai', 'Thailand', 'Bali', 'Goa', 'Europe'].map((pick) => (
                    <button
                      key={pick}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(pick);
                      }}
                      className="text-xs bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-slate-200 rounded-full px-2.5 py-1 font-medium text-slate-700 transition-all active:scale-95 shadow-2xs"
                    >
                      {pick}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DestinationAutocomplete;
