'use client';

import React, { useState, useEffect } from 'react';
import { Cruise, api } from '@/lib/api';
import styles from './admin.module.css';

export default function CruiseAdmin() {
  // Cruise Packages state
  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [loadingCruises, setLoadingCruises] = useState(true);
  const [selectedCruise, setSelectedCruise] = useState<Cruise | null>(null);
  const [isCreatingCruise, setIsCreatingCruise] = useState(false);
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
    banner_title: '',
    banner_tagline: '',
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

    if (file.size > 1 * 1024 * 1024) {
      alert('File size exceeds the 1 MB limit. Please select a smaller image.');
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
      const fetchedCruises = await api.getCruises();
      setCruises(fetchedCruises || []);
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
      banner_title: '',
      banner_tagline: '',
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
      const { show_on_homepage, ...cleanForm } = cruiseForm as any;
      const payload: Partial<Cruise> = {
        ...cleanForm,
        banner_title: cruiseForm.banner_title || null,
        banner_tagline: cruiseForm.banner_tagline || null,
        gallery: Array.isArray(cruiseForm.gallery) ? cruiseForm.gallery : [],
        highlights: Array.isArray(cruiseForm.highlights) ? cruiseForm.highlights : [],
        itinerary: Array.isArray(cruiseForm.itinerary) ? cruiseForm.itinerary : [],
        inclusions: Array.isArray(cruiseForm.inclusions) ? cruiseForm.inclusions : [],
        exclusions: Array.isArray(cruiseForm.exclusions) ? cruiseForm.exclusions : [],
        need_to_know: Array.isArray(cruiseForm.need_to_know) ? cruiseForm.need_to_know : [],
        faqs: Array.isArray(cruiseForm.faqs) ? cruiseForm.faqs : [],
        reviews: Array.isArray(cruiseForm.reviews) ? cruiseForm.reviews : [],
      };

      if (isCreatingCruise) {
        const res = await api.createCruise(payload);
        setSaveStatus('✓ Cruise package created successfully!');
        setIsCreatingCruise(false);
        const createdObj = res?.cruise || { ...payload };
        setSelectedCruise(createdObj as Cruise);
      } else if (selectedCruise) {
        const res = await api.updateCruise(selectedCruise.id, payload);
        setSaveStatus('✓ Cruise package updated successfully!');
        const updatedObj = res?.cruise || { ...selectedCruise, ...payload };
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

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>🚢 Cruise Holidays Management</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage cruise packages, itinerary highlights, prices, and settings.</p>
        </div>
      </div>

      {saveStatus && (
        <div style={{ padding: '0.85rem 1.25rem', backgroundColor: saveStatus.startsWith('✓') ? '#dcfce7' : '#fee2e2', color: saveStatus.startsWith('✓') ? '#166534' : '#991b1b', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>
          {saveStatus}
        </div>
      )}

      {/* Packages List & Editor */}
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
                    Banner Image Upload <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Recommended: 1920 × 460 px, Max 1 MB)</span>
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

                {/* Banner Title / Heading & Tagline */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div className="formGroup">
                    <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                      Banner Title / Heading
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Caribbean Mediterranean Voyage"
                      value={cruiseForm.banner_title || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, banner_title: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div className="formGroup">
                    <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                      Banner Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 7 Nights Luxury Ocean Voyage from Barcelona to Rome"
                      value={cruiseForm.banner_tagline || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, banner_tagline: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
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

                {/* SEO Settings Card (Matching Add Hotel Page) */}
                <div className={styles.formCard} style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
                  <h4 className={styles.formCardTitle}>SEO Settings</h4>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.9rem' }}>
                      Meta Title <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter meta title"
                      value={cruiseForm.meta_title || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, meta_title: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border, #cbd5e1)', borderRadius: 'var(--radius-md, 8px)' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.25rem', textAlign: 'right' }}>
                      {(cruiseForm.meta_title || '').length}/60
                    </span>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.9rem' }}>
                      Meta Description <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter meta description"
                      value={cruiseForm.meta_description || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, meta_description: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border, #cbd5e1)', borderRadius: 'var(--radius-md, 8px)' }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.25rem', textAlign: 'right' }}>
                      {(cruiseForm.meta_description || '').length}/160
                    </span>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.9rem' }}>
                      URL Slug <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ padding: '0.75rem', background: '#f1f5f9', border: '1px solid var(--color-border, #cbd5e1)', borderRight: 'none', borderRadius: 'var(--radius-md, 8px) 0 0 var(--radius-md, 8px)', fontSize: '0.8rem', color: 'var(--color-text-secondary, #64748b)', fontWeight: 600 }}>/cruise/</span>
                      <input
                        type="text"
                        placeholder="enter-url-slug"
                        style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--color-border, #cbd5e1)', borderRadius: '0 var(--radius-md, 8px) var(--radius-md, 8px) 0' }}
                        value={cruiseForm.url_slug || ''}
                        onChange={e => setCruiseForm({ ...cruiseForm, url_slug: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.9rem' }}>Canonical URL</label>
                    <input
                      type="text"
                      placeholder="https://www.example.com/cruise/slug"
                      value={cruiseForm.canonical_url || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, canonical_url: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border, #cbd5e1)', borderRadius: 'var(--radius-md, 8px)' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  {isCreatingCruise ? 'Save Cruise Package' : 'Update Cruise Package'}
                </button>
              </form>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', background: '#ffffff', borderRadius: '1rem' }}>
              Select a cruise package from the list or click "+ Add New Cruise" to create one.
            </div>
          )}
        </div>
      </div>
  );
}
