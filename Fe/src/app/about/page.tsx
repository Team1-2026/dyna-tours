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
    url: 'https://dynatours.in/about',
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

const renderIcon = (name: string) => {
  switch (name) {
    case 'Award':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>;
    case 'Compass':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>;
    case 'Grid':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
    case 'Users':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'DollarSign':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
    case 'Headphones':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>;
    case 'Globe':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case 'MapPin':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case 'Plane':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.7-.1-1.3.4-1.2 1.1l.6 4.3 3.6 2.6L4.5 18 2 17l-1 1 3.5 3.5L8 22l-1-2.5 3.3-3.8 2.6 3.6 4.3.6c.7.1 1.2-.5 1.1-1.2z"/></svg>;
    case 'FileText':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
    case 'Building':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="6" x2="9.01" y2="6"/><line x1="15" y1="6" x2="15.01" y2="6"/><line x1="9" y1="10" x2="9.01" y2="10"/><line x1="15" y1="10" x2="15.01" y2="10"/><line x1="9" y1="14" x2="9.01" y2="14"/><line x1="15" y1="14" x2="15.01" y2="14"/><line x1="9" y1="18" x2="15" y2="18"/></svg>;
    case 'Anchor':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>;
    case 'Briefcase':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
    case 'Shield':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case 'CheckCircle':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
    case 'Lock':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case 'UserCheck':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>;
    case 'PhoneCall':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
    case 'Calendar':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case 'Smile':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
    default:
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
  }
};

