import React, { useState, useEffect } from 'react';
import { contactPageApi, ContactPage } from '@/lib/api';
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

  if (loading) return <div style={{ padding: '20px' }}>Loading Contact Us page SEO Settings...</div>;
  if (!pageData) return <div style={{ padding: '20px' }}>Failed to load Contact Us page settings.</div>;

  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#1e293b' }}>Contact Us Page - SEO Settings</h2>
        {saveStatus && (
          <div style={{ padding: '6px 16px', borderRadius: '4px', background: '#0f172a', color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
            {saveStatus}
          </div>
        )}
      </div>

      <form onSubmit={handleSave}>
        <div className={styles.adminCard} style={{ marginBottom: '20px' }}>
          <h3 style={{ borderBottom: '2px solid #dc2626', paddingBottom: '8px', color: '#991b1b', marginTop: 0, marginBottom: '1.25rem' }}>
            SEO Settings
          </h3>
          
          <div className={styles.formGroup} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Meta Title</label>
            <input 
              type="text" 
              name="meta_title" 
              value={(pageData as any).meta_title || ''} 
              onChange={handleChange} 
              placeholder="e.g. Contact Us | Dyna Tours India" 
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
            />
          </div>

          <div className={styles.formGroup} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Meta Description</label>
            <textarea 
              name="meta_description" 
              value={(pageData as any).meta_description || ''} 
              onChange={handleChange} 
              rows={3} 
              placeholder="Meta description for search engines..." 
              style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
            <div className={styles.formGroup}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>URL Slug</label>
              <input 
                type="text" 
                name="url_slug" 
                value={(pageData as any).url_slug || 'contact-us'} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
              />
            </div>
            <div className={styles.formGroup}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Canonical URL</label>
              <input 
                type="text" 
                name="canonical_url" 
                value={(pageData as any).canonical_url || ''} 
                onChange={handleChange} 
                placeholder="https://dynatours.in/contact-us" 
                style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className={styles.saveBtn} 
          style={{ padding: '12px 28px', fontSize: '1rem', cursor: 'pointer', background: '#d9232d', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', width: '100%' }}
        >
          Save SEO Settings
        </button>
      </form>
    </div>
  );
}
