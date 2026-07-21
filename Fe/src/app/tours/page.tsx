'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './tours.module.css';
import { getPackages } from '@/lib/api';
import TourCard from '@/components/TourCard';

function ToursListContent() {
  const searchParams = useSearchParams();
  
  const [toursData, setToursData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPackages().then(data => {
      setToursData(data);
      setIsLoading(false);
    });
  }, []);
  
  // State variables for filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlBudget = searchParams.get('budget') || '';
    
    if (urlSearch) setSearch(urlSearch);
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlBudget) setSelectedBudget(urlBudget);
  }, [searchParams]);

  // Handle clearing all filters
  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBudget('');
    setSelectedDuration('');
    setSelectedRating('');
  };

  // Filtering Logic
  const filteredTours = toursData.filter((tour) => {
    // 1. Keyword search (title, destination, or description)
    if (search) {
      const query = search.toLowerCase();
      const matchTitle = tour.title.toLowerCase().includes(query);
      const matchDest = tour.destination.toLowerCase().includes(query);
      const matchDesc = tour.description.toLowerCase().includes(query);
      if (!matchTitle && !matchDest && !matchDesc) return false;
    }

    // 2. Category filter
    if (selectedCategory && tour.category !== selectedCategory) {
      return false;
    }

    // 3. Budget filter
    if (selectedBudget) {
      const maxBudget = parseInt(selectedBudget, 10);
      if (tour.price > maxBudget) return false;
    }

    // 4. Duration filter
    if (selectedDuration) {
      const days = tour.durationDays;
      if (selectedDuration === 'short' && days > 5) return false; // 1-5 Days
      if (selectedDuration === 'long' && days <= 5) return false; // 6+ Days
    }

    // 5. Rating filter
    if (selectedRating) {
      const minRating = parseFloat(selectedRating);
      if (tour.rating < minRating) return false;
    }

    return true;
  });

  return (
    <div className={`${styles.layout} container`}>
      {/* Filters Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>
          <span>Filters</span>
          {(search || selectedCategory || selectedBudget || selectedDuration || selectedRating) && (
            <button className={styles.clearAllBtn} onClick={handleClearFilters}>
              Reset
            </button>
          )}
        </div>

        {/* 1. Keyword Search */}
        <div className={styles.filterBlock}>
          <label className={styles.filterLabel}>Search Keywords</label>
          <div className={styles.searchInputWrapper}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="e.g. Kyoto, Alps..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* 2. Category Select */}
        <div className={styles.filterBlock}>
          <label className={styles.filterLabel}>Travel Theme</label>
          <div className={styles.optionsList}>
            {['Adventure', 'Culture', 'Leisure', 'Nature', 'History'].map((cat) => (
              <label key={cat} className={styles.optionItem}>
                <input
                  type="radio"
                  name="category"
                  className={styles.radioInput}
                  checked={selectedCategory === cat}
                  onChange={() => setSelectedCategory(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
            <label className={styles.optionItem}>
              <input
                type="radio"
                name="category"
                className={styles.radioInput}
                checked={selectedCategory === ''}
                onChange={() => setSelectedCategory('')}
              />
              <span>All Categories</span>
            </label>
          </div>
        </div>

        {/* 3. Budget Filter */}
        <div className={styles.filterBlock}>
          <label className={styles.filterLabel}>Max Budget</label>
          <div className={styles.optionsList}>
            {[
              { label: 'Under ₹1,500', value: '1500' },
              { label: 'Under ₹2,000', value: '2000' },
              { label: 'Under ₹2,500', value: '2500' },
            ].map((budgetOption) => (
              <label key={budgetOption.value} className={styles.optionItem}>
                <input
                  type="radio"
                  name="budget"
                  className={styles.radioInput}
                  checked={selectedBudget === budgetOption.value}
                  onChange={() => setSelectedBudget(budgetOption.value)}
                />
                <span>{budgetOption.label}</span>
              </label>
            ))}
            <label className={styles.optionItem}>
              <input
                type="radio"
                name="budget"
                className={styles.radioInput}
                checked={selectedBudget === ''}
                onChange={() => setSelectedBudget('')}
              />
              <span>Any Budget</span>
            </label>
          </div>
        </div>

        {/* 4. Duration Filter */}
        <div className={styles.filterBlock}>
          <label className={styles.filterLabel}>Duration</label>
          <div className={styles.optionsList}>
            <label className={styles.optionItem}>
              <input
                type="radio"
                name="duration"
                className={styles.radioInput}
                checked={selectedDuration === 'short'}
                onChange={() => setSelectedDuration('short')}
              />
              <span>Short (1-5 Days)</span>
            </label>
            <label className={styles.optionItem}>
              <input
                type="radio"
                name="duration"
                className={styles.radioInput}
                checked={selectedDuration === 'long'}
                onChange={() => setSelectedDuration('long')}
              />
              <span>Long (6+ Days)</span>
            </label>
            <label className={styles.optionItem}>
              <input
                type="radio"
                name="duration"
                className={styles.radioInput}
                checked={selectedDuration === ''}
                onChange={() => setSelectedDuration('')}
              />
              <span>Any Duration</span>
            </label>
          </div>
        </div>

        {/* 5. Rating Filter */}
        <div className={styles.filterBlock}>
          <label className={styles.filterLabel}>Min Rating</label>
          <div className={styles.optionsList}>
            {[
              { label: '★ 4.9 & Above', value: '4.9' },
              { label: '★ 4.8 & Above', value: '4.8' },
            ].map((ratingOption) => (
              <label key={ratingOption.value} className={styles.optionItem}>
                <input
                  type="radio"
                  name="rating"
                  className={styles.radioInput}
                  checked={selectedRating === ratingOption.value}
                  onChange={() => setSelectedRating(ratingOption.value)}
                />
                <span>{ratingOption.label}</span>
              </label>
            ))}
            <label className={styles.optionItem}>
              <input
                type="radio"
                name="rating"
                className={styles.radioInput}
                checked={selectedRating === ''}
                onChange={() => setSelectedRating('')}
              />
              <span>Any Rating</span>
            </label>
          </div>
        </div>
      </aside>

      {/* Tours Grid Side */}
      <div className={styles.content}>
        {/* Listing Stats */}
        <div className={styles.resultsMeta}>
          <span className={styles.resultsCount}>
            Found <strong>{filteredTours.length}</strong> {filteredTours.length === 1 ? 'tour' : 'tours'} matching your search
          </span>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-secondary-navy)' }}>
            <h2>Loading packages...</h2>
          </div>
        ) : filteredTours.length > 0 ? (
          <div className={styles.grid}>
            {filteredTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className={styles.noResultsTitle}>No Tour Packages Found</h3>
            <p className={styles.noResultsText}>
              We couldn't find any tour packages matching your active filters. Try adjusting your search query, increasing your budget, or clearing your filters.
            </p>
            <button className="btn btn-primary" onClick={handleClearFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ToursPage() {
  return (
    <div>
      {/* Header Banner */}
      <section className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.pageTitle}>Explore Destination Packages</h1>
          <p className={styles.pageSubtitle}>
            Find the perfect itinerary tailored to your travel preference and budget limits.
          </p>
        </div>
      </section>

      {/* Main Tours Grid with Suspense */}
      <Suspense fallback={
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', fontWeight: 600 }}>
            Loading tour packages...
          </p>
        </div>
      }>
        <ToursListContent />
      </Suspense>
    </div>
  );
}
