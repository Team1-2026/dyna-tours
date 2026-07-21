import React, { useState, useEffect } from 'react';
import { groupToursApi, GroupTourPage } from '@/lib/api';
import styles from './admin.module.css';
import RichTextEditor from '@/components/RichTextEditor';

export default function GroupTourPageAdmin() {
  const [pageData, setPageData] = useState<GroupTourPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = async () => {
    try {
      const data = await groupToursApi.getPage();
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
      await groupToursApi.updatePage(pageData);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'banner_image' | 'overview_image') => {
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

  if (loading) return <div>Loading...</div>;
  if (!pageData) return <div>Failed to load page data.</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h2 style={{ margin: '0 0 20px 0', color: 'var(--color-secondary-navy)' }}>Group Tours Page Settings</h2>
      
      {saveStatus && <div style={{ background: '#e6ffe6', padding: '10px', marginBottom: '20px', borderRadius: '4px', color: '#006600' }}>{saveStatus}</div>}

      <form onSubmit={handleSave} style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        
        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Hero Section</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Page Title</label>
          <input type="text" name="title" value={pageData.title || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tagline</label>
          <input type="text" name="tagline" value={pageData.tagline || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hero Banner Image</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner_image')} style={{ display: 'block', marginBottom: '10px' }} />
          {pageData.banner_image && <img src={pageData.banner_image} alt="Banner" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '4px' }} />}
        </div>

        <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Overview Section</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Overview Heading</label>
          <input type="text" name="overview_heading" value={pageData.overview_heading || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Overview Description (Rich Text)</label>
          <RichTextEditor 
            value={pageData.overview_description || ''}
            onChange={(val) => setPageData({ ...pageData, overview_description: val })}
          />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Overview Side Image</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'overview_image')} style={{ display: 'block', marginBottom: '10px' }} />
          {pageData.overview_image && <img src={pageData.overview_image} alt="Overview" style={{ height: '150px', objectFit: 'cover', borderRadius: '4px' }} />}
        </div>

        <button type="submit" className={styles.saveBtn}>Save Page Settings</button>
      </form>
    </div>
  );
}
