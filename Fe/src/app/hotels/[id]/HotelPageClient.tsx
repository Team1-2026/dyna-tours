'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, Hotel, Room, Facility, BASE_URL } from '@/lib/api';
import ImageZoomModal from '@/components/ImageZoomModal';
import styles from '../hotels.module.css';
import { AmenityIcon } from '@/components/AmenityIcon';

interface HotelPageClientProps {
  initialHotel: Hotel;
  initialRelatedHotels: Hotel[];
  id: string;
}

const formatVideoUrl = (url: string | null) => {
  if (!url) return null;
  if (url.startsWith('/') && !url.startsWith('//')) {
    const origin = BASE_URL.replace(/\/api$/, '');
    return `${origin}${url}`;
  }
  return url;
};

const isDirectVideo = (url: string | null) => {
  if (!url) return false;
  const formatted = formatVideoUrl(url);
  if (!formatted) return false;
  return /\.(mp4|webm|ogg|mov|m4v|3gp)($|\?)/i.test(formatted);
};

const getEmbedUrl = (url: string | null, autoplay: boolean = false) => {
  if (!url) return null;
  const formatted = formatVideoUrl(url);
  if (!formatted) return null;
  
  const autoParam = autoplay ? '?autoplay=1' : '';
  
  // YouTube Regex to match standard, youtu.be, and shorts links
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.b[e]\/)([^"&?\/\s]{11})/;
  const match = formatted.match(ytRegex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}${autoParam}`;
  }
  
  // Vimeo Regex
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
  const vimeoMatch = formatted.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}${autoParam}`;
  }
  
  return formatted;
};

