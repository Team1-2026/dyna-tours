import React from 'react';
import type { Metadata } from 'next';
import styles from './contact.module.css';
import { getBaseUrl, ContactPage as IContactPage } from '@/lib/api';
import ContactEnquiryForm from './components/ContactEnquiryForm';

export const metadata: Metadata = {
  title: 'Contact Us | Dyna Tours India - Changanassery, Kottayam, Kerala',
  description: "Get in touch with Dyna Tours India. Contact our travel experts for holiday packages, flight bookings, visa assistance, hotel reservations, and group tours. Head Office: Marks Square Building, M C Road, Changanassery, Kerala.",
  keywords: 'Contact Dyna Tours, Dyna Tours Phone Number, Dyna Tours Changanassery Office, Travel Agency Kottayam, Kerala Travel Agency Address, Contact Travel Agent',
  openGraph: {
    title: 'Contact Us | Dyna Tours India - Travel Experts',
    description: "Connect with Dyna Tours India for holiday packages, flight bookings, visa assistance, and corporate travel solutions.",
    type: 'website',
    url: 'https://dynatours.in/contact-us',
  },
};

async function getContactData(): Promise<IContactPage | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/contact-page`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch contact page data', error);
    return null;
  }
}

const renderIcon = (name: string) => {
  switch (name) {
    case 'PhoneCall':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
    case 'MessageCircle':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>;
    case 'Mail':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    case 'Sun':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
    case 'Plane':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.7-.1-1.3.4-1.2 1.1l.6 4.3 3.6 2.6L4.5 18 2 17l-1 1 3.5 3.5L8 22l-1-2.5 3.3-3.8 2.6 3.6 4.3.6c.7.1 1.2-.5 1.1-1.2z"/></svg>;
    case 'Building':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="6" x2="9.01" y2="6"/><line x1="15" y1="6" x2="15.01" y2="6"/><line x1="9" y1="10" x2="9.01" y2="10"/><line x1="15" y1="10" x2="15.01" y2="10"/><line x1="9" y1="14" x2="9.01" y2="14"/><line x1="15" y1="14" x2="15.01" y2="14"/><line x1="9" y1="18" x2="15" y2="18"/></svg>;
    case 'FileText':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
    case 'Anchor':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>;
    case 'Briefcase':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
    case 'Users':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'Shield':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case 'CheckCircle':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
    case 'Clock':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case 'MapPin':
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case 'Instagram':
      return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
    case 'Facebook':
      return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
    case 'Youtube':
      return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>;
    case 'Linkedin':
      return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
    case 'Twitter':
      return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>;
    default:
      return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
  }
};

export default async function ContactUsPage() {
  const data = await getContactData();

  if (!data) {
    return <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>Failed to load Contact page content.</div>;
  }

  // Schema.org ContactPage JSON-LD
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Dyna Tours India',
    url: 'https://dynatours.in/contact-us',
    description: data.hero_subtitle,
    mainEntity: {
      '@type': 'TravelAgency',
      name: 'Dyna Tours India',
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.office_address,
        addressLocality: 'Changanassery',
        addressRegion: 'Kerala',
        postalCode: '686103',
        addressCountry: 'IN'
      },
      telephone: data.phone_numbers?.[0]?.number || '+91 98466 65005',
      email: data.email_addresses?.[0]?.email || 'info@dynatours.com',
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Schema.org ContactPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      {/* 1. Hero Banner */}
      <section 
        className={styles.heroSection}
        style={{ backgroundImage: `url(${data.hero_bg_image})` }}
      >
        <div className={styles.heroOverlay} />
        
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span>📍 Head Office: Changanassery, Kerala</span>
          </div>
          <h1 className={styles.heroTitle}>{data.hero_title}</h1>
          <p className={styles.heroSubtitle}>{data.hero_subtitle}</p>
          
          <div className={styles.heroActions}>
            <a href="#enquiry-form" className={styles.btnPrimary}>
              {data.hero_cta_primary_text || 'Enquire Now'}
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
            {data.hero_cta_secondary_text && (
              <a href={data.hero_cta_secondary_url || 'tel:+919846665005'} className={styles.btnSecondary}>
                {data.hero_cta_secondary_text}
              </a>
            )}
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <span>Scroll to contact</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </div>
      </section>

      {/* 2. Enquiry Section (Form + Brand Card) */}
      <section id="enquiry-form" className={styles.enquirySection}>
        <div className={styles.container}>
          <div className={styles.enquiryGrid}>
            {/* Left Interactive Form Component */}
            <ContactEnquiryForm />

            {/* Right Brand Card */}
            <div className={styles.brandCard}>
              <div className={styles.brandPattern} />
              
              <div>
                <div className={styles.brandLogoWrapper}>
                  <img src="/images/logo.jpg" alt="Dyna Tours" className={styles.brandLogo} />
                </div>
                <h3 className={styles.brandTagline}>{data.brand_tagline}</h3>
                <p className={styles.brandDesc}>{data.brand_description}</p>
              </div>

              <div>
                <div className={styles.socialHeader}>Connect With Us</div>
                <div className={styles.socialRow}>
                  {data.social_links?.map((s, idx) => (
                    <a 
                      key={idx} 
                      href={s.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.socialBtn}
                      title={s.platform}
                      aria-label={s.platform}
                    >
                      {renderIcon(s.icon || 'Instagram')}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Contact Information Strip */}
      <section className={styles.infoStripSection}>
        <div className={styles.container}>
          <div className={styles.infoGrid}>
            {/* Address */}
            <div className={styles.infoCol}>
              <div className={styles.infoIcon}>
                {renderIcon('MapPin')}
              </div>
              <h3 className={styles.infoTitle}>Office Address</h3>
              <p className={styles.infoBody}>{data.office_address}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <a 
                  href={data.google_maps_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.copyBtn}
                >
                  📍 Open in Google Maps
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className={styles.infoCol}>
              <div className={styles.infoIcon}>
                {renderIcon('PhoneCall')}
              </div>
              <h3 className={styles.infoTitle}>Call Us</h3>
              <div className={styles.phoneList}>
                {data.phone_numbers?.map((p, idx) => (
                  <div key={idx} style={{ marginBottom: '0.25rem' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>{p.label}</div>
                    <a href={`tel:${p.number.replace(/\s+/g, '')}`} className={styles.phoneLink}>
                      {p.number}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className={styles.infoCol}>
              <div className={styles.infoIcon}>
                {renderIcon('Mail')}
              </div>
              <h3 className={styles.infoTitle}>Email Us</h3>
              <div className={styles.emailList}>
                {data.email_addresses?.map((e, idx) => (
                  <div key={idx} style={{ marginBottom: '0.25rem' }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>{e.label}</div>
                    <a href={`mailto:${e.email}`} className={styles.emailLink}>
                      {e.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Quick Contact Cards */}
      <section className={styles.quickSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Instant Support</span>
            <h2 className={styles.sectionTitle}>Need Quick Assistance?</h2>
            <p className={styles.sectionSubtitle}>Choose your preferred contact method to connect directly with our travel advisors.</p>
          </div>

          <div className={styles.quickGrid}>
            {data.quick_contact_cards?.map((card, idx) => (
              <div key={idx} className={styles.quickCard}>
                <div>
                  <div className={styles.quickIcon}>
                    {renderIcon(card.icon)}
                  </div>
                  <h3 className={styles.quickTitle}>{card.title}</h3>
                  <p className={styles.quickDesc}>{card.description}</p>
                </div>
                <a 
                  href={card.action_url} 
                  target={card.action_url.startsWith('http') ? '_blank' : '_self'} 
                  rel="noopener noreferrer" 
                  className={styles.quickActionBtn}
                >
                  {card.action_text}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Business Hours */}
      <section className={styles.hoursSection}>
        <div className={styles.container}>
          <div className={styles.hoursCard}>
            <div className={styles.hoursIconBox}>
              {renderIcon('Clock')}
            </div>
            <div className={styles.hoursContent}>
              <h2 className={styles.hoursTitle}>Working Business Hours</h2>
              <div className={styles.hoursGrid}>
                <div className={styles.hoursItem}>
                  <div className={styles.hoursDay}>Monday – Saturday</div>
                  <div className={styles.hoursTime}>{data.business_hours_weekday}</div>
                </div>
                <div className={styles.hoursItem}>
                  <div className={styles.hoursDay}>Sunday</div>
                  <div className={styles.hoursTime}>{data.business_hours_weekend}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Contact Dyna Tours */}
      <section className={styles.whyContactSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Services We Provide</span>
            <h2 className={styles.sectionTitle}>How We Can Assist You</h2>
            <p className={styles.sectionSubtitle}>From flight tickets to complete customized packages, our team handles all your travel requirements.</p>
          </div>

          <div className={styles.whyContactGrid}>
            {data.why_contact_cards?.map((item, idx) => (
              <div key={idx} className={styles.whyContactCard}>
                <div className={styles.whyContactIcon}>
                  {renderIcon(item.icon)}
                </div>
                <h3 className={styles.whyContactTitle}>{item.title}</h3>
                <p className={styles.whyContactDesc}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Google Maps Section */}
      <section className={styles.mapSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Location</span>
            <h2 className={styles.sectionTitle}>Visit Our Head Office</h2>
            <p className={styles.sectionSubtitle}>First Floor, Marks Square Building, M C Road, Above Yes Bank, Ruby Nagar, Changanassery, Kerala.</p>
          </div>

          <div className={styles.mapWrapper}>
            <iframe 
              src={data.map_embed_url}
              className={styles.mapIframe}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dyna Tours India Changanassery Map"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
