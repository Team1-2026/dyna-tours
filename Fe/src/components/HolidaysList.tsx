'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '@/app/holidays/holidays.module.css';
import { getPackages } from '@/lib/api';
import TourCard from '@/components/TourCard';

const HOLIDAY_CATEGORIES = [
  'All Packages',
  'Domestic Tour Packages',
  'International Tour Packages',
  'Kerala Tour Packages',
  'Honeymoon Tour Packages',
  'Day Excursions',
  'Luxury Tour Packages'
];

interface HolidaysListProps {
  initialCategory?: string;
}

export default function HolidaysList({ initialCategory }: HolidaysListProps) {
  const [tours, setTours] = useState<any[]>([]);

  useEffect(() => {
    getPackages().then(setTours);
  }, []);

  const searchParams = useSearchParams();
  
  // State variables for filters
  const [activeTab, setActiveTab] = useState(initialCategory || 'All Packages');
  const [searchDest, setSearchDest] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  // Initialize filters from URL parameters if no initial category is forced
  useEffect(() => {
    const urlDest = searchParams?.get('destination') || '';
    if (urlDest) setSearchDest(urlDest);
    // If the prop changed, update tab
    if (initialCategory) setActiveTab(initialCategory);
  }, [searchParams, initialCategory]);

  // Handle clearing all filters
  const handleClearFilters = () => {
    setSearchDest('');
    setSelectedTheme('');
    setSelectedDuration('');
    setSelectedBudget('');
    if (!initialCategory) {
      setActiveTab('All Packages');
    }
  };

  // Filtering Logic
  const filteredTours = tours.filter((tour) => {
    // 1. Tab Filter
    if (activeTab !== 'All Packages') {
      if (!tour.holidayCategory?.includes(activeTab)) {
        return false;
      }
    }

    // 2. Destination search
    if (searchDest) {
      const matchDest = tour.destination.toLowerCase().includes(searchDest.toLowerCase());
      if (!matchDest) return false;
    }

    // 3. Theme filter
    if (selectedTheme && tour.category !== selectedTheme) {
      return false;
    }

    // 4. Budget filter
    if (selectedBudget) {
      const maxBudget = parseInt(selectedBudget, 10);
      if (tour.price > maxBudget) return false;
    }

    // 5. Duration filter
    if (selectedDuration) {
      const days = tour.durationDays;
      if (selectedDuration === 'short' && days > 5) return false; 
      if (selectedDuration === 'long' && days <= 5) return false; 
    }

    return true;
  });

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Horizontal Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterInputs}>
          <div className={styles.filterGroup}>
            <label>Destination</label>
            <input 
              type="text" 
              placeholder="Where to?" 
              value={searchDest} 
              onChange={(e) => setSearchDest(e.target.value)}
              className={styles.filterInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label>Theme</label>
            <select 
              value={selectedTheme} 
              onChange={(e) => setSelectedTheme(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Any Theme</option>
              <option value="Adventure">Adventure</option>
              <option value="Culture">Culture</option>
              <option value="Leisure">Leisure</option>
              <option value="Nature">Nature</option>
              <option value="History">History</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Duration</label>
            <select 
              value={selectedDuration} 
              onChange={(e) => setSelectedDuration(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Any Duration</option>
              <option value="short">1 - 5 Days</option>
              <option value="long">6+ Days</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Budget</label>
            <select 
              value={selectedBudget} 
              onChange={(e) => setSelectedBudget(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Any Budget</option>
              <option value="1500">Under ₹1,500</option>
              <option value="2000">Under ₹2,000</option>
              <option value="5000">Under ₹5,000</option>
              <option value="30000">Under ₹30,000</option>
            </select>
          </div>
        </div>
        <div className={styles.filterActions}>
          <button className="btn btn-outline" onClick={handleClearFilters}>Reset</button>
        </div>
      </div>

      {/* Introduction Content */}
      <section style={{ padding: '2rem 0', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-manrope)' }}>
          Popular {activeTab === 'All Packages' ? 'Holiday Packages' : activeTab}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          Explore our handpicked holiday packages covering the most loved destinations. Whether you&apos;re planning a family vacation, honeymoon, adventure trip, or cultural getaway, find the perfect package for your next journey. Our experts have curated the best itineraries to ensure you have a memorable and hassle-free travel experience.
        </p>
      </section>

      {/* Category Tabs */}
      <div className={styles.categoryTabs}>
        {HOLIDAY_CATEGORIES.map(tab => (
          <button 
            key={tab} 
            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Results Meta */}
      <div className={styles.resultsMeta}>
        <span className={styles.resultsCount}>
          Found <strong>{filteredTours.length}</strong> packages
        </span>
      </div>

      {/* Listing Grid */}
      {filteredTours.length > 0 ? (
        <div className={styles.grid}>
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <h3 className={styles.noResultsTitle}>No Tour Packages Found</h3>
          <p className={styles.noResultsText}>
            We couldn&apos;t find any packages matching your filters. Try adjusting your search.
          </p>
          <button className="btn btn-primary" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
