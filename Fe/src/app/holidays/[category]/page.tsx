import React, { Suspense } from 'react';
import styles from '../holidays.module.css';
import HolidaysList from '@/components/HolidaysList';

import HolidayEnquiryForm from '@/components/HolidayEnquiryForm';

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = React.use(params);
  // Convert 'domestic-tour-packages' to 'Domestic Tour Packages'
  const categoryName = resolvedParams.category
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // Get a specific image based on category for the banner
  let bgImage = '/images/swiss_alps.png';
  if (resolvedParams.category.includes('kerala')) bgImage = '/images/kerala.jpg';
  if (resolvedParams.category.includes('domestic')) bgImage = '/images/kerala.jpg';
  if (resolvedParams.category.includes('international')) bgImage = '/images/paris_france.png';
  if (resolvedParams.category.includes('honeymoon')) bgImage = '/images/maldives.png';
  if (resolvedParams.category.includes('luxury')) bgImage = '/images/amalfi_coast.png';

  return (
    <div>
      {/* Header Banner */}
      <section className={styles.heroBanner} style={{ backgroundImage: `url('${bgImage}')` }}>
        <div className={styles.heroOverlay}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className={styles.heroTitle}>{categoryName}</h1>
          <p className={styles.heroSubtitle}>
            Explore our handpicked {categoryName.toLowerCase()} covering the most beautiful destinations.
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
        <HolidaysList initialCategory={categoryName} />
      </Suspense>


      {/* Bottom Enquiry CTA */}
      <section style={{ 
        position: 'relative',
        padding: '5rem 0', 
        backgroundImage: `url('/images/dream_domestic_bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-primary)' 
      }}>
        {/* Light overlay for low image opacity */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255, 255, 255, 0.15)', zIndex: 1 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-manrope)', color: 'var(--color-secondary-navy)', textShadow: '0 2px 10px rgba(255,255,255,0.8)' }}>Start Planning Your Dream {categoryName.replace(' Tour Packages', '')} Today</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-secondary-navy)', marginBottom: '2rem', fontWeight: 600, textShadow: '0 2px 10px rgba(255,255,255,0.8)' }}>
              Fill out the form and our travel experts will get back to you with a customized itinerary and quote within 24 hours.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://wa.me/12345678900" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ borderColor: 'var(--color-secondary-navy)', color: 'var(--color-secondary-navy)', background: 'transparent' }}>
                WhatsApp Now
              </a>
              <a href="tel:+12345678900" className="btn btn-outline" style={{ borderColor: 'var(--color-secondary-navy)', color: 'var(--color-secondary-navy)', background: 'transparent' }}>
                Call Us
              </a>
            </div>
          </div>
          <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '1.5rem', color: 'var(--color-text-primary)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontFamily: 'var(--font-manrope)', color: 'var(--color-secondary-navy)' }}>Request a Quote</h3>
            <HolidayEnquiryForm categoryName={categoryName} />
          </div>
        </div>
      </section>
    </div>
  );
}
