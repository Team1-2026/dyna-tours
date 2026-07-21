import React from 'react';
import Link from 'next/link';
import { VisaCountry } from '@/data/visaData';
import styles from '../../app/visa/page.module.css';

interface EVisaGridProps {
  destinations: VisaCountry[];
}

export default function EVisaGrid({ destinations }: EVisaGridProps) {
  return (
    <section className="section bg-light" id="e-visa" style={{ paddingBottom: '2rem' }}>
      <div className="container">
        <div className="section-title-wrap">
          <span className="section-subtitle">Fast & Easy</span>
          <h2 className="section-title">E-Visa Destinations</h2>
        </div>
        
        <div className={styles.gridContainer}>
          {destinations.map((country) => (
            <Link key={country.id} href={`/visa/${country.id}`} className={styles.visaCard}>
              <div className={styles.flagIcon}>{country.flag}</div>
              <div className={styles.visaCardContent}>
                <h3 className={styles.countryName}>{country.name}</h3>
                <div className={styles.visaPrice}>
                  Starting from <strong>{country.price}</strong>
                </div>
                <div className={styles.learnMore}>
                  Learn More
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
