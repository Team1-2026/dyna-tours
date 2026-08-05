'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api, Destination, Hotel, BASE_URL, getImageUrl } from '@/lib/api';
import { toursData } from '@/data/toursData';
import TourCard from '@/components/TourCard';
import ImageZoomModal from '@/components/ImageZoomModal';
import CountryCodeSelect from '@/components/CountryCodeSelect';
import styles from './destination.module.css';

const stripHtml = (html: string) => html ? html.replace(/<[^>]*>/g, '') : '';

const getBannerUrl = (dest: Destination) => {
  let img = dest.banner_image;

  if (img && typeof img === 'string' && img.trim().length > 0) {
    img = img.trim();
    if (img.startsWith('data:')) {
      return img;
    }
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }
    if (img.startsWith('/storage') || img.startsWith('/uploads') || img.startsWith('storage/') || img.startsWith('uploads/')) {
      const origin = BASE_URL.replace(/\/api$/, '');
      const cleanPath = img.startsWith('/') ? img : `/${img}`;
      return `${origin}${cleanPath}`;
    }
    return img;
  }

  if (dest.gallery && dest.gallery.length > 0) {
    const g = dest.gallery[0];
    const gUrl = typeof g === 'string' ? g : g?.url || '';
    if (gUrl && gUrl.trim().length > 0) {
      if (gUrl.startsWith('data:') || gUrl.startsWith('http://') || gUrl.startsWith('https://')) return gUrl;
      if (gUrl.startsWith('/storage') || gUrl.startsWith('/uploads')) {
        const origin = BASE_URL.replace(/\/api$/, '');
        return `${origin}${gUrl}`;
      }
    }
  }

  const nameLower = (dest.name || '').toLowerCase();
  if (nameLower.includes('uae') || nameLower.includes('dubai')) {
    return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80';
  } else if (nameLower.includes('kerala')) {
    return 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=80';
  } else if (nameLower.includes('munnar')) {
    return 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1920&q=80';
  } else if (nameLower.includes('thailand') || nameLower.includes('phuket')) {
    return 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1920&q=80';
  }

  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80';
};

const getSubBannerUrl = (sub: any) => {
  let img = sub.banner_image;

  if (!img || img.startsWith('/images/')) {
    if (sub.gallery && sub.gallery.length > 0) {
      const g = sub.gallery[0];
      const gUrl = typeof g === 'string' ? g : g?.url || '';
      if (gUrl && !gUrl.startsWith('/images/')) img = gUrl;
    }
  }

  if (!img || img.startsWith('/images/')) {
    const nameLower = (sub.name || '').toLowerCase();
    if (nameLower.includes('dubai')) {
      img = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80';
    } else if (nameLower.includes('abu dhabi')) {
      img = 'https://images.unsplash.com/photo-1512632578888-169bbbc64f35?auto=format&fit=crop&w=800&q=80';
    } else if (nameLower.includes('munnar')) {
      img = 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80';
    } else if (nameLower.includes('alleppey') || nameLower.includes('alappuzha')) {
      img = 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80';
    } else if (nameLower.includes('kochi') || nameLower.includes('cochin')) {
      img = 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80';
    } else if (nameLower.includes('wayanad')) {
      img = 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80';
    } else if (nameLower.includes('thekkady')) {
      img = 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80';
    } else if (nameLower.includes('kovalam')) {
      img = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80';
    } else if (nameLower.includes('phuket')) {
      img = 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80';
    } else if (nameLower.includes('bangkok')) {
      img = 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80';
    } else {
      img = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
    }
  }

  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/storage') || img.startsWith('/uploads')) {
    const origin = BASE_URL.replace(/\/api$/, '');
    return `${origin}${img}`;
  }
  return img;
};

interface DestinationPageClientProps {
  initialDestination: Destination;
  slug: string;
}

