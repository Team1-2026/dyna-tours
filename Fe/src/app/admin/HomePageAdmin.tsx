'use client';

import React, { useState, useEffect } from 'react';
import { homePageApi } from '@/lib/api';
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
  StatCounter,
  BlogPost,
  Testimonial,
} from '@/data/homeData';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { defaultBottomContentHtml } from '@/components/home/HomeBottomContent';

export default function HomePageAdmin() {
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'offers' | 'about' | 'testimonials' | 'cta' | 'reviews_content'>('hero');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Editable states
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [offers, setOffers] = useState<ExclusiveOffer[]>(defaultOffers);
  const [stats, setStats] = useState<StatCounter[]>(defaultStats);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);

  const [aboutData, setAboutData] = useState({
    title: 'About Dyna Tours India',
    subtitle: 'EXCELLENCE IN TRAVEL SINCE 2010',
    description1: 'Dyna Tours India is a premier luxury travel management company dedicated to curating extraordinary, customized international holidays, heritage domestic tours, express visas, and corporate travel experiences.',
    description2: 'With a passionate team of travel architects, 24/7 global concierge support, and direct partnerships with world-class airlines and luxury resorts, we ensure every journey is effortless, unforgettable, and tailored to your exact desires.',
    videoThumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    yearsExperience: 16,
  });

  const [ctaData, setCtaData] = useState({
    heading: 'Ready to Plan Your Next Adventure?',
    description: 'Connect with our expert travel consultants for tailor-made itineraries, VIP hotel upgrades, and instant visa assistance.',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85',
    whatsappNumber: '919876543210',
  });

  const [reviewsContentData, setReviewsContentData] = useState({
    title: 'Discover Exceptional Travel Experiences',
    subtitle: 'KNOWLEDGE & INSIGHTS',
    content: defaultBottomContentHtml,
  });

  useEffect(() => {
    async function fetchHomeCms() {
      setLoading(true);
      try {
        const data = await homePageApi.getHomePageData();
        if (data) {
          if (data.hero_slides) setHeroSlides(data.hero_slides);
          if (data.offers) setOffers(data.offers);
          if (data.stats) setStats(data.stats);
          if (data.testimonials) setTestimonials(data.testimonials);
          if (data.about) setAboutData((prev) => ({ ...prev, ...data.about }));
          if (data.cta) setCtaData((prev) => ({ ...prev, ...data.cta }));
          if (data.reviews_bottom_content) setReviewsContentData((prev) => ({ ...prev, ...data.reviews_bottom_content }));
        }
      } catch (err) {
        console.warn('Using initial home admin settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeCms();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving changes...');
    try {
      // Save data locally & simulate API save call
      const payload = {
        hero_slides: heroSlides,
        offers,
        stats,
        testimonials,
        about: aboutData,
        cta: ctaData,
        reviews_bottom_content: reviewsContentData,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('dyna_home_cms_data', JSON.stringify(payload));
      }
      setSaveStatus('✓ Home Page content updated successfully!');
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: any) {
      setSaveStatus(`❌ Failed to save: ${err.message || 'Error'}`);
    }
  };

  return (
    <div style={{ padding: '1.5rem', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0C2745', margin: 0 }}>🏠 Home Page CMS Manager</h2>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Customize hero slides, promotional offers, about content, statistics, and final CTA banners dynamically.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          style={{
            background: 'linear-gradient(135deg, #E7282B, #c61e21)',
            color: '#ffffff',
            border: 'none',
            padding: '0.65rem 1.4rem',
            borderRadius: '9999px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(231,40,43,0.3)',
          }}
        >
          Save All Changes
        </button>
      </div>

      {saveStatus && (
        <div style={{ padding: '0.75rem 1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>
          {saveStatus}
        </div>
      )}

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        {[
          { id: 'hero', label: '🎬 Hero Slides (4-6)' },
          { id: 'offers', label: '🏷️ Exclusive Deals' },
          { id: 'about', label: 'ℹ️ About & Counters' },
          { id: 'testimonials', label: '💬 Testimonials' },
          { id: 'reviews_content', label: '📝 Content Below Reviews' },
          { id: 'cta', label: '📢 Final CTA Banner' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            style={{
              padding: '0.6rem 1.1rem',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              background: activeSubTab === tab.id ? '#0C2745' : '#f1f5f9',
              color: activeSubTab === tab.id ? '#ffffff' : '#475569',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Hero Slides Editor */}
      {activeSubTab === 'hero' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {heroSlides.map((slide, idx) => (
            <div key={slide.id} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, color: '#0C2745', fontWeight: 800 }}>Slide #{idx + 1}</h4>
                <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '0.2rem 0.6rem', borderRadius: '4px', color: '#475569' }}>
                  ID: {slide.id}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Subtitle</label>
                  <input
                    type="text"
                    value={slide.subtitle}
                    onChange={(e) => {
                      const updated = [...heroSlides];
                      updated[idx].subtitle = e.target.value;
                      setHeroSlides(updated);
                    }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Badge Tag</label>
                  <input
                    type="text"
                    value={slide.badge || ''}
                    onChange={(e) => {
                      const updated = [...heroSlides];
                      updated[idx].badge = e.target.value;
                      setHeroSlides(updated);
                    }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Main Title Heading</label>
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) => {
                    const updated = [...heroSlides];
                    updated[idx].title = e.target.value;
                    setHeroSlides(updated);
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Short Description</label>
                <textarea
                  rows={2}
                  value={slide.description}
                  onChange={(e) => {
                    const updated = [...heroSlides];
                    updated[idx].description = e.target.value;
                    setHeroSlides(updated);
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Primary CTA Text</label>
                  <input
                    type="text"
                    value={slide.primaryCtaText}
                    onChange={(e) => {
                      const updated = [...heroSlides];
                      updated[idx].primaryCtaText = e.target.value;
                      setHeroSlides(updated);
                    }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Primary CTA Link</label>
                  <input
                    type="text"
                    value={slide.primaryCtaLink}
                    onChange={(e) => {
                      const updated = [...heroSlides];
                      updated[idx].primaryCtaLink = e.target.value;
                      setHeroSlides(updated);
                    }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Background Image URL</label>
                  <input
                    type="text"
                    value={slide.bgImage}
                    onChange={(e) => {
                      const updated = [...heroSlides];
                      updated[idx].bgImage = e.target.value;
                      setHeroSlides(updated);
                    }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Exclusive Deals Editor */}
      {activeSubTab === 'offers' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {offers.map((offer, idx) => (
            <div key={offer.id} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#0C2745', fontWeight: 800 }}>Offer Banner #{idx + 1}</h4>
              
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Title</label>
                <input
                  type="text"
                  value={offer.title}
                  onChange={(e) => {
                    const updated = [...offers];
                    updated[idx].title = e.target.value;
                    setOffers(updated);
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Discount Badge</label>
                  <input
                    type="text"
                    value={offer.discountBadge}
                    onChange={(e) => {
                      const updated = [...offers];
                      updated[idx].discountBadge = e.target.value;
                      setOffers(updated);
                    }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Promo Code</label>
                  <input
                    type="text"
                    value={offer.code || ''}
                    onChange={(e) => {
                      const updated = [...offers];
                      updated[idx].code = e.target.value;
                      setOffers(updated);
                    }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Description</label>
                <textarea
                  rows={2}
                  value={offer.description}
                  onChange={(e) => {
                    const updated = [...offers];
                    updated[idx].description = e.target.value;
                    setOffers(updated);
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Background Image URL</label>
                <input
                  type="text"
                  value={offer.bgImage}
                  onChange={(e) => {
                    const updated = [...offers];
                    updated[idx].bgImage = e.target.value;
                    setOffers(updated);
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. About & Counter Stats */}
      {activeSubTab === 'about' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#0C2745', fontWeight: 800 }}>About Section Content</h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Heading Title</label>
                <input
                  type="text"
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Subtitle</label>
                <input
                  type="text"
                  value={aboutData.subtitle}
                  onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Primary Paragraph</label>
              <textarea
                rows={3}
                value={aboutData.description1}
                onChange={(e) => setAboutData({ ...aboutData, description1: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Video Thumbnail Image URL</label>
                <input
                  type="text"
                  value={aboutData.videoThumbnail}
                  onChange={(e) => setAboutData({ ...aboutData, videoThumbnail: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>YouTube Video URL</label>
                <input
                  type="text"
                  value={aboutData.youtubeUrl}
                  onChange={(e) => setAboutData({ ...aboutData, youtubeUrl: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Years Exp.</label>
                <input
                  type="number"
                  value={aboutData.yearsExperience}
                  onChange={(e) => setAboutData({ ...aboutData, yearsExperience: Number(e.target.value) })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
          </div>

          <div style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#0C2745', fontWeight: 800 }}>Counter Statistics (4 Items)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {stats.map((stat, idx) => (
                <div key={stat.id} style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Label #{idx + 1}</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const updated = [...stats];
                      updated[idx].label = e.target.value;
                      setStats(updated);
                    }}
                    style={{ width: '100%', padding: '0.4rem', marginBottom: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                  />

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <input
                      type="number"
                      value={stat.number}
                      onChange={(e) => {
                        const updated = [...stats];
                        updated[idx].number = Number(e.target.value);
                        setStats(updated);
                      }}
                      style={{ width: '60%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                    />
                    <input
                      type="text"
                      value={stat.suffix}
                      onChange={(e) => {
                        const updated = [...stats];
                        updated[idx].suffix = e.target.value;
                        setStats(updated);
                      }}
                      style={{ width: '40%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Testimonials */}
      {activeSubTab === 'testimonials' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {testimonials.map((t, idx) => (
            <div key={t.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Traveler Name</label>
                <input
                  type="text"
                  value={t.name}
                  onChange={(e) => {
                    const updated = [...testimonials];
                    updated[idx].name = e.target.value;
                    setTestimonials(updated);
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '0.5rem' }}
                />

                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Destination Visited</label>
                <input
                  type="text"
                  value={t.destinationVisited}
                  onChange={(e) => {
                    const updated = [...testimonials];
                    updated[idx].destinationVisited = e.target.value;
                    setTestimonials(updated);
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Review Text</label>
                <textarea
                  rows={4}
                  value={t.review}
                  onChange={(e) => {
                    const updated = [...testimonials];
                    updated[idx].review = e.target.value;
                    setTestimonials(updated);
                  }}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Final CTA Banner */}
      {activeSubTab === 'cta' && (
        <div style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#0C2745', fontWeight: 800 }}>Final Call to Action Banner</h4>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Main Banner Heading</label>
            <input
              type="text"
              value={ctaData.heading}
              onChange={(e) => setCtaData({ ...ctaData, heading: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Short Description</label>
            <textarea
              rows={2}
              value={ctaData.description}
              onChange={(e) => setCtaData({ ...ctaData, description: e.target.value })}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Background Image URL</label>
              <input
                type="text"
                value={ctaData.bgImage}
                onChange={(e) => setCtaData({ ...ctaData, bgImage: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>WhatsApp Number (Country code)</label>
              <input
                type="text"
                value={ctaData.whatsappNumber}
                onChange={(e) => setCtaData({ ...ctaData, whatsappNumber: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. Content Below Reviews (Rich Text Editor) */}
      {activeSubTab === 'reviews_content' && (
        <div style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.25rem 0', color: '#0C2745', fontWeight: 800, fontSize: '1.1rem' }}>
              📝 Manage Content Below Reviews Section
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Use the rich text editor to format paragraphs, bullet points, headings (H1-H4), bold/italics, text alignment (Left, Center, Right, Justify), and internal/external hyperlinks.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                Section Title (Optional)
              </label>
              <input
                type="text"
                value={reviewsContentData.title}
                onChange={(e) => setReviewsContentData({ ...reviewsContentData, title: e.target.value })}
                placeholder="e.g. Discover Exceptional Travel Experiences"
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                Section Subtitle / Tag (Optional)
              </label>
              <input
                type="text"
                value={reviewsContentData.subtitle}
                onChange={(e) => setReviewsContentData({ ...reviewsContentData, subtitle: e.target.value })}
                placeholder="e.g. KNOWLEDGE & INSIGHTS"
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
              Rich Text Editor Content
            </label>
            <RichTextEditor
              value={reviewsContentData.content}
              onChange={(html) => setReviewsContentData({ ...reviewsContentData, content: html })}
              minHeight="280px"
              placeholder="Enter rich text content here..."
            />
          </div>
        </div>
      )}

    </div>
  );
}
