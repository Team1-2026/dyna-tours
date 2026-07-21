import React from 'react';
import Link from 'next/link';
import { VisaCountry } from '@/data/visaData';
import styles from '../../app/visa/page.module.css';

interface StampedVisaSectionProps {
  schengenCountries: Partial<VisaCountry>[];
  otherCountries: Partial<VisaCountry>[];
}

export default function StampedVisaSection({ schengenCountries, otherCountries }: StampedVisaSectionProps) {
  return (
    <section className="section bg-white" id="stamped-visa" style={{ paddingTop: '2rem' }}>
      <div className="container">
        <div className="section-title-wrap">
          <span className="section-subtitle">Embassy Visas</span>
          <h2 className="section-title">Stamped Visa (Offline Visa)</h2>
        </div>
        
        <div style={{ marginBottom: '4rem' }}>
          <div className={styles.stampedHeader} style={{ marginBottom: '1.5rem' }}>
            <h3>Schengen Countries</h3>
            <span className={styles.stampedRegion}>Europe</span>
          </div>
          <div className={styles.gridContainer}>
            {schengenCountries.map((country) => (
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

        <div>
          <div className={styles.stampedHeader} style={{ marginBottom: '1.5rem' }}>
            <h3>Other Countries</h3>
            <span className={styles.stampedRegion}>Worldwide</span>
          </div>
          <div className={styles.gridContainer}>
            {otherCountries.map((country) => (
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
      </div>
    </section>
  );
}
