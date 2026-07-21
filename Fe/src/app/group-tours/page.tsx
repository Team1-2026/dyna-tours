'use client';

import React, { useEffect, useState, useRef } from 'react';
import { groupToursApi, GroupTour, GroupTourPage } from '@/lib/api';
import styles from './group-tours.module.css';

export default function GroupToursPage() {
  const [pageData, setPageData] = useState<GroupTourPage | null>(null);
  const [tours, setTours] = useState<GroupTour[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [destFilter, setDestFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Overview toggle
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  // Enquiry Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    num_travellers: 1,
    message: '',
    group_tour_id: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const toursRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pData, tData] = await Promise.all([
          groupToursApi.getPage(),
          groupToursApi.getTours({ visible_only: true })
        ]);
        setPageData(pData);
        setTours(tData);
      } catch (err) {
        console.error('Failed to load group tours data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredTours = tours.filter(t => t.is_featured).sort((a, b) => a.featured_order - b.featured_order);
  const filteredTours = tours.filter(t => {
    if (destFilter && !t.destination.toLowerCase().includes(destFilter.toLowerCase())) return false;
    if (typeFilter && t.type !== typeFilter) return false;
    return true;
  });

  const uniqueDestinations = Array.from(new Set(tours.map(t => t.destination)));

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validations
    if (!formData.name || !formData.phone || !formData.email) {
      alert("Please fill all required fields.");
      return;
    }
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    setFormStatus('loading');
    try {
      await groupToursApi.submitEnquiry({
        ...formData,
        group_tour_id: formData.group_tour_id ? Number(formData.group_tour_id) : undefined
      });
      setFormStatus('success');
      setFormData({
        name: '', email: '', phone: '', num_travellers: 1, message: '', group_tour_id: ''
      });
    } catch (err) {
      console.error(err);
      setFormStatus('error');
      alert("Failed to submit enquiry. Please try again.");
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Available': return styles.statusAvailable;
      case 'Filling Fast': return styles.statusFilling;
      case 'Limited Seats': return styles.statusLimited;
      case 'Sold Out': return styles.statusSoldOut;
      default: return styles.statusAvailable;
    }
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  const defaultBanner = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000';
  const defaultOverviewImage = 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&q=80&w=1000';

  return (
    <div className={styles.pageContainer}>
      
      {/* Hero Section */}
      <section 
        className={styles.hero} 
        style={{ backgroundImage: `url(${pageData?.banner_image || defaultBanner})` }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{pageData?.title || 'Group Tours'}</h1>
          <p className={styles.heroTagline}>{pageData?.tagline || 'Explore the World Together'}</p>
          <a 
            href="#tours" 
            className={styles.ctaButton}
            onClick={(e) => {
              e.preventDefault();
              toursRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore Group Tours
          </a>
        </div>
      </section>

      {/* Search Section */}
      <section className={styles.searchSection}>
        <div className={styles.searchInputGroup}>
          <label>Destination</label>
          <select 
            className={styles.searchSelect} 
            value={destFilter} 
            onChange={e => setDestFilter(e.target.value)}
          >
            <option value="">All Destinations</option>
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
      </section>

      {/* Overview Section */}
      <section className={styles.overviewSection}>
        <div className={styles.overviewContent}>
          <h2>{pageData?.overview_heading || 'Why Choose Our Group Tours?'}</h2>
          
          <div className={styles.overviewText}>
            <div dangerouslySetInnerHTML={{ 
              __html: isOverviewExpanded 
                ? (pageData?.overview_description || '') 
                : (pageData?.overview_description || '').substring(0, 300) + '...'
            }} />
          </div>
          
          {(pageData?.overview_description?.length || 0) > 300 && (
            <button 
              className={styles.readMoreBtn} 
              onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
            >
              {isOverviewExpanded ? 'Read Less' : 'Read More →'}
            </button>
          )}
        </div>
        <div>
          <img 
            src={pageData?.overview_image || defaultOverviewImage} 
            alt="Group Tour Overview" 
            className={styles.overviewImage} 
          />
        </div>
      </section>

      {/* Featured Tours Carousel */}
      {featuredTours.length > 0 && (
        <section className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Upcoming & Featured Departures</h2>
          <div className={styles.carouselContainer}>
            {featuredTours.map(tour => (
              <div key={tour.id} className={styles.carouselItem}>
                <div className={styles.tourCard}>
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
                      <span className={styles.tourMetaItem}>📍 {tour.destination}</span>
                      <span className={styles.tourMetaItem}>⏱️ {tour.duration}</span>
                    </div>
                    {tour.departure_date && (
                      <div style={{ marginBottom: '15px', color: '#ff6b6b', fontWeight: 600, fontSize: '0.9rem' }}>
                        📅 Departs: {new Date(tour.departure_date).toLocaleDateString()}
                      </div>
                    )}
                    <div className={styles.tourPrice}>
                      <span className={styles.priceLabel}>Starting from</span>
                      <span className={styles.priceValue}>₹{tour.starting_price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Tours Grid */}
      <section className={styles.packagesSection} id="tours" ref={toursRef}>
        <h2 className={styles.sectionTitle}>All Group Tour Packages</h2>
        {filteredTours.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>No tours found matching your criteria.</p>
        ) : (
          <div className={styles.packagesGrid}>
            {filteredTours.map(tour => (
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
                    <span className={styles.tourMetaItem}>📍 {tour.destination}</span>
                    <span className={styles.tourMetaItem}>⏱️ {tour.duration}</span>
                  </div>
                  {tour.departure_date && (
                    <div style={{ marginBottom: '15px', color: '#e67e22', fontWeight: 600, fontSize: '0.9rem' }}>
                      📅 Departs: {new Date(tour.departure_date).toLocaleDateString()}
                    </div>
                  )}
                  <div className={styles.tourPrice}>
                    <span className={styles.priceLabel}>Starting from</span>
                    <span className={styles.priceValue}>₹{tour.starting_price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Enquiry Form Section */}
      <section className={styles.enquirySection}>
        <div className={styles.enquiryForm}>
          <h2 className={styles.sectionTitle} style={{ marginBottom: '10px' }}>Enquire Now</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
            Interested in joining a group tour? Fill out the form below and our travel experts will contact you.
          </p>

          {formStatus === 'success' ? (
            <div className={styles.successMessage}>
              Thank you for your enquiry! We have received your details and will get back to you shortly.
            </div>
          ) : (
            <form onSubmit={handleEnquirySubmit}>
              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleFormChange} 
                  className={styles.formControl} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleFormChange} 
                  className={styles.formControl} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Phone Number * (e.g. +919876543210)</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleFormChange} 
                  className={styles.formControl} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Number of Travellers</label>
                <input 
                  type="number" 
                  name="num_travellers" 
                  value={formData.num_travellers} 
                  onChange={handleFormChange} 
                  className={styles.formControl} 
                  min="1" 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Which Tour are you interested in?</label>
                <select 
                  name="group_tour_id" 
                  value={formData.group_tour_id} 
                  onChange={handleFormChange} 
                  className={styles.formControl}
                >
                  <option value="">General Enquiry / Unsure</option>
                  {tours.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Additional Message</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleFormChange} 
                  className={styles.formControl} 
                  rows={4}
                ></textarea>
              </div>
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={formStatus === 'loading'}
              >
                {formStatus === 'loading' ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
