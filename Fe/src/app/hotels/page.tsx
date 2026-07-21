'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, Hotel } from '@/lib/api';
import styles from './hotels.module.css';

export default function HotelsDirectoryPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  // Search filter states
  const [searchDestination, setSearchDestination] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchName, setSearchName] = useState('');
  const [expandedHotels, setExpandedHotels] = useState<string[]>([]);

  const toggleDescription = (id: string) => {
    setExpandedHotels(prev => 
      prev.includes(id) ? prev.filter(hId => hId !== id) : [...prev, id]
    );
  };

  const fetchHotelsList = (filters?: { destination_id?: string; category?: string; name?: string }) => {
    setLoading(true);
    api.getHotels(filters)
      .then(data => {
        setHotels(data);
      })
      .catch(err => {
        console.error('Failed to fetch hotels', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHotelsList();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const destId = searchDestination.trim().toLowerCase() === 'munnar' ? 'munnar' 
                 : searchDestination.trim().toLowerCase() === 'kerala' ? 'kerala'
                 : searchDestination.trim().toLowerCase() === 'thailand' ? 'thailand'
                 : searchDestination.trim().toLowerCase();

    fetchHotelsList({
      destination_id: destId,
      category: searchCategory,
      name: searchName,
    });
  };

  const handleResetFilters = () => {
    setSearchDestination('');
    setSearchCategory('');
    setSearchName('');
    fetchHotelsList();
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. Banner Image */}
      <div className={styles.bannerContainer}>
        <img 
          src="/images/maldives.png" 
          alt="Luxury Resort Banner" 
          className={styles.bannerImage}
        />
        <div className={styles.bannerOverlay} />
      </div>

      {/* 2. Page Intro Content Below the Banner */}
      <section className={styles.pageIntroSection}>
        <div className="container">
          <h1 className={styles.pageTitle}>Discover the Best Hotels for Your Perfect Vacation</h1>
          <p className={styles.pageSubtitle}>
            Browse our handpicked collection of luxury resorts, premium hotels, and scenic retreats designed for ultimate comfort.
          </p>
        </div>
      </section>

      <div className="container">
        {/* 2. Floating Search Section */}
        <section className={styles.searchPanel}>
          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Destination</label>
              <input 
                type="text" 
                placeholder="e.g. Munnar, Kerala..." 
                className={styles.searchInput}
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Hotel Category</label>
              <select 
                className={styles.searchSelect}
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="5-Star">⭐ 5-Star Luxury</option>
                <option value="4-Star">⭐ 4-Star Premium</option>
                <option value="Boutique">🏨 Boutique Hotel</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Hotel Name</label>
              <input 
                type="text" 
                placeholder="Search hotel name..." 
                className={styles.searchInput}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flexGrow: 1, height: '48px' }}>
                Search
              </button>
              {(searchDestination || searchCategory || searchName) && (
                <button 
                  type="button" 
                  onClick={handleResetFilters} 
                  className="btn btn-ghost" 
                  style={{ height: '48px', border: '1px solid var(--color-border)' }}
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </section>

        {/* 3. Listings */}
        <div className={styles.listingTitleWrap}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-secondary-navy)' }}>
            Popular Hotels for Your Vacation
          </h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Showing {hotels.length} luxury options available
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--color-text-secondary)' }}>Searching available hotels...</h3>
          </div>
        ) : hotels.length > 0 ? (
          <div className={styles.listingGrid}>
            {hotels.map((hotel) => (
              <div key={hotel.id} className={styles.hotelCard} style={{ background: '#ffffff' }}>
                <div style={{ position: 'relative', height: '220px' }}>
                  <img 
                    src={(typeof hotel.gallery?.[0] === 'string' ? hotel.gallery[0] : (hotel.gallery?.[0] as any)?.url) || '/images/default_hotel.png'} 
                    alt={hotel.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{ 
                    position: 'absolute', 
                    top: '1rem', 
                    left: '1rem', 
                    background: 'var(--color-secondary-navy)', 
                    color: '#ffffff', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: 'var(--radius-full)', 
                    fontSize: '0.75rem', 
                    fontWeight: 700 
                  }}>
                    {hotel.category}
                  </span>
                  {hotel.featured && (
                    <span style={{ 
                      position: 'absolute', 
                      top: '1rem', 
                      right: '1rem', 
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                      color: '#ffffff', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: 'var(--radius-full)', 
                      fontSize: '0.725rem', 
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style={{ color: '#ffffff' }}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      Featured
                    </span>
                  )}
                </div>
                <div style={{ padding: '1.75rem' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-secondary-navy)', marginBottom: '0.5rem' }}>
                    {hotel.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {hotel.location}
                  </div>
                  {expandedHotels.includes(hotel.id) && (
                    <div 
                      style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}
                      dangerouslySetInnerHTML={{ __html: hotel.short_description }}
                    />
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                    <button 
                      type="button"
                      onClick={() => toggleDescription(hotel.id)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--color-primary-red)', 
                        padding: 0, 
                        font: 'inherit', 
                        cursor: 'pointer', 
                        textDecoration: 'underline', 
                        fontSize: '0.85rem',
                        fontWeight: 600 
                      }}
                    >
                      {expandedHotels.includes(hotel.id) ? 'Hide Description' : 'Show Description'}
                    </button>
                    <Link href={`/hotels/${hotel.id}`} className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>
                      View Hotel
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '4rem 0', textAlign: 'center', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ color: 'var(--color-secondary-navy)', marginBottom: '0.5rem' }}>No Hotels Found</h3>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              We couldn't find any hotels matching your filters. Try resetting the criteria to explore all.
            </p>
            <button className="btn btn-primary" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
