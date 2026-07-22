import React, { useState, useEffect } from 'react';
import { aboutPageApi, AboutPage, WhyChooseCard, ServiceItem, AchievementCounter, CertificationLogo } from '@/lib/api';
import styles from './admin.module.css';
import RichTextEditor from '@/components/RichTextEditor';

export default function AboutAdmin() {
  const [pageData, setPageData] = useState<AboutPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = async () => {
    try {
      const data = await aboutPageApi.getPage();
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
      await aboutPageApi.updatePage(pageData);
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('Error saving page');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (pageData) setPageData({ ...pageData, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof AboutPage) => {
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

  if (loading) return <div style={{ padding: '20px' }}>Loading About Us page data...</div>;
  if (!pageData) return <div style={{ padding: '20px' }}>Failed to load About Us page settings.</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px' }}>
      <h2 style={{ margin: '0 0 20px 0', color: 'var(--color-secondary-navy)' }}>About Us Page Settings</h2>
      
      {saveStatus && (
        <div style={{ background: '#e6ffe6', padding: '12px 20px', marginBottom: '20px', borderRadius: '6px', color: '#006600', fontWeight: 'bold' }}>
          {saveStatus}
        </div>
      )}

      <form onSubmit={handleSave} style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        
        {/* 1. Hero Section */}
        <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', color: '#1e3a8a' }}>1. Hero Banner</h3>
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

        {/* 2. Company Overview */}
        <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', color: '#1e3a8a' }}>2. Company Overview</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Overview Section Title</label>
          <input type="text" name="overview_title" value={pageData.overview_title || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Years of Experience</label>
          <input type="number" name="years_experience" value={pageData.years_experience || 16} onChange={handleChange} style={{ width: '150px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Overview Description (Rich Text)</label>
          <RichTextEditor 
            value={pageData.overview_description || ''}
            onChange={(val) => setPageData({ ...pageData, overview_description: val })}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Overview Image 1</label>
            <input type="text" name="overview_image_1" value={pageData.overview_image_1 || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px' }} />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'overview_image_1')} />
            {pageData.overview_image_1 && <img src={pageData.overview_image_1} alt="Overview 1" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginTop: '8px' }} />}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Overview Image 2</label>
            <input type="text" name="overview_image_2" value={pageData.overview_image_2 || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px' }} />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'overview_image_2')} />
            {pageData.overview_image_2 && <img src={pageData.overview_image_2} alt="Overview 2" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginTop: '8px' }} />}
          </div>
        </div>

        {/* 3. Founder's Message */}
        <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', color: '#1e3a8a' }}>3. Founder's Message</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Founder / Leader Name</label>
            <input type="text" name="founder_name" value={pageData.founder_name || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title / Role</label>
            <input type="text" name="founder_title" value={pageData.founder_title || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Founder Highlight Quote</label>
          <input type="text" name="founder_quote" value={pageData.founder_quote || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Message Content (Rich Text)</label>
          <RichTextEditor 
            value={pageData.founder_message || ''}
            onChange={(val) => setPageData({ ...pageData, founder_message: val })}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Founder Photo</label>
            <input type="text" name="founder_image" value={pageData.founder_image || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px' }} />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'founder_image')} />
            {pageData.founder_image && <img src={pageData.founder_image} alt="Founder" style={{ height: '100px', objectFit: 'cover', borderRadius: '4px', marginTop: '8px' }} />}
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Signature Text / Image</label>
            <input type="text" name="founder_signature" value={pageData.founder_signature || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>

        {/* 4. Mission & Vision */}
        <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', color: '#1e3a8a' }}>4. Mission & Vision</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mission Title</label>
            <input type="text" name="mission_title" value={pageData.mission_title || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }} />
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mission Statement</label>
            <textarea name="mission_text" value={pageData.mission_text || ''} onChange={handleChange} rows={4} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Vision Title</label>
            <input type="text" name="vision_title" value={pageData.vision_title || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }} />
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Vision Statement</label>
            <textarea name="vision_text" value={pageData.vision_text || ''} onChange={handleChange} rows={4} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>

        {/* 7. Trusted Partner & Achievements */}
        <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', color: '#1e3a8a' }}>5. Trusted Partner & Achievements</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Trusted Partner Heading</label>
          <input type="text" name="trusted_partner_title" value={pageData.trusted_partner_title || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Trusted Partner Description</label>
          <textarea name="trusted_partner_description" value={pageData.trusted_partner_description || ''} onChange={handleChange} rows={2} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Achievements Section Title</label>
          <input type="text" name="achievements_title" value={pageData.achievements_title || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>

        {/* 10. CTA Section */}
        <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', color: '#1e3a8a' }}>6. Call To Action (CTA)</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>CTA Title</label>
          <input type="text" name="cta_title" value={pageData.cta_title || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>CTA Description</label>
          <textarea name="cta_description" value={pageData.cta_description || ''} onChange={handleChange} rows={2} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Primary Button Text</label>
            <input type="text" name="cta_primary_btn_text" value={pageData.cta_primary_btn_text || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Primary Button Link</label>
            <input type="text" name="cta_primary_btn_url" value={pageData.cta_primary_btn_url || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>

        <button type="submit" className={styles.saveBtn} style={{ padding: '12px 24px', fontSize: '1rem', cursor: 'pointer' }}>
          Save All About Us Page Settings
        </button>
      </form>
    </div>
  );
}
