'use client';

import React, { useState, useEffect } from 'react';
import { Cruise, CruisePageData, api } from '@/lib/api';

export default function CruiseAdmin() {
  const [activeSubTab, setActiveSubTab] = useState<'packages' | 'page_settings'>('packages');

  // Cruise Packages state
  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [loadingCruises, setLoadingCruises] = useState(true);
  const [selectedCruise, setSelectedCruise] = useState<Cruise | null>(null);
  const [isCreatingCruise, setIsCreatingCruise] = useState(false);

  // Landing Page state
  const [pageData, setPageData] = useState<CruisePageData>({
    banner_title: 'Cruise Holidays',
    banner_tagline: "Sail in Luxury – Discover the World's Most Spectacular Cruise Journeys",
    banner_image: '',
    overview_heading: 'Experience Unrivalled Luxury on the High Seas',
    overview_description: '',
    overview_image: '',
    overview_cta_text: 'View Cruise Packages',
    cta_heading: 'Ready to Set Sail?',
    cta_description: 'Book your dream cruise holiday with Dyna Tours India.',
    cta_image: '',
    cta_button1_text: 'Enquire Now',
    cta_button2_text: 'Talk to Expert',
  });

  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Form State for new/editing cruise package
  const [cruiseForm, setCruiseForm] = useState<Partial<Cruise>>({
    id: '',
    name: '',
    destination: '',
    duration: '',
    price: null,
    show_price: true,
    short_description: '',
    about: '',
    banner_image: '',
    featured: true,
    order_no: 1,
    status: 'Active',
    gallery: [],
    highlights: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    need_to_know: [],
    faqs: [],
    reviews: [],
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5 MB limit. Please select a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        callback(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const fetchData = async () => {
    setLoadingCruises(true);
    try {
      const [fetchedCruises, fetchedPageData] = await Promise.all([
        api.getCruises(),
        api.getCruisePage()
      ]);
      setCruises(fetchedCruises || []);
      if (fetchedPageData) setPageData(fetchedPageData);
    } catch (err) {
      console.error('Error loading cruise admin data:', err);
    } finally {
      setLoadingCruises(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectCruise = (cruise: Cruise) => {
    setIsCreatingCruise(false);
    setSelectedCruise(cruise);
    setCruiseForm({
      ...cruise,
      gallery: Array.isArray(cruise.gallery) ? cruise.gallery : [],
      highlights: Array.isArray(cruise.highlights) ? cruise.highlights : [],
      itinerary: Array.isArray(cruise.itinerary) ? cruise.itinerary : [],
      inclusions: Array.isArray(cruise.inclusions) ? cruise.inclusions : [],
      exclusions: Array.isArray(cruise.exclusions) ? cruise.exclusions : [],
      need_to_know: Array.isArray(cruise.need_to_know) ? cruise.need_to_know : [],
      faqs: Array.isArray(cruise.faqs) ? cruise.faqs : [],
      reviews: Array.isArray(cruise.reviews) ? cruise.reviews : [],
    });
  };

  const handleStartCreate = () => {
    setSelectedCruise(null);
    setIsCreatingCruise(true);
    setCruiseForm({
      id: `cruise-${Date.now()}`,
      name: '',
      destination: '',
      duration: '',
      price: null,
      show_price: true,
      short_description: '',
      about: '',
      banner_image: '',
      featured: true,
      order_no: cruises.length + 1,
      status: 'Active',
      gallery: [],
      highlights: [],
      itinerary: [],
      inclusions: [],
      exclusions: [],
      need_to_know: [],
      faqs: [],
      reviews: [],
    });
  };

  const handleSaveCruise = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    try {
      if (isCreatingCruise) {
        const res = await api.createCruise(cruiseForm);
        setSaveStatus('✓ Cruise package created successfully!');
        setIsCreatingCruise(false);
        const createdObj = res?.cruise || { ...cruiseForm };
        setSelectedCruise(createdObj as Cruise);
      } else if (selectedCruise) {
        const res = await api.updateCruise(selectedCruise.id, cruiseForm);
        setSaveStatus('✓ Cruise package updated successfully!');
        const updatedObj = res?.cruise || { ...selectedCruise, ...cruiseForm };
        setSelectedCruise(updatedObj as Cruise);
      }
      await fetchData();
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: any) {
      setSaveStatus(`❌ ${err?.message || 'Failed to save cruise package.'}`);
      setTimeout(() => setSaveStatus(null), 6000);
    }
  };

  const handleDeleteCruise = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cruise package?')) return;
    try {
      await api.deleteCruise(id);
      setSelectedCruise(null);
      setIsCreatingCruise(false);
      await fetchData();
    } catch (err: any) {
      alert(`Failed to delete cruise package: ${err?.message || ''}`);
    }
  };

  const handleSavePageData = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving Page Settings...');
    try {
      await api.updateCruisePage(pageData);
      setSaveStatus('✓ Landing page settings updated successfully!');
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: any) {
      setSaveStatus(`❌ ${err?.message || 'Failed to save page settings.'}`);
      setTimeout(() => setSaveStatus(null), 6000);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>🚢 Cruise Holidays Management</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage cruise packages, itinerary highlights, prices, and landing page content.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className={`btn ${activeSubTab === 'packages' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('packages')}
          >
            Cruise Packages ({cruises.length})
          </button>
          <button
            type="button"
            className={`btn ${activeSubTab === 'page_settings' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('page_settings')}
          >
            Landing Page CMS
          </button>
        </div>
      </div>

      {saveStatus && (
        <div style={{ padding: '0.85rem 1.25rem', backgroundColor: saveStatus.startsWith('✓') ? '#dcfce7' : '#fee2e2', color: saveStatus.startsWith('✓') ? '#166534' : '#991b1b', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>
          {saveStatus}
        </div>
      )}

      {/* Sub-Tab 1: Packages List & Editor */}
      {activeSubTab === 'packages' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
          {/* Package List */}
          <div style={{ background: '#ffffff', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>All Cruise Packages</h3>
              <button type="button" className="btn btn-primary btn-sm" onClick={handleStartCreate}>
                + Add New Cruise
              </button>
            </div>

            {loadingCruises ? (
              <p style={{ color: '#64748b' }}>Loading packages...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {cruises.map(c => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCruise(c)}
                    style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      border: selectedCruise?.id === c.id ? '2px solid #dc2626' : '1px solid #e2e8f0',
                      backgroundColor: selectedCruise?.id === c.id ? '#fef2f2' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <h4 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>{c.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>📍 {c.destination} • ⏳ {c.duration}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626', display: 'block' }}>
                        {c.show_price && c.price ? `₹${Number(c.price).toLocaleString()}` : 'Price on Request'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: c.status === 'Active' ? '#166534' : '#64748b' }}>
                        Order: {c.order_no ?? 'N/A'} ({c.status})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Package Form */}
          {(isCreatingCruise || selectedCruise) ? (
            <div style={{ background: '#ffffff', borderRadius: '1rem', padding: '1.75rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                  {isCreatingCruise ? 'Add New Cruise Package' : `Edit Package: ${selectedCruise?.name}`}
                </h3>
                {selectedCruise && (
                  <button type="button" className="btn btn-secondary btn-sm" style={{ color: '#dc2626', borderColor: '#dc2626' }} onClick={() => handleDeleteCruise(selectedCruise.id)}>
                    Delete Package
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveCruise}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="formGroup">
                    <label>Package ID / Slug <span className="required-star">*</span></label>
                    <input
                      type="text"
                      required
                      value={cruiseForm.id || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, id: e.target.value })}
                      disabled={!isCreatingCruise}
                    />
                  </div>

                  <div className="formGroup">
                    <label>Cruise Name <span className="required-star">*</span></label>
                    <input
                      type="text"
                      required
                      value={cruiseForm.name || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, name: e.target.value })}
                    />
                  </div>

                  <div className="formGroup">
                    <label>Destination <span className="required-star">*</span></label>
                    <input
                      type="text"
                      required
                      value={cruiseForm.destination || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, destination: e.target.value })}
                      placeholder="e.g. Europe (Spain, Italy & Greece)"
                    />
                  </div>

                  <div className="formGroup">
                    <label>Duration <span className="required-star">*</span></label>
                    <input
                      type="text"
                      required
                      value={cruiseForm.duration || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, duration: e.target.value })}
                      placeholder="e.g. 7 Nights / 8 Days"
                    />
                  </div>

                  <div className="formGroup">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      value={cruiseForm.price ?? ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, price: e.target.value !== '' ? Number(e.target.value) : null })}
                    />
                  </div>

                  <div className="formGroup">
                    <label>Display Order No</label>
                    <input
                      type="number"
                      min="1"
                      value={cruiseForm.order_no ?? ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, order_no: e.target.value !== '' ? Math.max(0, Number(e.target.value)) : null })}
                    />
                  </div>
                </div>

                <div className="formGroup" style={{ marginBottom: '1rem' }}>
                  <label>Short Description <span className="required-star">*</span></label>
                  <textarea
                    rows={2}
                    required
                    value={cruiseForm.short_description || ''}
                    onChange={e => setCruiseForm({ ...cruiseForm, short_description: e.target.value })}
                  />
                </div>

                <div className="formGroup" style={{ marginBottom: '1rem' }}>
                  <label>Full About Description</label>
                  <textarea
                    rows={4}
                    value={cruiseForm.about || ''}
                    onChange={e => setCruiseForm({ ...cruiseForm, about: e.target.value })}
                  />
                </div>

                {/* Banner Image Upload */}
                <div className="formGroup" style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                    Banner Image Upload <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Recommended: 1920 × 460 px, Max 5 MB)</span>
                  </label>

                  {cruiseForm.banner_image ? (
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem', width: '100%' }}>
                      <img
                        src={cruiseForm.banner_image}
                        alt="Banner Preview"
                        style={{
                          width: '100%',
                          maxHeight: '140px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setCruiseForm({ ...cruiseForm, banner_image: '' })}
                        title="Remove Banner Image"
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: '#dc2626',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '26px',
                          height: '26px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : null}

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <input
                      type="file"
                      accept="image/*"
                      id="cruise-package-banner-upload"
                      style={{ display: 'none' }}
                      onChange={(e) => handleImageUpload(e, (url) => setCruiseForm({ ...cruiseForm, banner_image: url }))}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => document.getElementById('cruise-package-banner-upload')?.click()}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      📤 Upload Banner Image
                    </button>
                    <input
                      type="text"
                      placeholder="Or enter image URL..."
                      value={cruiseForm.banner_image || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, banner_image: e.target.value })}
                      style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', whiteSpace: 'nowrap', margin: 0, fontSize: '0.9rem', color: '#0f172a', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={!!cruiseForm.show_price}
                      onChange={e => setCruiseForm({ ...cruiseForm, show_price: e.target.checked })}
                      style={{ width: '18px', height: '18px', margin: 0, cursor: 'pointer', accentColor: '#dc2626' }}
                    />
                    <span>Show Price</span>
                  </label>

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', whiteSpace: 'nowrap', margin: 0, fontSize: '0.9rem', color: '#0f172a', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={!!cruiseForm.featured}
                      onChange={e => setCruiseForm({ ...cruiseForm, featured: e.target.checked })}
                      style={{ width: '18px', height: '18px', margin: 0, cursor: 'pointer', accentColor: '#dc2626' }}
                    />
                    <span>Featured on Landing Page</span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Save Cruise Package
                </button>
              </form>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', background: '#ffffff', borderRadius: '1rem' }}>
              Select a cruise package from the list or click "+ Add New Cruise" to create one.
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 2: Landing Page CMS Settings */}
      {activeSubTab === 'page_settings' && (
        <div style={{ background: '#ffffff', borderRadius: '1rem', padding: '2rem', border: '1px solid #e2e8f0', maxWidth: '850px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>
            Edit Cruise Landing Page Content
          </h3>

          <form onSubmit={handleSavePageData}>
            <h4 style={{ fontSize: '1.05rem', color: '#dc2626', marginBottom: '1rem' }}>1. Hero Banner</h4>
            <div className="formGroup" style={{ marginBottom: '1rem' }}>
              <label>Page Title</label>
              <input
                type="text"
                value={pageData.banner_title}
                onChange={e => setPageData({ ...pageData, banner_title: e.target.value })}
              />
            </div>

            <div className="formGroup" style={{ marginBottom: '1rem' }}>
              <label>Tagline</label>
              <input
                type="text"
                value={pageData.banner_tagline}
                onChange={e => setPageData({ ...pageData, banner_tagline: e.target.value })}
              />
            </div>

            {/* Banner Image Upload */}
            <div className="formGroup" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Banner Image Upload <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Recommended: 1920 × 460 px, Max 5 MB)</span>
              </label>

              {pageData.banner_image ? (
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem', width: '100%' }}>
                  <img
                    src={pageData.banner_image}
                    alt="Hero Banner Preview"
                    style={{
                      width: '100%',
                      maxHeight: '140px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPageData({ ...pageData, banner_image: '' })}
                    title="Remove Banner Image"
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      background: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : null}

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  id="cruise-page-banner-upload"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageUpload(e, (url) => setPageData({ ...pageData, banner_image: url }))}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => document.getElementById('cruise-page-banner-upload')?.click()}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  📤 Upload Banner Image
                </button>
                <input
                  type="text"
                  placeholder="Or enter image URL..."
                  value={pageData.banner_image || ''}
                  onChange={e => setPageData({ ...pageData, banner_image: e.target.value })}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <h4 style={{ fontSize: '1.05rem', color: '#dc2626', marginBottom: '1rem' }}>2. Cruise Overview Section</h4>
            <div className="formGroup" style={{ marginBottom: '1rem' }}>
              <label>Overview Heading</label>
              <input
                type="text"
                value={pageData.overview_heading}
                onChange={e => setPageData({ ...pageData, overview_heading: e.target.value })}
              />
            </div>

            <div className="formGroup" style={{ marginBottom: '1rem' }}>
              <label>Overview Description</label>
              <textarea
                rows={4}
                value={pageData.overview_description || ''}
                onChange={e => setPageData({ ...pageData, overview_description: e.target.value })}
              />
            </div>

            {/* Overview Side Image Upload */}
            <div className="formGroup" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Overview Side Image Upload <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Max 5 MB)</span>
              </label>

              {pageData.overview_image ? (
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem', width: '100%' }}>
                  <img
                    src={pageData.overview_image}
                    alt="Overview Side Preview"
                    style={{
                      width: '100%',
                      maxHeight: '140px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPageData({ ...pageData, overview_image: '' })}
                    title="Remove Overview Image"
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      background: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : null}

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  id="cruise-overview-image-upload"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageUpload(e, (url) => setPageData({ ...pageData, overview_image: url }))}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => document.getElementById('cruise-overview-image-upload')?.click()}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  📤 Upload Overview Image
                </button>
                <input
                  type="text"
                  placeholder="Or enter image URL..."
                  value={pageData.overview_image || ''}
                  onChange={e => setPageData({ ...pageData, overview_image: e.target.value })}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <h4 style={{ fontSize: '1.05rem', color: '#dc2626', marginBottom: '1rem' }}>3. CTA Section</h4>
            <div className="formGroup" style={{ marginBottom: '1rem' }}>
              <label>CTA Heading</label>
              <input
                type="text"
                value={pageData.cta_heading}
                onChange={e => setPageData({ ...pageData, cta_heading: e.target.value })}
              />
            </div>

            <div className="formGroup" style={{ marginBottom: '1rem' }}>
              <label>CTA Description</label>
              <textarea
                rows={2}
                value={pageData.cta_description || ''}
                onChange={e => setPageData({ ...pageData, cta_description: e.target.value })}
              />
            </div>

            {/* CTA Background Image Upload */}
            <div className="formGroup" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                CTA Background Image Upload <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Max 5 MB)</span>
              </label>

              {pageData.cta_image ? (
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem', width: '100%' }}>
                  <img
                    src={pageData.cta_image}
                    alt="CTA Background Preview"
                    style={{
                      width: '100%',
                      maxHeight: '140px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setPageData({ ...pageData, cta_image: '' })}
                    title="Remove CTA Image"
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      background: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : null}

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  id="cruise-cta-image-upload"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageUpload(e, (url) => setPageData({ ...pageData, cta_image: url }))}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => document.getElementById('cruise-cta-image-upload')?.click()}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  📤 Upload CTA Image
                </button>
                <input
                  type="text"
                  placeholder="Or enter image URL..."
                  value={pageData.cta_image || ''}
                  onChange={e => setPageData({ ...pageData, cta_image: e.target.value })}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Save Page Settings
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
