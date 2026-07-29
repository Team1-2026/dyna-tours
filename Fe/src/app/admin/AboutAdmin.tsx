import React, { useState, useEffect } from 'react';
import { 
  aboutPageApi, 
  AboutPage, 
  WhyChooseCard, 
  ServiceItem, 
  AchievementCounter, 
  CertificationLogo, 
  TrustBadge 
} from '@/lib/api';
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
    } catch (err: any) {
      console.error(err);
      setSaveStatus(`❌ ${err?.message || 'Error saving page'}`);
      setTimeout(() => setSaveStatus(null), 6000);
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

  // Dynamic Array Helper Methods for Why Choose Us
  const addWhyChooseCard = () => {
    if (!pageData) return;
    const current = pageData.why_choose_cards || [];
    setPageData({
      ...pageData,
      why_choose_cards: [...current, { title: 'New Feature', description: 'Feature description', icon: 'Award' }]
    });
  };

  const updateWhyChooseCard = (index: number, field: keyof WhyChooseCard, value: string) => {
    if (!pageData || !pageData.why_choose_cards) return;
    const updated = [...pageData.why_choose_cards];
    updated[index] = { ...updated[index], [field]: value };
    setPageData({ ...pageData, why_choose_cards: updated });
  };

  const removeWhyChooseCard = (index: number) => {
    if (!pageData || !pageData.why_choose_cards) return;
    const updated = pageData.why_choose_cards.filter((_, idx) => idx !== index);
    setPageData({ ...pageData, why_choose_cards: updated });
  };

  // Dynamic Array Helper Methods for Services
  const addServiceItem = () => {
    if (!pageData) return;
    const current = pageData.services_list || [];
    setPageData({
      ...pageData,
      services_list: [...current, { title: 'New Service', description: 'Service description', icon: 'Globe', link: '/holidays' }]
    });
  };

  const updateServiceItem = (index: number, field: keyof ServiceItem, value: string) => {
    if (!pageData || !pageData.services_list) return;
    const updated = [...pageData.services_list];
    updated[index] = { ...updated[index], [field]: value };
    setPageData({ ...pageData, services_list: updated });
  };

  const removeServiceItem = (index: number) => {
    if (!pageData || !pageData.services_list) return;
    const updated = pageData.services_list.filter((_, idx) => idx !== index);
    setPageData({ ...pageData, services_list: updated });
  };

  // Dynamic Array Helper Methods for Trust Badges / Checkmarks
  const addTrustBadge = () => {
    if (!pageData) return;
    const current = pageData.trust_badges || [];
    setPageData({
      ...pageData,
      trust_badges: [...current, { title: 'Custom-designed group tours', icon: 'CheckCircle' }]
    });
  };

  const updateTrustBadge = (index: number, field: keyof TrustBadge, value: string) => {
    if (!pageData || !pageData.trust_badges) return;
    const updated = [...pageData.trust_badges];
    updated[index] = { ...updated[index], [field]: value };
    setPageData({ ...pageData, trust_badges: updated });
  };

  const removeTrustBadge = (index: number) => {
    if (!pageData || !pageData.trust_badges) return;
    const updated = pageData.trust_badges.filter((_, idx) => idx !== index);
    setPageData({ ...pageData, trust_badges: updated });
  };

  // Dynamic Array Helper Methods for Achievements
  const addAchievementCounter = () => {
    if (!pageData) return;
    const current = pageData.achievement_counters || [];
    setPageData({
      ...pageData,
      achievement_counters: [...current, { number: 100, suffix: '+', label: 'Destinations', icon: 'Globe' }]
    });
  };

  const updateAchievementCounter = (index: number, field: keyof AchievementCounter, value: any) => {
    if (!pageData || !pageData.achievement_counters) return;
    const updated = [...pageData.achievement_counters];
    updated[index] = { ...updated[index], [field]: value };
    setPageData({ ...pageData, achievement_counters: updated });
  };

  const removeAchievementCounter = (index: number) => {
    if (!pageData || !pageData.achievement_counters) return;
    const updated = pageData.achievement_counters.filter((_, idx) => idx !== index);
    setPageData({ ...pageData, achievement_counters: updated });
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
        
        {/* 1. HERO BANNER SECTION */}
        <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', color: '#1e3a8a', marginTop: 0 }}>
          1. Hero Banner
        </h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hero Title</label>
          <input 
            type="text" 
            name="hero_title" 
            value={pageData.hero_title || 'About Dyna Tours India'} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Hero Subtitle / Lead Paragraph</label>
          <textarea 
            name="hero_subtitle" 
            value={pageData.hero_subtitle || 'Creating unforgettable travel experiences with trusted holiday, visa, flight, cruise and corporate travel solutions.'} 
            onChange={handleChange} 
            rows={2} 
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Hero Background Image URL / Upload <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'normal' }}>(Recommended size: 1920 × 460 px)</span>
          </label>
          <input 
            type="text" 
            name="hero_bg_image" 
            value={pageData.hero_bg_image || ''} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px' }} 
          />
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero_bg_image')} />
          {pageData.hero_bg_image && (
            <img 
              src={pageData.hero_bg_image} 
              alt="Hero BG" 
              style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '6px', marginTop: '10px' }} 
            />
          )}
        </div>

        {/* 2. OUR STORY SECTION */}
        <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', color: '#1e3a8a' }}>
          2. Our Story (Wander. Explore. Discover.)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Main Heading</label>
            <input 
              type="text" 
              name="overview_title" 
              value={pageData.overview_title || 'Wander. Explore. Discover.'} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Story Subheading</label>
            <input 
              type="text" 
              name="story_subheading" 
              value={pageData.story_subheading || 'Your Journey, Our Passion!'} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
            />
          </div>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Years of Experience Counter</label>
          <input 
            type="number" 
            name="years_experience" 
            value={pageData.years_experience || 16} 
            onChange={handleChange} 
            style={{ width: '150px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Story Content (Rich Text)</label>
          <RichTextEditor 
            value={pageData.overview_description || ''}
            onChange={(val) => setPageData({ ...pageData, overview_description: val })}
          />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Story Circular Photo Badge <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Recommended size: 800 × 600 px)</span>
          </label>
          <input 
            type="text" 
            name="overview_image_1" 
            value={pageData.overview_image_1 || ''} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px' }} 
          />
          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'overview_image_1')} />
          {pageData.overview_image_1 && (
            <img src={pageData.overview_image_1} alt="Story Photo" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', marginTop: '8px' }} />
          )}
        </div>

        {/* 3. A MESSAGE FROM OUR DIRECTORS */}
        <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', color: '#1e3a8a' }}>
          3. A Message from Our Directors
        </h3>
        
        {/* Director 1 */}
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#0f172a' }}>Director 1 (Managing Director)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name</label>
              <input 
                type="text" 
                name="founder_name" 
                value={pageData.founder_name || 'Jomy Milbin'} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title / Role</label>
              <input 
                type="text" 
                name="founder_title" 
                value={pageData.founder_title || 'Managing Director'} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
              />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Quote</label>
            <input 
              type="text" 
              name="founder_quote" 
              value={pageData.founder_quote || 'Travel is the only thing you buy that makes you richer.'} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Message Content (Rich Text)</label>
            <RichTextEditor 
              value={pageData.founder_message || ''}
              onChange={(val) => setPageData({ ...pageData, founder_message: val })}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Photo <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Recommended size: 600 × 600 px)</span>
            </label>
            <input 
              type="text" 
              name="founder_image" 
              value={pageData.founder_image || ''} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px' }} 
            />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'founder_image')} />
            {pageData.founder_image && (
              <img src={pageData.founder_image} alt="Director 1" style={{ height: '100px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px' }} />
            )}
          </div>
        </div>

        {/* Director 2 */}
        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#0f172a' }}>Director 2 (Director)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name</label>
              <input 
                type="text" 
                name="director2_name" 
                value={pageData.director2_name || 'Thomas John'} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title / Role</label>
              <input 
                type="text" 
                name="director2_title" 
                value={pageData.director2_title || 'Director'} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
              />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Quote</label>
            <input 
              type="text" 
              name="director2_quote" 
              value={pageData.director2_quote || 'Travel is the only thing you buy that makes you richer.'} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Message Content (Rich Text)</label>
            <RichTextEditor 
              value={pageData.director2_message || ''}
              onChange={(val) => setPageData({ ...pageData, director2_message: val })}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Photo <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Recommended size: 600 × 600 px)</span>
            </label>
            <input 
              type="text" 
              name="director2_image" 
              value={pageData.director2_image || ''} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '8px' }} 
            />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'director2_image')} />
            {pageData.director2_image && (
              <img src={pageData.director2_image} alt="Director 2" style={{ height: '100px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px' }} />
            )}
          </div>
        </div>

        {/* 4. MISSION & VISION */}
        <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', color: '#1e3a8a' }}>
          4. Our Mission & Our Vision
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mission Title</label>
            <input 
              type="text" 
              name="mission_title" 
              value={pageData.mission_title || 'Our Mission'} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }} 
            />
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mission Statement</label>
            <textarea 
              name="mission_text" 
              value={pageData.mission_text || 'To deliver personalized, reliable and memorable travel experiences through quality service, innovation, and a commitment to customer satisfaction at every step.'} 
              onChange={handleChange} 
              rows={4} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Vision Title</label>
            <input 
              type="text" 
              name="vision_title" 
              value={pageData.vision_title || 'Our Vision'} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }} 
            />
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Vision Statement</label>
            <textarea 
              name="vision_text" 
              value={pageData.vision_text || "To be Kerala's most trusted travel company, driving innovation, exceeding customer expectations, and creating unforgettable journeys worldwide."} 
              onChange={handleChange} 
              rows={4} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
            />
          </div>
        </div>

        {/* 5. WHY CHOOSE US (6 FEATURE CARDS) */}
        <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', color: '#1e3a8a' }}>
          5. Why Choose Us Section
        </h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Section Title</label>
          <input 
            type="text" 
            name="why_choose_title" 
            value={pageData.why_choose_title || 'Why Choose Dyna Tours India?'} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>

        {/* Why Choose Cards Manager */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ fontWeight: 'bold' }}>Why Choose Cards (6 Items)</label>
            <button type="button" onClick={addWhyChooseCard} style={{ padding: '4px 12px', cursor: 'pointer', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' }}>
              + Add Feature Card
            </button>
          </div>

          {(pageData.why_choose_cards || []).map((card, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <input 
                  type="text" 
                  value={card.title} 
                  onChange={(e) => updateWhyChooseCard(idx, 'title', e.target.value)} 
                  placeholder="Card Title" 
                  style={{ flex: 1, padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} 
                />
                <select 
                  value={card.icon || 'Award'} 
                  onChange={(e) => updateWhyChooseCard(idx, 'icon', e.target.value)} 
                  style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value="Award">Award / Ribbon</option>
                  <option value="Suitcase">Suitcase / Custom</option>
                  <option value="Globe">Globe / Travel</option>
                  <option value="Expert">Expert / UserCheck</option>
                  <option value="Tag">Price Tag / Deal</option>
                  <option value="Headphones">Support / Headphones</option>
                </select>
                <button type="button" onClick={() => removeWhyChooseCard(idx)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                  🗑 Remove
                </button>
              </div>
              <input 
                type="text" 
                value={card.description} 
                onChange={(e) => updateWhyChooseCard(idx, 'description', e.target.value)} 
                placeholder="Card Description" 
                style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} 
              />
            </div>
          ))}
        </div>

        {/* 6. OUR SERVICES (10 CARDS) */}
        <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', color: '#1e3a8a' }}>
          6. Our Services Section
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Services Heading</label>
            <input 
              type="text" 
              name="services_title" 
              value={pageData.services_title || 'Our Services'} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Services Subtext</label>
            <input 
              type="text" 
              name="services_subtext" 
              value={pageData.services_subtext || 'Complete travel solutions across multiple categories'} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
            />
          </div>
        </div>

        {/* Services List Manager */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ fontWeight: 'bold' }}>Services List (10 Items)</label>
            <button type="button" onClick={addServiceItem} style={{ padding: '4px 12px', cursor: 'pointer', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' }}>
              + Add Service
            </button>
          </div>

          {(pageData.services_list || []).map((srv, idx) => (
            <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <input 
                  type="text" 
                  value={srv.title} 
                  onChange={(e) => updateServiceItem(idx, 'title', e.target.value)} 
                  placeholder="Service Title" 
                  style={{ flex: 1, padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} 
                />
                <select 
                  value={srv.icon || 'Palm'} 
                  onChange={(e) => updateServiceItem(idx, 'icon', e.target.value)} 
                  style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value="Palm">Holiday / Palm</option>
                  <option value="FileText">Visa / Document</option>
                  <option value="Plane">Flight / Plane</option>
                  <option value="Building">Hotel / Building</option>
                  <option value="Anchor">Cruise / Anchor</option>
                  <option value="Users">Group Tours / Users</option>
                  <option value="Briefcase">Corporate / Briefcase</option>
                  <option value="Shield">Insurance / Shield</option>
                  <option value="CheckCircle">Attestation / Stamp</option>
                  <option value="Compass">Custom Tours / Compass</option>
                </select>
                <input 
                  type="text" 
                  value={srv.link || ''} 
                  onChange={(e) => updateServiceItem(idx, 'link', e.target.value)} 
                  placeholder="Link URL" 
                  style={{ width: '160px', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} 
                />
                <button type="button" onClick={() => removeServiceItem(idx)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                  🗑
                </button>
              </div>
              <input 
                type="text" 
                value={srv.description} 
                onChange={(e) => updateServiceItem(idx, 'description', e.target.value)} 
                placeholder="Service Description" 
                style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} 
              />
            </div>
          ))}
        </div>

        {/* 7. YOUR TRUSTED TRAVEL PARTNER */}
        <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', color: '#1e3a8a' }}>
          7. Your Trusted Travel Partner
        </h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Partner Heading</label>
          <input 
            type="text" 
            name="trusted_partner_title" 
            value={pageData.trusted_partner_title || 'Your Trusted Travel Partner'} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Partner Description</label>
          <textarea 
            name="trusted_partner_description" 
            value={pageData.trusted_partner_description || 'From the misty hills of India to the vibrant cities of Europe, and from the tropical islands of Southeast Asia to the wonders of the world — we make every journey extraordinary. Explore the world with Dyna Tours India.'} 
            onChange={handleChange} 
            rows={3} 
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>

        {/* Trust Checkmarks / Bullets */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ fontWeight: 'bold' }}>Trust Checklist Bullets (6 Checkmarks)</label>
            <button type="button" onClick={addTrustBadge} style={{ padding: '4px 12px', cursor: 'pointer', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' }}>
              + Add Bullet
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {(pageData.trust_badges || []).map((badge, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={badge.title} 
                  onChange={(e) => updateTrustBadge(idx, 'title', e.target.value)} 
                  placeholder="Checklist Item" 
                  style={{ flex: 1, padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} 
                />
                <button type="button" onClick={() => removeTrustBadge(idx)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 8. OUR ACHIEVEMENTS COUNTER BAR */}
        <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', color: '#1e3a8a' }}>
          8. Our Achievements Counter Bar
        </h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Achievements Heading</label>
          <input 
            type="text" 
            name="achievements_title" 
            value={pageData.achievements_title || 'Our Achievements'} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>

        {/* Achievement Counters Manager */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ fontWeight: 'bold' }}>Achievement Counter Metrics (6 Items)</label>
            <button type="button" onClick={addAchievementCounter} style={{ padding: '4px 12px', cursor: 'pointer', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' }}>
              + Add Metric
            </button>
          </div>

          {(pageData.achievement_counters || []).map((cnt, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center', background: '#f8fafc', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
              <input 
                type="text" 
                value={cnt.number} 
                onChange={(e) => updateAchievementCounter(idx, 'number', e.target.value)} 
                placeholder="Number/Value (e.g. 16+ or Corporate)" 
                style={{ width: '160px', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} 
              />
              <input 
                type="text" 
                value={cnt.label} 
                onChange={(e) => updateAchievementCounter(idx, 'label', e.target.value)} 
                placeholder="Metric Label (e.g. Years Experience)" 
                style={{ flex: 1, padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} 
              />
              <button type="button" onClick={() => removeAchievementCounter(idx)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                🗑
              </button>
            </div>
          ))}
        </div>

        {/* 9. CALL TO ACTION (CTA) BANNER */}
        <h3 style={{ borderBottom: '2px solid #3b82f6', paddingBottom: '8px', color: '#1e3a8a' }}>
          9. Call To Action (CTA) Banner
        </h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>CTA Title</label>
          <input 
            type="text" 
            name="cta_title" 
            value={pageData.cta_title || "Let's Plan Your Next Adventure"} 
            onChange={handleChange} 
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>CTA Description</label>
          <textarea 
            name="cta_description" 
            value={pageData.cta_description || 'Connect with our travel experts and let us create a customized travel experience tailored to your needs.'} 
            onChange={handleChange} 
            rows={2} 
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Primary Button Text</label>
            <input 
              type="text" 
              name="cta_primary_btn_text" 
              value={pageData.cta_primary_btn_text || 'Enquire Now'} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Secondary Button Text (WhatsApp)</label>
            <input 
              type="text" 
              name="cta_secondary_btn_text" 
              value={pageData.cta_secondary_btn_text || 'WhatsApp Us'} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className={styles.saveBtn} 
          style={{ padding: '14px 28px', fontSize: '1rem', cursor: 'pointer', background: '#d9232d', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', width: '100%' }}
        >
          Save
        </button>
      </form>
    </div>
  );
}