export default async function AboutUsPage() {
  const data = await getAboutData();

  if (!data) {
    return <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>Failed to load About Us page content.</div>;
  }

  // Schema.org Organization JSON-LD
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Dyna Tours India',
    url: 'https://dynatours.in',
    logo: 'https://dynatours.in/images/logo.jpg',
    description: data.hero_subtitle,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Head Office: Changanassery',
      addressLocality: 'Kottayam',
      addressRegion: 'Kerala',
      addressCountry: 'India'
    },
    telephone: '+91 9946461999',
    foundingDate: '2010',
    sameAs: [
      'https://facebook.com/dynatours',
      'https://instagram.com/dynatours'
    ]
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Schema.org Organization Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* 1. Hero Banner */}
      <section 
        className={styles.heroSection}
        style={{ backgroundImage: `url(${data.hero_bg_image})` }}
      >
        <div className={styles.heroOverlay} />
        
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span>✨ 16+ Years of Travel Excellence</span>
          </div>
          <h1 className={styles.heroTitle}>{data.hero_title}</h1>
          <p className={styles.heroSubtitle}>{data.hero_subtitle}</p>
          
          <div className={styles.heroActions}>
            <a href="#services" className={styles.btnPrimary}>
              Explore Our Services
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
            <a href="#cta" className={styles.btnSecondary}>
              Contact Us
            </a>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <span>Scroll to explore</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </div>
      </section>

      {/* 2. Company Overview */}
      <section className={styles.overviewSection}>
        <div className={styles.container}>
          <div className={styles.overviewGrid}>
            <div className={styles.overviewImages}>
              <div className={styles.imageCard1}>
                <img src={data.overview_image_1} alt="Dyna Tours Office" />
              </div>
              <div className={styles.imageCard2}>
                <img src={data.overview_image_2} alt="Travel Consultants" />
              </div>
              <div className={styles.experienceBadge}>
                <div className={styles.expNumber}>{data.years_experience}+</div>
                <div className={styles.expLabel}>Years Experience</div>
              </div>
            </div>

            <div className={styles.overviewContent}>
              <span className={styles.sectionTag}>Company Overview</span>
              <h2 className={styles.sectionTitle}>{data.overview_title}</h2>
              <div 
                className={styles.overviewBody}
                dangerouslySetInnerHTML={{ __html: data.overview_description }}
              />

              <div className={styles.overviewHighlights}>
                <div className={styles.highlightCard}>
                  <div className={styles.highlightIcon}>
                    {renderIcon('Award')}
                  </div>
                  <div className={styles.highlightTitle}>16+ Years Experience</div>
                </div>
                <div className={styles.highlightCard}>
                  <div className={styles.highlightIcon}>
                    {renderIcon('Users')}
                  </div>
                  <div className={styles.highlightTitle}>25,000+ Happy Clients</div>
                </div>
                <div className={styles.highlightCard}>
                  <div className={styles.highlightIcon}>
                    {renderIcon('Globe')}
                  </div>
                  <div className={styles.highlightTitle}>Global Network</div>
                </div>
                <div className={styles.highlightCard}>
                  <div className={styles.highlightIcon}>
                    {renderIcon('Headphones')}
                  </div>
                  <div className={styles.highlightTitle}>Personalized Service</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Founder's Message */}
      <section className={styles.founderSection}>
        <div className={styles.container}>
          <div className={styles.founderCard}>
            <div className={styles.founderImageWrapper}>
              <img src={data.founder_image} alt={data.founder_name} />
              <div className={styles.founderOverlay} />
              <div className={styles.founderNameTag}>
                <div className={styles.founderName}>{data.founder_name}</div>
                <div className={styles.founderRole}>{data.founder_title}</div>
              </div>
            </div>

            <div className={styles.founderContent}>
              <span className={styles.sectionTag}>Leadership Vision</span>
              <h2 className={styles.sectionTitle} style={{ fontSize: '2rem' }}>Message from Our Founder</h2>
              
              {data.founder_quote && (
                <div className={styles.quoteBox}>
                  <p className={styles.quoteText}>"{data.founder_quote}"</p>
                </div>
              )}

              <div 
                className={styles.founderMessageBody}
                dangerouslySetInnerHTML={{ __html: data.founder_message }}
              />

              <div className={styles.founderSignature}>
                {data.founder_signature}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Mission & Vision */}
      <section className={styles.missionVisionSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Core Principles</span>
            <h2 className={styles.sectionTitle}>Driven by Purpose & Excellence</h2>
          </div>

          <div className={styles.missionGrid}>
            <div className={styles.mvCard}>
              <div className={styles.mvIcon}>
                {renderIcon('Compass')}
              </div>
              <h3 className={styles.mvTitle}>{data.mission_title}</h3>
              <p className={styles.mvText}>{data.mission_text}</p>
            </div>

            <div className={styles.mvCard}>
              <div className={styles.mvIcon}>
                {renderIcon('Award')}
              </div>
              <h3 className={styles.mvTitle}>{data.vision_title}</h3>
              <p className={styles.mvText}>{data.vision_text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Dyna Tours India */}
      <section className={styles.whyChooseSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>The Dyna Advantage</span>
            <h2 className={styles.sectionTitle}>{data.why_choose_title}</h2>
            <p className={styles.sectionSubtitle}>
              Experience seamless, worry-free travel backed by 16+ years of expertise and personalized support.
            </p>
          </div>

          <div className={styles.whyGrid}>
            {data.why_choose_cards?.map((card, idx) => (
              <div key={idx} className={styles.whyCard}>
                <div className={styles.whyIcon}>
                  {renderIcon(card.icon)}
                </div>
                <h3 className={styles.whyTitle}>{card.title}</h3>
                <p className={styles.whyDesc}>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Our Services */}
      <section id="services" className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>What We Offer</span>
            <h2 className={styles.sectionTitle}>{data.services_title}</h2>
            <p className={styles.sectionSubtitle}>
              End-to-end travel solutions under one roof for families, couples, groups, and corporate travelers.
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {data.services_list?.map((service, idx) => (
              <div key={idx} className={styles.serviceCard}>
                <div className={styles.serviceTop}>
                  <div className={styles.serviceIcon}>
                    {renderIcon(service.icon)}
                  </div>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDesc}>{service.description}</p>
                </div>
                <Link href={service.link || '/holidays'} className={styles.serviceLink}>
                  Explore Service
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Trusted Travel Partner */}
      <section 
        className={styles.trustedSection}
        style={{ backgroundImage: `url(${data.trusted_partner_bg_image})` }}
      >
        <div className={styles.trustedOverlay} />
        <div className={styles.container}>
          <div className={styles.trustedContent}>
            <h2 className={styles.trustedTitle}>{data.trusted_partner_title}</h2>
            <p className={styles.trustedDesc}>{data.trusted_partner_description}</p>

            <div className={styles.trustBadgeGrid}>
              {data.trust_badges?.map((badge, idx) => (
                <div key={idx} className={styles.trustBadgeCard}>
                  <div className={styles.trustBadgeIcon}>
                    {renderIcon(badge.icon || 'CheckCircle')}
                  </div>
                  <div className={styles.trustBadgeTitle}>{badge.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Our Achievements Counter */}
      <section className={styles.achievementsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader} style={{ marginBottom: '3rem' }}>
            <span className={styles.sectionTag} style={{ color: '#f87171' }}>Milestones</span>
            <h2 className={styles.sectionTitle} style={{ color: '#ffffff' }}>{data.achievements_title}</h2>
          </div>

          <div className={styles.counterGrid}>
            {data.achievement_counters?.map((counter, idx) => (
              <div key={idx} className={styles.counterCard}>
                <div className={styles.counterIcon}>
                  {renderIcon(counter.icon)}
                </div>
                <div className={styles.counterNumber}>
                  {counter.number.toLocaleString()}{counter.suffix || ''}
                </div>
                <div className={styles.counterLabel}>{counter.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Certifications & Memberships */}
      <section className={styles.certificationsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Industry Recognition</span>
            <h2 className={styles.sectionTitle}>{data.certifications_title}</h2>
            <p className={styles.sectionSubtitle}>
              Recognized and accredited by leading national & international tourism authorities.
            </p>
          </div>

          <div className={styles.certGrid}>
            {data.certification_logos?.map((cert, idx) => (
              <div key={idx} className={styles.certCard} title={cert.name}>
                {cert.image && (
                  <img src={cert.image} alt={cert.name} className={styles.certImage} />
                )}
                <span className={styles.certCode}>{cert.code}</span>
                <h3 className={styles.certName}>{cert.name}</h3>
                {cert.description && (
                  <p className={styles.certDesc}>{cert.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Call to Action (CTA) */}
      <section 
        id="cta"
        className={styles.ctaSection}
        style={{ backgroundImage: `url(${data.cta_bg_image})` }}
      >
        <div className={styles.ctaOverlay} />
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>{data.cta_title}</h2>
            <p className={styles.ctaDesc}>{data.cta_description}</p>

            <div className={styles.ctaButtons}>
              <Link href={data.cta_primary_btn_url || '/#enquiry'} className={styles.btnPrimary}>
                {data.cta_primary_btn_text || 'Enquire Now'}
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
              
              {data.cta_secondary_btn_text && (
                <a 
                  href={data.cta_secondary_btn_url || 'https://wa.me/919946461999'} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.btnWhatsapp}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  {data.cta_secondary_btn_text}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