export default function HotelPageClient({ initialHotel, initialRelatedHotels, id }: HotelPageClientProps) {
  const router = useRouter();
  const hotel = initialHotel;

  // Lightbox Zoom states
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomedIndex, setZoomedIndex] = useState(0);
  const relatedHotels = initialRelatedHotels;
  const [isTermsOpen, setIsTermsOpen] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  // Enquiry form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    check_in: '',
    check_out: '',
    num_adults: 2,
    num_children: 0,
    children_ages: '',
    message: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [showAboutDescription, setShowAboutDescription] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        type: 'hotel',
        target_id: hotel.id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        check_in: formData.check_in,
        check_out: formData.check_out,
        num_adults: Number(formData.num_adults),
        num_children: Number(formData.num_children),
        children_ages: formData.children_ages,
        message: formData.message
      });
      setFormSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        check_in: '',
        check_out: '',
        num_adults: 2,
        num_children: 0,
        children_ages: '',
        message: ''
      });
    } catch (err) {
      console.error(err);
      alert('Failed to submit booking enquiry. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const renderFacilityCard = (facility: Facility) => {
    return (
      <div key={facility.id} className={styles.facilityCard}>
        <AmenityIcon name={facility.icon} size={22} className={styles.facilityIcon} />
        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{facility.name}</span>
        <span className={styles.tooltipText}>
          <strong style={{ display: 'block', fontWeight: 700 }}>{facility.name}</strong>
          {facility.description && (
            <span style={{ display: 'block', fontSize: '0.7rem', marginTop: '0.25rem', whiteSpace: 'normal', minWidth: '160px', fontWeight: 400, color: 'rgba(255, 255, 255, 0.85)' }}>
              {facility.description}
            </span>
          )}
        </span>
      </div>
    );
  };

  const stripHtml = (html: string) => html ? html.replace(/<[^>]*>/g, '') : '';

  return (
    <div className={styles.pageContainer}>
      {/* 1. Header Banner */}
      <section className={styles.pageIntroSection} style={{ background: 'var(--color-secondary-navy-light)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <h1 className={styles.pageTitle}>{hotel.name}</h1>
          <p className={styles.pageSubtitle}>
            {hotel.location} • {hotel.category} Luxury Experience
          </p>
        </div>
      </section>

      <div className="container">
        <div className={styles.detailGrid}>
          
          {/* Left Side: Details */}
          <div>
            {/* Gallery Images */}
            {hotel.gallery && hotel.gallery.length > 0 && (
              <div className={styles.imageGallery}>
                <div className={styles.galleryGrid}>
                  <div 
                    className={`${styles.galleryItem} ${styles.galleryItemLarge}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setZoomedIndex(0);
                      setIsZoomOpen(true);
                    }}
                  >
                    <img 
                      src={typeof hotel.gallery[0] === 'string' ? hotel.gallery[0] : hotel.gallery[0]?.url || ''} 
                      alt={`${hotel.name} featured view`} 
                      className={styles.galleryImg} 
                    />
                  </div>
                  {hotel.gallery.slice(1, 3).map((img, idx) => {
                    const imgUrl = typeof img === 'string' ? img : img?.url || '';
                    if (!imgUrl) return null;
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
                        <img src={imgUrl} alt={`${hotel.name} view ${idx + 2}`} className={styles.galleryImg} />
                      </div>
                    );
                  })}
                  {hotel.gallery[3] && (
                    <div 
                      className={styles.galleryItem} 
                      style={{ gridColumn: 'span 2', cursor: 'pointer' }}
                      onClick={() => {
                        setZoomedIndex(3);
                        setIsZoomOpen(true);
                      }}
                    >
                      <img 
                        src={typeof hotel.gallery[3] === 'string' ? hotel.gallery[3] : hotel.gallery[3]?.url || ''} 
                        alt={`${hotel.name} view 4`} 
                        className={styles.galleryImg} 
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Meta Row: Location, Distance, Category */}
            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <svg className={styles.metaIcon} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{hotel.location}</span>
              </div>
              {hotel.distance_from_attractions && (
                <div className={styles.metaItem}>
                  <svg className={styles.metaIcon} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                  <span>{hotel.distance_from_attractions}</span>
                </div>
              )}
              <div className={styles.metaItem}>
                <svg className={styles.metaIcon} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>{hotel.category}</span>
              </div>
            </div>

            {/* About / Hotel Description Section */}
            <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-premium)', marginBottom: '2.5rem', border: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary-navy)', marginBottom: '1.25rem' }}>
                About the Hotel
              </h2>
              {showAboutDescription ? (
                <div>
                  <div 
                    style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', fontSize: '1rem' }}
                    dangerouslySetInnerHTML={{ __html: hotel.about }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowAboutDescription(false)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--color-primary-red)', 
                      padding: 0, 
                      font: 'inherit', 
                      cursor: 'pointer', 
                      textDecoration: 'underline', 
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      marginTop: '1.25rem' 
                    }}
                  >
                    Hide Description
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => setShowAboutDescription(true)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--color-primary-red)', 
                    padding: 0, 
                    font: 'inherit', 
                    cursor: 'pointer', 
                    textDecoration: 'underline', 
                    fontSize: '0.9rem',
                    fontWeight: 700 
                  }}
                >
                  Show Description
                </button>
              )}
            </div>

            {/* Hotel Video Tour */}
            {hotel.video_url && (
              <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-premium)', marginBottom: '2.5rem', border: '1px solid var(--color-border)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary-navy)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🎥 Video Tour
                </h2>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                  {isDirectVideo(hotel.video_url) ? (
                    <video
                      src={formatVideoUrl(hotel.video_url) || ''}
                      controls
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
                    />
                  ) : (
                    <iframe
                      src={getEmbedUrl(hotel.video_url) || ''}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`${hotel.name} Video Tour`}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Inclusions & Exclusions Section */}
            {((hotel.inclusions && hotel.inclusions !== '<ul></ul>') || (hotel.exclusions && hotel.exclusions !== '<ul></ul>')) && (
              <div className={styles.inclusionsExclusionsGrid}>
                {hotel.inclusions && hotel.inclusions !== '<ul></ul>' && (
                  <div className={styles.inclusionsBlock}>
                    <h3>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                      <span>Included In Stays</span>
                    </h3>
                    <div className={styles.richList} dangerouslySetInnerHTML={{ __html: hotel.inclusions }} />
                  </div>
                )}

                {hotel.exclusions && hotel.exclusions !== '<ul></ul>' && (
                  <div className={styles.exclusionsBlock}>
                    <h3>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      <span>Excluded From Stays</span>
                    </h3>
                    <div className={styles.richList} dangerouslySetInnerHTML={{ __html: hotel.exclusions }} />
                  </div>
                )}
              </div>
            )}

            {/* Terms & Conditions Section */}
            {hotel.terms_conditions && hotel.terms_conditions !== '<ul></ul>' && (
              <div className={styles.termsAccordion}>
                <div className={styles.termsHeader} onClick={() => setIsTermsOpen(!isTermsOpen)}>
                  <h3 className={styles.termsTitle}>
                    📝 Hotel Specific Policies & Terms
                  </h3>
                  <svg 
                    style={{ transform: isTermsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                    viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"
                  >
                    <polyline points="6,9 12,15 18,9" />
                  </svg>
                </div>
                {isTermsOpen && (
                  <div className={styles.termsBody} dangerouslySetInnerHTML={{ __html: hotel.terms_conditions }} />
                )}
              </div>
            )}

            {/* Amenities */}
            {hotel.facilities && hotel.facilities.length > 0 && (
              <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-premium)', marginBottom: '1.25rem', border: '1px solid var(--color-border)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-secondary-navy)', marginBottom: '1rem' }}>
                  Amenities
                </h2>
                <div className={styles.facilitiesGrid}>
                  {hotel.facilities.map((fac) => renderFacilityCard(fac))}
                </div>
              </div>
            )}

          </div>

          {/* Right Side: Price block & Contact Form */}
          <div className={styles.sidebarSticky}>
            
            {/* Price Display and Offer Label Block */}
            {((hotel.show_offer_label && hotel.offer_label) || (hotel.show_price && hotel.price)) && (
              <div className={styles.priceDisplayBlock}>
                {hotel.show_offer_label && hotel.offer_label && (
                  <div>
                    <span className={styles.offerBadge}>
                      {hotel.offer_label.trim().endsWith('%') ? `${hotel.offer_label.trim()} off` : hotel.offer_label}
                    </span>
                  </div>
                )}
                {hotel.show_price && hotel.price && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <span className={styles.priceLabel}>Best Available Price</span>
                    <div className={styles.priceNumber}>
                      ₹{hotel.price}
                      <span style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}> / night</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Contact / Enquiry Form */}
            <div className={styles.formCard} id="enquiry-form">
              <h3 className={styles.formTitle}>Enquire & Book</h3>
              <p className={styles.formSubtitle}>Send us details of your stay to check room availability.</p>

              {formSuccess && (
                <div className={styles.alertSuccess}>
                  ✓ Booking Enquiry submitted successfully! We will check availability and contact you.
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.formGroup}>
                    <label htmlFor="check_in">Check-in Date</label>
                    <input
                      type="date"
                      name="check_in"
                      id="check_in"
                      required
                      className={styles.formInput}
                      value={formData.check_in}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="check_out">Check-out Date</label>
                    <input
                      type="date"
                      name="check_out"
                      id="check_out"
                      required
                      className={styles.formInput}
                      value={formData.check_out}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.formGroup}>
                    <label htmlFor="num_adults">Adults</label>
                    <input
                      type="number"
                      name="num_adults"
                      id="num_adults"
                      min="1"
                      required
                      className={styles.formInput}
                      value={formData.num_adults}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="num_children">Children</label>
                    <input
                      type="number"
                      name="num_children"
                      id="num_children"
                      min="0"
                      required
                      className={styles.formInput}
                      value={formData.num_children}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {Number(formData.num_children) > 0 && (
                  <div className={styles.formGroup}>
                    <label htmlFor="children_ages">Children's Age(s)</label>
                    <input
                      type="text"
                      name="children_ages"
                      id="children_ages"
                      placeholder="e.g. 5, 8"
                      className={styles.formInput}
                      value={formData.children_ages}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message / Special Requests</label>
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
                  {formSubmitting ? 'Sending Request...' : 'Enquire Now'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Room Categories Section */}
        {hotel.show_rooms && hotel.rooms && hotel.rooms.length > 0 && (
          <div className={styles.roomsSection}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-secondary-navy)' }}>
              Available Room Categories
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
              Select from our premium accommodations. Rates include breakfast.
            </p>

            <div className={styles.roomsGrid}>
              {hotel.rooms.map((room) => (
                <div key={room.id} className={`${styles.roomCard} ${room.image || (room.images && room.images.length > 0) ? styles.hasImage : ''}`}>
                  
                  {/* Room multiple image slider */}
                  {room.images && room.images.length > 0 ? (
                    <div className={styles.roomImgWrapper}>
                      <div className={styles.roomImgSlider}>
                        {room.images.map((imgUrl, imgIdx) => (
                          <img key={imgIdx} src={imgUrl} alt={`${room.type} view ${imgIdx + 1}`} className={styles.roomImg} />
                        ))}
                      </div>
                    </div>
                  ) : room.image ? (
                    <div className={styles.roomImgWrapper}>
                      <img src={room.image} alt={room.type} className={styles.roomImg} />
                    </div>
                  ) : null}

                  <div className={room.image || (room.images && room.images.length > 0) ? styles.roomContent : styles.roomContentDirect}>
                    <div style={{ flex: 1 }}>
                      <h3 className={styles.roomTitle}>{room.type}</h3>
                      
                      {room.description && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>
                          {room.description}
                        </p>
                      )}

                      <div className={styles.roomSpecs}>
                        {room.size && (
                          <div className={styles.roomSpecItem}>
                            <span className={styles.roomSpecLabel}>Size:</span>
                            <span>{room.size}</span>
                          </div>
                        )}
                        {room.view && (
                          <div className={styles.roomSpecItem}>
                            <span className={styles.roomSpecLabel}>View:</span>
                            <span>{room.view}</span>
                          </div>
                        )}
                        {room.bed_type && (
                          <div className={styles.roomSpecItem}>
                            <span className={styles.roomSpecLabel}>Bedding:</span>
                            <span>{room.bed_type}</span>
                          </div>
                        )}
                        <div className={styles.roomSpecItem}>
                          <span className={styles.roomSpecLabel}>Breakfast:</span>
                          <span>{room.breakfast || 'Included'}</span>
                        </div>
                        <div className={styles.roomSpecItem} style={{ gridColumn: 'span 2' }}>
                          <span className={styles.roomSpecLabel}>Max Occupancy:</span>
                          <span>{room.occupancy}</span>
                        </div>
                      </div>

                      {/* Room specific amenities list */}
                      {room.amenities && room.amenities.length > 0 && (
                        <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {room.amenities.map(am => (
                            <div key={am} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f1f5f9', padding: '0.35rem 0.75rem', borderRadius: '1rem', border: '1px solid var(--color-border)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-secondary-navy)' }}>
                              <AmenityIcon name={am} size={16} />
                              <span>{am}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={styles.roomRightSection}>
                      <div className={styles.roomPriceWrapper}>
                        {hotel.show_price && (room.price || hotel.price) && (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Avg / Night</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-primary-red)' }}>
                              ₹{room.price || hotel.price}
                            </span>
                            {room.remaining_rooms !== undefined && room.remaining_rooms !== null && (
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', background: '#fee2e2', padding: '0.2rem 0.5rem', borderRadius: '4px', marginTop: '0.25rem', display: 'inline-block', textAlign: 'center' }}>
                                Only {room.remaining_rooms} {room.remaining_rooms === 1 ? 'room' : 'rooms'} left!
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {room.video_url && (
                        <button 
                          type="button"
                          className="btn btn-secondary roomVideoCTA" 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            padding: '0.5rem 1rem',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border)',
                            background: '#ffffff',
                            color: 'var(--color-secondary-navy)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            width: '100%'
                          }}
                          onClick={() => setActiveVideoUrl(room.video_url || null)}
                        >
                          🎥 Watch Video
                        </button>
                      )}

                      <button 
                        className="btn btn-primary roomCTA" 
                        onClick={() => {
                          document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RELATED HOTELS SECTION */}
        {relatedHotels.length > 0 && (
          <div style={{ marginTop: '5rem', borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem', paddingBottom: '3rem' }}>
            <div className="section-title-wrap" style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
              <span className="section-subtitle">Recommended Alternatives</span>
              <h2 className="section-title">Other Related Hotels You Might Like</h2>
            </div>
            <div className={styles.relatedHotelsGrid}>
              {relatedHotels.map((relHotel) => (
                <Link 
                  key={relHotel.id} 
                  href={`/hotels/${relHotel.id}`}
                  className={styles.relatedHotelCard}
                >
                  <img 
                    src={(typeof relHotel.gallery?.[0] === 'string' ? relHotel.gallery[0] : (relHotel.gallery?.[0] as any)?.url) || '/images/default_hotel.png'} 
                    alt={relHotel.name} 
                    className={styles.relatedHotelImg} 
                  />
                  <div className={styles.relatedHotelBody}>
                    <span className={styles.relatedHotelCategory}>{relHotel.category}</span>
                    <h4 className={styles.relatedHotelName}>{relHotel.name}</h4>
                    <span className={styles.relatedHotelLocation}>📍 {relHotel.location}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        images={(hotel.gallery || [])
          .map((img: any) => (typeof img === 'string' ? img : img?.url || ''))
          .filter(Boolean)}
        initialIndex={zoomedIndex}
      />

      {activeVideoUrl && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setActiveVideoUrl(null)}
        >
          <div 
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: '800px',
              aspectRatio: '16/9',
              background: '#000',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideoUrl(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                zIndex: 10,
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              ✕
            </button>
            {isDirectVideo(activeVideoUrl) ? (
              <video
                src={formatVideoUrl(activeVideoUrl) || ''}
                controls
                autoPlay
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <iframe
                src={getEmbedUrl(activeVideoUrl, true) || ''}
                style={{ width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Room Video Tour"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
