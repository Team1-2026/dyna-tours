'use client';

import React, { Suspense } from 'react';
import styles from './holidays.module.css';
import HolidaysList from '@/components/HolidaysList';

export default function HolidaysPage() {
  return (
    <div>
      {/* Header Banner */}
      <section className={styles.heroBanner}>
        <div className={styles.heroOverlay}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className={styles.heroTitle}>All Holiday Packages</h1>
          <p className={styles.heroSubtitle}>
            Discover unforgettable travel experiences with our carefully curated domestic and international holiday packages.
          </p>
        </div>
      </section>

      {/* Main Tours Grid with Suspense */}
      <Suspense fallback={
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', fontWeight: 600 }}>
            Loading holiday packages...
          </p>
        </div>
      }>
        <HolidaysList />
      </Suspense>
    </div>
  );
}
