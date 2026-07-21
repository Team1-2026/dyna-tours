'use client';

import React, { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImageZoomModal from '@/components/ImageZoomModal';
import TourCard from '@/components/TourCard';
import styles from './tour-details.module.css';
import { getPackageById, getPackages, api } from '@/lib/api';

import ResolvedImage from '@/components/ResolvedImage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TourDetailsPage({ params }: PageProps) {
  const router = useRouter();
  
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [tour, setTour] = useState<any>(null);
  const [relatedToursData, setRelatedToursData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      getPackageById(id),
      getPackages()
    ]).then(([data, allPackages]) => {
      setTour(data);
      if (data && data.relatedTours && data.relatedTours.length > 0) {
        const related = allPackages.filter(p => data.relatedTours.includes(p.id));
        setRelatedToursData(related);
      }
      setIsLoading(false);
    });
  }, [id]);

  // Client states
  const [activeTab, setActiveTab] = useState<'itinerary' | 'inclusions' | 'terms' | 'cancellation'>('itinerary');
  const [activeDay, setActiveDay] = useState<number | null>(1);
  const [travelers, setTravelers] = useState<number>(2);

  // Zoom lightbox states
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomImages, setZoomImages] = useState<string[]>([]);
  const [zoomIndex, setZoomIndex] = useState(0);

  const openZoom = (images: string[], index = 0) => {
    setZoomImages(images);
    setZoomIndex(index);
    setIsZoomOpen(true);
  };

  const toggleDay = (dayNum: number) => {
    setActiveDay((prev) => (prev === dayNum ? null : dayNum));
  };
  const [travelDate, setTravelDate] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [numChildren, setNumChildren] = useState<number>(0);
  const [childrenAges, setChildrenAges] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>('');

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--color-secondary-navy)' }}>Loading...</h2>
      </div>
    );
  }

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
  const taxesAndFees = (tour.tax !== undefined && tour.tax !== null ? Number(tour.tax) : 120) * travelers;
  const totalPrice = subtotal + taxesAndFees;

  // Handle counter change
  const incrementTravelers = () => setTravelers((prev) => Math.min(prev + 1, 10));
  const decrementTravelers = () => setTravelers((prev) => Math.max(prev - 1, 1));

  // Handle Booking form submit
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!travelDate || !fullName || !email || !phone) {
      alert('Please fill out all required booking fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit as an enquiry to the backend
      await api.submitEnquiry({
        type: 'package',
        target_id: tour.title,
        name: fullName,
        phone: phone,
        email: email,
        num_people: travelers,
        travel_date: travelDate,
        num_children: numChildren,
        children_ages: childrenAges,
        message: message,
      });

      // Generate booking reference e.g., DYNA-58492
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const ref = `DYNA-${randomDigits}`;
      setBookingRef(ref);

      // Create new booking record for localStorage
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
        phone,
        numChildren,
        childrenAges,
        message,
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
      router.push('/booking-success');
    } catch (error) {
      alert('There was an error submitting your request. Please try again.');
      setIsSubmitting(false);
    }
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
          <Link href="/tours">Tour Packages</Link>
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
              style={{ backgroundImage: `url("${(() => {
                if (!tour.image) return '';
                if (typeof window !== 'undefined') {
                  const storedData = localStorage.getItem(`uploaded_image_${tour.image}`);
                  if (storedData) return storedData;
                }
                if (tour.image.startsWith('/') || tour.image.startsWith('http')) return tour.image;
                return `/images/${tour.image}`;
              })()}")`, cursor: 'pointer' }} 
              onClick={() => setIsZoomOpen(true)}
            />

            {/* Custom Banner Code */}
            {tour.bannerCode && (
              <div 
                style={{ marginTop: '1.5rem', marginBottom: '1.5rem', width: '100%', overflow: 'hidden', borderRadius: '1rem' }}
                dangerouslySetInnerHTML={{ __html: tour.bannerCode }}
              />
            )}

            {/* Quick Info */}
            {tour.quickInfo && tour.quickInfo.length > 0 && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {tour.quickInfo.map((info: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', backgroundColor: '#fff', borderRadius: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-secondary-navy)' }}>
                    <span dangerouslySetInnerHTML={{ __html: info.icon }} />
                    <span>{info.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Package Summary & Highlights (Always visible) */}
            <div style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '2rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <h2 className={styles.contentTitle}>Package Summary</h2>
              <p className={styles.overviewText}>{tour.description}</p>
            </div>
            
            <div style={{ backgroundColor: '#fff', borderRadius: '1rem', padding: '2rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <h3 className={styles.contentTitle}>Key Highlights</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {tour.highlights.map((highlight: string, index: number) => (
                  <div key={index} style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>✨</span>
                    <span style={{ color: 'var(--color-secondary-navy)', fontWeight: 500, fontSize: '0.95rem' }}>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className={styles.tabsContainer}>
              <ul className={styles.tabList} style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '2rem', paddingBottom: '0' }}>
                <li>
                  <button 
                    className={`${styles.tabBtn} ${activeTab === 'itinerary' ? styles.activeTabBtn : ''}`}
                    onClick={() => setActiveTab('itinerary')}
                  >
                    Itinerary
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
                    className={`${styles.tabBtn} ${activeTab === 'terms' ? styles.activeTabBtn : ''}`}
                    onClick={() => setActiveTab('terms')}
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button 
                    className={`${styles.tabBtn} ${activeTab === 'cancellation' ? styles.activeTabBtn : ''}`}
                    onClick={() => setActiveTab('cancellation')}
                  >
                    Cancellation Policy
                  </button>
                </li>
              </ul>

              {/* Tab Contents */}
              <div className={styles.tabContent}>


                {/* 2. Itinerary Tab (Accordion Layout) */}
                {activeTab === 'itinerary' && (
                  <div>
                    {tour.routeOverview && tour.routeOverview.length > 0 && (
                      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-secondary-navy)', marginBottom: '1rem' }}>Route Overview</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                          {tour.routeOverview.map((route: any, index: number) => (
                            <React.Fragment key={index}>
                              <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                {route.nights} {route.nights === 1 ? 'Night' : 'Nights'}
                                {route.days ? ` / ${route.days} ${route.days === 1 ? 'Day' : 'Days'}` : ''} {route.destination}
                              </span>
                              {index < tour.routeOverview.length - 1 && (
                                <span style={{ color: '#94a3b8' }}>•</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}
                    <h2 className={styles.contentTitle}>Day-by-Day Schedule</h2>
                    <div className={styles.accordion}>
                      {tour.itinerary.map((day: any) => {
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
                                <span className={styles.dayBadge}>DAY {day.day}</span>
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
                              <div className={styles.itineraryGrid}>
                                <div className={styles.itineraryLeft}>
                                  <div className={styles.introOverline}>Introduction</div>
                                  <p className={styles.accordionDesc}>{day.description}</p>
                                  
                                  {(day.sightseeing || day.meals || day.hotel || day.transport) && (
                                    <div className={styles.infoBoxGrid}>
                                      {day.sightseeing && (
                                        <div className={styles.infoBox}>
                                          <div className={styles.infoBoxIcon}>
                                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#e11d48" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                              <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                          </div>
                                          <div className={styles.infoBoxContent}>
                                            <span className={styles.infoBoxTitle}>Sightseeing</span>
                                            <span className={styles.infoBoxSubtitle}>{day.sightseeing}</span>
                                          </div>
                                        </div>
                                      )}
                                      {day.meals && (
                                        <div className={styles.infoBox}>
                                          <div className={styles.infoBoxIcon}>
                                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#e11d48" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                                              <path d="M7 2v20"></path>
                                              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                                            </svg>
                                          </div>
                                          <div className={styles.infoBoxContent}>
                                            <span className={styles.infoBoxTitle}>Meals</span>
                                            <span className={styles.infoBoxSubtitle}>{day.meals}</span>
                                          </div>
                                        </div>
                                      )}
                                      {day.hotel && (
                                        <div className={styles.infoBox}>
                                          <div className={styles.infoBoxIcon}>
                                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#e11d48" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M2 4v16"></path>
                                              <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
                                              <path d="M2 17h20"></path>
                                              <path d="M6 8v9"></path>
                                            </svg>
                                          </div>
                                          <div className={styles.infoBoxContent}>
                                            <span className={styles.infoBoxTitle}>Hotel</span>
                                            <span className={styles.infoBoxSubtitle}>{day.hotel}</span>
                                          </div>
                                        </div>
                                      )}
                                      {day.transport && (
                                        <div className={styles.infoBox}>
                                          <div className={styles.infoBoxIcon}>
                                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="#e11d48" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path>
                                              <circle cx="7" cy="17" r="2"></circle>
                                              <path d="M9 17h6"></path>
                                              <circle cx="17" cy="17" r="2"></circle>
                                            </svg>
                                          </div>
                                          <div className={styles.infoBoxContent}>
                                            <span className={styles.infoBoxTitle}>Transport</span>
                                            <span className={styles.infoBoxSubtitle}>{day.transport}</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                </div>

                                { (day.image || (day.gallery && day.gallery.length > 0) || day.logistics) && (() => {
                                  const mainImg = day.image || (day.gallery && day.gallery[0]);
                                  const thumbImages = day.image ? (day.gallery || []) : (day.gallery || []).slice(1);
                                  const allImages = [mainImg, ...thumbImages].filter(Boolean);
                                  const displayImages = allImages.slice(0, 4);
                                  return (
                                    <div className={styles.galleryColumn}>
                                      {displayImages.length > 0 && (
                                        <div className={styles.thumbnailRow} style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                          {displayImages.map((imgUrl: string, idx: number) => {
                                            const isLastAndMore = idx === 3 && allImages.length > 4;
                                            return (
                                              <div key={idx} className={styles.thumbnailContainer} onClick={() => openZoom(allImages, idx)} style={{ cursor: 'pointer' }}>
                                                <ResolvedImage src={imgUrl} alt={`Thumbnail ${idx}`} className={styles.thumbnail} />
                                                {isLastAndMore && (
                                                  <div className={styles.moreImagesOverlay}>
                                                    +{allImages.length - 4}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                      

                                    </div>
                                  );
                                })()}
                              </div>
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
                        {tour.inclusions.map((inc: string, i: number) => (
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
                        {tour.exclusions.map((exc: string, i: number) => (
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



                {/* Terms Tab */}
                {activeTab === 'terms' && (
                  <div>
                    {tour.termsAndConditions ? (
                      <>
                        {Array.isArray(tour.termsAndConditions) ? (
                          <ul className={styles.highlightsList}>
                            {tour.termsAndConditions.map((term: string, index: number) => (
                              <li key={index} className={styles.highlightItem}>
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10" />
                                  <line x1="12" y1="8" x2="12" y2="12" />
                                  <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{term}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className={styles.overviewText} style={{ whiteSpace: 'pre-wrap' }}>
                            {tour.termsAndConditions}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className={styles.overviewText}>Please contact us for detailed terms and conditions for this tour.</p>
                    )}
                  </div>
                )}

                {/* Cancellation Tab */}
                {activeTab === 'cancellation' && (
                  <div>
                    {tour.cancellationPolicy ? (
                      Array.isArray(tour.cancellationPolicy) ? (
                        <ul className={styles.highlightsList}>
                          {tour.cancellationPolicy.map((policy: string, index: number) => (
                            <li key={index} className={styles.highlightItem}>
                              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                              </svg>
                              <span>{policy}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={styles.overviewText} style={{ whiteSpace: 'pre-wrap' }}>
                          {tour.cancellationPolicy}
                        </p>
                      )
                    ) : (
                      <p className={styles.overviewText}>Please contact us for detailed cancellation policy for this tour.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Booking Widget */}
          <aside className={styles.widget}>
            {tour.show_price !== false && (
              <div className={styles.widgetHeader}>
                <span className={styles.widgetPriceLabel}>Cost estimate</span>
                <div>
                  <span className={styles.widgetPrice}>₹{(tour.price || 0).toLocaleString()}</span>
                  <span className={styles.widgetPriceUnit}> / guest</span>
                </div>
              </div>
            )}

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

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone No</label>
                <input 
                  type="tel" 
                  placeholder="Contact number"
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>No: of Child</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="Children count"
                    value={numChildren}
                    onChange={(e) => setNumChildren(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Ages</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 5, 8"
                    value={childrenAges}
                    onChange={(e) => setChildrenAges(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Message</label>
                <textarea 
                  placeholder="Special requests or notes..."
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', resize: 'vertical' }}
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

      {/* Related Tour Packages Section */}
      <div className="container" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-secondary-navy)', marginBottom: '1.5rem', fontWeight: 700 }}>
          Related Tour Packages
        </h2>
        {relatedToursData && relatedToursData.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {relatedToursData.map((relTour) => (
              <TourCard key={relTour.id} tour={relTour} layout="vertical" />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-secondary)' }}>No related tour packages have been selected for this tour yet. You can add them from the Admin Panel.</p>
        )}
      </div>

      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        images={zoomImages}
        initialIndex={zoomIndex}
      />
    </div>
  );
}
