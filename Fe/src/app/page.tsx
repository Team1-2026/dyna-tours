'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { categories } from '@/data/toursData';
import TourCard from '@/components/TourCard';
import { api, Hotel, getPackages } from '@/lib/api';

const stripHtml = (html: string) => html ? html.replace(/<[^>]*>/g, '') : '';

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [featuredTours, setFeaturedTours] = useState<any[]>([]);
  const [domesticTours, setDomesticTours] = useState<any[]>([]);
  const [showBlanketDescription, setShowBlanketDescription] = useState(false);

  useEffect(() => {
    api.getHotels({ featured: true })
      .then(data => {
        setFeaturedHotels(data);
      })
      .catch(err => {
        console.error('Failed to load featured hotels on home page', err);
      });
      
    getPackages().then(data => {
      setFeaturedTours(data.filter((tour: any) => tour.featured));
      setDomesticTours(data.filter((tour: any) => tour.holidayCategory?.includes('Domestic Tour Packages')).slice(0, 4));
    });
  }, []);

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (budget) params.append('budget', budget);
    
    router.push(`/tours?${params.toString()}`);
  };

  // Get Featured Tours fetched dynamically

  // Click Category Card
  const handleCategoryClick = (catName: string) => {
    router.push(`/tours?category=${catName}`);
  };

  // Mapping category name to styling classes
  const getCategoryClass = (name: string) => {
    switch (name) {
      case 'Adventure': return styles.catAdventure;
      case 'Culture': return styles.catCulture;
      case 'Leisure': return styles.catLeisure;
      case 'Nature': return styles.catNature;
      case 'History': return styles.catHistory;
      default: return '';
    }
  };

  return (
    <div>
      {/* 1. Split Hero Section */}
      <section className={styles.hero}>
        <div className={`${styles.heroGrid} container`}>
          {/* Hero Left: Text & Content */}
          <div className={styles.heroContent}>
            <span className={styles.heroSubtitle}>Exclusive Journeys & Tours</span>
            <h1 className={styles.heroTitle}>Crafting Memories, One Journey at a Time</h1>
            <p className={styles.heroText}>
              Discover the world's most extraordinary destinations. We combine premium accommodations, expert local guides, and fine-tuned itineraries.
            </p>
          </div>

          {/* Hero Right: Layered Asymmetric Cards Collage */}
          <div className={styles.collageContainer}>
            <div className={`${styles.collageCard} ${styles.collageCard1}`}>
              <div className={styles.collageImage} style={{ backgroundImage: `url('/images/swiss_alps.png')` }} />
            </div>
            <div className={`${styles.collageCard} ${styles.collageCard2}`}>
              <div className={styles.collageImage} style={{ backgroundImage: `url('/images/kyoto_japan.png')` }} />
            </div>
            <div className={`${styles.collageCard} ${styles.collageCard3}`}>
              <div className={styles.collageImage} style={{ backgroundImage: `url('/images/amalfi_coast.png')` }} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Redesigned Floating Search Form */}
      <div className={`${styles.searchContainer} container`}>
        <form className={styles.searchBar} onSubmit={handleSearch}>
          {/* Keyword Search */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Where to?</label>
            <div className={styles.searchIconWrapper}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-primary-red)" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search destinations..."
                className={styles.searchIconInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Category Select */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Activity Theme</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className={styles.searchSelect}
            >
              <option value="">All Categories</option>
              <option value="Adventure">🏔️ Adventure</option>
              <option value="Culture">⛩️ Culture</option>
              <option value="Leisure">🏖️ Leisure</option>
              <option value="Nature">🦁 Nature</option>
              <option value="History">🏛️ History</option>
            </select>
          </div>

          {/* Budget Select */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Max Budget</label>
            <select 
              value={budget} 
              onChange={(e) => setBudget(e.target.value)}
              className={styles.searchSelect}
            >
              <option value="">Any Budget</option>
              <option value="1500">Under ₹1,500</option>
              <option value="2000">Under ₹2,000</option>
              <option value="2500">Under ₹2,500</option>
            </select>
          </div>

          {/* Search CTA */}
          <button type="submit" className={`btn btn-primary ${styles.searchBtn}`}>
            Search Tours
          </button>
        </form>
      </div>

      {/* Popular Domestic Tour Packages Section */}
      {domesticTours.length > 0 && (
        <section className="section" style={{ backgroundColor: '#f8fafc' }}>
          <div className="container">
            <div className="section-title-wrap">
              <span className="section-subtitle">Explore India</span>
              <h2 className="section-title">Popular Domestic Tour Packages</h2>
            </div>
            
            <div className="responsive-grid">
              {domesticTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} layout="vertical" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Masonry Categories Section */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Travel Moods</span>
            <h2 className="section-title">Select Your Custom Vibe</h2>
          </div>
          
          <div className={styles.categoriesGrid}>
            {categories.map((cat) => (
              <div 
                key={cat.name} 
                className={`${styles.categoryCard} ${getCategoryClass(cat.name)}`}
                onClick={() => handleCategoryClick(cat.name)}
              >
                <div 
                  className={styles.categoryBg}
                  style={{ backgroundImage: `url(${cat.image})` }}
                />
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <h3 className={styles.categoryName}>{cat.name}</h3>
                <span className={styles.categoryCount}>{cat.count} Packages</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Tours Section */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Highly Recommended</span>
            <h2 className="section-title">Our Featured Tour Packages</h2>
          </div>
          
          <div className={styles.featuredGrid}>
            {featuredTours.map((tour, index) => {
              const isHorizontal = index === 0 || index === 3;
              return (
                <div 
                  key={tour.id} 
                  className={isHorizontal ? styles.featuredCardFull : ''}
                >
                  <TourCard 
                    tour={tour} 
                    layout={isHorizontal ? 'horizontal' : 'vertical'} 
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Featured Hotels Section */}
      {featuredHotels.length > 0 && (
        <section className="section" style={{ backgroundColor: 'var(--color-secondary-navy-light)' }}>
          <div className="container">
            <div className="section-title-wrap">
              <span className="section-subtitle">Luxury Accommodations</span>
              <h2 className="section-title">Featured Stays & Hotels</h2>
            </div>
            
            <div className="responsive-grid">
              {featuredHotels.map((hotel) => (
                <div key={hotel.id} style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-premium)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: '220px' }}>
                    <img 
                      src={(typeof hotel.gallery?.[0] === 'string' ? hotel.gallery[0] : (hotel.gallery?.[0] as any)?.url) || '/images/default_hotel.png'} 
                      alt={hotel.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span style={{ 
                      position: 'absolute', 
                      top: '1rem', 
                      left: '1rem', 
                      background: 'var(--color-primary-red)', 
                      color: '#ffffff', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: 'var(--radius-full)', 
                      fontSize: '0.75rem', 
                      fontWeight: 700 
                    }}>
                      {hotel.category}
                    </span>
                    {hotel.featured && (
                      <span style={{ 
                        position: 'absolute', 
                        top: '1rem', 
                        right: '1rem', 
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                        color: '#ffffff', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: 'var(--radius-full)', 
                        fontSize: '0.725rem', 
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" style={{ color: '#ffffff' }}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        Featured
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-secondary-navy)', marginBottom: '0.5rem' }}>
                      {hotel.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {hotel.location}
                    </div>
                    {hotel.id !== 'blanket-hotel-spa-munnar' ? (
                      <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem', flexGrow: 1 }}>
                        {stripHtml(hotel.short_description).slice(0, 140)}...
                      </p>
                    ) : (
                      showBlanketDescription && (
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                          {stripHtml(hotel.short_description).slice(0, 140)}...
                        </p>
                      )
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: 'auto' }}>
                      {hotel.id === 'blanket-hotel-spa-munnar' ? (
                        <button 
                          type="button"
                          onClick={() => setShowBlanketDescription(!showBlanketDescription)}
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
                          {showBlanketDescription ? 'Hide Description' : 'Show Description'}
                        </button>
                      ) : (
                        hotel.show_price && hotel.price && (
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>Rate / Night</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-red)' }}>
                              ₹{hotel.price}
                            </span>
                          </div>
                        )
                      )}
                      <Link href={`/hotels/${hotel.id}`} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Why Choose Us Section */}
      <section className={`section ${styles.whyChooseUs}`} id="about-us">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Dyna Difference</span>
            <h2 className="section-title">Why Travel With Dyna Tours</h2>
          </div>

          <div className={styles.featuresGrid}>
            {/* Feature 1 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Premium Stays</h3>
              <p className={styles.featureDescription}>
                We partner only with 4-star and 5-star boutique hotels, luxury lodges, and authentic heritage stays.
              </p>
            </div>

            {/* Feature 2 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Local Experts</h3>
              <p className={styles.featureDescription}>
                Every tour features native English-speaking guides who possess deep cultural and geographical insights.
              </p>
            </div>

            {/* Feature 3 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
                  <polyline points="2,8.5 12,15 22,8.5" />
                  <polyline points="12,22 12,15" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>Curated Itineraries</h3>
              <p className={styles.featureDescription}>
                We design schedules that perfectly balance highlights, food tours, and breathing space.
              </p>
            </div>

            {/* Feature 4 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className={styles.featureTitle}>24/7 Support</h3>
              <p className={styles.featureDescription}>
                Travel stress-free knowing our dedicated support team is available around the clock to assist you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <section className="section" id="testimonials">
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-subtitle">Reviews</span>
            <h2 className="section-title">What Our Guests Say</h2>
          </div>

          <div className={styles.testimonialsGrid}>
            {/* Testimonial 1 */}
            <div className={styles.testimonialCard}>
              <svg className={styles.quoteIcon} viewBox="0 0 24 24" width="50" height="50" fill="currentColor">
                <path d="M14,17h3l2-5V5h-6v7h3L14,17z M4,17h3l2-5V5H3v7h3L4,17z" />
              </svg>
              <div>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/></svg>
                  ))}
                </div>
                <p className={styles.quoteText}>
                  "The Swiss Alps tour was absolutely flawless. The Glacier Express panoramic views were stunning, and our hotel in Zermatt had the best views of the Matterhorn. Dyna Tours executed every detail perfectly!"
                </p>
              </div>
              <div className={styles.clientMeta}>
                <div className={styles.avatar}>SR</div>
                <div className={styles.clientInfo}>
                  <span className={styles.clientName}>Sarah R.</span>
                  <span className={styles.clientTour}>Swiss Alps Explorer</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className={styles.testimonialCard}>
              <svg className={styles.quoteIcon} viewBox="0 0 24 24" width="50" height="50" fill="currentColor">
                <path d="M14,17h3l2-5V5h-6v7h3L14,17z M4,17h3l2-5V5H3v7h3L4,17z" />
              </svg>
              <div>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/></svg>
                  ))}
                </div>
                <p className={styles.quoteText}>
                  "Our tea ceremony experience in Kyoto was so peaceful and educational. The local ryokan hotel felt like a step back in time but with 5-star comfort. Thank you for a wonderful cultural escape."
                </p>
              </div>
              <div className={styles.clientMeta}>
                <div className={styles.avatar}>MK</div>
                <div className={styles.clientInfo}>
                  <span className={styles.clientName}>Marcus K.</span>
                  <span className={styles.clientTour}>Kyoto Cultural Explorer</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className={styles.testimonialCard}>
              <svg className={styles.quoteIcon} viewBox="0 0 24 24" width="50" height="50" fill="currentColor">
                <path d="M14,17h3l2-5V5h-6v7h3L14,17z M4,17h3l2-5V5H3v7h3L4,17z" />
              </svg>
              <div>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/></svg>
                  ))}
                </div>
                <p className={styles.quoteText}>
                  "We saw the 'Big Five' on our first day in the Ngorongoro Crater! The safari vehicles are highly customized with pop-up roofs, and our guide was an absolute genius at spotting wildlife. Lifetime memories."
                </p>
              </div>
              <div className={styles.clientMeta}>
                <div className={styles.avatar}>ED</div>
                <div className={styles.clientInfo}>
                  <span className={styles.clientName}>Elena D.</span>
                  <span className={styles.clientTour}>Serengeti Safari</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