export default function DestinationPageClient({ initialDestination, slug }: DestinationPageClientProps) {
  const [destination] = useState<Destination>(initialDestination);
  const [countryCode, setCountryCode] = useState('+91');

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
  const destinationTours = toursData.filter(tour => {
    // 1. Check explicit related_tours mapping from Admin
    if (destination.related_tours && Array.isArray(destination.related_tours) && destination.related_tours.length > 0) {
      if (destination.related_tours.includes(tour.id) || destination.related_tours.includes(tour.title)) {
        return true;
      }
    }
    // 2. Fallback to name/location matching
    const titleLower = tour.title.toLowerCase();
    const destLower = destination.name.toLowerCase();
    return titleLower.includes(destLower) || (destLower === 'kerala' && (titleLower.includes('munnar') || titleLower.includes('alleppey') || titleLower.includes('wayanad')));
  });

  // Filter hotels matching this destination from Laravel
  const matchedHotels = destination.hotels || [];
  const [expandedHotels, setExpandedHotels] = useState<string[]>([]);

  // Check toggles for packages & hotels
  const shouldShowPackages = destination.show_packages !== false && (destination.show_packages as any) !== 0 && (destination.show_packages as any) !== '0' && (destination.show_packages as any) !== 'false';
  const shouldShowHotels = destination.show_hotels !== false && (destination.show_hotels as any) !== 0 && (destination.show_hotels as any) !== '0' && (destination.show_hotels as any) !== 'false';

  const toggleHotelDescription = (id: string) => {
    setExpandedHotels(prev =>
      prev.includes(id) ? prev.filter(hId => hId !== id) : [...prev, id]
    );
  };

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
        phone: `${countryCode} ${formData.phone}`,
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

  const bannerUrl = getBannerUrl(destination);

  return (
    <div className={styles.destinationPage}>
      {/* 1. Hero Banner */}
      <section 
        className={styles.heroBanner}
        style={{ backgroundImage: `url(${bannerUrl})` }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{(destination as any).banner_title || (destination as any).banner_heading || destination.name}</h1>
          <p className={styles.heroSubtitle}>
            {(destination as any).banner_subtitle || (destination as any).banner_tagline || (isStatePage ? 'State Overview & Popular Places' : 'Explore Attractions, Hotels & Packages')}
          </p>
        </div>
      </section>

      {/* 2. Main Container Area */}
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Top Gallery Images (Displayed only on inside/sub-destination pages) */}
        {!isStatePage && (() => {
          const displayGallery = (destination.gallery || []).filter(img => {
            const imgUrl = typeof img === 'string' ? img : img?.url || '';
            if (!imgUrl || !imgUrl.trim()) return false;
            if (imgUrl.includes('/images/default.jpg') || imgUrl.includes('/images/placeholder.png')) return false;
            if (destination.banner_image && (imgUrl === destination.banner_image || imgUrl.endsWith(destination.banner_image))) return false;
            return true;
          });

          if (displayGallery.length === 0) return null;
          const hasMultiple = displayGallery.length > 2;

          return (
            <div className={styles.imageGallery}>
              <div className={styles.galleryGrid}>
                <div 
                  className={`${styles.galleryItem} ${hasMultiple ? styles.galleryItemLarge : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setZoomedIndex(0);
                    setIsZoomOpen(true);
                  }}
                >
                  <img 
                    src={getImageUrl(typeof displayGallery[0] === 'string' ? displayGallery[0] : displayGallery[0]?.url || '')} 
                    alt={`${destination.name} featured view`} 
                    className={styles.galleryImg} 
                  />
                </div>
                {displayGallery.slice(1, 3).map((img, idx) => {
                  const rawUrl = typeof img === 'string' ? img : img?.url || '';
                  if (!rawUrl) return null;
                  return (
                    <div 
                      key={idx} 
                      className={styles.galleryItem}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setZoomedIndex(idx + 1);
                        setIsZoomOpen(true);
                      }}
                    >
                      <img src={getImageUrl(rawUrl)} alt={`${destination.name} view ${idx + 2}`} className={styles.galleryImg} />
                    </div>
                  );
                })}
                {displayGallery[3] && (
                  <div 
                    className={styles.galleryItem} 
                    style={{ gridColumn: 'span 2', cursor: 'pointer' }}
                    onClick={() => {
                      setZoomedIndex(3);
                      setIsZoomOpen(true);
                    }}
                  >
                    <img 
                      src={getImageUrl(typeof displayGallery[3] === 'string' ? displayGallery[3] : displayGallery[3]?.url || '')} 
                      alt={`${destination.name} view 4`} 
                      className={styles.galleryImg} 
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Top Row: Overview (6 Cols) and Plan Your Trip Form (6 Cols) */}
        <div className={styles.overviewFormGrid}>
          {/* Left 6 Columns: Overview */}
          <div className={styles.overviewCard}>
            <h2 className={styles.blockTitle}>{destination.name} Overview</h2>
            <div className={styles.textParagraph} dangerouslySetInnerHTML={{ __html: destination.overview }} />
          </div>

          {/* Right 6 Columns: Plan Your Trip Form (Matching Hotel Enquiry Form Background & Size) */}
          <div className={styles.formCard} id="plan-trip">
            <h3 className={styles.formTitle}>Plan Your Trip</h3>
            <p className={styles.formSubtitle}>Send us an enquiry to get custom details and rates.</p>

            {formSuccess && (
              <div className={styles.alertSuccess}>
                ✓ Enquiry submitted successfully! Our experts will contact you soon.
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Enter your full name"
                  className={styles.darkInput}
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number *</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      placeholder="Phone No."
                      className={styles.darkInput}
                      style={{ flex: 1 }}
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    placeholder="Email Address"
                    className={styles.darkInput}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div className={styles.formGroup}>
                  <label htmlFor="num_people">No. of Travellers</label>
                  <input
                    type="number"
                    name="num_people"
                    id="num_people"
                    min="1"
                    required
                    className={styles.darkInput}
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
                    className={styles.darkInput}
                    value={formData.travel_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message / Preferences</label>
                <textarea
                  name="message"
                  id="message"
                  rows={3}
                  placeholder="Mention preferred hotels, places or special requests..."
                  className={styles.darkTextarea}
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={formSubmitting}
              >
                {formSubmitting ? 'Sending Request...' : 'Plan My Trip'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section: Sub-destinations, How to Reach, Best Time, Attractions */}
        <div className={styles.detailGrid}>
          {/* Sub-destinations / Regions list (If State/Country Parent Page) */}
          {isStatePage && (
            <div className={styles.contentBlock}>
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="section-subtitle">Discover regions</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary-navy)' }}>
                  Popular Destinations in {destination.name}
                </h2>
              </div>

              {/* Search Bar */}
              <div className={styles.searchBox} style={{ marginBottom: '1.5rem' }}>
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

              {/* Regions Grid */}
              {filteredSubDestinations.length > 0 ? (
                <div className={styles.subDestGrid}>
                  {filteredSubDestinations.map((sub) => (
                    <Link 
                      key={sub.id} 
                      href={`/destinations/${sub.id}`}
                      className={styles.subDestCard}
                    >
                      <img 
                        src={getSubBannerUrl(sub)} 
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
                <p style={{ color: 'var(--color-text-secondary)', margin: '1rem 0' }}>
                  No sub-destinations matching "{searchQuery}" found.
                </p>
              )}
            </div>
          )}

          {/* How to Reach */}
          {destination.how_to_reach && (
            <div className={styles.contentBlock}>
              <h2 className={styles.blockTitle}>How to Reach</h2>
              <div className={styles.textParagraph} dangerouslySetInnerHTML={{ __html: destination.how_to_reach }} />
            </div>
          )}

          {/* Best Time to Visit */}
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
        </div>
      </div>

      {/* 3. Explore Tour Packages Section */}
      {shouldShowPackages && destinationTours.length > 0 && (
        <section className={styles.packagesSection}>
          <div className="container">
            <div className="section-title-wrap">
              <span className="section-subtitle">Specially Curated</span>
              <h2 className="section-title">Explore Our Related Packages</h2>
            </div>

            <div className={styles.packagesGrid}>
              {destinationTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Explore Hotels Near Destination Section */}
      {shouldShowHotels && matchedHotels.length > 0 && (
        <section className={styles.hotelsSection}>
          <div className="container">
            <div className="section-title-wrap">
              <span className="section-subtitle">Stay In Luxury</span>
              <h2 className="section-title">Recommended Hotels Near {destination.name}</h2>
            </div>

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
                    {expandedHotels.includes(hotel.id) && (
                      <div 
                        style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}
                        dangerouslySetInnerHTML={{ __html: hotel.short_description }}
                      />
                    )}
                    
                    <div className={styles.hotelFooter}>
                      <button 
                        type="button"
                        onClick={() => toggleHotelDescription(hotel.id)}
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
                      <Link href={`/hotels/${hotel.id}`} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
                        View Hotel
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        images={(destination.gallery || [])
          .map((img: any) => getImageUrl(typeof img === 'string' ? img : img?.url || ''))
          .filter(Boolean)}
        initialIndex={zoomedIndex}
      />
    </div>
  );
}
