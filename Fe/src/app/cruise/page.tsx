import React from 'react';
import { api, Cruise, CruisePageData } from '@/lib/api';
import CruisePageClient from './CruisePageClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Cruise Holidays | Luxury Cruise Packages | Dyna Tours India',
  description: "Sail in Luxury with Dyna Tours India. Explore Mediterranean, Southeast Asia, Caribbean & Kerala luxury cruise packages with world-class dining, suites & shore excursions.",
};

export default async function CruisePage() {
  let pageData: CruisePageData = {
    banner_title: 'Cruise Holidays',
    banner_tagline: "Sail in Luxury – Discover the World's Most Spectacular Cruise Journeys",
    banner_image: 'https://images.unsplash.com/photo-1548574505-5e2386903d8f?auto=format&fit=crop&w=1920&q=80',
    overview_heading: 'Experience Unrivalled Luxury on the High Seas',
    overview_description: 'Embark on unforgettable ocean and river cruise journeys tailored for comfort, romance, and adventure.',
    overview_image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
    overview_cta_text: 'View Cruise Packages',
    cta_heading: 'Ready to Set Sail?',
    cta_description: 'Book your dream cruise holiday with Dyna Tours India.',
    cta_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    cta_button1_text: 'Enquire Now',
    cta_button2_text: 'Talk to Expert'
  };

  let cruises: Cruise[] = [];

  try {
    const [fetchedPage, fetchedCruises] = await Promise.all([
      api.getCruisePage(),
      api.getCruises({ status: 'Active' })
    ]);
    if (fetchedPage) pageData = fetchedPage;
    if (fetchedCruises) cruises = fetchedCruises;
  } catch (err) {
    console.error('Failed to load cruise page data on server:', err);
  }

  return <CruisePageClient initialPageData={pageData} initialCruises={cruises} />;
}
