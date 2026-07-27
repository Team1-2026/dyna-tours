'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../app/visa/page.module.css';

interface VisaHeroBannerProps {
  countries: { id: string; name: string }[];
}

export default function VisaHeroBanner({ countries }: VisaHeroBannerProps) {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCountry) {
      router.push(`/visa/${selectedCountry}`);
    }
  };

  return (
    <>
      {/* 1. Hero Banner Image Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span>✈️ Global Travel Assistance</span>
          </div>
          <h1 className={styles.heroTitle}>
            Visa Services & Assistance
          </h1>
          <p className={styles.heroSubtitle}>
            Fast, reliable & hassle-free tourist visa processing for international destinations worldwide.
          </p>
        </div>
      </section>

      {/* 2. Destination Country Search Bar & Intro Section */}
      <section className={styles.searchSection}>
        <div className="container">
          <div className={`${styles.searchCard} animate-fade-in-up`}>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <div className={styles.inputGroup}>
                <label htmlFor="country-select" className={styles.inputLabel}>
                  Destination Country
                </label>
                <select
                  id="country-select"
                  className={styles.selectInput}
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  required
                >
                  <option value="" disabled>Select destination country...</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className={`btn btn-primary ${styles.searchBtn}`}>
                Search Visa
              </button>
            </form>
            <div className={styles.secureText}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Safe & secure enquiry flow</span>
            </div>
          </div>

          {/* Premium Designed Intro Block Placed Below Search Bar */}
          <div className={styles.visaIntroBlock}>
            <div className={styles.introBadgeWrapper}>
              <span className={styles.introBadge}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Trusted Global Visa Services
              </span>
            </div>

            <h2 className={styles.introTitle}>
              Apply for Your Tourist Visa <span className={styles.titleHighlight}>with Confidence</span>
            </h2>

            <p className={styles.introText}>
              Dyna Tours India provides reliable visa assistance for international destinations, helping travelers with documentation, requirements, and application support.
            </p>

            <div className={styles.introFeaturesGrid}>
              <div className={styles.introFeatureItem}>
                <div className={styles.featureIconBox}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <polyline points="9 15 11 17 15 13"/>
                  </svg>
                </div>
                <span>Document Verification</span>
              </div>

              <div className={styles.introFeatureItem}>
                <div className={styles.featureIconBox}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <span>Fast-Track Processing</span>
              </div>

              <div className={styles.introFeatureItem}>
                <div className={styles.featureIconBox}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <span>End-to-End Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
