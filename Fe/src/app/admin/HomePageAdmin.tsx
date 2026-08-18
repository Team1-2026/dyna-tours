'use client';

import React, { useState, useEffect } from 'react';
import { homePageApi, api, getImageUrl } from '@/lib/api';
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
import SectionVisibilityToggle from '@/components/admin/SectionVisibilityToggle';

export default function HomePageAdmin() {
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'offers' | 'testimonials' | 'cta' | 'reviews_content'>('hero');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Editable states
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [offers, setOffers] = useState<ExclusiveOffer[]>(defaultOffers);
  const [stats, setStats] = useState<StatCounter[]>(defaultStats);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);

  // Uploading indicators
  const [uploadingSlideIdx, setUploadingSlideIdx] = useState<number | null>(null);
  const [uploadingOfferIdx, setUploadingOfferIdx] = useState<number | null>(null);
  const [uploadingTestimonialIdx, setUploadingTestimonialIdx] = useState<number | null>(null);

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

  const handleHeroSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size must be less than 10MB.');
      return;
    }

    setUploadingSlideIdx(slideIdx);
    setSaveStatus(`Uploading background image for Slide #${slideIdx + 1}...`);
    try {
      const uploaded = await api.uploadImage(file);
      const updated = [...heroSlides];
      updated[slideIdx].bgImage = uploaded.url;
      setHeroSlides(updated);
      setSaveStatus(`✓ Slide #${slideIdx + 1} background image uploaded successfully!`);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to upload image file');
      setSaveStatus(null);
    } finally {
      setUploadingSlideIdx(null);
      e.target.value = '';
    }
  };

  const handleOfferImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, offerIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size must be less than 10MB.');
      return;
    }

    setUploadingOfferIdx(offerIdx);
    setSaveStatus(`Uploading background image for Offer #${offerIdx + 1}...`);
    try {
      const uploaded = await api.uploadImage(file);
      const updated = [...offers];
      updated[offerIdx].bgImage = uploaded.url;
      setOffers(updated);
      setSaveStatus(`✓ Offer #${offerIdx + 1} background image uploaded successfully!`);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to upload image file');
      setSaveStatus(null);
    } finally {
      setUploadingOfferIdx(null);
      e.target.value = '';
    }
  };

  const handleTestimonialPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, tIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5MB.');
      return;
    }

    setUploadingTestimonialIdx(tIdx);
    setSaveStatus(`Uploading photo for Traveler #${tIdx + 1}...`);
    try {
      const uploaded = await api.uploadImage(file);
      const updated = [...testimonials];
      updated[tIdx].photo = uploaded.url;
      setTestimonials(updated);
      setSaveStatus(`✓ Traveler #${tIdx + 1} photo uploaded successfully!`);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to upload photo file');
      setSaveStatus(null);
    } finally {
      setUploadingTestimonialIdx(null);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving changes...');
    try {
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0C2745', margin: 0 }}>🏠 Home Page</h2>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Customize hero slides, promotional offers, testimonials, and final CTA banners dynamically.
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
          { id: 'testimonials', label: '💬 Testimonials' },
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '1rem', alignItems: 'end' }}>
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
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Background Image</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {slide.bgImage && (
                      <div style={{ position: 'relative', width: '54px', height: '38px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', flexShrink: 0 }}>
                        <img
                          src={getImageUrl(slide.bgImage)}
                          alt={`Slide #${idx + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <input
                      type="file"
                      id={`hero-slide-file-${idx}`}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleHeroSlideImageUpload(e, idx)}
                    />

                    <button
                      type="button"
                      disabled={uploadingSlideIdx === idx}
                      onClick={() => document.getElementById(`hero-slide-file-${idx}`)?.click()}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        padding: '0.55rem 0.9rem',
                        background: uploadingSlideIdx === idx ? '#94a3b8' : '#0C2745',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: uploadingSlideIdx === idx ? 'not-allowed' : 'pointer',
                        whiteSpace: 'nowrap',
                        flex: 1,
                      }}
                    >
                      <span>{uploadingSlideIdx === idx ? '⏳ Uploading...' : (slide.bgImage ? '📤 Change Image' : '📁 Upload Image')}</span>
                    </button>

                    {slide.bgImage && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...heroSlides];
                          updated[idx].bgImage = '';
                          setHeroSlides(updated);
                        }}
                        title="Remove image"
                        style={{
                          padding: '0.55rem 0.65rem',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
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
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Background Image</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {offer.bgImage && (
                    <div style={{ position: 'relative', width: '50px', height: '38px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', flexShrink: 0 }}>
                      <img
                        src={getImageUrl(offer.bgImage)}
                        alt={`Offer #${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    id={`offer-file-${idx}`}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleOfferImageUpload(e, idx)}
                  />

                  <button
                    type="button"
                    disabled={uploadingOfferIdx === idx}
                    onClick={() => document.getElementById(`offer-file-${idx}`)?.click()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      padding: '0.55rem 0.9rem',
                      background: uploadingOfferIdx === idx ? '#94a3b8' : '#0C2745',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      cursor: uploadingOfferIdx === idx ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}
                  >
                    <span>{uploadingOfferIdx === idx ? '⏳ Uploading...' : (offer.bgImage ? '📤 Change Image' : '📁 Upload Image')}</span>
                  </button>

                  {offer.bgImage && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...offers];
                        updated[idx].bgImage = '';
                        setOffers(updated);
                      }}
                      title="Remove image"
                      style={{
                        padding: '0.55rem 0.65rem',
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Testimonials */}
      {activeSubTab === 'testimonials' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {testimonials.map((t, idx) => (
            <div key={t.id} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem' }}>
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
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '0.75rem' }}
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
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '0.75rem' }}
                />

                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Traveler Photo</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {t.photo && (
                    <div style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #cbd5e1', flexShrink: 0 }}>
                      <img
                        src={getImageUrl(t.photo)}
                        alt={t.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    id={`testimonial-file-${idx}`}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleTestimonialPhotoUpload(e, idx)}
                  />

                  <button
                    type="button"
                    disabled={uploadingTestimonialIdx === idx}
                    onClick={() => document.getElementById(`testimonial-file-${idx}`)?.click()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      padding: '0.55rem 0.9rem',
                      background: uploadingTestimonialIdx === idx ? '#94a3b8' : '#0C2745',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      cursor: uploadingTestimonialIdx === idx ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}
                  >
                    <span>{uploadingTestimonialIdx === idx ? '⏳ Uploading...' : (t.photo ? '📤 Change Photo' : '📁 Upload Photo')}</span>
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>Review Text</label>
                <textarea
                  rows={5}
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

    </div>
  );
}
