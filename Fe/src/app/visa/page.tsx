import React from 'react';
import type { Metadata } from 'next';
import { schengenCountries, otherCountries } from '@/data/visaData';
import { api, getBaseUrl } from '@/lib/api';
import VisaHeroBanner from '@/components/visa/VisaHeroBanner';
import EVisaGrid from '@/components/visa/EVisaGrid';
import StampedVisaSection from '@/components/visa/StampedVisaSection';
import WhyChooseUsVisa from '@/components/visa/WhyChooseUsVisa';
import VisaProcess from '@/components/visa/VisaProcess';
import VisaEnquiryForm from '@/components/visa/VisaEnquiryForm';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${getBaseUrl()}/visa-page`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.meta_title || 'Trusted Global Visa Services | Dyna Tours India',
        description: data.meta_description || 'Apply for your tourist visa with confidence. Dyna Tours India provides reliable visa assistance for international destinations, including e-Visas and embassy visas.',
        keywords: data.meta_keywords || 'Visa Services, Tourist Visa, e-Visa, Schengen Visa, USA Visa, UK Visa, Dyna Tours',
        openGraph: {
          title: data.og_title || data.meta_title || 'Trusted Global Visa Services | Dyna Tours India',
          description: data.og_description || data.meta_description || 'Expert visa assistance, document verification, and end-to-end support for your international travel.',
          type: 'website',
          images: data.og_image ? [{ url: data.og_image }] : undefined,
        },
      };
    }
  } catch (err) {
    console.error('Failed to fetch visa-page SEO metadata:', err);
  }

  return {
    title: 'Trusted Global Visa Services | Dyna Tours India',
    description: 'Apply for your tourist visa with confidence. Dyna Tours India provides reliable visa assistance for international destinations, including e-Visas and embassy visas.',
  };
}

export default async function VisaPage() {
  // Schema.org structured data for Visa Service
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'serviceType': 'Visa Assistance Services',
    'provider': {
      '@type': 'TravelAgency',
      'name': 'Dyna Tours India',
    },
    'areaServed': 'Worldwide',
    'description': 'Dyna Tours India provides reliable visa assistance for international destinations, helping travelers with documentation, visa requirements, and application support.'
  };

  // Fetch dynamic visas from backend
  const allVisas = await api.getVisas();
  
  // Separate into e-Visas for the grid if they have type 'e-visa'
  // Or just pass all e-visas from the DB
  const dynamicEVisas = allVisas.filter(v => v.type === 'e-visa' || !v.type);

  const allDestinations = allVisas.map(d => ({ id: d.id, name: d.name }));

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <VisaHeroBanner countries={allDestinations} />
      
      {/* Intro section implicitly covered by banner text but we can add a bit more here if needed */}
      
      <EVisaGrid destinations={dynamicEVisas} />
      
      <StampedVisaSection 
        schengenCountries={schengenCountries} 
        otherCountries={otherCountries} 
      />
      
      <WhyChooseUsVisa />
      
      <VisaProcess />
      
      <section className="section bg-white" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <VisaEnquiryForm destinations={allVisas} />
        </div>
      </section>
      
      {/* Mobile Sticky CTA */}
      <a href="#enquiry" className={styles.floatingCTA} aria-label="Enquire Now">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </a>
    </main>
  );
}
