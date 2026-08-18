import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';
import RichTextEditor from '@/components/RichTextEditor';
import ImageTabularManager from '@/components/ImageTabularManager';

export default function FlightsAdmin() {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/flights/page', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPageData(data);
      }
    } catch (error) {
      console.error('Error fetching flight page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/flights/page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pageData)
      });
      if (response.ok) {
        alert('Flight page updated successfully');
      } else {
        alert('Failed to update flight page');
      }
    } catch (error) {
      console.error('Error saving flight page data:', error);
      alert('Error saving data');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setPageData({ ...pageData, [field]: value });
  };

  if (loading) return <div>Loading...</div>;
  if (!pageData) return <div>No data available</div>;

  return (
    <div className={styles.adminSection}>
      <div className={styles.sectionHeader}>
        <h2>Flight Page Settings</h2>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className={styles.adminGrid}>
        {/* Hero Section */}
        <div className={styles.adminCard}>
          <h3>Hero Banner</h3>
          <div className={styles.formGroup}>
            <label>Headline</label>
            <input type="text" value={pageData.hero_headline || ''} onChange={(e) => handleChange('hero_headline', e.target.value)} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>Tagline</label>
            <input type="text" value={pageData.hero_tagline || ''} onChange={(e) => handleChange('hero_tagline', e.target.value)} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>Hero Image URL <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'normal' }}>(Recommended size: 1920 × 460 px)</span></label>
            <input type="text" value={pageData.hero_image || ''} onChange={(e) => handleChange('hero_image', e.target.value)} className={styles.input} />
          </div>
        </div>

        {/* Overview Section */}
        <div className={styles.adminCard}>
          <h3>Overview</h3>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input type="text" value={pageData.overview_title || ''} onChange={(e) => handleChange('overview_title', e.target.value)} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <RichTextEditor value={pageData.overview_description || ''} onChange={(val) => handleChange('overview_description', val)} />
          </div>
        </div>

        {/* Call to Action Section */}
        <div className={styles.adminCard}>
          <h3>Call to Action (CTA)</h3>
          <div className={styles.formGroup}>
            <label>CTA Heading</label>
            <input type="text" value={pageData.cta_heading || ''} onChange={(e) => handleChange('cta_heading', e.target.value)} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>CTA Text</label>
            <textarea value={pageData.cta_text || ''} onChange={(e) => handleChange('cta_text', e.target.value)} className={styles.input} rows={3} />
          </div>
          <div className={styles.formGroup}>
            <label>CTA Background Image</label>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              {pageData.cta_bg_image && (
                <div style={{ width: '48px', height: '36px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', flexShrink: 0 }}>
                  <img
                    src={pageData.cta_bg_image.startsWith('http') ? pageData.cta_bg_image : `http://127.0.0.1:8000${pageData.cta_bg_image}`}
                    alt="CTA Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              <input
                type="file"
                id="flight-cta-upload"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const formData = new FormData();
                    formData.append('image', file);
                    const token = localStorage.getItem('token');
                    const res = await fetch('http://127.0.0.1:8000/api/upload', {
                      method: 'POST',
                      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                      body: formData,
                    });
                    if (res.ok) {
                      const data = await res.json();
                      handleChange('cta_bg_image', data.url);
                    }
                  } catch (err) {
                    console.error('Failed to upload image:', err);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById('flight-cta-upload')?.click()}
                style={{
                  padding: '0.55rem 1rem',
                  background: '#0C2745',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                }}
              >
                {pageData.cta_bg_image ? '📤 Change Image' : '📁 Upload Image'}
              </button>
              {pageData.cta_bg_image && (
                <button
                  type="button"
                  onClick={() => handleChange('cta_bg_image', '')}
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
          <div className={styles.formGroup}>
            <label>WhatsApp Number</label>
            <input type="text" value={pageData.whatsapp_number || ''} onChange={(e) => handleChange('whatsapp_number', e.target.value)} className={styles.input} placeholder="+919876543210" />
          </div>
        </div>
      </div>
      
      {/* Gallery Section */}
      <div className={styles.adminCard} style={{ marginTop: '2rem' }}>
        <h3>Gallery Images</h3>
        <p className={styles.helpText}>Add images to the flight page gallery.</p>
        <ImageTabularManager
          images={pageData.gallery_images || []}
          onChange={(imgs) => handleChange('gallery_images', imgs)}
        />
      </div>

      {/* Bottom Save Changes button */}
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving} style={{ padding: '0.875rem 2.5rem', fontSize: '1rem' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

    </div>
  );
}
