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
        <button className={styles.primaryButton} onClick={handleSave} disabled={saving}>
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
            <label>Hero Image URL</label>
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
            <label>CTA Background Image URL</label>
            <input type="text" value={pageData.cta_bg_image || ''} onChange={(e) => handleChange('cta_bg_image', e.target.value)} className={styles.input} />
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

    </div>
  );
}
