'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { groupToursApi, GroupTour, GroupTourDetails, getImageUrl } from '@/lib/api';
import CountryCodeSelect from '@/components/CountryCodeSelect';
import { isValidPhone, validatePhoneByCountry } from '@/lib/phoneValidation';
import styles from './group-tour-details.module.css';

const parseDetails = (tour: GroupTour | null): GroupTourDetails => {
  if (!tour || !tour.full_details) return {};
  if (typeof tour.full_details === 'object') return tour.full_details as GroupTourDetails;
  try {
    return JSON.parse(tour.full_details);
  } catch (e) {
    return {};
  }
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GroupTourDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [activeDay, setActiveDay] = useState<number | null>(1);
  const [activeTab1, setActiveTab1] = useState<'itinerary' | 'inclusions' | 'terms'>('itinerary');
  const [activeTab2, setActiveTab2] = useState<'flights' | 'hotels' | 'needToKnow'>('flights');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    num_travellers: 2,
    travel_date: '2026-09-15',
    message: ''
  });
  const [countryCode, setCountryCode] = useState('+91');
  const [tour, setTour] = useState<GroupTour | null>(null);
  const [relatedTours, setRelatedTours] = useState<GroupTour[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    groupToursApi.getTours().then(allTours => {
      const currentTour = allTours.find(t => String(t.id) === String(id));
      if (currentTour) {
        setTour(currentTour);
        if (currentTour.related_tours && currentTour.related_tours.length > 0) {
          const relIds = currentTour.related_tours.map(String);
          const matched = allTours.filter(t => String(t.id) !== String(id) && relIds.includes(String(t.id)));
          setRelatedTours(matched);
        } else {
          setRelatedTours(allTours.filter(t => String(t.id) !== String(id)).slice(0, 4));
        }
      }
    }).catch(err => console.error(err));
  }, [id]);

  const toggleDay = (day: number) => {
    setActiveDay(activeDay === day ? null : day);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneCheck = validatePhoneByCountry(formData.phone, countryCode);
    if (!phoneCheck.isValid) {
      alert(phoneCheck.message || 'Please enter a valid phone number.');
      return;
    }
    try {
      const tourNameInfo = tour ? `Interested in ${tour.name}` : '';
      const finalMessage = tourNameInfo
        ? (formData.message ? `${tourNameInfo}\n${formData.message}` : tourNameInfo)
        : formData.message;

      await groupToursApi.submitEnquiry({
        ...formData,
        message: finalMessage,
        phone: `${countryCode} ${formData.phone}`,
        group_tour_id: Number(id) || undefined
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to submit enquiry. Please try again.');
    }
  };

  const details = parseDetails(tour);

  const quickInfo = {
    tripFrom: details.quick_info?.trip_from || 'Kochi (COK)',
    tripTo: details.quick_info?.trip_to || tour?.destination || '',
    groupSize: details.quick_info?.group_size || '20–30 Travellers',
    accommodation: details.quick_info?.accommodation_type || 'Deluxe / Premium Hotels',
    transportation: details.quick_info?.transportation_type || 'A/C Coach / Private Vehicle',
    duration: tour?.duration || '',
  };

  const overviewText = details.overview || (tour?.name ? `Experience an enriching group travel journey to ${tour.destination || tour.name} with curated sightseeing, comfortable stays, and hassle-free tour management.` : '');

  const highlightsList = (Array.isArray(details.highlights) && details.highlights.filter(Boolean).length > 0)
    ? details.highlights.filter(Boolean)
    : [];

  const itineraryList = (Array.isArray(details.itinerary) && details.itinerary.length > 0)
    ? details.itinerary
    : [];

  const onwardFlight = (details.flight_details?.onward?.from || details.flight_details?.onward?.to)
    ? details.flight_details.onward
    : null;

  const returnFlight = (details.flight_details?.return?.from || details.flight_details?.return?.to)
    ? details.flight_details.return
    : null;

  const hotelList = (Array.isArray(details.hotels) && details.hotels.length > 0)
    ? details.hotels
    : [];

  const inclusionsList = (Array.isArray(details.inclusions) && details.inclusions.filter(Boolean).length > 0)
    ? details.inclusions.filter(Boolean)
    : [
        'Hotel Accommodation',
        'Daily Breakfast & Specified Meals',
        'Sightseeing & Transfers as per itinerary',
        'Professional Tour Manager / Guide Assistance',
        'All Applicable Driver Allowances & Tolls'
      ];

  const exclusionsList = (Array.isArray(details.exclusions) && details.exclusions.filter(Boolean).length > 0)
    ? details.exclusions.filter(Boolean)
    : [
        'Personal Expenses (Laundry, Telephone, Minibar)',
        'Optional Tours & Entrance Fees Not Mentioned',
        'Tips & Gratuities',
        'GST / TCS as per government regulations'
      ];

  const needToKnowTopics = (Array.isArray(details.need_to_know) && details.need_to_know.length > 0)
    ? details.need_to_know
    : [
        {
          title: '📌 Reporting & Check-in Times',
          rules: [
            'Standard hotel check-in time: 02:00 PM (Local Time). Standard check-out time: 11:00 AM (Local Time).',
            'Guests are requested to report at the airport at least 3 hours prior to departure for international flights.',
            'Keep your passport, visa, travel insurance, and flight tickets easily accessible throughout your journey.'
          ]
        }
      ];

  const termsList = (Array.isArray(details.terms_and_conditions) && details.terms_and_conditions.filter(Boolean).length > 0)
    ? details.terms_and_conditions.filter(Boolean)
    : [
        'Advance booking amount is non-refundable upon confirmation.',
        'Full payment must be completed prior to departure date.',
        'Visa approval is solely at the discretion of the embassy.',
        'Airline cancellation and date change fees apply as per airline policy.',
        'Tours are subject to weather, operational, and local government regulations.'
      ];

  const cleanServiceText = (text: string) => {
    if (!text) return '';
    return text
      .replace(/[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E6}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|[\u{200D}]/gu, '')
      .replace(/^[^\w\d\(\)\-\.]+/u, '')
      .trim();
  };

  const featuresList = (Array.isArray(details.features) && details.features.filter(Boolean).length > 0)
    ? details.features.filter(Boolean)
    : [
        'Breakfast Included',
        'Hotel Stay',
        'Transportation',
        'Sightseeing',
        'Tour Assistance 24x7',
        'Visa Assistance',
        'Flight Included'
      ];

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Banner */}
      <section 
        className={styles.heroSection}
        style={{ backgroundImage: `url('${getImageUrl(tour?.banner_image || tour?.image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=2000')}')` }}
      >
        <div className={styles.heroOverlay} />
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/group-tours">Group Tours</Link>
              <span>/</span>
              <span style={{ color: '#ffffff' }}>{tour?.name || 'Group Tour'}</span>
            </div>

            <div className={styles.badgesRow}>
              <span className={`${styles.statusBadge} ${styles.badgeFilling}`}>🔥 {tour?.status || 'Available'}</span>
              <span className={`${styles.statusBadge} ${styles.badgeDuration}`}>⏱️ {tour?.duration || '7 Nights / 8 Days'}</span>
              <span className={`${styles.statusBadge} ${styles.badgeSeats}`}>👥 Max 30 Seats</span>
            </div>

            <h1 className={styles.heroTitle}>{tour?.banner_title || tour?.name || 'Panoramic Europe – Alpine Grandeur & Cultural Treasures'}</h1>
            <p className={styles.heroSubtitle}>{tour?.banner_tagline || 'Discover the Best of Europe in One Unforgettable Journey'}</p>

            <div className={styles.priceTag}>
              <span className={styles.priceLabel}>Starting From</span>
              <span className={styles.priceValue}>₹{Number(tour?.starting_price || 0).toLocaleString('en-IN')}/-</span>
              <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>per person</span>
            </div>
          </div>
        </div>
      </section>

      {/* Top Image Gallery */}
      {Array.isArray(tour?.gallery) && tour.gallery.length > 0 && (() => {
        const displayGallery = tour.gallery.filter(Boolean);
        if (displayGallery.length === 0) return null;
        const hasMultiple = displayGallery.length > 2;

        return (
          <div className="container" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <div className={styles.imageGallery} style={{ margin: 0 }}>
              <div className={styles.galleryGrid}>
                <div className={`${styles.galleryItem} ${hasMultiple ? styles.galleryItemLarge : ''}`}>
                  <img 
                    src={getImageUrl(displayGallery[0])} 
                    alt={`${tour.name} featured view`} 
                    className={styles.galleryImg} 
                  />
                </div>
                {displayGallery.slice(1, 3).map((imgUrl, idx) => (
                  <div key={idx} className={styles.galleryItem}>
                    <img src={getImageUrl(imgUrl)} alt={`${tour.name} view ${idx + 2}`} className={styles.galleryImg} />
                  </div>
                ))}
                {displayGallery[3] && (
                  <div className={styles.galleryItem} style={{ gridColumn: 'span 2' }}>
                    <img 
                      src={getImageUrl(displayGallery[3])} 
                      alt={`${tour.name} view 4`} 
                      className={styles.galleryImg} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Main Content & Sidebar Layout */}
      <div className="container">
        <div className={styles.mainLayout}>
          <div className={styles.mainContent}>
            
            {/* 1. Tour Overview */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionHeaderTitle}>Tour Overview</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#475569', whiteSpace: 'pre-line' }}>
                {overviewText}
              </p>
            </div>

            {/* 2. Included Services */}
            <div className={styles.sectionCard} style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <h2 className={styles.sectionHeaderTitle}>Included Services</h2>
              <ul className={styles.includedServicesList}>
                {featuresList.map((feature, idx) => {
                  const cleaned = cleanServiceText(feature);
                  if (!cleaned) return null;
                  return (
                    <li key={idx} style={{ listStyleType: 'disc' }}>
                      {cleaned}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* 3. Key Highlights */}
            {highlightsList.length > 0 && (
              <div className={styles.sectionCard}>
                <h2 className={styles.sectionHeaderTitle}>Key Tour Highlights</h2>
                <div className={styles.highlightsGrid}>
                  {highlightsList.map((item, idx) => (
                    <div key={idx} className={styles.highlightItem}>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.highlightIcon}>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Quick Tour Info */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionHeaderTitle}>Quick Tour Information</h2>
              <div className={styles.quickInfoGrid}>
                <div className={styles.quickInfoItem}>
                  <div className={styles.quickInfoLabel}>Trip From</div>
                  <div className={styles.quickInfoValue}>{quickInfo.tripFrom}</div>
                </div>
                <div className={styles.quickInfoItem}>
                  <div className={styles.quickInfoLabel}>Trip To</div>
                  <div className={styles.quickInfoValue}>{quickInfo.tripTo}</div>
                </div>
                <div className={styles.quickInfoItem}>
                  <div className={styles.quickInfoLabel}>Group Size</div>
                  <div className={styles.quickInfoValue}>{quickInfo.groupSize}</div>
                </div>
                <div className={styles.quickInfoItem}>
                  <div className={styles.quickInfoLabel}>Accommodation</div>
                  <div className={styles.quickInfoValue}>{quickInfo.accommodation}</div>
                </div>
                <div className={styles.quickInfoItem}>
                  <div className={styles.quickInfoLabel}>Transportation</div>
                  <div className={styles.quickInfoValue}>{quickInfo.transportation}</div>
                </div>
                <div className={styles.quickInfoItem}>
                  <div className={styles.quickInfoLabel}>Duration</div>
                  <div className={styles.quickInfoValue}>{quickInfo.duration}</div>
                </div>
              </div>
            </div>

            {/* Tab Section 1: Itinerary, Inclusions & Terms */}
            <div className={styles.tabsContainer}>
              <ul className={styles.tabList}>
                <li>
                  <button 
                    className={`${styles.tabBtn} ${activeTab1 === 'itinerary' ? styles.activeTabBtn : ''}`}
                    onClick={() => setActiveTab1('itinerary')}
                  >
                    Day-wise Itinerary
                  </button>
                </li>
                <li>
                  <button 
                    className={`${styles.tabBtn} ${activeTab1 === 'inclusions' ? styles.activeTabBtn : ''}`}
                    onClick={() => setActiveTab1('inclusions')}
                  >
                    Package Inclusions & Exclusions
                  </button>
                </li>
                <li>
                  <button 
                    className={`${styles.tabBtn} ${activeTab1 === 'terms' ? styles.activeTabBtn : ''}`}
                    onClick={() => setActiveTab1('terms')}
                  >
                    Terms & Conditions
                  </button>
                </li>
              </ul>

              {/* Tab Section 1 Content */}
              <div className={styles.tabContent}>
                {/* 1. Day-wise Itinerary Tab */}
                {activeTab1 === 'itinerary' && (
                  <div className={styles.sectionCard}>
                    <h2 className={styles.sectionHeaderTitle}>Day-wise Itinerary</h2>
                    {itineraryList.length > 0 ? (
                      <div className={styles.itineraryList}>
                        {itineraryList.map((item) => (
                          <div 
                            key={item.day} 
                            className={`${styles.itineraryDayItem} ${activeDay === item.day ? styles.itineraryDayItemActive : ''}`}
                          >
                            <div 
                              className={styles.itineraryHeader}
                              onClick={() => toggleDay(item.day)}
                            >
                              <div className={styles.dayBadgeTitle}>
                                <span className={styles.dayBadge}>Day {item.day}</span>
                                <h3 className={styles.dayTitle}>{item.title}</h3>
                              </div>
                              <span style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: 800 }}>
                                {activeDay === item.day ? '−' : '+'}
                              </span>
                            </div>

                            {activeDay === item.day && (
                              <div className={styles.itineraryBody}>
                                <p className={styles.itineraryDesc}>{item.desc}</p>
                                
                                {item.places && item.places.length > 0 && (
                                  <div>
                                    <div className={styles.itinerarySubHeader}>Places Covered</div>
                                    <ul className={styles.placesList}>
                                      {item.places.map((p, idx) => (
                                        <li key={idx} className={styles.placeChip}>{p}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {item.highlights && item.highlights.length > 0 && (
                                  <div>
                                    <div className={styles.itinerarySubHeader}>Highlights</div>
                                    <ul className={styles.placesList}>
                                      {item.highlights.map((h, idx) => (
                                        <li key={idx} className={styles.placeChip}>✨ {h}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {item.optional && (
                                  <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#64748b' }}>
                                    <strong>Optional:</strong> {item.optional}
                                  </div>
                                )}

                                <div className={styles.metaRow}>
                                  {item.meals && <span>🍽️ <strong>Meals:</strong> {item.meals}</span>}
                                  {item.overnight && <span>🏨 <strong>Overnight:</strong> {item.overnight}</span>}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: '#64748b' }}>Day-wise itinerary schedule will be shared upon booking request.</p>
                    )}
                  </div>
                )}

                {/* 2. Package Inclusions & Exclusions Tab */}
                {activeTab1 === 'inclusions' && (
                  <div className={styles.sectionCard}>
                    <h2 className={styles.sectionHeaderTitle}>Package Inclusions & Exclusions</h2>
                    <div className={styles.incExcGrid}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#16a34a', marginBottom: '1rem' }}>✓ Package Includes</h3>
                        <ul className={styles.incList}>
                          {inclusionsList.map((inc, idx) => (
                            <li key={idx}>
                              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#dc2626', marginBottom: '1rem' }}>✕ Package Excludes</h3>
                        <ul className={styles.excList}>
                          {exclusionsList.map((exc, idx) => (
                            <li key={idx}>
                              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              <span>{exc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Terms & Conditions Tab */}
                {activeTab1 === 'terms' && (
                  <div className={styles.sectionCard}>
                    <h2 className={styles.sectionHeaderTitle}>Terms & Conditions</h2>
                    <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        {termsList.map((term, idx) => (
                          <li key={idx} style={{ listStyleType: 'disc' }}>{term}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tab Section 2: Flights, Accommodation & Need to Know */}
            <div className={styles.tabsContainer}>
              <ul className={styles.tabList}>
                <li>
                  <button 
                    className={`${styles.tabBtn} ${activeTab2 === 'flights' ? styles.activeTabBtn : ''}`}
                    onClick={() => setActiveTab2('flights')}
                  >
                    Flight Details
                  </button>
                </li>
                <li>
                  <button 
                    className={`${styles.tabBtn} ${activeTab2 === 'hotels' ? styles.activeTabBtn : ''}`}
                    onClick={() => setActiveTab2('hotels')}
                  >
                    Accommodation Details
                  </button>
                </li>
                <li>
                  <button 
                    className={`${styles.tabBtn} ${activeTab2 === 'needToKnow' ? styles.activeTabBtn : ''}`}
                    onClick={() => setActiveTab2('needToKnow')}
                  >
                    Need to Know
                  </button>
                </li>
              </ul>

              {/* Tab Section 2 Content */}
              <div className={styles.tabContent}>
                {/* 1. Flight Details Tab */}
                {activeTab2 === 'flights' && (
                  <div className={styles.sectionCard}>
                    <h2 className={styles.sectionHeaderTitle}>Flight Details</h2>
                    {(onwardFlight || returnFlight) ? (
                      <div className={styles.flightGrid}>
                        {/* Onward Flight */}
                        {onwardFlight && (
                          <div className={styles.flightCard}>
                            <div className={styles.flightCardHeader}>
                              <span className={styles.flightTypeLabel}>🛫 Onward Journey</span>
                              {onwardFlight.duration && <span className={styles.flightDurationBadge}>✈️ {onwardFlight.duration}</span>}
                            </div>
                            <div className={styles.flightRoute}>
                              <div>
                                <div className={styles.cityName}>{onwardFlight.from || 'Departure'}</div>
                                {onwardFlight.departure_time && <div className={styles.flightTime}>{onwardFlight.departure_time}</div>}
                                {onwardFlight.departure_date && <div className={styles.flightDate}>{onwardFlight.departure_date}</div>}
                              </div>
                              <div style={{ textAlign: 'center', color: '#64748b', fontSize: '1.25rem' }}>➔</div>
                              <div style={{ textAlign: 'right' }}>
                                <div className={styles.cityName}>{onwardFlight.to || 'Arrival'}</div>
                                {onwardFlight.arrival_time && <div className={styles.flightTime}>{onwardFlight.arrival_time}</div>}
                                {onwardFlight.arrival_date && <div className={styles.flightDate}>{onwardFlight.arrival_date}</div>}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Return Flight */}
                        {returnFlight && (
                          <div className={styles.flightCard}>
                            <div className={styles.flightCardHeader}>
                              <span className={styles.flightTypeLabel}>🛬 Return Journey</span>
                              {returnFlight.duration && <span className={styles.flightDurationBadge}>✈️ {returnFlight.duration}</span>}
                            </div>
                            <div className={styles.flightRoute}>
                              <div>
                                <div className={styles.cityName}>{returnFlight.from || 'Departure'}</div>
                                {returnFlight.departure_time && <div className={styles.flightTime}>{returnFlight.departure_time}</div>}
                                {returnFlight.departure_date && <div className={styles.flightDate}>{returnFlight.departure_date}</div>}
                              </div>
                              <div style={{ textAlign: 'center', color: '#64748b', fontSize: '1.25rem' }}>➔</div>
                              <div style={{ textAlign: 'right' }}>
                                <div className={styles.cityName}>{returnFlight.to || 'Arrival'}</div>
                                {returnFlight.arrival_time && <div className={styles.flightTime}>{returnFlight.arrival_time}</div>}
                                {returnFlight.arrival_date && <div className={styles.flightDate}>{returnFlight.arrival_date}</div>}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ background: '#f8fafc', padding: '2rem', textAlign: 'center', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                        <p style={{ fontSize: '1rem', fontWeight: 600, margin: 0, color: '#334155' }}>✈️ Custom Flight Options Available</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>Flight details will be provided based on your departure city and preferred dates upon booking confirmation.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Accommodation Details Tab */}
                {activeTab2 === 'hotels' && (
                  <div className={styles.sectionCard}>
                    <h2 className={styles.sectionHeaderTitle}>Accommodation Details</h2>
                    {hotelList.length > 0 ? (
                      <div className={styles.tableResponsive}>
                        <table className={styles.hotelTable}>
                          <thead>
                            <tr>
                              <th>City</th>
                              <th>Hotel</th>
                              <th>Category</th>
                              <th>Check-in</th>
                              <th>Check-out</th>
                            </tr>
                          </thead>
                          <tbody>
                            {hotelList.map((hotel, idx) => (
                              <tr key={idx}>
                                <td><strong>{hotel.city}</strong></td>
                                <td>{hotel.hotel_name}</td>
                                <td><span className={styles.stars}>{hotel.rating}</span></td>
                                <td>{hotel.check_in}</td>
                                <td>{hotel.check_out}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ background: '#f8fafc', padding: '2rem', textAlign: 'center', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                        <p style={{ fontSize: '1rem', fontWeight: 600, margin: 0, color: '#334155' }}>🏨 Premium 3★ / 4★ Hotel Accommodation</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', marginBottom: 0 }}>Confirmed hotel vouchers and property names will be shared upon reservation.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Need to Know Tab */}
                {activeTab2 === 'needToKnow' && (
                  <div className={styles.sectionCard}>
                    <h2 className={styles.sectionHeaderTitle}>Need to Know</h2>
                    <div className={styles.needToKnowBox}>
                      {needToKnowTopics.map((topic, idx) => (
                        <div key={idx} className={styles.needToKnowTopic}>
                          <h3 className={styles.topicTitle}>{topic.title}</h3>
                          <ul className={styles.topicList}>
                            {(Array.isArray(topic.rules) ? topic.rules : []).map((rule, rIdx) => (
                              <li key={rIdx}>{rule}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Packages */}
            <div className={styles.relatedSection}>
              <h2 className={styles.sectionHeaderTitle}>Related Group Tour Packages</h2>
              <div className={styles.relatedGrid}>
                {relatedTours.length > 0 ? (
                  relatedTours.map((rel) => (
                    <div key={rel.id} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                      <div style={{ height: '160px', backgroundImage: `url(${getImageUrl(rel.image || '')})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                      <div style={{ padding: '1rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>{rel.name}</h4>
                        <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem' }}>⏱️ {rel.duration}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#dc2626' }}>₹{Number(rel.starting_price || 0).toLocaleString('en-IN')}</span>
                          <Link href={`/group-tours/${rel.id}`} style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>View Tour →</Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#64748b' }}>No related tour packages have been selected for this tour yet.</p>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar Booking Form */}
          <div className={styles.sidebar}>
            <div className={styles.stickySidebar}>
              <div className={styles.bookingFormCard}>
                <h3 className={styles.formTitle}>Book This Group Tour</h3>
                <p className={styles.formSubtitle}>Submit your enquiry for instant seat reservation and itinerary details.</p>

                {submitted ? (
                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '1rem', borderRadius: '8px', textAlign: 'center', fontWeight: 600 }}>
                    ✓ Thank you! Our travel expert will call you shortly regarding seat availability and booking details.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                      <label>Full Name *</label>
                      <input 
                        type="text" 
                        placeholder="Enter your full name" 
                        className={styles.formControl} 
                        value={formData.name} 
                        onChange={e => setFormData({ ...formData, name: e.target.value })} 
                        required 
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Phone Number *</label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', width: '100%' }}>
                        <CountryCodeSelect 
                          value={countryCode} 
                          onChange={setCountryCode} 
                          style={{ 
                            background: 'rgba(255, 255, 255, 0.07)', 
                            border: '1px solid rgba(255, 255, 255, 0.15)', 
                            color: '#ffffff', 
                            padding: '0.65rem 0.4rem', 
                            width: '100px',
                            flexShrink: 0,
                            borderRadius: 'var(--radius-md, 8px)'
                          }} 
                        />
                        <input 
                          type="tel" 
                          placeholder="Phone Number *" 
                          className={styles.formControl} 
                          style={{ flex: 1, minWidth: 0, marginBottom: 0 }}
                          value={formData.phone} 
                          onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                          required 
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Email Address *</label>
                      <input 
                        type="email" 
                        placeholder="Email address" 
                        className={styles.formControl} 
                        value={formData.email} 
                        onChange={e => setFormData({ ...formData, email: e.target.value })} 
                        required 
                      />
                    </div>

                    <div className={styles.formRowGrid}>
                      <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                        <label>Travellers</label>
                        <input 
                          type="number" 
                          className={styles.formControl} 
                          style={{ marginBottom: 0 }}
                          value={formData.num_travellers} 
                          onChange={e => setFormData({ ...formData, num_travellers: Number(e.target.value) })} 
                          min={1} 
                        />
                      </div>

                      <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                        <label>Departure Date</label>
                        <input 
                          type="date" 
                          className={styles.formControl} 
                          style={{ marginBottom: 0 }}
                          value={formData.travel_date} 
                          onChange={e => setFormData({ ...formData, travel_date: e.target.value })} 
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup} style={{ marginBottom: '0.6rem' }}>
                      <label>Special Requirements</label>
                      <textarea 
                        placeholder="Special requirements or queries..." 
                        rows={2} 
                        className={styles.formControl} 
                        style={{ marginBottom: 0 }}
                        value={formData.message} 
                        onChange={e => setFormData({ ...formData, message: e.target.value })} 
                      />
                    </div>

                    <button type="submit" className={styles.btnSubmit}>
                      Submit Enquiry
                    </button>
                    <a 
                      href={`https://wa.me/919846665005?text=Hi,%20I'm%20interested%20in%20${encodeURIComponent(tour?.name || 'Group Tour')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.btnWhatsapp}
                    >
                      <span>💬 WhatsApp Enquiry</span>
                    </a>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
