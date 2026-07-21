import React from 'react';
import type { Metadata } from 'next';
import styles from './page.module.css';
import FlightEnquiryForm from './components/FlightEnquiryForm';
import FaqAccordion from './components/FaqAccordion';
import FlightGallery from './components/FlightGallery';

export const metadata: Metadata = {
  title: 'Flight Booking Services | Dyna Tours India',
  description: 'Book your domestic and international flights at the best available prices with Dyna Tours India. Fast, secure, and hassle-free flight booking.',
  openGraph: {
    title: 'Flight Booking Services | Dyna Tours India',
    description: 'Book your domestic and international flights at the best available prices with Dyna Tours India.',
    type: 'website'
  }
};

async function getFlightPageData() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/flights/page', { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch flight page data', error);
    return null;
  }
}

const IconMapper = ({ name }: { name: string }) => {
  switch(name) {
    case 'UserCheck':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>;
    case 'Tag':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
    case 'Globe':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
    case 'PhoneCall':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
    case 'Shield':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
    case 'CheckCircle':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
    case 'Briefcase':
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
    default:
      return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
  }
};

export default async function FlightPage() {
  const pageData = await getFlightPageData();

  if (!pageData) {
    return <div>Failed to load flight page content.</div>;
  }

  const {
    hero_headline, hero_tagline, hero_image,
    overview_title, overview_description,
    gallery_images,
    why_book_title, why_book_benefits,
    cta_heading, cta_text, cta_bg_image, whatsapp_number,
    faqs
  } = pageData;

  const bgStyle = hero_image ? { backgroundImage: `url(${hero_image})` } : { backgroundImage: 'url(https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop)' };
  const ctaBgStyle = cta_bg_image ? { backgroundImage: `url(${cta_bg_image})` } : { backgroundImage: 'url(https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop)' };
  
  const whatsappLink = whatsapp_number ? `https://wa.me/${whatsapp_number.replace(/\+/g, '')}` : 'https://wa.me/';

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero} style={bgStyle}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroHeadline}>{hero_headline}</h1>
          <p className={styles.heroTagline}>{hero_tagline}</p>
          <a href="#enquiry" className={styles.primaryButton}>Book Your Flight Now</a>
        </div>
      </section>

      {/* Overview Section */}
      <section className={styles.overview}>
        <div className={styles.container}>
          <div className={styles.overviewHeader}>
            <h2 className={styles.overviewTitle}>{overview_title}</h2>
            {overview_description && (
              <div 
                className={styles.overviewDescription}
                dangerouslySetInnerHTML={{ __html: overview_description }}
              />
            )}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {gallery_images && gallery_images.length > 0 && (
        <section className={styles.gallery}>
          <div className={styles.container}>
            <h2 className={styles.overviewTitle} style={{textAlign: 'center'}}>Travel Inspiration</h2>
            <FlightGallery images={gallery_images} />
          </div>
        </section>
      )}

      {/* Why Book Section */}
      {why_book_benefits && why_book_benefits.length > 0 && (
        <section className={styles.whyBook}>
          <div className={styles.container}>
            <h2 className={styles.overviewTitle} style={{textAlign: 'center'}}>{why_book_title}</h2>
            <div className={styles.benefitsGrid}>
              {why_book_benefits.map((benefit: any, index: number) => (
                <div key={index} className={styles.benefitCard}>
                  <div className={styles.benefitIcon}>
                    <IconMapper name={benefit.icon} />
                  </div>
                  <h3 className={styles.benefitTitle}>{benefit.title}</h3>
                  <p className={styles.benefitDescription}>{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Flight Enquiry Form Section */}
      <section className={styles.formSection}>
        <FlightEnquiryForm />
      </section>

      {/* FAQ Section */}
      {faqs && faqs.length > 0 && (
        <section className={styles.faqSection}>
          <div className={styles.container}>
            <h2 className={styles.overviewTitle} style={{textAlign: 'center', marginBottom: '3rem'}}>Frequently Asked Questions</h2>
            <FaqAccordion faqs={faqs} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className={styles.ctaBanner} style={ctaBgStyle}>
        <div className={styles.ctaOverlay}></div>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaHeading}>{cta_heading}</h2>
          <p className={styles.ctaText}>{cta_text}</p>
          <div className={styles.ctaButtons}>
            <a href="#enquiry" className={styles.primaryButton}>Book Your Flight Now</a>
            {whatsapp_number && (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
