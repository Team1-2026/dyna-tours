'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { groupToursApi, GroupTour, GroupTourPage, GroupTourDetails } from '@/lib/api';
import styles from './group-tours.module.css';
import Pagination from '@/components/Pagination';

const parseDetails = (tour: GroupTour | null): GroupTourDetails => {
  if (!tour || !tour.full_details) return {};
  if (typeof tour.full_details === 'object') return tour.full_details as GroupTourDetails;
  try {
    return JSON.parse(tour.full_details);
  } catch (e) {
    return {};
  }
};

const defaultTours: GroupTour[] = [
  {
    id: 1,
    name: 'Panoramic Europe – Alpine Grandeur & Cultural Treasures',
    type: 'international',
    destination: 'France • Switzerland • Italy',
    duration: '7 Nights / 8 Days',
    starting_price: 199999,
    status: 'Filling Fast',
    is_featured: true,
    featured_order: 1,
    departure_date: '2026-09-15',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000',
    is_visible: true,
    created_at: '',
    updated_at: ''
  },
  {
    id: 2,
    name: 'Swiss Alps Explorer',
    type: 'international',
    destination: 'Switzerland',
    duration: '7 Nights / 8 Days',
    starting_price: 179999,
    status: 'Filling Fast',
    is_featured: true,
    featured_order: 2,
    departure_date: '2026-07-15',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=1000',
    is_visible: true,
    created_at: '',
    updated_at: ''
  },
  {
    id: 3,
    name: 'Thailand Discovery',
    type: 'international',
    destination: 'Thailand',
    duration: '6 Nights / 7 Days',
    starting_price: 59999,
    status: 'Limited Seats',
    is_featured: true,
    featured_order: 3,
    departure_date: '2026-09-18',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=1000',
    is_visible: true,
    created_at: '',
    updated_at: ''
  },
  {
    id: 4,
    name: 'Dubai Explorer',
    type: 'international',
    destination: 'Dubai',
    duration: '5 Nights / 6 Days',
    starting_price: 45999,
    status: 'Sold Out',
    is_featured: false,
    featured_order: 4,
    departure_date: '2026-11-05',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1000',
    is_visible: true,
    created_at: '',
    updated_at: ''
  }
];

import { useSearchParams } from 'next/navigation';
import CountryCodeSelect from '@/components/CountryCodeSelect';
import { isValidPhone, validatePhoneByCountry } from '@/lib/phoneValidation';

const formatDepartureDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const dynamic = 'force-dynamic';

