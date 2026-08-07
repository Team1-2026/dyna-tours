'use client';

import React, { useState, useEffect } from 'react';
import { Cruise, CruiseItineraryDay, CruiseFaq, api } from '@/lib/api';
import styles from './admin.module.css';

export default function CruiseAdmin() {
  // Cruise Packages state
  const [cruises, setCruises] = useState<Cruise[]>([]);
  const [loadingCruises, setLoadingCruises] = useState(true);
  const [selectedCruise, setSelectedCruise] = useState<Cruise | null>(null);
  const [isCreatingCruise, setIsCreatingCruise] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Table Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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
    meta_title: '',
    meta_description: '',
    url_slug: '',
    canonical_url: '',
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

    const handleViewCruises = () => {
      setIsCreatingCruise(false);
      setSelectedCruise(null);
    };

    const handleAddNewCruise = () => {
      handleStartCreate();
    };

    window.addEventListener('admin:view-cruises', handleViewCruises);
    window.addEventListener('admin:add-new-cruise', handleAddNewCruise);

    return () => {
      window.removeEventListener('admin:view-cruises', handleViewCruises);
      window.removeEventListener('admin:add-new-cruise', handleAddNewCruise);
    };
  }, []);

  const handleSelectCruise = (cruise: Cruise) => {
    setIsCreatingCruise(false);
    setSelectedCruise(cruise);
    setCruiseForm({
      ...cruise,
      banner_title: cruise.banner_title || '',
      banner_tagline: cruise.banner_tagline || '',
      gallery: Array.isArray(cruise.gallery) ? cruise.gallery : [],
      highlights: Array.isArray(cruise.highlights) ? cruise.highlights : [],
      itinerary: Array.isArray(cruise.itinerary) ? cruise.itinerary : [],
      inclusions: Array.isArray(cruise.inclusions) ? cruise.inclusions : [],
      exclusions: Array.isArray(cruise.exclusions) ? cruise.exclusions : [],
      need_to_know: Array.isArray(cruise.need_to_know) ? cruise.need_to_know : [],
      faqs: Array.isArray(cruise.faqs) ? cruise.faqs : [],
      reviews: Array.isArray(cruise.reviews) ? cruise.reviews : [],
      meta_title: cruise.meta_title || '',
      meta_description: cruise.meta_description || '',
      url_slug: cruise.url_slug || '',
      canonical_url: cruise.canonical_url || '',
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
      meta_title: '',
      meta_description: '',
      url_slug: '',
      canonical_url: '',
    });
  };

  const handleSaveCruise = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const handleDeleteCruise = async (id: string, name: string) => {
    if (!confirm(`Are you absolutely sure you want to delete the cruise package "${name}"?`)) return;
    try {
      await api.deleteCruise(id);
      setSelectedCruise(null);
      setIsCreatingCruise(false);
      await fetchData();
    } catch (err: any) {
      alert(`Failed to delete cruise package: ${err?.message || ''}`);
    }
  };

  // Filtered list for table view
  const filteredCruises = cruises
    .filter(c => {
      const matchesQuery = !searchQuery || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.destination.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || c.status === statusFilter;
      return matchesQuery && matchesStatus;
    })
    .sort((a, b) => {
      const orderA = a.order_no ?? Infinity;
      const orderB = b.order_no ?? Infinity;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });

  return (
    <div>
      {saveStatus && (
        <div style={{ padding: '0.85rem 1.25rem', backgroundColor: saveStatus.startsWith('✓') ? '#dcfce7' : '#fee2e2', color: saveStatus.startsWith('✓') ? '#166534' : '#991b1b', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 600 }}>
          {saveStatus}
        </div>
      )}

      {/* ==========================================
          1. ALL CRUISE PACKAGES LIST VIEW (Identical to All Hotels Page)
          ========================================== */}
      {!isCreatingCruise && !selectedCruise && (
        <div className={styles.panelCard}>
          <div className={styles.tableHeaderToolbar}>
            <h3 className={styles.panelTitle} style={{ margin: 0 }}>Cruise Packages Management</h3>

            <div className={styles.toolbarFilters}>
              <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Search cruise package..."
                  className={styles.toolbarSearchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className={`searchSelect ${styles.toolbarSelect}`}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button type="button" className={styles.filterBtn}>
                <span>🎛️</span> Filter
              </button>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleStartCreate}
            >
              + Add New Cruise
            </button>
          </div>

          <div className={styles.tableContainer}>
            {loadingCruises ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                Loading cruise packages...
              </div>
            ) : filteredCruises.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                No cruise packages found. Click "+ Add New Cruise" to add one.
              </div>
            ) : (
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Sl No</th>
                    <th>Cruise Package Name</th>
                    <th>Destination</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCruises.map((c, index) => (
                    <tr key={c.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {c.banner_image && (
                            <img
                              src={c.banner_image}
                              alt={c.name}
                              style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                            />
                          )}
                          <span style={{ fontWeight: 700, color: 'var(--color-secondary-navy)' }}>{c.name}</span>
                        </div>
                      </td>
                      <td>📍 {c.destination}</td>
                      <td>⏳ {c.duration}</td>
                      <td style={{ fontWeight: 700, color: 'var(--color-primary-red)' }}>
                        {c.show_price && c.price ? `₹${Number(c.price).toLocaleString('en-IN')}` : 'Price on Request'}
                      </td>
                      <td>
                        <span className={`${styles.statusPill} ${c.status === 'Active' ? styles.statusActive : styles.statusInactive}`}>
                          {c.status === 'Active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <a
                          href={`/cruise/${c.url_slug || c.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`${styles.tableActionBtn} ${styles.actionView}`}
                        >
                          View
                        </a>
                        <button
                          type="button"
                          className={`${styles.tableActionBtn} ${styles.actionEdit}`}
                          onClick={() => handleSelectCruise(c)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className={`${styles.tableActionBtn} ${styles.actionDelete}`}
                          onClick={() => handleDeleteCruise(c.id, c.name)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer with Pagination */}
          <div className={styles.tableFooterRow}>
            <span>Showing 1 to {filteredCruises.length} of {cruises.length} entries</span>
            <div className={styles.paginationWrapper}>
              <button className={styles.paginationBtn}>Previous</button>
              <button className={`${styles.paginationBtn} ${styles.paginationBtnActive}`}>1</button>
              <button className={styles.paginationBtn}>Next</button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          2. TWO COLUMN FORM BUILDER (Identical to All Hotels Edit Page)
          ========================================== */}
      {(isCreatingCruise || selectedCruise) && (
        <form onSubmit={handleSaveCruise}>
          {/* Header Bar with Back & Delete Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setIsCreatingCruise(false); setSelectedCruise(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              ← Back to All Cruise Packages
            </button>

            <h2 className={styles.panelTitle} style={{ margin: 0 }}>
              {isCreatingCruise ? 'Add New Cruise Package' : `Edit Cruise: ${selectedCruise?.name}`}
            </h2>

            {selectedCruise && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteCruise(selectedCruise.id, selectedCruise.name)}
              >
                Delete Package
              </button>
            )}
          </div>

          <div className={styles.editorGrid}>
            {/* LEFT COLUMN: Main Form Elements (65%) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Card 1: Cruise Details */}
              <div className={styles.formCard}>
                <h4 className={styles.formCardTitle}>Cruise Details</h4>

                <div className={styles.formRow}>
                  <div className="formGroup">
                    <label htmlFor="cruise_name">Cruise Name <span className="required-star">*</span></label>
                    <input
                      type="text"
                      id="cruise_name"
                      required
                      placeholder="Enter cruise name"
                      value={cruiseForm.name || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, name: e.target.value })}
                    />
                  </div>

                  <div className="formGroup">
                    <label htmlFor="cruise_slug">Package ID / Slug (Unique) <span className="required-star">*</span></label>
                    <input
                      type="text"
                      id="cruise_slug"
                      required
                      placeholder="e.g. singapore-ocean-sail"
                      disabled={!isCreatingCruise}
                      value={cruiseForm.id || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, id: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className="formGroup">
                    <label htmlFor="destination">Destination <span className="required-star">*</span></label>
                    <input
                      type="text"
                      id="destination"
                      required
                      placeholder="e.g. Singapore, Penang, Phuket"
                      value={cruiseForm.destination || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, destination: e.target.value })}
                    />
                  </div>

                  <div className="formGroup">
                    <label htmlFor="duration">Duration <span className="required-star">*</span></label>
                    <input
                      type="text"
                      id="duration"
                      required
                      placeholder="e.g. 6 Nights / 7 Days"
                      value={cruiseForm.duration || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="formGroup" style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="short_description">Short Description <span className="required-star">*</span></label>
                  <textarea
                    id="short_description"
                    required
                    rows={2}
                    placeholder="Brief summary displayed on package cards..."
                    value={cruiseForm.short_description || ''}
                    onChange={e => setCruiseForm({ ...cruiseForm, short_description: e.target.value })}
                  />
                </div>

                <div className="formGroup">
                  <label htmlFor="about">Full About Description</label>
                  <textarea
                    id="about"
                    rows={4}
                    placeholder="Detailed overview for the cruise package page..."
                    value={cruiseForm.about || ''}
                    onChange={e => setCruiseForm({ ...cruiseForm, about: e.target.value })}
                  />
                </div>
              </div>

              {/* Card 2: Banner Image & Subtitles */}
              <div className={styles.formCard}>
                <h4 className={styles.formCardTitle}>Banner Image & Subtitles</h4>

                <div className="formGroup" style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontWeight: 600, color: 'var(--color-secondary-navy)', marginBottom: '0.4rem' }}>
                    Banner Image Upload <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 'normal' }}>(Recommended: 1920 × 460 px, Max 1 MB)</span>
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
                          border: '1px solid var(--color-border)'
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
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className="formGroup">
                    <label htmlFor="banner_title">Banner Title / Heading</label>
                    <input
                      type="text"
                      id="banner_title"
                      placeholder="e.g. Royal Caribbean Mediterranean Voyage"
                      value={cruiseForm.banner_title || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, banner_title: e.target.value })}
                    />
                  </div>

                  <div className="formGroup">
                    <label htmlFor="banner_tagline">Banner Subtitle / Tagline</label>
                    <input
                      type="text"
                      id="banner_tagline"
                      placeholder="e.g. 7 Nights Luxury Ocean Voyage from Barcelona to Rome"
                      value={cruiseForm.banner_tagline || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, banner_tagline: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Gallery Images */}
              <div className={styles.formCard}>
                <h4 className={styles.formCardTitle}>Gallery Images</h4>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    id="cruise-gallery-upload"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(e, (url) => {
                      const currentG = Array.isArray(cruiseForm.gallery) ? cruiseForm.gallery : [];
                      setCruiseForm({ ...cruiseForm, gallery: [...currentG, url] });
                    })}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => document.getElementById('cruise-gallery-upload')?.click()}
                  >
                    📤 Upload Gallery Image
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.85rem' }}>
                  {(Array.isArray(cruiseForm.gallery) ? cruiseForm.gallery : []).map((url, idx) => (
                    <div key={idx} style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--color-border)', height: '90px' }}>
                      <img src={url} alt={`Gallery ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => {
                          const currentG = Array.isArray(cruiseForm.gallery) ? cruiseForm.gallery : [];
                          setCruiseForm({ ...cruiseForm, gallery: currentG.filter((_, i) => i !== idx) });
                        }}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: '#dc2626',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 4: Highlights & Itinerary */}
              <div className={styles.formCard}>
                <h4 className={styles.formCardTitle}>Highlights & Itinerary</h4>

                {/* Highlights */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <label style={{ fontWeight: 700, color: 'var(--color-secondary-navy)' }}>Cruise Highlights</label>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        const currentH = Array.isArray(cruiseForm.highlights) ? cruiseForm.highlights : [];
                        setCruiseForm({ ...cruiseForm, highlights: [...currentH, ''] });
                      }}
                    >
                      + Add Highlight
                    </button>
                  </div>
                  {(Array.isArray(cruiseForm.highlights) ? cruiseForm.highlights : []).map((hl, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={hl}
                        onChange={e => {
                          const currentH = [...(Array.isArray(cruiseForm.highlights) ? cruiseForm.highlights : [])];
                          currentH[idx] = e.target.value;
                          setCruiseForm({ ...cruiseForm, highlights: currentH });
                        }}
                        placeholder="e.g. Shore excursion to Pompeii and Amalfi Coast"
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          const currentH = (Array.isArray(cruiseForm.highlights) ? cruiseForm.highlights : []).filter((_, i) => i !== idx);
                          setCruiseForm({ ...cruiseForm, highlights: currentH });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Itinerary */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <label style={{ fontWeight: 700, color: 'var(--color-secondary-navy)' }}>Itinerary Days</label>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        const currentItin = Array.isArray(cruiseForm.itinerary) ? cruiseForm.itinerary : [];
                        setCruiseForm({
                          ...cruiseForm,
                          itinerary: [...currentItin, { day: String(currentItin.length + 1), title: '', description: '', accommodation: '' }]
                        });
                      }}
                    >
                      + Add Itinerary Day
                    </button>
                  </div>

                  {(Array.isArray(cruiseForm.itinerary) ? cruiseForm.itinerary : []).map((day, idx) => (
                    <div key={idx} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', backgroundColor: '#f8fafc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-secondary-navy)' }}>Day {day.day || idx + 1}</span>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            const currentItin = (Array.isArray(cruiseForm.itinerary) ? cruiseForm.itinerary : []).filter((_, i) => i !== idx);
                            setCruiseForm({ ...cruiseForm, itinerary: currentItin });
                          }}
                        >
                          Remove Day
                        </button>
                      </div>
                      <div className={styles.formRow} style={{ marginBottom: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="Day Title (e.g. Departure from Barcelona)"
                          value={day.title || ''}
                          onChange={e => {
                            const currentItin = [...(Array.isArray(cruiseForm.itinerary) ? cruiseForm.itinerary : [])];
                            currentItin[idx] = { ...currentItin[idx], title: e.target.value };
                            setCruiseForm({ ...cruiseForm, itinerary: currentItin });
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Accommodation / Meals (e.g. Ocean View Cabin, All Meals Included)"
                          value={day.accommodation || ''}
                          onChange={e => {
                            const currentItin = [...(Array.isArray(cruiseForm.itinerary) ? cruiseForm.itinerary : [])];
                            currentItin[idx] = { ...currentItin[idx], accommodation: e.target.value };
                            setCruiseForm({ ...cruiseForm, itinerary: currentItin });
                          }}
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Activities description for the day..."
                        value={day.description || ''}
                        onChange={e => {
                          const currentItin = [...(Array.isArray(cruiseForm.itinerary) ? cruiseForm.itinerary : [])];
                          currentItin[idx] = { ...currentItin[idx], description: e.target.value };
                          setCruiseForm({ ...cruiseForm, itinerary: currentItin });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 5: Inclusions & Exclusions */}
              <div className={styles.formCard}>
                <h4 className={styles.formCardTitle}>Inclusions & Exclusions</h4>

                <div className={styles.formRow}>
                  {/* Inclusions */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontWeight: 700, color: '#166534' }}>✓ Inclusions</label>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          const currentInc = Array.isArray(cruiseForm.inclusions) ? cruiseForm.inclusions : [];
                          setCruiseForm({ ...cruiseForm, inclusions: [...currentInc, ''] });
                        }}
                      >
                        + Add Inclusion
                      </button>
                    </div>
                    {(Array.isArray(cruiseForm.inclusions) ? cruiseForm.inclusions : []).map((inc, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                        <input
                          type="text"
                          value={inc}
                          onChange={e => {
                            const currentInc = [...(Array.isArray(cruiseForm.inclusions) ? cruiseForm.inclusions : [])];
                            currentInc[idx] = e.target.value;
                            setCruiseForm({ ...cruiseForm, inclusions: currentInc });
                          }}
                          placeholder="e.g. All-inclusive full board dining"
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            const currentInc = (Array.isArray(cruiseForm.inclusions) ? cruiseForm.inclusions : []).filter((_, i) => i !== idx);
                            setCruiseForm({ ...cruiseForm, inclusions: currentInc });
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Exclusions */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontWeight: 700, color: '#991b1b' }}>✕ Exclusions</label>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          const currentExc = Array.isArray(cruiseForm.exclusions) ? cruiseForm.exclusions : [];
                          setCruiseForm({ ...cruiseForm, exclusions: [...currentExc, ''] });
                        }}
                      >
                        + Add Exclusion
                      </button>
                    </div>
                    {(Array.isArray(cruiseForm.exclusions) ? cruiseForm.exclusions : []).map((exc, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                        <input
                          type="text"
                          value={exc}
                          onChange={e => {
                            const currentExc = [...(Array.isArray(cruiseForm.exclusions) ? cruiseForm.exclusions : [])];
                            currentExc[idx] = e.target.value;
                            setCruiseForm({ ...cruiseForm, exclusions: currentExc });
                          }}
                          placeholder="e.g. Shore excursions & gratuities"
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            const currentExc = (Array.isArray(cruiseForm.exclusions) ? cruiseForm.exclusions : []).filter((_, i) => i !== idx);
                            setCruiseForm({ ...cruiseForm, exclusions: currentExc });
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 6: Guidelines & FAQs */}
              <div className={styles.formCard}>
                <h4 className={styles.formCardTitle}>Guidelines & FAQs</h4>

                {/* Need to Know */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontWeight: 700, color: 'var(--color-secondary-navy)' }}>Need to Know Guidelines</label>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        const currentN = Array.isArray(cruiseForm.need_to_know) ? cruiseForm.need_to_know : [];
                        setCruiseForm({ ...cruiseForm, need_to_know: [...currentN, ''] });
                      }}
                    >
                      + Add Guideline
                    </button>
                  </div>
                  {(Array.isArray(cruiseForm.need_to_know) ? cruiseForm.need_to_know : []).map((nk, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                      <input
                        type="text"
                        value={nk}
                        onChange={e => {
                          const currentN = [...(Array.isArray(cruiseForm.need_to_know) ? cruiseForm.need_to_know : [])];
                          currentN[idx] = e.target.value;
                          setCruiseForm({ ...cruiseForm, need_to_know: currentN });
                        }}
                        placeholder="e.g. Passport must be valid for at least 6 months"
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          const currentN = (Array.isArray(cruiseForm.need_to_know) ? cruiseForm.need_to_know : []).filter((_, i) => i !== idx);
                          setCruiseForm({ ...cruiseForm, need_to_know: currentN });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* FAQs */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontWeight: 700, color: 'var(--color-secondary-navy)' }}>Frequently Asked Questions</label>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        const currentF = Array.isArray(cruiseForm.faqs) ? cruiseForm.faqs : [];
                        setCruiseForm({ ...cruiseForm, faqs: [...currentF, { question: '', answer: '' }] });
                      }}
                    >
                      + Add FAQ
                    </button>
                  </div>
                  {(Array.isArray(cruiseForm.faqs) ? cruiseForm.faqs : []).map((faq, idx) => (
                    <div key={idx} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '0.85rem', marginBottom: '0.75rem', backgroundColor: '#f8fafc' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>FAQ #{idx + 1}</span>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            const currentF = (Array.isArray(cruiseForm.faqs) ? cruiseForm.faqs : []).filter((_, i) => i !== idx);
                            setCruiseForm({ ...cruiseForm, faqs: currentF });
                          }}
                        >
                          ✕ Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Question (e.g. Is Wi-Fi available onboard?)"
                        value={faq.question || ''}
                        onChange={e => {
                          const currentF = [...(Array.isArray(cruiseForm.faqs) ? cruiseForm.faqs : [])];
                          currentF[idx] = { ...currentF[idx], question: e.target.value };
                          setCruiseForm({ ...cruiseForm, faqs: currentF });
                        }}
                        style={{ marginBottom: '0.5rem' }}
                      />
                      <textarea
                        rows={2}
                        placeholder="Answer..."
                        value={faq.answer || ''}
                        onChange={e => {
                          const currentF = [...(Array.isArray(cruiseForm.faqs) ? cruiseForm.faqs : [])];
                          currentF[idx] = { ...currentF[idx], answer: e.target.value };
                          setCruiseForm({ ...cruiseForm, faqs: currentF });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Settings, Pricing & SEO Sidebar (35%) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Publish & Pricing Card */}
              <div className={styles.formCard}>
                <h4 className={styles.formCardTitle}>Publish & Pricing</h4>

                <div className="formGroup" style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={cruiseForm.status || 'Active'}
                    onChange={e => setCruiseForm({ ...cruiseForm, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="formGroup" style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="order_no">Display Order No</label>
                  <input
                    type="number"
                    id="order_no"
                    value={cruiseForm.order_no ?? ''}
                    onChange={e => setCruiseForm({ ...cruiseForm, order_no: e.target.value ? Number(e.target.value) : 1 })}
                  />
                </div>

                <div className="formGroup" style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="price">Price (₹)</label>
                  <input
                    type="text"
                    id="price"
                    value={cruiseForm.price ?? ''}
                    onChange={e => setCruiseForm({ ...cruiseForm, price: e.target.value ? Number(e.target.value) : null })}
                    placeholder="e.g. 125000"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, fontSize: '0.9rem', color: 'var(--color-secondary-navy)', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={!!cruiseForm.show_price}
                      onChange={e => setCruiseForm({ ...cruiseForm, show_price: e.target.checked })}
                      style={{ width: '18px', height: '18px', margin: 0, cursor: 'pointer', accentColor: '#dc2626' }}
                    />
                    <span>Show Price</span>
                  </label>

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, fontSize: '0.9rem', color: 'var(--color-secondary-navy)', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={!!cruiseForm.featured}
                      onChange={e => setCruiseForm({ ...cruiseForm, featured: e.target.checked })}
                      style={{ width: '18px', height: '18px', margin: 0, cursor: 'pointer', accentColor: '#dc2626' }}
                    />
                    <span>Featured on Landing Page</span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                  {isCreatingCruise ? 'Save Cruise Package' : 'Update Cruise Package'}
                </button>
              </div>

              {/* SEO Settings Card */}
              <div className={styles.formCard}>
                <h4 className={styles.formCardTitle}>SEO & Meta Settings</h4>

                <div className="formGroup" style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="meta_title">Meta Title</label>
                  <input
                    type="text"
                    id="meta_title"
                    placeholder="Enter meta title"
                    value={cruiseForm.meta_title || ''}
                    onChange={e => setCruiseForm({ ...cruiseForm, meta_title: e.target.value })}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginTop: '0.25rem', textAlign: 'right' }}>
                    {(cruiseForm.meta_title || '').length}/60
                  </span>
                </div>

                <div className="formGroup" style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="meta_description">Meta Description</label>
                  <textarea
                    id="meta_description"
                    rows={3}
                    placeholder="Enter meta description"
                    value={cruiseForm.meta_description || ''}
                    onChange={e => setCruiseForm({ ...cruiseForm, meta_description: e.target.value })}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'block', marginTop: '0.25rem', textAlign: 'right' }}>
                    {(cruiseForm.meta_description || '').length}/160
                  </span>
                </div>

                <div className="formGroup" style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="url_slug">URL Slug</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ padding: '0.75rem', background: '#f1f5f9', border: '1px solid var(--color-border)', borderRight: 'none', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>/cruise/</span>
                    <input
                      type="text"
                      id="url_slug"
                      placeholder="enter-url-slug"
                      style={{ flex: 1, borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
                      value={cruiseForm.url_slug || ''}
                      onChange={e => setCruiseForm({ ...cruiseForm, url_slug: e.target.value })}
                    />
                  </div>
                </div>

                <div className="formGroup">
                  <label htmlFor="canonical_url">Canonical URL</label>
                  <input
                    type="text"
                    id="canonical_url"
                    placeholder="https://www.example.com/cruise/slug"
                    value={cruiseForm.canonical_url || ''}
                    onChange={e => setCruiseForm({ ...cruiseForm, canonical_url: e.target.value })}
                  />
                </div>
              </div>

            </div>
          </div>
        </form>
      )}
    </div>
  );
}
