'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './tour-details.module.css';
import { toursData } from '@/data/toursData';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TourDetailsPage({ params }: PageProps) {
  const router = useRouter();
  
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const tour = toursData.find((t) => t.id === id);

  // Client states
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'inclusions' | 'reviews'>('overview');
  const [activeDay, setActiveDay] = useState<number | null>(1);
  const [travelers, setTravelers] = useState<number>(2);

  const toggleDay = (dayNum: number) => {
    setActiveDay((prev) => (prev === dayNum ? null : dayNum));
  };
  const [travelDate, setTravelDate] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  if (!tour) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--color-secondary-navy)' }}>
          Tour Package Not Found
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
          The tour package you are trying to view does not exist or has been moved.
        </p>
        <Link href="/tours" className="btn btn-primary">
          Back to Explore
        </Link>
      </div>
    );
  }

  // Cost breakdown
  const subtotal = tour.price * travelers;
  const taxesAndFees = 120 * travelers;
  const totalPrice = subtotal + taxesAndFees;

  // Handle counter change
  const incrementTravelers = () => setTravelers((prev) => Math.min(prev + 1, 10));
  const decrementTravelers = () => setTravelers((prev) => Math.max(prev - 1, 1));

  // Handle Booking form submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelDate || !fullName || !email) {
      alert('Please fill out all booking fields.');
      return;
    }

    setIsSubmitting(true);

    // Simulate network latency
    setTimeout(() => {
      // Generate booking reference e.g., DYNA-58492
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const ref = `DYNA-${randomDigits}`;
      setBookingRef(ref);

      // Create new booking record
      const newBooking = {
        ref,
        tourId: tour.id,
        tourTitle: tour.title,
        tourImage: tour.image,
        destination: tour.destination,
        pricePaid: totalPrice,
        travelers,
        travelDate,
        fullName,
        email,
        dateBooked: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };

      // Retrieve existing bookings from localStorage
      const existingBookingsStr = localStorage.getItem('dyna_bookings');
      const existingBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
      
      // Save new booking
      localStorage.setItem('dyna_bookings', JSON.stringify([newBooking, ...existingBookings]));

      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 1500);
  };

  // Star render utility
  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(
          <svg key={i} viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} viewBox="0 0 24 24" width="18" height="18" fill="#d1d5db">
            <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className={styles.pageWrapper}>
      <div className="container">
        {/* Breadcrumbs */}
        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/tours">Tours</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.currentBreadcrumb}>{tour.title}</span>
        </div>

        {/* Title summary */}
        <div className={styles.headerSummary}>
          <span className={styles.categoryBadge}>{tour.category}</span>
          <h1 className={styles.title}>{tour.title}</h1>
          
          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{tour.destination}</span>
            </div>

            <div className={styles.metaItem}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              <span>{tour.duration}</span>
            </div>

            <div className={styles.rating}>
              <div className={styles.stars}>{renderStars(tour.rating)}</div>
              <span className={styles.ratingText}>{tour.rating}</span>
              <span>({tour.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className={styles.grid}>
          {/* Left Column: Details & Tabs */}
          <div>
            {/* Main Picture */}
            <div 
              className={styles.gallery} 
              style={{ backgroundImage: `url(${tour.image})` }} 
            />

            {/* Tab Navigation */}
            <div className={styles.tabsContainer}>
              <ul className={styles.tabList}>
                <li>
                  <button 
                    className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.activeTabBtn : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                </li>
                <li>
                  <button 
                    className={`${styles.tabBtn} ${activeTab === 'itinerary' ? styles.activeTabBtn : ''}`}
                    onClick={() => setActiveTab('itinerary')}
                  >
                    Daily Itinerary
                  </button>
                </li>
                <li>
                  <button 
                    className={`${styles.tabBtn} ${activeTab === 'inclusions' ? styles.activeTabBtn : ''}`}
                    onClick={() => setActiveTab('inclusions')}
                  >
                    Inclusions & Exclusions
                  </button>
                </li>
                <li>
                  <button 
                    className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.activeTabBtn : ''}`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Reviews
                  </button>
                </li>
              </ul>

              {/* Tab Contents */}
              <div className={styles.tabContent}>
                {/* 1. Overview Tab */}
                {activeTab === 'overview' && (
                  <div>
                    <h2 className={styles.contentTitle}>About the Journey</h2>
                    <p className={styles.overviewText}>{tour.description}</p>
                    
                    <h3 className={styles.contentTitle} style={{ fontSize: '1.25rem', marginTop: '2rem' }}>
                      Tour Highlights
                    </h3>
                    <ul className={styles.highlightsList}>
                      {tour.highlights.map((highlight, index) => (
                        <li key={index} className={styles.highlightItem}>
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 2. Itinerary Tab (Accordion Layout) */}
                {activeTab === 'itinerary' && (
                  <div>
                    <h2 className={styles.contentTitle}>Day-by-Day Schedule</h2>
                    <div className={styles.accordion}>
                      {tour.itinerary.map((day) => {
                        const isExpanded = activeDay === day.day;
                        return (
                          <div 
                            key={day.day} 
                            className={`${styles.accordionItem} ${isExpanded ? styles.accordionItemExpanded : ''}`}
                          >
                            <button 
                              type="button"
                              className={styles.accordionHeader}
                              onClick={() => toggleDay(day.day)}
                            >
                              <div className={styles.accordionHeaderLeft}>
                                <span className={styles.dayBadge}>Day {day.day}</span>
                                <span className={styles.accordionTitle}>{day.title}</span>
                              </div>
                              <svg 
                                className={`${styles.accordionChevron} ${isExpanded ? styles.chevronRotated : ''}`} 
                                viewBox="0 0 24 24" 
                                width="20" 
                                height="20" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2.5"
                              >
                                <polyline points="6,9 12,15 18,9" />
                              </svg>
                            </button>
                            <div className={`${styles.accordionContent} ${isExpanded ? styles.contentExpanded : ''}`}>
                              <p className={styles.accordionDesc}>{day.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Inclusions Tab */}
                {activeTab === 'inclusions' && (
                  <div className={styles.inclusionsGrid}>
                    {/* Inclusions */}
                    <div className={styles.inclusionsBlock}>
                      <h3 className={`${styles.blockTitle} styles.blockTitleGreen`}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#10b981" strokeWidth="2.5">
                          <polyline points="20,6 9,17 4,12" />
                        </svg>
                        <span>What's Included</span>
                      </h3>
                      <ul className={styles.incList}>
                        {tour.inclusions.map((inc, i) => (
                          <li key={i} className={styles.incItem}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20,6 9,17 4,12" />
                            </svg>
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Exclusions */}
                    <div className={styles.exclusionsBlock}>
                      <h3 className={`${styles.blockTitle} styles.blockTitleRed`}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-primary-red)" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        <span>What's Excluded</span>
                      </h3>
                      <ul className={styles.excList}>
                        {tour.exclusions.map((exc, i) => (
                          <li key={i} className={styles.excItem}>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 4. Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    <h2 className={styles.contentTitle}>Guest Testimonials</h2>
                    
                    {/* Add a customized review matching the specific tour */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', color: '#fbbf24', gap: '0.25rem', marginBottom: '0.5rem' }}>
                          {renderStars(5)}
                        </div>
                        <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', fontSize: '0.95rem', marginBottom: '1rem' }}>
                          "An absolute masterpiece of a tour. The guides were extremely knowledgeable, the hotels were top tier, and every transfer went off without a hitch. Truly a five-star experience."
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                          <strong style={{ color: 'var(--color-secondary-navy)' }}>Robert L.</strong>
                          <span style={{ color: 'var(--color-text-muted)' }}>— Traveled March 2026</span>
                        </div>
                      </div>

                      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', color: '#fbbf24', gap: '0.25rem', marginBottom: '0.5rem' }}>
                          {renderStars(tour.rating)}
                        </div>
                        <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', fontSize: '0.95rem', marginBottom: '1rem' }}>
                          "Dyna Tours exceeded our expectations. The balance of scheduled events and leisure time was perfect. Savoring local food recommendations made it feel truly authentic."
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                          <strong style={{ color: 'var(--color-secondary-navy)' }}>Emily J.</strong>
                          <span style={{ color: 'var(--color-text-muted)' }}>— Traveled May 2026</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Widget */}
          <aside className={styles.widget}>
            <div className={styles.widgetHeader}>
              <span className={styles.widgetPriceLabel}>Cost estimate</span>
              <div>
                <span className={styles.widgetPrice}>₹{tour.price.toLocaleString()}</span>
                <span className={styles.widgetPriceUnit}> / guest</span>
              </div>
            </div>

            <form className={styles.bookingForm} onSubmit={handleBookingSubmit}>
              {/* Travel Date */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Select Travel Date</label>
                <input 
                  type="date" 
                  required 
                  min={new Date().toISOString().split('T')[0]} 
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                />
              </div>

              {/* Travelers Counter */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Number of Guests</label>
                <div className={styles.counter}>
                  <button 
                    type="button" 
                    className={styles.counterBtn}
                    onClick={decrementTravelers}
                    disabled={travelers <= 1}
                  >
                    −
                  </button>
                  <span className={styles.counterValue}>{travelers}</span>
                  <button 
                    type="button" 
                    className={styles.counterBtn}
                    onClick={incrementTravelers}
                    disabled={travelers >= 10}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Traveler Information */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Lead traveler name"
                  required 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="For ticket delivery"
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Pricing breakdown summary */}
              {tour.show_price_breakdown !== false && (
                <div className={styles.summaryBlock}>
                  <div className={styles.summaryTotalRow}>
                    <span>Total cost</span>
                    <span className={styles.summaryTotalVal}>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button 
                type="submit" 
                className="btn btn-primary btn-full btn-lg" 
                style={{ marginTop: '0.5rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Securing Booking...' : 'Request Reservation'}
              </button>
            </form>
          </aside>
        </div>
      </div>

      {/* Checkout Success Modal Overlay */}
      {showSuccessModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
            
            <h2 className={styles.modalTitle}>Booking Secured!</h2>
            <p className={styles.modalText}>
              Your reservation has been processed successfully. We've emailed confirmation documents and packing lists to <strong>{email}</strong>.
            </p>
            
            <div className={styles.bookingRef}>
              Ref: {bookingRef}
            </div>

            <button 
              className="btn btn-secondary btn-full"
              onClick={() => router.push('/dashboard')}
            >
              Go to My Bookings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
