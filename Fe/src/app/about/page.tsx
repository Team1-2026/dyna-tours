import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './about.module.css';
import { getBaseUrl, AboutPage as IAboutPage } from '@/lib/api';

export const metadata: Metadata = {
  title: 'About Us | Dyna Tours India - 16+ Years of Travel Excellence',
  description: 'Learn about Dyna Tours India, a premier travel management company with over 16 years of expertise in domestic and international holidays, flight bookings, visas, hotels, and corporate travel.',
  keywords: 'Dyna Tours, About Dyna Tours India, Travel Company Kerala, Changanassery Kottayam Travel Agency, Holiday Packages India, Visa Assistance, International Tours',
  openGraph: {
    title: 'About Us | Dyna Tours India - 16+ Years of Travel Excellence',
    description: 'Discover Dyna Tours India, your trusted travel partner for domestic & international holidays, flights, hotels, and visa assistance.',
    type: 'website',
    url: 'https://backdyna.logiclabz.in/about',
  },
};

async function getAboutData(): Promise<IAboutPage | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/about-page`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch about page data', error);
    return null;
  }
}

// Icon renderer with clean SVG representations matching reference UI
const renderIcon = (name: string) => {
  switch (name) {
    case 'Award':
    case 'Ribbon':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      );
    case 'Users':
    case 'People':
    case 'Group':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'Globe':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case 'Target':
    case 'Bullseye':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case 'Eye':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'Suitcase':
    case 'Custom':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case 'Expert':
    case 'UserCheck':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <polyline points="17 11 19 13 23 9" />
        </svg>
      );
    case 'Tag':
    case 'DollarSign':
    case 'Price':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      );
    case 'Headphones':
    case 'Support':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      );
    case 'Palm':
    case 'Holidays':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 8c0-2.76-2.24-5-5-5S3 5.24 3 8c0 1.66.81 3.13 2.05 4.05L4 21h10l-1.05-8.95C12.19 11.13 13 9.66 13 8z" />
          <path d="M12 4.5C14.5 4.5 17 6 18 8" />
          <path d="M18 10.5c2 0 4 1 5 3" />
        </svg>
      );
    case 'FileText':
    case 'Passport':
    case 'Visa':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    case 'Plane':
    case 'Flight':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.7-.1-1.3.4-1.2 1.1l.6 4.3 3.6 2.6L4.5 18 2 17l-1 1 3.5 3.5L8 22l-1-2.5 3.3-3.8 2.6 3.6 4.3.6c.7.1 1.2-.5 1.1-1.2z" />
        </svg>
      );
    case 'Building':
    case 'Hotel':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <line x1="9" y1="6" x2="9.01" y2="6" />
          <line x1="15" y1="6" x2="15.01" y2="6" />
          <line x1="9" y1="10" x2="9.01" y2="10" />
          <line x1="15" y1="10" x2="15.01" y2="10" />
          <line x1="9" y1="14" x2="9.01" y2="14" />
          <line x1="15" y1="14" x2="15.01" y2="14" />
          <line x1="9" y1="18" x2="15" y2="18" />
        </svg>
      );
    case 'Anchor':
    case 'Cruise':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.5 0 2.5 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7" />
          <path d="M19 9l-7-5-7 5" />
          <path d="M12 4v6" />
        </svg>
      );
    case 'Briefcase':
    case 'Corporate':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case 'Shield':
    case 'Insurance':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'CheckCircle':
    case 'Attestation':
    case 'Certificate':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case 'Compass':
    case 'MapPin':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      );
    case 'Calendar':
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
};

export default async function AboutUsPage() {
  const data = await getAboutData();

  // Schema.org Organization JSON-LD
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Dyna Tours India',
    url: 'https://backdyna.logiclabz.in',
    logo: 'https://backdyna.logiclabz.in/images/logo.jpg',
    description: 'Creating unforgettable travel experiences with trusted holiday, visa, flight, cruise and corporate travel solutions.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Head Office: Changanassery',
      addressLocality: 'Kottayam',
      addressRegion: 'Kerala',
      addressCountry: 'India'
    },
    telephone: '+91 9946461999',
    foundingDate: '2010'
  };

  // Default image fallbacks matching design
  const heroBg = data?.hero_bg_image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80';
  const circlePhoto = data?.overview_image_1 || '/images/story_circle.jpg';
  const director1Photo = '/images/jomy_milbin.jpg?v=2';
  const director2Photo = '/images/thomas_john.jpg?v=2';

  // 6 Why Choose Us Cards
  const whyChooseList = data?.why_choose_cards?.length ? data.why_choose_cards : [
    {
      icon: 'Award',
      title: '16+ Years of Trusted Experience',
      description: 'Reliable travel solutions backed by expertise and customer trust.'
    },
    {
      icon: 'Suitcase',
      title: 'Customized Travel Solutions',
      description: 'Tailored itineraries for your preferences and budget.'
    },
    {
      icon: 'Globe',
      title: 'Complete Travel Services',
      description: 'End-to-end holiday, visa, flight, hotel, cruise & more.'
    },
    {
      icon: 'Expert',
      title: 'Experienced Travel Experts',
      description: 'Professional guidance at every stage of your journey.'
    },
    {
      icon: 'Tag',
      title: 'Competitive Pricing',
      description: 'Exclusive deals with transparent pricing.'
    },
    {
      icon: 'Headphones',
      title: '24/7 Customer Support',
      description: 'Always here to assist you before, during and after your trip.'
    }
  ];

  // 10 Services List
  const servicesList = data?.services_list?.length ? data.services_list : [
    { title: 'Holiday Packages', description: 'Customized domestic & international holidays', icon: 'Palm', link: '/holidays' },
    { title: 'Visa Assistance', description: 'Professional visa guidance and documentation', icon: 'FileText', link: '/visa' },
    { title: 'Flight Ticketing', description: 'Affordable flight bookings worldwide', icon: 'Plane', link: '/flights' },
    { title: 'Hotel Reservations', description: 'Wide range of hotels and resorts', icon: 'Building', link: '/hotels' },
    { title: 'Cruise Holidays', description: 'Luxury cruise vacations', icon: 'Anchor', link: '/holidays' },
    { title: 'Group Tours', description: 'Planned departures with expert tour managers', icon: 'Users', link: '/group-tours' },
    { title: 'Corporate Travel', description: 'Business travel solutions', icon: 'Briefcase', link: '/holidays' },
    { title: 'Travel Insurance', description: 'Safe and worry-free journeys', icon: 'Shield', link: '/visa' },
    { title: 'Certificate Attestation', description: 'Reliable attestation services', icon: 'CheckCircle', link: '/visa' },
    { title: 'Customized Tours', description: 'Travel that matches your interests', icon: 'Compass', link: '/holidays' }
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* Schema.org Organization Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* 1. HERO BANNER SECTION */}
      <section 
        className={styles.heroSection}
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className={styles.heroOverlay} />
        
        <div className={styles.heroContainer}>
          <div className={styles.heroTextContent}>
            <div className={styles.sectionSubtitleRed}>
              <span className={styles.dashLine}></span>
              <span>ABOUT US</span>
              <span className={styles.dashLine}></span>
            </div>
            
            <h1 className={styles.heroTitle}>
              About <span className={styles.textRed}>Us</span>
            </h1>
            
            <p className={styles.heroLead}>
              Creating unforgettable travel experiences with trusted holiday, visa, flight, cruise and corporate travel solutions.
            </p>

            <div className={styles.breadcrumbNav}>
              <Link href="/" className={styles.breadcrumbLink}>Home</Link>
              <span className={styles.breadcrumbSeparator}>›</span>
              <span className={styles.breadcrumbCurrent}>About Us</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            
            {/* Left Column: Text & Badges */}
            <div className={styles.storyContent}>
              <div className={styles.sectionLabelLeft}>
                <span className={styles.dashLineRed}></span>
                <span>OUR STORY</span>
              </div>

              <h2 className={styles.storyTitle}>
                Wander. Explore. <span className={styles.textRed}>Discover.</span>
                <br />
                <span className={styles.storySubheading}>{data?.story_subheading || 'Your Journey, Our Passion!'}</span>
              </h2>

              <p className={styles.storyParagraph}>
                Dyna Tours India, established in 2010, is a leading travel company based in Changanassery, Kerala. With over 16 years of experience, we specialize in domestic and international holiday packages, visa assistance, flight bookings, cruise holidays, hotel reservations, and corporate travel solutions.
              </p>
              
              <p className={styles.storyParagraph}>
                Our mission is to deliver exceptional travel experiences with personalized service, transparent pricing and 24/7 customer support.
              </p>

              {/* 3 Stat Badges */}
              <div className={styles.statPillsRow}>
                <div className={styles.statPillCard}>
                  <div className={styles.statIconBadge}>
                    {renderIcon('Award')}
                  </div>
                  <div className={styles.statPillText}>
                    <strong>16+</strong>
                    <span>Years Experience</span>
                  </div>
                </div>

                <div className={styles.statPillCard}>
                  <div className={styles.statIconBadge}>
                    {renderIcon('Users')}
                  </div>
                  <div className={styles.statPillText}>
                    <strong>25,000+</strong>
                    <span>Happy Travellers</span>
                  </div>
                </div>

                <div className={styles.statPillCard}>
                  <div className={styles.statIconBadge}>
                    {renderIcon('Globe')}
                  </div>
                  <div className={styles.statPillText}>
                    <strong>Worldwide</strong>
                    <span>Destinations</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Circular Travel Image & Map Graphic */}
            <div className={styles.storyGraphicWrapper}>
              <div className={styles.worldMapBg} />
              
              <div className={styles.circleImageFrame}>
                <img src={circlePhoto} alt="Wander Explore Discover - Dyna Tours" />
                
                {/* Floating Red Airplane Badge */}
                <div className={styles.circlePlaneBadge}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                </div>

                {/* Floating Pin Badge */}
                <div className={styles.circlePinBadge}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <circle cx="12" cy="12" r="6" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. A MESSAGE FROM OUR DIRECTORS SECTION */}
      <section className={styles.directorsSection}>
        <div className={styles.container}>
          
          <div className={styles.sectionHeaderCenter}>
            <div className={styles.sectionSubtitleRedCenter}>
              <span className={styles.dashLineRed}></span>
              <span>A Message from Our Directors</span>
              <span className={styles.dashLineRed}></span>
            </div>
          </div>

          <div className={styles.directorsCardBox}>
            <div className={styles.directorsGrid}>
              
              {/* Director 1 */}
              <div className={styles.directorCol}>
                <div className={styles.directorAvatarWrapper}>
                  <img src={data?.founder_image || director1Photo} alt={data?.founder_name || 'Jomy Milbin'} />
                </div>
                <div className={styles.directorInfoBlock}>
                  <p className={styles.directorQuoteText}>
                    “ {data?.founder_quote || 'Travel is the only thing you buy that makes you richer.'} ”
                  </p>
                  {data?.founder_message ? (
                    <div 
                      className={styles.directorBodyText}
                      dangerouslySetInnerHTML={{ __html: data.founder_message }}
                    />
                  ) : (
                    <p className={styles.directorBodyText}>
                      At Dyna Tours, we believe every journey has the power to inspire, transform and create lifelong memories. For over 16 years, we have been committed to delivering trusted travel solutions with a customer-first approach.
                    </p>
                  )}
                  <div className={styles.directorSignatureBox}>
                    <div className={styles.signatureScript}>{data?.founder_signature || data?.founder_name || 'Jomy Milbin'}</div>
                    <div className={styles.directorNameTitle}>
                      <strong>{data?.founder_name || 'Jomy Milbin'}</strong>
                      <span>{data?.founder_title || 'Managing Director'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Director 2 */}
              <div className={styles.directorCol}>
                <div className={styles.directorAvatarWrapper}>
                  <img src={data?.director2_image || director2Photo} alt={data?.director2_name || 'Thomas John'} />
                </div>
                <div className={styles.directorInfoBlock}>
                  <p className={styles.directorQuoteText}>
                    “ {data?.director2_quote || 'Travel is the only thing you buy that makes you richer.'} ”
                  </p>
                  {data?.director2_message ? (
                    <div 
                      className={styles.directorBodyText}
                      dangerouslySetInnerHTML={{ __html: data.director2_message }}
                    />
                  ) : (
                    <p className={styles.directorBodyText}>
                      Our dedicated team works passionately to design personalized experiences and ensure every detail of your trip is seamless. Thank you for trusting us as your travel partner. We look forward to being a part of your next adventure!
                    </p>
                  )}
                  <div className={styles.directorSignatureBox}>
                    <div className={styles.signatureScript}>{data?.director2_signature || data?.director2_name || 'Thomas John'}</div>
                    <div className={styles.directorNameTitle}>
                      <strong>{data?.director2_name || 'Thomas John'}</strong>
                      <span>{data?.director2_title || 'Director'}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. OUR MISSION & OUR VISION CARDS */}
      <section className={styles.missionVisionSection}>
        <div className={styles.container}>
          <div className={styles.mvGrid}>
            
            {/* Mission Card (Light Pink Tint) */}
            <div className={styles.missionCard}>
              <div className={styles.mvIconCircleRed}>
                {renderIcon('Target')}
              </div>
              <div className={styles.mvTextContent}>
                <h3 className={styles.mvTitleRed}>Our Mission</h3>
                <p className={styles.mvBody}>
                  To deliver personalized, reliable and memorable travel experiences through quality service, innovation, and a commitment to customer satisfaction at every step.
                </p>
              </div>
            </div>

            {/* Vision Card (Light Blue Tint) */}
            <div className={styles.visionCard}>
              <div className={styles.mvIconCircleRed}>
                {renderIcon('Eye')}
              </div>
              <div className={styles.mvTextContent}>
                <h3 className={styles.mvTitleRed}>Our Vision</h3>
                <p className={styles.mvBody}>
                  To be Kerala's most trusted travel company, driving innovation, exceeding customer expectations, and creating unforgettable journeys worldwide.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US SECTION */}
      <section className={styles.whyChooseSection}>
        <div className={styles.container}>
          
          <div className={styles.sectionHeaderCenter}>
            <div className={styles.sectionSubtitleRedCenter}>
              <span className={styles.dashLineRed}></span>
              <span>WHY CHOOSE US</span>
              <span className={styles.dashLineRed}></span>
            </div>
            <h2 className={styles.sectionMainHeading}>
              Why Choose <span className={styles.textRed}>Dyna Tours India?</span>
            </h2>
          </div>

          <div className={styles.whyGrid6}>
            {whyChooseList.map((item, idx) => (
              <div key={idx} className={styles.whyIconCard}>
                <div className={styles.whyCircleIcon}>
                  {renderIcon(item.icon)}
                </div>
                <h3 className={styles.whyCardTitle}>{item.title}</h3>
                <p className={styles.whyCardDesc}>{item.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. OUR SERVICES SECTION (Dark Navy Background) */}
      <section className={styles.darkServicesSection}>
        <div className={styles.container}>
          
          <div className={styles.sectionHeaderCenterLight}>
            <h2 className={styles.darkServicesHeading}>{data?.services_title || 'Our Services'}</h2>
            <p className={styles.darkServicesSubtext}>
              {data?.services_subtext || 'Complete travel solutions across multiple categories'}
            </p>
          </div>

          <div className={styles.servicesGrid10}>
            {servicesList.map((srv, idx) => (
              <Link key={idx} href={srv.link || '/holidays'} className={styles.darkServiceCard}>
                <div className={styles.darkServiceIcon}>
                  {renderIcon(srv.icon)}
                </div>
                <h3 className={styles.darkServiceTitle}>{srv.title}</h3>
                <p className={styles.darkServiceDesc}>{srv.description}</p>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 7. YOUR TRUSTED TRAVEL PARTNER SECTION */}
      <section className={styles.partnerSection}>
        <div className={styles.container}>
          <div className={styles.partnerGrid}>
            
            {/* Left Column: 3 Overlapping Vertical Images */}
            <div className={styles.partnerImagesWrapper}>
              <div className={styles.partnerImgCard1}>
                <img src={data?.partner_image_1 || '/images/partner_1.jpg'} alt="Family Beach Vacation" />
              </div>
              <div className={styles.partnerImgCard2}>
                <img src={data?.partner_image_2 || '/images/partner_2.jpg'} alt="Luxury Cruise Ship" />
              </div>
              <div className={styles.partnerImgCard3}>
                <img src={data?.partner_image_3 || '/images/partner_3.jpg'} alt="Flight Sunset Flight" />
              </div>
            </div>

            {/* Right Column: Partner Text & Bullet Checklist */}
            <div className={styles.partnerContent}>
              <h2 className={styles.partnerHeading}>
                {data?.trusted_partner_title ? data.trusted_partner_title : <>Your Trusted <span className={styles.textRed}>Travel Partner</span></>}
              </h2>

              <p className={styles.partnerLeadText}>
                {data?.trusted_partner_description || 'From the misty hills of India to the vibrant cities of Europe, and from the tropical islands of Southeast Asia to the wonders of the world — we make every journey extraordinary. Explore the world with Dyna Tours India.'}
              </p>

              {/* Bullet Checklist Grid */}
              <div className={styles.bulletCheckGrid}>
                {(data?.trust_badges?.length ? data.trust_badges : [
                  { title: 'Custom-designed group tours' },
                  { title: 'Visa assistance services' },
                  { title: 'Hotel bookings worldwide' },
                  { title: 'FIT arrangements' },
                  { title: 'Luxury cruise packages' },
                  { title: 'International flight bookings' }
                ]).map((badge, idx) => (
                  <div key={idx} className={styles.checkItem}>
                    <div className={styles.checkIconRed}>✓</div>
                    <span>{badge.title}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. OUR ACHIEVEMENTS COUNTER BAR */}
      <section className={styles.achievementsSection}>
        <div className={styles.achievementsOverlay} />
        <div className={styles.containerRelative}>
          
          <div className={styles.sectionSubtitleWhiteCenter}>
            <span className={styles.dashLineWhite}></span>
            <span>{data?.achievements_title || 'Our Achievements'}</span>
            <span className={styles.dashLineWhite}></span>
          </div>

          <div className={styles.achievementsRow}>
            {(data?.achievement_counters?.length ? data.achievement_counters : [
              { number: '16+', label: 'Years Experience', icon: 'Award' },
              { number: '25,000+', label: 'Happy Customers', icon: 'Users' },
              { number: '100+', label: 'Destinations', icon: 'Globe' },
              { number: '20+', label: 'Travel Experts', icon: 'Expert' },
              { number: 'Thousands', label: 'Of Visas Processed', icon: 'FileText' },
              { number: 'Corporate', label: 'Clients Served', icon: 'Building' }
            ]).map((cnt, idx) => (
              <div key={idx} className={styles.achieveCol}>
                <div className={styles.achieveIcon}>{renderIcon(cnt.icon)}</div>
                <div className={styles.achieveNumber}>{cnt.number}{(cnt as any).suffix || ''}</div>
                <div className={styles.achieveLabel}>{cnt.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. CERTIFICATIONS & MEMBERSHIPS SECTION */}
      <section className={styles.certificationsSection}>
        <div className={styles.container}>
          
          <div className={styles.sectionSubtitleRedCenter}>
            <span className={styles.dashLineRed}></span>
            <span>Certifications & Memberships</span>
            <span className={styles.dashLineRed}></span>
          </div>

          <div className={styles.certLogosRow}>
            <div className={styles.certBadgeCard}>
              <div className={styles.certLogoText}>IATA</div>
            </div>
            <div className={styles.certBadgeCard}>
              <div className={styles.certLogoText} style={{ color: '#047857' }}>KTM</div>
              <span className={styles.certSublabel}>KERALA TRAVEL MART</span>
            </div>
            <div className={styles.certBadgeCard}>
              <div className={styles.certLogoText} style={{ color: '#0284c7' }}>TAFI</div>
              <span className={styles.certSublabel}>THE WAY FORWARD</span>
            </div>
            <div className={styles.certBadgeCard}>
              <div className={styles.certLogoText} style={{ color: '#b45309' }}>Ministry of Tourism</div>
              <span className={styles.certSublabel}>Government of India</span>
            </div>
            <div className={styles.certBadgeCard}>
              <div className={styles.certLogoText} style={{ color: '#059669' }}>kerala</div>
              <span className={styles.certSublabel}>God's Own Country</span>
            </div>
            <div className={styles.certBadgeCard}>
              <div className={styles.certLogoText} style={{ color: '#dc2626' }}>Incredible India</div>
            </div>
          </div>

        </div>
      </section>

      {/* 10. CALL TO ACTION BANNER */}
      <section className={styles.ctaPanoramaSection}>
        <div className={styles.ctaPanoramaOverlay} />
        <div className={styles.containerRelative}>
          
          <div className={styles.ctaFlexRow}>
            <div className={styles.ctaTextCol}>
              <h2 className={styles.ctaHeadingText}>
                Let's Plan Your <span className={styles.textRed}>Next Adventure</span>
              </h2>
              <p className={styles.ctaSubtext}>
                Connect with our travel experts and let us create a customized travel experience tailored to your needs.
              </p>
            </div>

            <div className={styles.ctaButtonsCol}>
              <Link href="/#enquiry" className={styles.btnCtaRed}>
                Enquire Now <span className={styles.btnArrow}>→</span>
              </Link>
              
              <a 
                href="https://wa.me/919946461999" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.btnCtaGreen}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '6px' }}>
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                WhatsApp Us
              </a>

              <Link href="/holidays" className={styles.btnCtaWhite}>
                View Holiday Packages
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
