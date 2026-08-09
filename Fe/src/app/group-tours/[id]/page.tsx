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
    tripTo: details.quick_info?.trip_to || tour?.destination || 'France • Switzerland • Italy',
    groupSize: details.quick_info?.group_size || '20–30 Travellers',
    accommodation: details.quick_info?.accommodation_type || 'Premium 4★ Hotels',
    transportation: details.quick_info?.transportation_type || 'Luxury Private A/C Coach',
    duration: tour?.duration || '7 Nights / 8 Days',
  };

  const overviewText = details.overview || "Experience the timeless charm of Europe with our Panoramic Europe – Alpine Grandeur & Cultural Treasures group tour. From the romantic streets of Paris to the breathtaking Swiss Alps and the enchanting canals of Venice, this carefully crafted itinerary combines iconic landmarks, spectacular mountain scenery, and rich cultural experiences. Travel comfortably with an experienced tour manager while enjoying premium accommodations, guided sightseeing, and memorable experiences across three of Europe's most beautiful destinations.";

  const highlightsList = (Array.isArray(details.highlights) && details.highlights.filter(Boolean).length > 0)
    ? details.highlights.filter(Boolean)
    : [
        'Explore the romantic city of Paris',
        'Visit the Eiffel Tower (2nd Level)',
        'Enjoy a scenic Seine River Cruise',
        'Discover the beauty of the Swiss Alps',
        'Ride the Rotair Cable Car to Mt. Titlis',
        'Experience the Cliff Walk & Glacier Cave',
        'Visit charming Lucerne',
        'Explore Venice by private boat',
        'Gondola Ride through Venice canals',
        'Professional Tour Manager',
        'Comfortable Premium Hotels',
        'Daily Breakfast & Indian Meals',
        'Airport Transfers & Luxury Coach Travel'
      ];

  const itineraryList = (Array.isArray(details.itinerary) && details.itinerary.length > 0)
    ? details.itinerary
    : [
        {
          day: 1,
          title: 'Arrival in Paris',
          desc: 'Welcome to France! Upon arrival, meet our Tour Manager and transfer to your hotel.',
          highlights: ['Airport Meet & Greet', 'Hotel Check-in', 'Evening Seine River Cruise', 'Welcome Dinner'],
          meals: 'Dinner',
          overnight: 'Paris'
        },
        {
          day: 2,
          title: 'Paris City Tour',
          desc: "Explore the city's most famous attractions with a guided sightseeing tour.",
          places: ['Eiffel Tower (2nd Level)', 'Arc de Triomphe', 'Champs-Élysées', 'Place de la Concorde', 'Louvre Museum (Photo Stop)', 'River Seine'],
          meals: 'Breakfast, Lunch & Dinner',
          overnight: 'Paris'
        },
        {
          day: 3,
          title: 'Paris to Switzerland',
          desc: 'Travel through picturesque countryside into the heart of Switzerland.',
          highlights: ['Scenic Coach Journey', 'Beautiful Alpine Landscapes', 'Hotel Check-in', 'Leisure Evening'],
          meals: 'Breakfast & Dinner',
          overnight: 'Switzerland'
        },
        {
          day: 4,
          title: 'Mt. Titlis Excursion',
          desc: "A day dedicated to one of Switzerland's most spectacular mountain experiences.",
          highlights: ['Rotair Revolving Cable Car', 'Mt. Titlis Summit', 'Ice Flyer Chairlift', 'Glacier Cave', 'Cliff Walk'],
          meals: 'Breakfast & Dinner',
          overnight: 'Switzerland'
        },
        {
          day: 5,
          title: 'Lucerne City Tour',
          desc: "Enjoy one of Europe's most beautiful lakeside cities.",
          places: ['Chapel Bridge', 'Lion Monument', 'Lake Lucerne', 'Old Town', 'Swiss Shopping'],
          optional: 'Lake Lucerne Cruise',
          meals: 'Breakfast & Dinner',
          overnight: 'Switzerland'
        },
        {
          day: 6,
          title: 'Venice',
          desc: 'Travel to Italy and discover the magical floating city.',
          highlights: ['Private Boat Transfer', "St. Mark's Square", "St. Mark's Basilica (Outside)", 'Bridge of Sighs', 'Gondola Ride', 'Murano Glass Demonstration'],
          meals: 'Breakfast & Dinner',
          overnight: 'Venice'
        },
        {
          day: 7,
          title: 'Leisure & Shopping',
          desc: 'Spend your final day exploring Europe at your own pace. Options include: Local Shopping, Café Experience, Photography, Free Time. Enjoy a special farewell dinner.',
          meals: 'Breakfast & Farewell Dinner',
          overnight: 'Venice'
        },
        {
          day: 8,
          title: 'Departure',
          desc: 'After breakfast, Hotel Check-out, Airport Transfer, and return home with unforgettable European memories.',
          meals: 'Breakfast',
          overnight: 'Return Journey'
        }
      ];

  const onwardFlight = details.flight_details?.onward || {
    from: 'Kochi (COK)',
    to: 'Paris (CDG)',
    departure_date: '15 Sep 2026',
    departure_time: '09:30 PM',
    arrival_date: '16 Sep 2026',
    arrival_time: '08:15 AM',
    duration: '12h 45m'
  };

  const returnFlight = details.flight_details?.return || {
    from: 'Paris (CDG)',
    to: 'Kochi (COK)',
    departure_date: '22 Sep 2026',
    departure_time: '09:45 PM',
    arrival_date: '23 Sep 2026',
    arrival_time: '01:55 PM',
    duration: '11h 55m'
  };

  const hotelList = (Array.isArray(details.hotels) && details.hotels.length > 0)
    ? details.hotels
    : [
        { city: 'Paris', hotel_name: 'Hotel Novotel or Similar', rating: '★★★★', check_in: '15 Sep 2026', check_out: '17 Sep 2026' },
        { city: 'Lucerne', hotel_name: 'Hotel Ibis Styles or Similar', rating: '★★★★', check_in: '17 Sep 2026', check_out: '20 Sep 2026' },
        { city: 'Venice', hotel_name: 'Hotel Elite or Similar', rating: '★★★★', check_in: '20 Sep 2026', check_out: '22 Sep 2026' }
      ];

  const inclusionsList = (Array.isArray(details.inclusions) && details.inclusions.filter(Boolean).length > 0)
    ? details.inclusions.filter(Boolean)
    : [
        'Return Economy Airfare',
        'Schengen Visa Assistance',
        'Premium Hotel Accommodation',
        'Daily Breakfast',
        'Indian Lunch & Dinner',
        'Luxury Air-Conditioned Coach',
        'Airport Transfers',
        'Sightseeing as per itinerary',
        'Eiffel Tower Entry (2nd Level)',
        'Seine River Cruise',
        'Mt. Titlis Excursion',
        'Gondola Ride in Venice',
        'Professional Tour Manager',
        'Travel Insurance',
        'All applicable taxes (as per booking terms)'
      ];

  const exclusionsList = (Array.isArray(details.exclusions) && details.exclusions.filter(Boolean).length > 0)
    ? details.exclusions.filter(Boolean)
    : [
        'Personal Expenses',
        'Optional Tours',
        'Porterage & Tips',
        'Meals Not Mentioned',
        'Early Check-in / Late Check-out',
        'GST / TCS (If Applicable)',
        'Any item not mentioned under "Package Includes"'
      ];

  const needToKnowTopics = (Array.isArray(details.need_to_know) && details.need_to_know.length > 0)
    ? details.need_to_know
    : [
        {
          title: '📌 Check-in & Reporting Times',
          rules: [
            'Standard hotel check-in time: 02:00 PM (Local Time). Standard hotel check-out time: 12:00 PM (Local Time).',
            'Guests are requested to report at the airport at least 3 hours prior to the scheduled departure time for international flights.',
            'Keep your passport, visa, travel insurance, and flight tickets easily accessible throughout your journey.',
            'Early check-in and late check-out are subject to hotel availability and may incur additional charges.'
          ]
        },
        {
          title: '🧳 Luggage Allowance',
          rules: [
            'International airlines generally allow 20–30 kg of checked baggage per passenger (subject to airline policy).',
            'Cabin baggage allowance is usually 7 kg per passenger.',
            'Carry essential items such as medications, valuables, electronic devices, passports, and travel documents in your hand baggage.',
            'Lithium batteries and power banks must be carried in cabin baggage only, as per airline regulations.'
          ]
        },
        {
          title: '📑 Visa & Travel Documents',
          rules: [
            'Ensure your passport is valid for at least 6 months from the date of travel.',
            'Visa requirements vary by destination. Our team will provide complete assistance with visa documentation and application procedures wherever applicable.',
            'Travellers are advised to carry printed and digital copies of their passport, visa, flight tickets, hotel confirmations, and travel insurance.',
            'Visa approval is subject to the respective embassy or immigration authorities.'
          ]
        }
      ];

  return (
    <div className={styles.pageWrapper}>
      {/* 1. Hero Banner */}
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

      {/* 2. Inclusions Strip */}
      <div className={styles.inclusionsStrip}>
        <div className="container">
          <div className={styles.inclusionsGrid}>
            <div className={styles.inclusionItem}>
              <div className={styles.inclusionIcon}>🥐</div>
              <span>Breakfast Included</span>
            </div>
            <div className={styles.inclusionItem}>
              <div className={styles.inclusionIcon}>🏨</div>
              <span>Hotel Stay</span>
            </div>
            <div className={styles.inclusionItem}>
              <div className={styles.inclusionIcon}>🚌</div>
              <span>Transportation</span>
            </div>
            <div className={styles.inclusionItem}>
              <div className={styles.inclusionIcon}>🏞️</div>
              <span>Sightseeing</span>
            </div>
            <div className={styles.inclusionItem}>
              <div className={styles.inclusionIcon}>📞</div>
              <span>Tour Assistance 24x7</span>
            </div>
            <div className={styles.inclusionItem}>
              <div className={styles.inclusionIcon}>📄</div>
              <span>Visa Assistance</span>
            </div>
            <div className={styles.inclusionItem}>
              <div className={styles.inclusionIcon}>✈️</div>
              <span>Flight Included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Image Gallery (Matches Hotel Page Layout Exactly) */}
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
      {/* 3. Main Content & Sidebar Layout */}
      <div className="container">
        <div className={styles.mainLayout}>
          <div className={styles.mainContent}>
            
            {/* Quick Tour Info Card */}
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

            {/* Overview */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionHeaderTitle}>Tour Overview</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#475569', whiteSpace: 'pre-line' }}>
                {overviewText}
              </p>
            </div>

            {/* Tour Highlights */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionHeaderTitle}>Tour Highlights</h2>
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

            {/* Day-wise Itinerary */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionHeaderTitle}>Day-wise Itinerary</h2>
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
            </div>

            {/* Flight Details Section */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionHeaderTitle}>Flight Details</h2>
              <div className={styles.flightGrid}>
                {/* Onward Flight */}
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

                {/* Return Flight */}
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
              </div>
            </div>

            {/* Accommodation Details Table */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionHeaderTitle}>Accommodation Details</h2>
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
            </div>

            {/* Package Includes & Excludes */}
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

            {/* Need to Know Section */}
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
