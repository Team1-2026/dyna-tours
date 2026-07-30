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
    } catch (err: any) {
      console.error(err);
      setSaveStatus(`❌ ${err?.message || 'Error saving page settings'}`);
      setTimeout(() => setSaveStatus(null), 6000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (pageData) setPageData({ ...pageData, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ContactPage) => {
    const file = e.target.files?.[0];
    if (!file || !pageData) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(`File "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(2)} MB. Maximum allowed image size is 5 MB.`);
      e.target.value = '';
      return;
    }
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
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Hero Background Image URL / Upload <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'normal' }}>(Recommended size: 1920 × 460 px)</span>
          </label>
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
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Brand Card Description</label>
          <textarea name="brand_description" value={pageData.brand_description || ''} onChange={handleChange} rows={3} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>

        {/* Social Media Links Editor (Task 38) */}
        <div style={{ marginBottom: '30px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#1e293b' }}>Connect With Us - Social Media Links</label>
          {(pageData.social_links || []).map((link, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Platform (e.g. Instagram)" 
                value={link.platform} 
                onChange={(e) => {
                  const updated = [...(pageData.social_links || [])];
                  updated[idx] = { ...updated[idx], platform: e.target.value };
                  setPageData({ ...pageData, social_links: updated });
                }}
                style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <input 
                type="text" 
                placeholder="URL (e.g. https://instagram.com/dynatours)" 
                value={link.url} 
                onChange={(e) => {
                  const updated = [...(pageData.social_links || [])];
                  updated[idx] = { ...updated[idx], url: e.target.value };
                  setPageData({ ...pageData, social_links: updated });
                }}
                style={{ padding: '6px 10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <button 
                type="button"
                onClick={() => {
                  const updated = (pageData.social_links || []).filter((_, i) => i !== idx);
                  setPageData({ ...pageData, social_links: updated });
                }}
                style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Remove
              </button>
            </div>
          ))}
          <button 
            type="button"
            onClick={() => {
              const updated = [...(pageData.social_links || []), { platform: 'New Platform', url: 'https://', icon: 'Instagram' }];
              setPageData({ ...pageData, social_links: updated });
            }}
            style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '5px' }}
          >
            + Add Social Link
          </button>
        </div>

        {/* Google Maps Embed Link */}
        <h3 style={{ borderBottom: '2px solid #dc2626', paddingBottom: '8px', color: '#991b1b' }}>5. Google Maps Iframe Embed</h3>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Google Maps Embed URL (`src` attribute)</label>
          <input type="text" name="map_embed_url" value={pageData.map_embed_url || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>

        {/* SEO Settings (Task 32) */}
        <h3 style={{ borderBottom: '2px solid #dc2626', paddingBottom: '8px', color: '#991b1b' }}>6. SEO Settings</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Meta Title</label>
          <input type="text" name="meta_title" value={(pageData as any).meta_title || ''} onChange={handleChange} placeholder="e.g. Contact Us | Dyna Tours India" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Meta Description</label>
          <textarea name="meta_description" value={(pageData as any).meta_description || ''} onChange={handleChange} rows={2} placeholder="Meta description for search engines..." style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>URL Slug</label>
            <input type="text" name="url_slug" value={(pageData as any).url_slug || 'contact-us'} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Canonical URL</label>
            <input type="text" name="canonical_url" value={(pageData as any).canonical_url || ''} onChange={handleChange} placeholder="https://dynatours.in/contact-us" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>

        <button type="submit" className={styles.saveBtn} style={{ padding: '12px 24px', fontSize: '1rem', cursor: 'pointer' }}>
          Save
        </button>
      </form>
    </div>
  );
}
