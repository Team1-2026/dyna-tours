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
      <section className={styles.heroSection}></section>

      <section className="section" style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div className={styles.heroContent} style={{ margin: '0 auto', color: 'var(--color-text-primary)', marginBottom: '3rem' }}>
            <span className="section-subtitle animate-fade-in">Trusted Global Visa Services</span>
            <h1 className={`${styles.heroTitle} animate-fade-in-up`} style={{ color: 'var(--color-secondary-navy)' }}>
              Apply for your tourist visa with confidence
            </h1>
            <p className={`${styles.heroText} animate-fade-in-up`} style={{ color: 'var(--color-text-secondary)', animationDelay: '0.1s' }}>
              Dyna Tours India provides reliable visa assistance for international destinations, helping travelers with documentation, visa requirements, and application support for both e-Visas and embassy visas.
            </p>
          </div>

          <div className={`${styles.searchCard} animate-fade-in-up`} style={{ animationDelay: '0.2s', transform: 'none', margin: '0 auto' }}>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <div className={styles.inputGroup}>
                <label htmlFor="country-select" className={styles.inputLabel} style={{ textAlign: 'left' }}>Destination Country</label>
                <select
                  id="country-select"
                  className={styles.selectInput}
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  required
                >
                  <option value="" disabled>Select country</option>
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
        </div>
      </section>
    </>
  );
}
