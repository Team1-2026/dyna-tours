'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  api, 
  getPackages, 
  homePageApi, 
  formatPrice,
  Hotel, 
  Destination,
  getSectionVisibility,
  SectionVisibility,
  defaultSectionVisibility
} from '@/lib/api';

import {
  defaultHeroSlides,
  defaultOffers,
  defaultThemes,
  defaultVisaCountries,
  defaultStats,
  defaultBlogs,
  defaultTestimonials,
  HeroSlide,
  ExclusiveOffer,
  TravelTheme,
  VisaCountryCard,
  StatCounter,
  BlogPost,
  Testimonial,
} from '@/data/homeData';

import { HeroBanner } from '@/components/home/HeroBanner';
import { UniversalSearch } from '@/components/home/UniversalSearch';
import { ExclusiveDeals } from '@/components/home/ExclusiveDeals';
import { TrendingPackages } from '@/components/home/TrendingPackages';
import { PopularDestinations } from '@/components/home/PopularDestinations';
import { ThemePackages } from '@/components/home/ThemePackages';
import { VisaServicesSection } from '@/components/home/VisaServicesSection';
import { FeaturedHotelsSection } from '@/components/home/FeaturedHotelsSection';
import { AboutSection } from '@/components/home/AboutSection';
import { LatestBlogs } from '@/components/home/LatestBlogs';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { HomeBottomContent } from '@/components/home/HomeBottomContent';
import { FinalCTA } from '@/components/home/FinalCTA';

export default function Home() {
  // State for dynamic CMS & API data
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [offers, setOffers] = useState<ExclusiveOffer[]>(defaultOffers);
  const [packages, setPackages] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [themes, setThemes] = useState<TravelTheme[]>(defaultThemes);
  const [visaCountries, setVisaCountries] = useState<VisaCountryCard[]>(defaultVisaCountries);
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [stats, setStats] = useState<StatCounter[]>(defaultStats);
  const [blogs, setBlogs] = useState<BlogPost[]>(defaultBlogs);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [aboutData, setAboutData] = useState<any>(null);
  const [ctaData, setCtaData] = useState<any>(null);
  const [reviewsContentData, setReviewsContentData] = useState<any>(null);
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(defaultSectionVisibility);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setSectionVisibility(getSectionVisibility());
    const handleVisibilityChanged = () => {
      if (isMounted) setSectionVisibility(getSectionVisibility());
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('dyna_section_visibility_changed', handleVisibilityChanged);
    }

    async function loadHomeContent() {
      try {
        // Fetch Packages
        const packagesData = await getPackages().catch(() => []);
        if (isMounted && packagesData && packagesData.length > 0) {
          setPackages(packagesData);
        }

        // Fetch Destinations
        const destData = await api.getDestinations().catch(() => []);
        if (isMounted && destData && destData.length > 0) {
          setDestinations(destData);
        }

        // Fetch Featured Hotels
        const hotelData = await api.getHotels().catch(() => []);
        if (isMounted && hotelData && hotelData.length > 0) {
          const activeHotels = hotelData.filter(h => h.status !== 'Inactive');
          const sorted = [...(activeHotels.length > 0 ? activeHotels : hotelData)].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          setFeaturedHotels(sorted);
        }

        // Fetch Visas
        const visaData = await api.getVisas().catch(() => []);
        if (isMounted && visaData && visaData.length > 0) {
          const formattedVisas: VisaCountryCard[] = visaData.map((v: any) => ({
            id: String(v.id || v.country),
            country: v.country || v.name,
            code: v.code || '',
            flagUrl: v.flag_url || v.flagUrl || `https://flagcdn.com/w160/${(v.code || 'in').toLowerCase()}.png`,
            visaType: v.visa_type || v.visaType || 'Tourist Visa',
            processingTime: v.processing_time || v.processingTime || '3-5 Days',
            startingPrice: v.price ? formatPrice(v.price) : '₹3,499',
            popular: Boolean(v.popular),
            urlSlug: v.url_slug || v.id,
          }));
          setVisaCountries(formattedVisas);
        }

        // Fetch CMS Home Data if configured in Laravel Admin Panel
        const homeCms = await homePageApi.getHomePageData().catch(() => null);
        if (isMounted && homeCms) {
          if (homeCms.hero_slides) setHeroSlides(homeCms.hero_slides);
          if (homeCms.offers) setOffers(homeCms.offers);
          if (homeCms.themes) setThemes(homeCms.themes);
          if (homeCms.stats) setStats(homeCms.stats);
          if (homeCms.blogs) setBlogs(homeCms.blogs);
          if (homeCms.testimonials) setTestimonials(homeCms.testimonials);
          if (homeCms.about) setAboutData(homeCms.about);
          if (homeCms.cta) setCtaData(homeCms.cta);
          if (homeCms.reviews_bottom_content) setReviewsContentData(homeCms.reviews_bottom_content);
        }
      } catch (error) {
        console.warn('Using default luxury home datasets:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHomeContent();

    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('dyna_section_visibility_changed', handleVisibilityChanged);
      }
    };
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen selection:bg-red-600 selection:text-white">
      
      {/* 1. Hero Banner */}
      <HeroBanner slides={heroSlides} />

      {/* 2. Universal Travel Search Widget */}
      <UniversalSearch />

      {/* 3. Exclusive Deals & Offers Carousel */}
      <ExclusiveDeals offers={offers} />

      {/* 4. Trending Holiday Packages */}
      {sectionVisibility.packages !== false && (
        <TrendingPackages 
          packages={packages} 
          adminDescription={aboutData?.trending_description}
        />
      )}

      {/* 5. Popular Destinations */}
      {sectionVisibility.destinations !== false && (
        <PopularDestinations 
          destinations={destinations}
          adminDescription={aboutData?.destinations_description}
        />
      )}

      {/* 6. Theme Packages Grid */}
      {sectionVisibility.themes !== false && (
        <ThemePackages 
          themes={themes}
          packages={packages}
          adminDescription={aboutData?.themes_description}
        />
      )}

      {/* 7. Visa Services */}
      {sectionVisibility.visa !== false && (
        <VisaServicesSection 
          countries={visaCountries}
          adminDescription={aboutData?.visa_description}
        />
      )}

      {/* 8. Featured Luxury Hotels */}
      {sectionVisibility.hotels !== false && (
        <FeaturedHotelsSection hotels={featuredHotels} />
      )}

      {/* 9. About Dyna Tours India & Counter Stats */}
      <AboutSection 
        stats={stats}
        title={aboutData?.title}
        subtitle={aboutData?.subtitle}
        description1={aboutData?.description1}
        description2={aboutData?.description2}
        videoThumbnail={aboutData?.video_thumbnail}
        youtubeUrl={aboutData?.youtube_url}
        yearsExperience={aboutData?.years_experience}
      />

      {/* 10. Latest Blogs & Travel Guides */}
      {/* <LatestBlogs blogs={blogs} /> */}

      {/* 11. Testimonials Slider */}
      <TestimonialsSection testimonials={testimonials} />

    </div>
  );
}
