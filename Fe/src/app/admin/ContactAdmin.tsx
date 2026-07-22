import React, { useState, useEffect } from 'react';
import { contactPageApi, ContactPage, PhoneNumberItem, EmailAddressItem, SocialLinkItem } from '@/lib/api';
import styles from './admin.module.css';

export default function ContactAdmin() {
  const [pageData, setPageData] = useState<ContactPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = async () => {
    try {
      const data = await contactPageApi.getPage();
      setPageData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageData) return;
    setSaveStatus('Saving...');
    try {
      await contactPageApi.updatePage(pageData);
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('Error saving page settings');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (pageData) setPageData({ ...pageData, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ContactPage) => {
    const file = e.target.files?.[0];
    if (!file || !pageData) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPageData({ ...pageData, [fieldName]: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading Contact Us page data...</div>;
  if (!pageData) return <div style={{ padding: '20px' }}>Failed to load Contact Us page settings.</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px' }}>
      <h2 style={{ margin: '0 0 20px 0', color: 'var(--color-secondary-navy)' }}>Contact Us Page Settings</h2>
      
      {saveStatus && (
        <div style={{ background: '#e6ffe6', padding: '12px 20px', marginBottom: '20px', borderRadius: '6px', color: '#006600', fontWeight: 'bold' }}>
          {saveStatus}
        </div>
      )}

      <form onSubmit={handleSave} style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        
        {/* 1. Hero Banner */}
        <h3 style={{ borderBottom: '2px solid #dc2626', paddingBottom: '8px', color: '#991b1b' }}>1. Hero Banner</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hero Title</label>
          <input type="text" name="hero_title" value={pageData.hero_title || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hero Subtitle</label>
          <textarea name="hero_subtitle" value={pageData.hero_subtitle || ''} onChange={handleChange} rows={2} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hero Background Image URL / Upload</label>
          <input type="text" name="hero_bg_image" value={pageData.hero_bg_image || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px' }} />
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero_bg_image')} />
          {pageData.hero_bg_image && <img src={pageData.hero_bg_image} alt="Hero BG" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '6px', marginTop: '10px' }} />}
        </div>

        {/* 2. Office & Contact Details */}
        <h3 style={{ borderBottom: '2px solid #dc2626', paddingBottom: '8px', color: '#991b1b' }}>2. Office & Contact Information</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Office Name</label>
          <input type="text" name="office_name" value={pageData.office_name || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Office Address</label>
          <textarea name="office_address" value={pageData.office_address || ''} onChange={handleChange} rows={3} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Google Maps Link (For Open in Maps Button)</label>
          <input type="text" name="google_maps_url" value={pageData.google_maps_url || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>

        {/* Business Hours */}
        <h3 style={{ borderBottom: '2px solid #dc2626', paddingBottom: '8px', color: '#991b1b' }}>3. Business Hours</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Weekday Hours (Mon-Sat)</label>
            <input type="text" name="business_hours_weekday" value={pageData.business_hours_weekday || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Weekend Hours (Sunday)</label>
            <input type="text" name="business_hours_weekend" value={pageData.business_hours_weekend || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>

        {/* Brand Card Settings */}
        <h3 style={{ borderBottom: '2px solid #dc2626', paddingBottom: '8px', color: '#991b1b' }}>4. Brand Card & Social Media</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Brand Tagline</label>
          <input type="text" name="brand_tagline" value={pageData.brand_tagline || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Brand Card Description</label>
          <textarea name="brand_description" value={pageData.brand_description || ''} onChange={handleChange} rows={3} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>

        {/* Google Maps Embed Link */}
        <h3 style={{ borderBottom: '2px solid #dc2626', paddingBottom: '8px', color: '#991b1b' }}>5. Google Maps Iframe Embed</h3>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Google Maps Embed URL (`src` attribute)</label>
          <input type="text" name="map_embed_url" value={pageData.map_embed_url || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>

        <button type="submit" className={styles.saveBtn} style={{ padding: '12px 24px', fontSize: '1rem', cursor: 'pointer' }}>
          Save All Contact Us Page Settings
        </button>
      </form>
    </div>
  );
}
