import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import styles from './country.module.css';
import VisaFAQ from '@/components/visa/VisaFAQ';
import VisaEnquiryForm from '@/components/visa/VisaEnquiryForm';

export const dynamic = 'force-dynamic';

interface CountryVisaPageProps {
  params: {
    country: string;
  };
}

export async function generateMetadata({ params }: CountryVisaPageProps): Promise<Metadata> {
  const countryId = (await params).country;
  
  try {
    const countryData = await api.getVisa(countryId);
    
    return {
      title: `${countryData.name} Tourist Visa Requirements | Dyna Tours India`,
      description: `Get complete information on ${countryData.name} tourist visa requirements, processing time (${countryData.processingTime}), and documents needed. Apply online with Dyna Tours India.`,
      openGraph: {
        title: `${countryData.name} Tourist Visa | Apply Online`,
        description: `Complete guide for ${countryData.name} tourist visa. Processing time: ${countryData.processingTime}.`,
      },
      twitter: {
        card: 'summary',
        title: `${countryData.name} Tourist Visa | Apply Online`,
        description: `Complete guide for ${countryData.name} tourist visa. Processing time: ${countryData.processingTime}.`,
      }
    };
  } catch (err) {
    return {
      title: 'Visa Not Found | Dyna Tours India'
    };
  }
}

import { schengenCountries, otherCountries } from '@/data/visaData';

export async function generateStaticParams() {
  const visas = await api.getVisas();
  const list = [
    ...visas,
    ...schengenCountries.map(c => ({ id: c.id! })),
    ...otherCountries.map(c => ({ id: c.id! }))
  ];
  return list.map((country) => ({
    country: country.id,
  }));
}

export default async function CountryVisaPage({ params }: CountryVisaPageProps) {
  const countryId = (await params).country;
  let countryData;
  let allVisas;
  
  try {
    [countryData, allVisas] = await Promise.all([
      api.getVisa(countryId),
      api.getVisas()
    ]);
  } catch (err) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'serviceType': `${countryData.name} Visa Assistance`,
    'provider': {
      '@type': 'TravelAgency',
      'name': 'Dyna Tours India',
    },
    'areaServed': countryData.name,
    'offers': {
      '@type': 'Offer',
      'price': countryData.price ? countryData.price.replace(/[^0-9.]/g, '') : '',
      'priceCurrency': 'INR'
    },
    'description': `Assistance for ${countryData.name} Tourist Visa. Processing time: ${countryData.processingTime}. Validity: ${countryData.validity}.`
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Header */}
      <section className={styles.countryHeader}>
        <div className="container">
          <div className={styles.countryHeaderContent}>
            <div className={styles.countryFlagLarge}>{countryData.flag}</div>
            <div>
              <h1 className={styles.countryHeaderTitle}>{countryData.name} Tourist Visa</h1>
              <span className={styles.countryTypeBadge}>{countryData.type.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details */}
      <section className="section bg-light" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="container">
          <div className={styles.keyInfoGrid}>
            <div className={styles.keyInfoItem}>
              <span className={styles.keyInfoLabel}>Processing Time</span>
              <span className={styles.keyInfoValue}>{countryData.processingTime}</span>
            </div>
            <div className={styles.keyInfoItem}>
              <span className={styles.keyInfoLabel}>Validity</span>
              <span className={styles.keyInfoValue}>{countryData.validity}</span>
            </div>
            <div className={styles.keyInfoItem}>
              <span className={styles.keyInfoLabel}>Biometrics/Interview</span>
              <span className={styles.keyInfoValue}>{countryData.biometric}</span>
            </div>
            {countryData.entryType && (
              <div className={styles.keyInfoItem}>
                <span className={styles.keyInfoLabel}>Entry Type</span>
                <span className={styles.keyInfoValue}>{countryData.entryType}</span>
              </div>
            )}
            {countryData.stayPeriod && (
              <div className={styles.keyInfoItem}>
                <span className={styles.keyInfoLabel}>Stay Period</span>
                <span className={styles.keyInfoValue}>{countryData.stayPeriod}</span>
              </div>
            )}
            {countryData.price && (
              <div className={styles.keyInfoItem}>
                <span className={styles.keyInfoLabel}>Starting Price</span>
                <span className={styles.keyInfoValue}>{countryData.price}</span>
              </div>
            )}
          </div>

          <div className={styles.detailsContent}>
            {/* Left 8 Columns: Main Details Content */}
            <div className={styles.detailsMain}>
              {countryData.description && (
                <section>
                  <div 
                    style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={{ __html: countryData.description }}
                  />
                </section>
              )}

              <section>
                <h2>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--color-primary-red)" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Required Documents
                </h2>
                <ul className={styles.detailsList}>
                  {countryData.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--color-primary-red)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  Important Notes
                </h2>
                <ul className={styles.detailsList}>
                  {countryData.importantNotes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2>
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--color-primary-red)" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  Terms & Conditions
                </h2>
                <ul className={styles.detailsList}>
                  {countryData.terms.map((term, idx) => (
                    <li key={idx}>{term}</li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right 4 Columns: Need Assistance Card */}
            <div>
              <div className={styles.sidebarCard}>
                <span className="section-subtitle" style={{ display: 'block', marginBottom: '0.5rem' }}>Personalized Support</span>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--color-secondary-navy)', marginBottom: '1rem' }}>
                  Need Assistance?
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.95rem' }}>
                  Our experienced visa specialists will guide you through the complete {countryData.name} tourist visa application process, ensuring document verification and hassle-free processing.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-secondary-navy)', fontWeight: 600, fontSize: '0.9rem' }}>
                    <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>
                    Official Document Verification
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-secondary-navy)', fontWeight: 600, fontSize: '0.9rem' }}>
                    <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</span>
                    Fast-Track Processing Support
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-secondary-navy)', fontWeight: 600, fontSize: '0.9rem' }}>
                    <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛡️</span>
                    100% Secure & Confidential
                  </div>
                </div>

                <a href="#enquiry-form" className="btn btn-primary" style={{ width: '100%', marginTop: '1.75rem', textAlign: 'center', display: 'block' }}>
                  Enquire Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ specific to country */}
      <VisaFAQ faqs={countryData.faqs} />

      {/* Start Your Visa Enquiry Section */}
      <section className="section bg-white" id="enquiry-form" style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <VisaEnquiryForm 
            destinations={allVisas} 
            preselectedCountry={countryData.id} 
          />
        </div>
      </section>
    </main>
  );
}
