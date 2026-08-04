'use client';

import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';
import { BASE_URL } from '@/lib/api';

interface PageSeoItem {
  id: string;
  name: string;
  category: 'static';
  endpoint: string;
  defaultSlug: string;
  defaultTitle: string;
  defaultDescription: string;
}

const SEO_PAGES: PageSeoItem[] = [
  {
    id: 'home',
    name: 'Home Page',
    category: 'static',
    endpoint: '/home-page',
    defaultSlug: '',
    defaultTitle: 'Dyna Tours | Premium International & Domestic Travel Agency in Kerala',
    defaultDescription: 'Plan your dream vacation with Dyna Tours India. Explore Kerala backwaters, international holiday packages, luxury cruises, flights, and visas.'
  },
  {
    id: 'about',
    name: 'About Us Page',
    category: 'static',
    endpoint: '/about-page',
    defaultSlug: 'about',
    defaultTitle: 'About Us | Dyna Tours India',
    defaultDescription: 'Discover our story, leadership team, and 16+ years of experience delivering unforgettable travel experiences.'
  },
  {
    id: 'contact',
    name: 'Contact Us Page',
    category: 'static',
    endpoint: '/contact-page',
    defaultSlug: 'contact-us',
    defaultTitle: 'Contact Us | Dyna Tours India',
    defaultDescription: 'Get in touch with our travel experts. Visit our office in Trivandrum, call us, or send an enquiry.'
  },
  {
    id: 'flights',
    name: 'Flight Services Page',
    category: 'static',
    endpoint: '/flights/page',
    defaultSlug: 'flights',
    defaultTitle: 'Flight Ticket Booking | Best Airfare Deals | Dyna Tours',
    defaultDescription: 'Book domestic and international flights with top airlines. Exclusive deals, instant seat selection, and 24x7 support.'
  },
  {
    id: 'groupTours',
    name: 'Group Tours Page',
    category: 'static',
    endpoint: '/group-tour-page',
    defaultSlug: 'group-tours',
    defaultTitle: 'Fixed Departure Group Tours | Dyna Tours India',
    defaultDescription: 'Join our fully guided domestic & international group tours with experienced tour managers.'
  },
  {
    id: 'cruise',
    name: 'Cruise Holidays Page',
    category: 'static',
    endpoint: '/cruise-page',
    defaultSlug: 'cruise',
    defaultTitle: 'Luxury Cruise Holidays & Packages | Dyna Tours India',
    defaultDescription: 'Sail in luxury across Europe, Asia, and tropical islands. Exclusive ocean and river cruise packages.'
  },
  {
    id: 'packages',
    name: 'Holiday Packages Page',
    category: 'static',
    endpoint: '/group-tour-page',
    defaultSlug: 'holidays',
    defaultTitle: 'Domestic & International Holiday Packages | Dyna Tours India',
    defaultDescription: 'Explore handcrafted domestic and international vacation packages with customized itineraries, flights, and luxury hotel stays.'
  }
];