function GroupToursContent() {
  const searchParams = useSearchParams();
  const [pageData, setPageData] = useState<GroupTourPage | null>(null);
  const [tours, setTours] = useState<GroupTour[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [destFilter, setDestFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Overview toggle
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  // Selected tour for enquiry
  const [selectedTourForEnquiry, setSelectedTourForEnquiry] = useState<GroupTour | null>(null);

  // Enquiry Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    num_travellers: 2,
    message: '',
    group_tour_id: '',
    preferred_date: '2026-09-15'
  });
  const [countryCode, setCountryCode] = useState('+91');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const toursRef = useRef<HTMLDivElement>(null);
  const enquiryFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const urlDest = searchParams?.get('destination') || searchParams?.get('search') || '';
    const urlType = searchParams?.get('type') || '';

    if (urlDest) setDestFilter(urlDest);
    if (urlType) setTypeFilter(urlType);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pData, tData] = await Promise.all([
          groupToursApi.getPage(),
          groupToursApi.getTours({ visible_only: true })
        ]);
        setPageData(pData);
        setTours(tData && tData.length > 0 ? tData : defaultTours);
      } catch (err) {
        console.error('Failed to load group tours data:', err);
        setTours(defaultTours);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayTours = tours.length > 0 ? tours : defaultTours;
  const filteredTours = displayTours.filter(t => {
    if (destFilter && !t.destination.toLowerCase().includes(destFilter.toLowerCase())) return false;
    if (typeFilter && t.type !== typeFilter) return false;
    return true;
  });

  const uniqueDestinations = Array.from(new Set(displayTours.map(t => t.destination)));

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openEnquiryModal = (tour?: GroupTour) => {
    if (tour) {
      setSelectedTourForEnquiry(tour);
      setFormData(prev => ({ ...prev, group_tour_id: String(tour.id) }));
    }
    enquiryFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      alert("Please fill all required fields.");
      return;
    }
    const phoneCheck = validatePhoneByCountry(formData.phone, countryCode);
    if (!phoneCheck.isValid) {
      alert(phoneCheck.message || 'Please enter a valid phone number.');
      return;
    }
    setFormStatus('loading');
    try {
      const tourNameInfo = selectedTourForEnquiry ? `Interested in ${selectedTourForEnquiry.name}` : '';
      const finalMessage = tourNameInfo
        ? (formData.message ? `${tourNameInfo}\n${formData.message}` : tourNameInfo)
        : formData.message;

      await groupToursApi.submitEnquiry({
        ...formData,
        message: finalMessage,
        phone: `${countryCode} ${formData.phone}`,
        group_tour_id: formData.group_tour_id ? Number(formData.group_tour_id) : undefined
      });
      setFormStatus('success');
    } catch (err: any) {
      console.error(err);
      setFormStatus('error');
      alert(err?.message || 'Failed to submit enquiry. Please try again.');
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Available':
      case 'Booking Open': return styles.statusAvailable;
      case 'Filling Fast': return styles.statusFilling;
      case 'Limited Seats': return styles.statusLimited;
      case 'Sold Out': return styles.statusSoldOut;
      default: return styles.statusAvailable;
    }
  };

  const defaultBanner = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000';
  const defaultOverviewImage = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000';

  return (
    <div className={styles.pageContainer}>
      
      {/* 1. Hero Section */}
      <section 
        className={styles.hero} 
        style={{ backgroundImage: `url(${pageData?.banner_image || defaultBanner})` }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span>›</span>
            <span>Group Tours</span>
          </div>
          <h1 className={styles.heroTitle}>{pageData?.title || 'Group Tours'}</h1>
          <p className={styles.heroTagline}>{pageData?.tagline || 'Travel together. Experience more. Handpicked group tours to the world’s most amazing destinations.'}</p>
        </div>
      </section>

      {/* 2. Floating Search Bar Overlay */}
      <section className={styles.searchSection}>
        <div className={styles.searchInputGroup}>
          <label>Destination</label>
          <select 
            className={styles.searchSelect} 
            value={destFilter} 
            onChange={e => setDestFilter(e.target.value)}
          >
            <option value="">Where do you want to go?</option>
            {uniqueDestinations.map(dest => (
              <option key={dest} value={dest}>{dest}</option>
            ))}
          </select>
        </div>

        <div className={styles.searchInputGroup}>
          <label>Tour Type</label>
          <select 
            className={styles.searchSelect} 
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>
        </div>

        <button 
          className={styles.searchBtn} 
          onClick={() => toursRef.current?.scrollIntoView({ behavior: 'smooth' })}
        >
          🔍 Search Tours
        </button>
      </section>

      {/* 3. Split Overview Section */}
      <section className={styles.overviewSection}>
        <div className={styles.overviewImageWrapper}>
          <img 
            src={pageData?.overview_image || defaultOverviewImage} 
            alt="The Ultimate Way to Experience Global Adventures" 
            className={styles.overviewImage} 
          />
        </div>
        <div className={styles.overviewContent}>
          <span className={styles.sectionSubtitle}>TRAVEL TOGETHER</span>
          <h2 className={styles.overviewHeading}>{pageData?.overview_heading || 'The Ultimate Way to Experience Global Adventures'}</h2>
          
          <div className={styles.overviewText}>
            <p>
              Group Tours transform how you experience the world, bringing together like-minded travelers for journeys filled with convenience, connection, and carefully curated experiences.
            </p>
            {isOverviewExpanded && (
              <>
                <p style={{ marginTop: '1rem' }}>
                  Our specialized Group Tour Packages accommodate diverse interests, perfect whether you're setting out with family, friends, or colleagues.
                </p>
                <p style={{ marginTop: '1rem' }}>
                  Well-planned itineraries and supervised tours at their core, these adventures celebrate togetherness while creating lasting memories.
                </p>
              </>
            )}
          </div>
          
          <button 
            className={styles.readMoreBtn} 
            onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
          >
            {isOverviewExpanded ? 'Read Less ▲' : 'Read More ▼'}
          </button>
        </div>
      </section>

      {/* 4. Tour Packages Grid Section */}
      <section className={styles.packagesSection} id="tours" ref={toursRef}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className={styles.sectionSubtitle}>EXPLORE TOGETHER</span>
          <h2 className={styles.sectionTitle}>Tour Packages</h2>
          <p className={styles.sectionDescription}>
            Discover expertly crafted group tours that bring together must-see landmarks, cultural highlights, and shared experiences – perfectly designed for travellers who love exploring together.
          </p>
        </div>

        <div className={styles.packagesGrid}>
          {filteredTours
            .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
            .map(tour => {
              const det = parseDetails(tour);
              const isShowPrice = det.show_price !== false;

              return (
                <div key={tour.id} className={styles.tourCard}>
                  <div 
                    className={styles.tourCardImage} 
                    style={{ backgroundImage: `url(${tour.image || defaultBanner})` }}
                  >
                    <span className={`${styles.statusBadge} ${getStatusClass(tour.status)}`}>
                      {tour.status}
                    </span>
                  </div>
                  <div className={styles.tourCardContent}>
                    <h3 className={styles.tourTitle}>{tour.name}</h3>
                    <div className={styles.tourMeta}>
                      <span className={styles.tourMetaItem}>⏱️ {tour.duration}</span>
                      {tour.departure_date && (
                        <span className={styles.tourMetaItem} suppressHydrationWarning>📅 {formatDepartureDate(tour.departure_date)}</span>
                      )}
                    </div>
                    <div className={styles.tourPriceRow}>
                      <span className={styles.priceLabel}>{isShowPrice ? 'From' : 'Price'}</span>
                      {isShowPrice ? (
                        <span className={styles.priceValue}>₹{Number(tour.starting_price).toLocaleString('en-IN')}/-</span>
                      ) : (
                        <span className={styles.priceValue} style={{ fontSize: '1.05rem', color: '#2563eb' }}>On Request</span>
                      )}
                    </div>
                  
                    <div className={styles.cardActionsRow}>
                      <Link href={`/group-tours/${tour.id}`} className={styles.btnViewDetails}>
                        View Details
                      </Link>
                      <button className={styles.btnEnquireNow} onClick={() => openEnquiryModal(tour)}>
                        Enquire Now
                      </button>
                      <a 
                        href={`https://wa.me/919746470555?text=Hi,%20I'm%20interested%20in%20${encodeURIComponent(tour.name)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.btnWhatsappIcon}
                        title="Chat on WhatsApp"
                      >
                        💬
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredTours.length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
          totalItems={filteredTours.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </section>

      {/* 5. Upcoming Group Departures Banner Carousel */}
      <section className={styles.upcomingBannerSection}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span className={styles.upcomingTag}>UPCOMING GROUP DEPARTURES</span>
        </div>

        <div className={styles.upcomingCard}>
          <div className={styles.upcomingCardBg} />
          <div className={styles.upcomingContent}>
            <div className={styles.upcomingLeft}>
              <div className={styles.upcomingTitleBadge}>Europe</div>
              <h3 className={styles.upcomingHeading}>8D | 7N GROUP TOUR</h3>
              <p className={styles.upcomingSub}>Panoramic Europe – Alpine Grandeur & Cultural Treasures</p>
              
              <div className={styles.upcomingFeatures}>
                <span>🏨 Premium Hotels</span>
                <span>🍛 Indian Meals</span>
                <span>👨‍💼 Expert Tour Manager</span>
                <span>🏞️ All Major Sightseeing</span>
              </div>
            </div>

            <div className={styles.upcomingRight}>
              <div className={styles.depDateLabel}>DEPARTURE DATE</div>
              <div className={styles.depDateValue}>15 SEP 2026</div>
              <span className={styles.statusFilling}>FILLING FAST</span>
              
              <div className={styles.priceBlock}>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>STARTING FROM</span>
                <div className={styles.bigPrice}>₹1,99,999/-</div>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>PER PERSON</span>
              </div>

              <Link href="/group-tours/1" className={styles.btnUpcomingDetails}>
                View Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Plan Your Next Group Adventure Section & Enquiry Form */}
      <section className={styles.enquirySection} ref={enquiryFormRef}>
        <div className={styles.enquiryGrid}>
          {/* Left Info Column */}
          <div className={styles.enquiryLeftCol}>
            <h2 className={styles.enquiryHeading}>Plan Your Next Group Adventure</h2>
            <p className={styles.enquirySub}>Our travel experts are here to help you choose the perfect group tour.</p>
            
            <ul className={styles.featureList}>
              <li>
                <span className={styles.featureIcon}>🏷️</span>
                <span>Best Group Tour Deals</span>
              </li>
              <li>
                <span className={styles.featureIcon}>👨‍💼</span>
                <span>Expert Travel Assistance</span>
              </li>
              <li>
                <span className={styles.featureIcon}>🛡️</span>
                <span>Safe & Comfortable Travel</span>
              </li>
              <li>
                <span className={styles.featureIcon}>📞</span>
                <span>24/7 Customer Support</span>
              </li>
            </ul>
          </div>

          {/* Right Form Column */}
          <div className={styles.enquiryFormCard}>
            {formStatus === 'success' ? (
              <div className={styles.successBox}>
                ✓ Thank you! We have received your enquiry for {selectedTourForEnquiry?.name || 'Group Tours'}. Our travel expert will get in touch with you shortly.
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Enter your full name" 
                      value={formData.name} 
                      onChange={handleFormChange} 
                      className={styles.formInput} 
                      required 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Mobile Number *</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                      <input 
                        type="tel" 
                        name="phone" 
                        placeholder="Enter your mobile number" 
                        value={formData.phone} 
                        onChange={handleFormChange} 
                        className={styles.formInput} 
                        style={{ flex: 1, minWidth: 0 }}
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Email Address *</label>
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Enter your email address" 
                      value={formData.email} 
                      onChange={handleFormChange} 
                      className={styles.formInput} 
                      required 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Preferred Tour *</label>
                    <select 
                      name="group_tour_id" 
                      value={formData.group_tour_id} 
                      onChange={handleFormChange} 
                      className={styles.formInput}
                    >
                      <option value="">Select a tour</option>
                      {displayTours.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Number of Travellers *</label>
                    <select 
                      name="num_travellers" 
                      value={formData.num_travellers} 
                      onChange={handleFormChange} 
                      className={styles.formInput}
                    >
                      <option value={1}>1 Traveller</option>
                      <option value={2}>2 Travellers</option>
                      <option value={3}>3-5 Travellers</option>
                      <option value={6}>6+ Group</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Preferred Departure Date *</label>
                    <input 
                      type="date" 
                      name="preferred_date" 
                      value={formData.preferred_date} 
                      onChange={handleFormChange} 
                      className={styles.formInput} 
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Message</label>
                  <textarea 
                    name="message" 
                    placeholder="Tell us more about your travel plans..." 
                    value={formData.message} 
                    onChange={handleFormChange} 
                    className={styles.formInput} 
                    rows={3}
                  />
                </div>

                <div className={styles.formButtonsRow}>
                  <button type="submit" className={styles.btnSubmitRed}>
                    Submit Enquiry
                  </button>

                  <a 
                    href="https://wa.me/919746470555?text=Hi,%20I'm%20interested%20in%20Group%20Tours" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.btnWhatsappGreen}
                  >
                    💬 WhatsApp Enquiry
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

export default function GroupToursPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', fontWeight: 600 }}>
          Loading group tours...
        </p>
      </div>
    }>
      <GroupToursContent />
    </Suspense>
  );
}
