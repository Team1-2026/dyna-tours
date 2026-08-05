'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cruise, CruisePageData, api } from '@/lib/api';
import styles from './cruise.module.css';
import CountryCodeSelect from '@/components/CountryCodeSelect';

interface Props {
  initialPageData: CruisePageData;
  initialCruises: Cruise[];
}

export default function CruisePageClient({ initialPageData, initialCruises }: Props) {
  const [pageData] = useState<CruisePageData>(initialPageData);
  const [cruises] = useState<Cruise[]>(initialCruises);
  const [countryCode, setCountryCode] = useState('+91');

  // Enquiry Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    destination: '',
    travel_date: '',
    num_people: 2,
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      await api.submitEnquiry({
        type: 'cruise',
        target_id: 'general-cruise-enquiry',
        name: formData.name,
        email: formData.email,
        phone: `${countryCode} ${formData.phone}`,
        travel_date: formData.travel_date,
        num_people: Number(formData.num_people),
        message: `Preferred Destination: ${formData.destination || 'Not Specified'}` + (formData.message ? ` | Note: ${formData.message}` : '')
      });
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        destination: '',
        travel_date: '',
        num_people: 2,
        message: ''
      });
    } catch (err) {
      console.error(err);
      alert('Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. Hero Banner */}
      <section
        className={styles.heroBanner}
        style={{ backgroundImage: `url(${pageData.banner_image || 'https://images.unsplash.com/photo-1548574505-5e2386903d8f?auto=format&fit=crop&w=1920&q=80'})` }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link> &gt; <span>Cruise</span>
          </nav>
          <h1 className={styles.heroTitle}>{pageData.banner_title || 'Cruise Holidays'}</h1>
          <p className={styles.heroSubtitle}>
            {pageData.banner_tagline || "Sail in Luxury – Discover the World's Most Spectacular Cruise Journeys"}
          </p>
        </div>
      </section>

      {/* 2. Cruise Overview & Quote Form */}
      <section className={styles.overviewSection}>
        <div className="container">
          <div className={styles.overviewGrid}>
            {/* Left Column: Overview Details */}
            <div className={styles.overviewContentBox}>
              <div>
                <h2 className={styles.overviewHeading}>{pageData.overview_heading || 'Experience Unrivalled Luxury on the High Seas'}</h2>
                <div className={styles.overviewText}>
                  {pageData.overview_description || 'Embark on unforgettable ocean and river cruise journeys tailored for comfort, romance, and adventure.'}
                </div>
                <div className={styles.cruiseHighlightsList}>
                  <div className={styles.cruiseHighlightItem}>
                    🚢 <strong>World's Top Cruise Lines:</strong> Royal Caribbean, MSC, Costa, Viking & Celebrity.
                  </div>
                  <div className={styles.cruiseHighlightItem}>
                    📍 <strong>Exclusive Destinations:</strong> Mediterranean, Caribbean, Alaska, Singapore & Kerala Backwaters.
                  </div>
                  <div className={styles.cruiseHighlightItem}>
                    🍷 <strong>All-Inclusive Luxury:</strong> Fine dining, entertainment, shore tours & dedicated butler service.
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <a href="#featured-cruises" className="btn btn-primary btn-lg">
                  {pageData.overview_cta_text || 'View Cruise Packages'}
                </a>
              </div>
            </div>

            {/* Right Column: Request a Cruise Quote Form (Navy Background matching Hotel enquiry form) */}
            <div className={styles.formCard} id="enquiry-form">
              <h3 className={styles.formTitle}>Request a Cruise Quote</h3>
              <p className={styles.formSubtitle}>Fill in your details and our cruise specialist will send you tailored options & best offers.</p>

              {success && (
                <div className={styles.alertSuccess}>
                  ✓ Thank you! Your cruise enquiry has been submitted. Our team will contact you shortly.
                </div>
              )}

              <form onSubmit={handleSubmitEnquiry}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>Full Name *</label>
                    <input type="text" id="name" name="name" required value={formData.name} onChange={handleInputChange} placeholder="John Doe" className={styles.darkInput} />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>Phone Number *</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                      <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="9876543210" className={styles.darkInput} style={{ flex: 1 }} />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>Email Address *</label>
                    <input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className={styles.darkInput} />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="destination" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>Preferred Destination</label>
                    <input type="text" id="destination" name="destination" value={formData.destination} onChange={handleInputChange} placeholder="e.g. Mediterranean, Singapore" className={styles.darkInput} />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="travel_date" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>Travel Date</label>
                    <input type="date" id="travel_date" name="travel_date" value={formData.travel_date} onChange={handleInputChange} className={styles.darkInput} />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="num_people" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>No. of Travellers</label>
                    <input type="number" id="num_people" name="num_people" min="1" value={formData.num_people} onChange={handleInputChange} className={styles.darkInput} />
                  </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: '0.85rem' }}>
                  <label htmlFor="message" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>Message / Special Requirements</label>
                  <textarea id="message" name="message" rows={2} value={formData.message} onChange={handleInputChange} placeholder="Preferred cruise line, cabin type..." className={styles.darkTextarea} />
                </div>

                <button type="submit" className={styles.redSubmitBtn} disabled={submitting}>
                  {submitting ? 'Sending Request...' : 'Request a Quote'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Cruise Packages */}
      <section id="featured-cruises" className={styles.packagesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Cruise Packages</h2>
            <p className={styles.sectionSubtitle}>Explore our top ocean & river cruise itineraries across Europe, Asia, and tropical islands.</p>
          </div>

          <div className={styles.cruiseGrid}>
            {cruises.map((cruise) => (
              <div key={cruise.id} className={styles.cruiseCard}>
                <div className={styles.cardImageWrapper}>
                  <img
                    src={cruise.banner_image || 'https://images.unsplash.com/photo-1548574505-5e2386903d8f?auto=format&fit=crop&w=800&q=80'}
                    alt={cruise.name}
                    className={styles.cardImage}
                  />
                  <span className={styles.cardBadge}>{cruise.duration}</span>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.cruiseName}>{cruise.name}</h3>
                  <div className={styles.cruiseMeta}>
                    <span>📍 {cruise.destination}</span>
                  </div>
                  <p className={styles.cruiseDesc}>
                    {cruise.short_description ? (cruise.short_description.length > 110 ? cruise.short_description.slice(0, 110) + '...' : cruise.short_description) : ''}
                  </p>

                  <div className={styles.cardFooter}>
                    {cruise.show_price && cruise.price ? (
                      <div className={styles.priceBlock}>
                        <span className={styles.priceLabel}>Starting From</span>
                        <span className={styles.priceValue} suppressHydrationWarning>₹{Number(cruise.price).toLocaleString('en-IN')}</span>
                      </div>
                    ) : (
                      <div className={styles.priceBlock}>
                        <span className={styles.priceLabel}>Price</span>
                        <span className={styles.priceValue} style={{ fontSize: '0.95rem' }}>On Request</span>
                      </div>
                    )}

                    <div className={styles.cardActions}>
                      <Link href={`/cruise/${cruise.url_slug || cruise.id}`} className="btn btn-secondary btn-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Call-to-Action Section */}
      <section
        className={styles.ctaSection}
        style={{ backgroundImage: `url(${pageData.cta_image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80'})` }}
      >
        <div className={styles.ctaOverlay} />
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaHeading}>{pageData.cta_heading || 'Ready to Set Sail?'}</h2>
          <p className={styles.ctaDesc}>{pageData.cta_description || 'Book your dream cruise holiday with Dyna Tours India.'}</p>
          <div className={styles.ctaButtons}>
            <a href="#enquiry-form" className="btn btn-primary btn-lg">
              {pageData.cta_button1_text || 'Enquire Now'}
            </a>
            <a href="tel:+919847000000" className="btn btn-secondary btn-lg" style={{ color: '#fff', borderColor: '#fff' }}>
              {pageData.cta_button2_text || 'Talk to Expert'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