export default function SeoAdmin() {
  const [selectedPageId, setSelectedPageId] = useState<string>('home');
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const selectedConfig = SEO_PAGES.find(p => p.id === selectedPageId) || SEO_PAGES[0];

  useEffect(() => {
    fetchPageSeoData(selectedConfig);
  }, [selectedPageId]);

  const fetchPageSeoData = async (config: PageSeoItem) => {
    setLoading(true);
    setSaveStatus(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const apiHost = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;
      const response = await fetch(`${apiHost}${config.endpoint}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const data = await response.json();
        setPageData(data);
      } else {
        setPageData({});
      }
    } catch (err) {
      console.error('Error fetching SEO data:', err);
      setPageData({});
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageData) return;
    setSaving(true);
    setSaveStatus('Saving SEO settings...');

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const apiHost = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;
      const response = await fetch(`${apiHost}${selectedConfig.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(pageData)
      });

      if (response.ok) {
        setSaveStatus('✅ SEO settings saved successfully!');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('❌ Failed to save SEO settings.');
      }
    } catch (err) {
      console.error('Error saving SEO settings:', err);
      setSaveStatus('❌ Connection error while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, val: string) => {
    setPageData((prev: any) => ({
      ...prev,
      [field]: val
    }));
  };

  const metaTitle = pageData?.meta_title ?? selectedConfig.defaultTitle;
  const metaDescription = pageData?.meta_description ?? selectedConfig.defaultDescription;
  const urlSlug = pageData?.url_slug ?? selectedConfig.defaultSlug;
  const canonicalUrl = pageData?.canonical_url ?? `https://dynatours.in/${urlSlug}`;

  return (
    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--color-secondary-navy)', fontSize: '1.5rem', fontWeight: 800 }}>
            🔍 SEO & Search Engine Manager
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Manage Google meta titles, descriptions, slugs, and canonical URLs without modifying underlying page content.
          </p>
        </div>

        {saveStatus && (
          <div style={{ padding: '8px 16px', borderRadius: '6px', background: saveStatus.includes('✅') ? '#dcfce7' : '#fee2e2', color: saveStatus.includes('✅') ? '#166534' : '#991b1b', fontWeight: 700, fontSize: '0.85rem' }}>
            {saveStatus}
          </div>
        )}
      </div>

      {/* Page Selection Bar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        {SEO_PAGES.map((pg) => {
          const isSelected = pg.id === selectedPageId;
          return (
            <button
              key={pg.id}
              type="button"
              onClick={() => setSelectedPageId(pg.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                fontWeight: isSelected ? 700 : 500,
                background: isSelected ? 'var(--color-primary-red, #d9232d)' : '#ffffff',
                color: isSelected ? '#ffffff' : '#334155',
                border: isSelected ? 'none' : '1px solid #cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {pg.name}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ padding: '3rem 0', textAlign: 'center', color: '#64748b' }}>
          Loading SEO settings for {selectedConfig.name}...
        </div>
      ) : (
        <form onSubmit={handleSaveSeo} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Left Column: Form Fields */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 750, color: 'var(--color-secondary-navy)' }}>
              Edit Meta Data: {selectedConfig.name}
            </h3>

            {/* Meta Title */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                  Meta Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: metaTitle.length > 60 ? '#ef4444' : '#64748b' }}>
                  {metaTitle.length} / 60 chars {metaTitle.length > 60 ? '(Too long)' : '(Recommended 50–60)'}
                </span>
              </div>
              <input
                type="text"
                value={pageData?.meta_title || ''}
                onChange={(e) => handleChange('meta_title', e.target.value)}
                placeholder={selectedConfig.defaultTitle}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
              />
            </div>

            {/* Meta Description */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                  Meta Description <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: metaDescription.length > 160 ? '#ef4444' : '#64748b' }}>
                  {metaDescription.length} / 160 chars {metaDescription.length > 160 ? '(Too long)' : '(Recommended 150–160)'}
                </span>
              </div>
              <textarea
                rows={3}
                value={pageData?.meta_description || ''}
                onChange={(e) => handleChange('meta_description', e.target.value)}
                placeholder={selectedConfig.defaultDescription}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem', lineHeight: 1.5 }}
              />
            </div>

            {/* URL Slug & Canonical URL */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  URL Slug
                </label>
                <input
                  type="text"
                  value={pageData?.url_slug ?? selectedConfig.defaultSlug}
                  onChange={(e) => handleChange('url_slug', e.target.value)}
                  placeholder={selectedConfig.defaultSlug}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={pageData?.canonical_url || ''}
                  onChange={(e) => handleChange('canonical_url', e.target.value)}
                  placeholder={`https://dynatours.in/${urlSlug}`}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.88rem' }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                background: 'var(--color-primary-red, #d9232d)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? 'Saving SEO Settings...' : `Save SEO Settings for ${selectedConfig.name}`}
            </button>
          </div>

          {/* Right Column: Google Search Live Snippet Preview */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 800 }}>
              🌐 Live Google Search Preview
            </h4>

            {/* Google Snippet Card */}
            <div style={{ background: '#ffffff', border: '1px solid #dadce0', borderRadius: '8px', padding: '16px', fontFamily: 'Arial, sans-serif' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#202124', marginBottom: '4px' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#d9232d', color: '#fff', fontSize: '10px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>D</span>
                <span>dynatours.in</span>
                <span style={{ color: '#5f6368' }}>› {urlSlug || 'page'}</span>
              </div>

              <div style={{ fontSize: '18px', color: '#1a0dab', fontWeight: '400', lineHeight: 1.3, marginBottom: '4px', wordBreak: 'break-word', cursor: 'pointer' }}>
                {metaTitle || selectedConfig.defaultTitle}
              </div>

              <div style={{ fontSize: '14px', color: '#4d5156', lineHeight: 1.5, wordBreak: 'break-word' }}>
                {metaDescription || selectedConfig.defaultDescription}
              </div>
            </div>

            <div style={{ marginTop: '16px', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
              💡 <strong>SEO Best Practices:</strong>
              <ul style={{ margin: '6px 0 0 0', paddingLeft: '16px' }}>
                <li>Keep titles between 50 and 60 characters so Google doesn't truncate them.</li>
                <li>Include target keywords near the beginning of the title.</li>
                <li>Meta description should accurately describe page offerings within 150-160 characters.</li>
              </ul>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
