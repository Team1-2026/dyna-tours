'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import styles from './group-tour-details.module.css';

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
  const [submitted, setSubmitted] = useState(false);

  const toggleDay = (day: number) => {
    setActiveDay(activeDay === day ? null : day);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 1. Hero Banner */}
      <section 
        className={styles.heroSection}
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=2000')` }}
      >
        <div className={styles.heroOverlay} />
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/group-tours">Group Tours</Link>
              <span>/</span>
              <span style={{ color: '#ffffff' }}>Panoramic Europe</span>
            </div>

            <div className={styles.badgesRow}>
              <span className={`${styles.statusBadge} ${styles.badgeFilling}`}>🔥 Filling Fast</span>
              <span className={`${styles.statusBadge} ${styles.badgeDuration}`}>⏱️ 7 Nights / 8 Days</span>
              <span className={`${styles.statusBadge} ${styles.badgeSeats}`}>👥 Max 30 Seats</span>
            </div>

            <h1 className={styles.heroTitle}>Panoramic Europe – Alpine Grandeur & Cultural Treasures</h1>
            <p className={styles.heroSubtitle}>Discover the Best of Europe in One Unforgettable Journey</p>

            <div className={styles.priceTag}>
              <span className={styles.priceLabel}>Starting From</span>
              <span className={styles.priceValue}>₹1,99,999/-</span>
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
                  <div className={styles.quickInfoValue}>Kochi (COK)</div>
                </div>
                <div className={styles.quickInfoItem}>
                  <div className={styles.quickInfoLabel}>Trip To</div>
                  <div className={styles.quickInfoValue}>France • Switzerland • Italy</div>
                </div>
                <div className={styles.quickInfoItem}>
                  <div className={styles.quickInfoLabel}>Group Size</div>
                  <div className={styles.quickInfoValue}>20–30 Travellers</div>
                </div>
                <div className={styles.quickInfoItem}>
                  <div className={styles.quickInfoLabel}>Accommodation</div>
                  <div className={styles.quickInfoValue}>Premium 4★ Hotels</div>
                </div>
                <div className={styles.quickInfoItem}>
                  <div className={styles.quickInfoLabel}>Transportation</div>
                  <div className={styles.quickInfoValue}>Luxury Private A/C Coach</div>
                </div>
                <div className={styles.quickInfoItem}>
                  <div className={styles.quickInfoLabel}>Duration</div>
                  <div className={styles.quickInfoValue}>7 Nights / 8 Days</div>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionHeaderTitle}>Tour Overview</h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#475569' }}>
                Experience the timeless charm of Europe with our Panoramic Europe – Alpine Grandeur & Cultural Treasures group tour. From the romantic streets of Paris to the breathtaking Swiss Alps and the enchanting canals of Venice, this carefully crafted itinerary combines iconic landmarks, spectacular mountain scenery, and rich cultural experiences. Travel comfortably with an experienced tour manager while enjoying premium accommodations, guided sightseeing, and memorable experiences across three of Europe's most beautiful destinations.
              </p>
            </div>

            {/* Tour Highlights */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionHeaderTitle}>Tour Highlights</h2>
              <div className={styles.highlightsGrid}>
                {[
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
                ].map((item, idx) => (
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
                {[
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
                ].map((item) => (
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
                        
                        {item.places && (
                          <div>
                            <div className={styles.itinerarySubHeader}>Places Covered</div>
                            <ul className={styles.placesList}>
                              {item.places.map((p, idx) => (
                                <li key={idx} className={styles.placeChip}>{p}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {item.highlights && (
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
                          <span>🍽️ <strong>Meals:</strong> {item.meals}</span>
                          <span>🏨 <strong>Overnight:</strong> {item.overnight}</span>
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
                    <span className={styles.flightDurationBadge}>✈️ 12h 45m</span>
                  </div>
                  <div className={styles.flightRoute}>
                    <div>
                      <div className={styles.cityName}>Kochi (COK)</div>
                      <div className={styles.flightTime}>09:30 PM</div>
                      <div className={styles.flightDate}>15 Sep 2026</div>
                    </div>
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '1.25rem' }}>➔</div>
                    <div style={{ textAlign: 'right' }}>
                      <div className={styles.cityName}>Paris (CDG)</div>
                      <div className={styles.flightTime}>08:15 AM</div>
                      <div className={styles.flightDate}>16 Sep 2026</div>
                    </div>
                  </div>
                </div>

                {/* Return Flight */}
                <div className={styles.flightCard}>
                  <div className={styles.flightCardHeader}>
                    <span className={styles.flightTypeLabel}>🛬 Return Journey</span>
                    <span className={styles.flightDurationBadge}>✈️ 11h 55m</span>
                  </div>
                  <div className={styles.flightRoute}>
                    <div>
                      <div className={styles.cityName}>Paris (CDG)</div>
                      <div className={styles.flightTime}>09:45 PM</div>
                      <div className={styles.flightDate}>22 Sep 2026</div>
                    </div>
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '1.25rem' }}>➔</div>
                    <div style={{ textAlign: 'right' }}>
                      <div className={styles.cityName}>Kochi (COK)</div>
                      <div className={styles.flightTime}>01:55 PM</div>
                      <div className={styles.flightDate}>23 Sep 2026</div>
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
                    <tr>
                      <td><strong>Paris</strong></td>
                      <td>Hotel Novotel or Similar</td>
                      <td><span className={styles.stars}>★★★★</span></td>
                      <td>15 Sep 2026</td>
                      <td>17 Sep 2026</td>
                    </tr>
                    <tr>
                      <td><strong>Lucerne</strong></td>
                      <td>Hotel Ibis Styles or Similar</td>
                      <td><span className={styles.stars}>★★★★</span></td>
                      <td>17 Sep 2026</td>
                      <td>20 Sep 2026</td>
                    </tr>
                    <tr>
                      <td><strong>Venice</strong></td>
                      <td>Hotel Elite or Similar</td>
                      <td><span className={styles.stars}>★★★★</span></td>
                      <td>20 Sep 2026</td>
                      <td>22 Sep 2026</td>
                    </tr>
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
                    {[
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
                    ].map((inc, idx) => (
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
                    {[
                      'Personal Expenses',
                      'Optional Tours',
                      'Porterage & Tips',
                      'Meals Not Mentioned',
                      'Early Check-in / Late Check-out',
                      'GST / TCS (If Applicable)',
                      'Any item not mentioned under "Package Includes"'
                    ].map((exc, idx) => (
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
                
                <div className={styles.needToKnowTopic}>
                  <h3 className={styles.topicTitle}>📌 Check-in & Reporting Times</h3>
                  <ul className={styles.topicList}>
                    <li>Standard hotel check-in time: 02:00 PM (Local Time). Standard hotel check-out time: 12:00 PM (Local Time).</li>
                    <li>Guests are requested to report at the airport at least 3 hours prior to the scheduled departure time for international flights.</li>
                    <li>Keep your passport, visa, travel insurance, and flight tickets easily accessible throughout your journey.</li>
                    <li>Early check-in and late check-out are subject to hotel availability and may incur additional charges.</li>
                  </ul>
                </div>

                <div className={styles.needToKnowTopic}>
                  <h3 className={styles.topicTitle}>🧳 Luggage Allowance</h3>
                  <ul className={styles.topicList}>
                    <li>International airlines generally allow 20–30 kg of checked baggage per passenger (subject to airline policy).</li>
                    <li>Cabin baggage allowance is usually 7 kg per passenger.</li>
                    <li>Carry essential items such as medications, valuables, electronic devices, passports, and travel documents in your hand baggage.</li>
                    <li>Lithium batteries and power banks must be carried in cabin baggage only, as per airline regulations.</li>
                  </ul>
                </div>

                <div className={styles.needToKnowTopic}>
                  <h3 className={styles.topicTitle}>📑 Visa & Travel Documents</h3>
                  <ul className={styles.topicList}>
                    <li>Ensure your passport is valid for at least 6 months from the date of travel.</li>
                    <li>Visa requirements vary by destination. Our team will provide complete assistance with visa documentation and application procedures wherever applicable.</li>
                    <li>Travellers are advised to carry printed and digital copies of their passport, visa, flight tickets, hotel confirmations, and travel insurance.</li>
                    <li>Visa approval is subject to the respective embassy or immigration authorities.</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Related Packages */}
            <div className={styles.relatedSection}>
              <h2 className={styles.sectionHeaderTitle}>Related Group Tour Packages</h2>
              <div className={styles.relatedGrid}>
                {[
                  { title: 'Swiss Alps Explorer', duration: '7 Nights / 8 Days', price: '₹1,79,999', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800' },
                  { title: 'European Highlights', duration: '9 Nights / 10 Days', price: '₹1,99,999', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=800' },
                  { title: 'Thailand Discovery', duration: '6 Nights / 7 Days', price: '₹59,999', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800' },
                  { title: 'Dubai Explorer', duration: '5 Nights / 6 Days', price: '₹45,999', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800' }
                ].map((rel, idx) => (
                  <div key={idx} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ height: '160px', backgroundImage: `url(${rel.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>{rel.title}</h4>
                      <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem' }}>⏱️ {rel.duration}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#dc2626' }}>{rel.price}</span>
                        <Link href="/group-tours" style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#2563eb', textDecoration: 'none' }}>View Tour →</Link>
                      </div>
                    </div>
                  </div>
                ))}
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
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '1.25rem', borderRadius: '8px', textAlign: 'center' }}>
                    ✓ Thank you! Our travel expert will call you shortly regarding seat availability and booking details.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <input 
                      type="text" 
                      placeholder="Full Name *" 
                      className={styles.formControl} 
                      value={formData.name} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })} 
                      required 
                    />
                    <input 
                      type="email" 
                      placeholder="Email Address *" 
                      className={styles.formControl} 
                      value={formData.email} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })} 
                      required 
                    />
                    <input 
                      type="tel" 
                      placeholder="Phone Number *" 
                      className={styles.formControl} 
                      value={formData.phone} 
                      onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                      required 
                    />
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Travellers</label>
                        <input 
                          type="number" 
                          className={styles.formControl} 
                          value={formData.num_travellers} 
                          onChange={e => setFormData({ ...formData, num_travellers: Number(e.target.value) })} 
                          min={1} 
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Departure</label>
                        <input 
                          type="date" 
                          className={styles.formControl} 
                          value={formData.travel_date} 
                          onChange={e => setFormData({ ...formData, travel_date: e.target.value })} 
                        />
                      </div>
                    </div>
                    <textarea 
                      placeholder="Special Requirements / Queries" 
                      rows={3} 
                      className={styles.formControl} 
                      value={formData.message} 
                      onChange={e => setFormData({ ...formData, message: e.target.value })} 
                    />
                    <button type="submit" className={styles.btnSubmit}>
                      Submit Enquiry
                    </button>
                    <a 
                      href="https://wa.me/919846665005?text=Hi,%20I'm%20interested%20in%20Panoramic%20Europe%20Group%20Tour" 
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
