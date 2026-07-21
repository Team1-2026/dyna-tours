'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api, Destination, Hotel } from '@/lib/api';
import { toursData } from '@/data/toursData';
import TourCard from '@/components/TourCard';
import ImageZoomModal from '@/components/ImageZoomModal';
import styles from './destination.module.css';

const stripHtml = (html: string) => html ? html.replace(/<[^>]*>/g, '') : '';

interface DestinationPageClientProps {
  initialDestination: Destination;
  slug: string;
}

export default function DestinationPageClient({ initialDestination, slug }: DestinationPageClientProps) {
  const [destination] = useState<Destination>(initialDestination);

  // Lightbox Zoom states
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomedIndex, setZoomedIndex] = useState(0);

  // Search query state for State/Country Page
  const [searchQuery, setSearchQuery] = useState('');

  // Enquiry form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    num_people: 1,
    travel_date: '',
    message: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Determine if it is a State/Country (parent) page or Detail page
  const subDestinations = destination.sub_destinations || [];
  const isStatePage = destination.parent_id === null && subDestinations.length > 0;

  // Filter sub-destinations based on search query
  const filteredSubDestinations = subDestinations.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.overview && d.overview.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter tours matching this destination
  let matchedTours = [];
  if (destination.related_tours && destination.related_tours.length > 0) {
    matchedTours = toursData.filter(tour => destination.related_tours?.includes(tour.id));
  } else {
    matchedTours = toursData.filter(tour => 
      tour.destination.toLowerCase().includes(destination.name.toLowerCase()) ||
      tour.title.toLowerCase().includes(destination.name.toLowerCase())
    );
  }

  // Filter hotels matching this destination from Laravel
  const matchedHotels = destination.hotels || [];

  // Handle Enquiry submission
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormSuccess(false);

    try {
      await api.submitEnquiry({
        type: 'destination',
        target_id: destination.id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        num_people: Number(formData.num_people),
        travel_date: formData.travel_date,
        message: formData.message
      });
      setFormSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        num_people: 1,
        travel_date: '',
        message: ''
      });
    } catch (err) {
      console.error(err);
      alert('Failed to submit enquiry. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. Hero Banner */}
      <section 
        className={styles.heroBanner}
        style={{ backgroundImage: `url(${destination.banner_image || '/images/default_banner.png'})` }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          {destination.parent_id && (
            <span className={styles.parentBadge}>
              Explore {destination.parent_id}
            </span>
          )}
          <h1 className={styles.heroTitle}>{destination.name}</h1>
          <p className={styles.heroSubtitle}>
            {isStatePage ? 'State Overview & Popular Places' : 'Explore Attractions, Hotels & Packages'}
          </p>
        </div>
      </section>

      {/* 2. Main content area depending on page type */}
      {isStatePage ? (
        /* ==========================================
           STATE / COUNTRY LAYOUT
           ========================================== */
        <div>
          {/* Overview & Best Time to Visit */}
          <section className="section">
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '3rem' }}>
                <div>
                  <h2 className={styles.blockTitle}>{destination.name} Overview</h2>
                  <div className={styles.textParagraph} dangerouslySetInnerHTML={{ __html: destination.overview }} />
                </div>
                {destination.best_time_to_visit && (
                  <div style={{ background: 'var(--color-bg-card)', padding: '2.25rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-premium)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-secondary-navy)', marginBottom: '1rem' }}>
                      ☀️ Best Time to Visit
                    </h3>
                    <div 
                      style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }} 
                      dangerouslySetInnerHTML={{ __html: destination.best_time_to_visit }}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Search bar & popular child places */}
          <section className={styles.subDestSection}>
            <div className="container">
              <div className="section-title-wrap" style={{ textAlign: 'left', marginBottom: '2rem' }}>
                <span className="section-subtitle">Discover regions</span>
                <h2 className="section-title">Popular Destinations in {destination.name}</h2>
              </div>

              {/* Destination Search Bar */}
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder={`Search places in ${destination.name}...`}
                  className={styles.searchInputField}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
                  Search
                </button>
              </div>

              {/* Child List Grid */}
              {filteredSubDestinations.length > 0 ? (
                <div className={styles.subDestGrid}>
                  {filteredSubDestinations.map((sub) => (
                    <Link 
                      key={sub.id} 
                      href={`/destinations/${sub.id}`}
                      className={styles.subDestCard}
                    >
                      <img 
                        src={sub.banner_image || '/images/default_banner.png'} 
                        alt={sub.name}
                        className={styles.subDestImg}
                      />
                      <div className={styles.subDestOverlay}>
                        <h3 className={styles.subDestName}>{sub.name}</h3>
                        <span className={styles.subDestLink}>
                          View Details 
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-secondary)', margin: '2rem 0' }}>
                  No sub-destinations matching "{searchQuery}" found.
                </p>
              )}
            </div>
          </section>
        </div>
      ) : (
        /* ==========================================
           DETAIL PAGE LAYOUT
           ========================================== */
        <section className="section">
          <div className="container">
            <div className={styles.detailGrid}>
              
              {/* Left Column: Details */}
              <div>
                {/* Overview */}
                <div className={styles.contentBlock}>
                  <h2 className={styles.blockTitle}>Overview</h2>
                  <div className={styles.textParagraph} dangerouslySetInnerHTML={{ __html: destination.overview }} />
                </div>

                {/* How to Reach */}
                {destination.how_to_reach && (
                  <div className={styles.contentBlock}>
                    <h2 className={styles.blockTitle}>How to Reach</h2>
                    <div className={styles.textParagraph} dangerouslySetInnerHTML={{ __html: destination.how_to_reach }} />
                  </div>
                )}

                {/* Best Time to Visit (for details) */}
                {destination.best_time_to_visit && (
                  <div className={styles.contentBlock}>
                    <h2 className={styles.blockTitle}>Best Time to Visit</h2>
                    <div className={styles.textParagraph} dangerouslySetInnerHTML={{ __html: destination.best_time_to_visit }} />
                  </div>
                )}

                {/* Top Attractions */}
                {destination.top_attractions && destination.top_attractions.length > 0 && (
                  <div className={styles.contentBlock}>
                    <h2 className={styles.blockTitle}>Top Places to Visit in {destination.name}</h2>
                    <div className={styles.attractionsList}>
                      {destination.top_attractions.map((att, idx) => (
                        <div key={idx} className={styles.attractionCard}>
                          <div className={styles.attractionHeader}>
                            <h3 className={styles.attractionName}>
                              {idx + 1}. {att.name}
                            </h3>
                            <span className={styles.attractionFee}>
                              Fee: {att.fee}
                            </span>
                          </div>
                          <div className={styles.attractionMeta}>
                            <div className={styles.attractionMetaItem}>
                              <span className={styles.metaLabel}>Timings:</span>
                              <span>{att.timings}</span>
                            </div>
                            <div className={styles.attractionMetaItem}>
                              <span className={styles.metaLabel}>Highlights:</span>
                              <span>{att.highlights}</span>
                            </div>
                            {att.note && (
                              <div className={styles.attractionMetaItem}>
                                <span className={styles.metaLabel}>Note:</span>
                                <span>{att.note}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gallery */}
                {destination.gallery && destination.gallery.length > 0 && (
                  <div className={styles.contentBlock}>
                    <h2 className={styles.blockTitle}>Gallery Images</h2>
                    <div className={styles.galleryGrid}>
                      {destination.gallery.map((img, idx) => {
                        const imgUrl = typeof img === 'string' ? img : img?.url || '';
                        if (!imgUrl) return null;
                        return (
                          <div 
                            key={idx} 
                            className={styles.galleryItem}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setZoomedIndex(idx);
                              setIsZoomOpen(true);
                            }}
                          >
                            <img src={imgUrl} alt={`${destination.name} Gallery ${idx}`} className={styles.galleryImg} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Contact / Enquiry Sticky Form */}
              <div className={styles.sidebarSticky}>
                <div className={styles.formCard}>
                  <h3 className={styles.formTitle}>Plan Your Trip</h3>
                  <p className={styles.formSubtitle}>Send us an enquiry to get custom details and rates.</p>

                  {formSuccess && (
                    <div className={styles.alertSuccess}>
                      ✓ Enquiry submitted successfully! Our experts will contact you soon.
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className={styles.formInput}
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        className={styles.formInput}
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className={styles.formInput}
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="num_people">Number of Peoples</label>
                      <input
                        type="number"
                        name="num_people"
                        id="num_people"
                        min="1"
                        required
                        className={styles.formInput}
                        value={formData.num_people}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="travel_date">Travel Date</label>
                      <input
                        type="date"
                        name="travel_date"
                        id="travel_date"
                        required
                        className={styles.formInput}
                        value={formData.travel_date}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="message">Message / Preferences</label>
                      <textarea
                        name="message"
                        id="message"
                        rows={4}
                        className={styles.formInput}
                        value={formData.message}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className={styles.submitBtn}
                      disabled={formSubmitting}
                    >
                      {formSubmitting ? 'Sending...' : 'Submit Enquiry'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Explore Tour Packages Section (Conditional based on admin panel toggle) */}
      {!isStatePage && destination.show_packages && (
        <section className={styles.packagesSection}>
          <div className="container">
            <div className="section-title-wrap">
              <span className="section-subtitle">Specially Curated</span>
              <h2 className="section-title">Explore Our Related Packages</h2>
            </div>

            {matchedTours.length > 0 ? (
              <div className={styles.packagesGrid}>
                {matchedTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem 0' }}>
                No standard packages currently listed for {destination.name}. Please submit an enquiry for a custom package!
              </p>
            )}
          </div>
        </section>
      )}

      {/* 4. Explore Hotels Near Destination Section (Conditional based on admin panel toggle) */}
      {!isStatePage && destination.show_hotels && (
        <section className={styles.hotelsSection}>
          <div className="container">
            <div className="section-title-wrap">
              <span className="section-subtitle">Stay In Luxury</span>
              <h2 className="section-title">Recommended Hotels Near {destination.name}</h2>
            </div>

            {matchedHotels.length > 0 ? (
              <div className={styles.hotelsGrid}>
                {matchedHotels.map((hotel) => (
                  <div key={hotel.id} className={styles.hotelCard}>
                    <div className={styles.hotelImgWrapper}>
                      <img 
                        src={(typeof hotel.gallery?.[0] === 'string' ? hotel.gallery[0] : (hotel.gallery?.[0] as any)?.url) || '/images/default_hotel.png'} 
                        alt={hotel.name}
                        className={styles.hotelImg}
                      />
                      <span className={styles.hotelBadge}>{hotel.category}</span>
                    </div>
                    <div className={styles.hotelInfo}>
                      <div className={styles.hotelHeader}>
                        <h3 className={styles.hotelName}>{hotel.name}</h3>
                      </div>
                      <div className={styles.hotelLocation}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {hotel.location}
                      </div>
                      <p className={styles.hotelDesc}>
                        {stripHtml(hotel.short_description).slice(0, 140)}...
                      </p>
                      
                      <div className={styles.hotelFooter}>
                        {hotel.show_price && hotel.price && (
                          <div className={styles.hotelPriceSection}>
                            <span className={styles.hotelPriceLabel}>Starting From</span>
                            <span className={styles.hotelPrice}>₹{hotel.price} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>/ night</span></span>
                          </div>
                        )}
                        <Link href={`/hotels/${hotel.id}`} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
                          View Rooms
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem 0' }}>
                No hotels currently registered near {destination.name}.
              </p>
            )}
          </div>
        </section>
      )}

      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        images={(destination.gallery || [])
          .map((img: any) => (typeof img === 'string' ? img : img?.url || ''))
          .filter(Boolean)}
        initialIndex={zoomedIndex}
      />
    </div>
  );
}
