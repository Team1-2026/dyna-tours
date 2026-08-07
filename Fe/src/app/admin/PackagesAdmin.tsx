'use client';

import React, { useState, useEffect } from 'react';
import { getPackages, createPackage, updatePackage, deletePackage } from '@/lib/api';
import styles from './admin.module.css';

import SectionVisibilityToggle from '@/components/admin/SectionVisibilityToggle';

export default function PackagesAdmin() {
  const compressAndSaveImage = (file: File, key: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width *= ratio;
          height *= ratio;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Save to IndexedDB to avoid localStorage quota limits
          try {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            const request = indexedDB.open("DynaToursImages", 1);
            request.onupgradeneeded = (ev) => {
              (ev.target as any).result.createObjectStore("images");
            };
            request.onsuccess = (ev) => {
              const db = (ev.target as any).result;
              const tx = db.transaction("images", "readwrite");
              tx.objectStore("images").put(dataUrl, key);
            };
          } catch (err) {
            console.error("Failed to save image", err);
          }
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [relatedSearch, setRelatedSearch] = useState('');

  const fetchPackages = async () => {
    setLoading(true);
    const data = await getPackages();
    setPackages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    const onAddNew = () => {
      setFormData(getEmptyPackage());
      setEditingId(null);
      setIsFormOpen(true);
    };
    const onViewAll = () => {
      setIsFormOpen(false);
    };
    window.addEventListener('admin:add-new-package', onAddNew);
    window.addEventListener('admin:view-packages', onViewAll);
    return () => {
      window.removeEventListener('admin:add-new-package', onAddNew);
      window.removeEventListener('admin:view-packages', onViewAll);
    };
  }, []);

  const getEmptyPackage = () => ({
    title: '',
    slug: '',
    destination: '',
    category: 'Leisure',
    tourType: '',
    price: 0,
    tax: 0,
    show_price: true,
    show_price_breakdown: true,
    duration: '',
    durationDays: 1,
    durationNights: 0,
    rating: 5,
    reviewsCount: 0,
    description: '',
    overview: {
      introduction: '',
      destinationsCovered: '',
      idealTravelers: '',
      experienceSummary: ''
    },
    routeOverview: [],
    highlights: [''],
    itinerary: [],
    inclusions: [''],
    exclusions: [''],
    image: '',
    gallery: [],
    holidayCategory: ['Domestic Tour Packages'],
    termsAndConditions: '',
    cancellationPolicy: '',
    quickInfo: [],
    bannerCode: '',
    relatedTours: [],
    meta_title: '',
    meta_description: '',
    canonical_url: ''
  });

  const handleAddNew = () => {
    setFormData(getEmptyPackage());
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (pkg: any) => {
    const pkgCopy = JSON.parse(JSON.stringify(pkg));
    if (pkgCopy.slug === undefined) pkgCopy.slug = '';
    if (pkgCopy.tourType === undefined) pkgCopy.tourType = '';
    if (pkgCopy.image === undefined) pkgCopy.image = '';
    if (pkgCopy.description === undefined) pkgCopy.description = '';
    if (pkgCopy.show_price === undefined) pkgCopy.show_price = true;
    if (pkgCopy.show_price_breakdown === undefined) pkgCopy.show_price_breakdown = true;
    if (pkgCopy.tax === undefined) pkgCopy.tax = 0;
    if (pkgCopy.durationNights === undefined) pkgCopy.durationNights = 0;
    if (pkgCopy.relatedTours === undefined) pkgCopy.relatedTours = [];
    if (pkgCopy.meta_title === undefined) pkgCopy.meta_title = '';
    if (pkgCopy.meta_description === undefined) pkgCopy.meta_description = '';
    if (pkgCopy.canonical_url === undefined) pkgCopy.canonical_url = '';
    setFormData(pkgCopy);
    setEditingId(pkg.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete ${title}?`)) {
      await deletePackage(id);
      fetchPackages();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    
    // Auto-generate duration string and parse numeric fields
    const dataToSave = {
      ...formData,
      price: formData.price === '' || formData.price === null || formData.price === undefined ? 0 : Number(formData.price),
      tax: formData.tax === '' || formData.tax === null || formData.tax === undefined ? 0 : Number(formData.tax),
      durationDays: formData.durationDays === '' || formData.durationDays === null || formData.durationDays === undefined ? 1 : Number(formData.durationDays),
      durationNights: formData.durationNights === '' || formData.durationNights === null || formData.durationNights === undefined ? 0 : Number(formData.durationNights),
      rating: formData.rating === '' || formData.rating === null || formData.rating === undefined ? 5 : Number(formData.rating),
      reviewsCount: formData.reviewsCount === '' || formData.reviewsCount === null || formData.reviewsCount === undefined ? 0 : Number(formData.reviewsCount),
      duration: `${formData.durationDays || 1} Days / ${formData.durationNights || 0} Nights`
    };

    try {
      if (editingId) {
        await updatePackage(editingId, dataToSave);
      } else {
        await createPackage(dataToSave);
      }
      setSaveStatus('Saved Successfully!');
      setIsFormOpen(false);
      fetchPackages();
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus('Error saving package.');
    }
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayItem = (field: string) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: string, index: number) => {
    const newArr = [...formData[field]];
    newArr.splice(index, 1);
    setFormData({ ...formData, [field]: newArr });
  };

  // Route Overview Handlers
  const addRouteStop = () => {
    setFormData({ ...formData, routeOverview: [...(formData.routeOverview || []), { destination: '', nights: 0, days: 0 }] });
  };

  const updateRouteStop = (index: number, field: string, value: string | number) => {
    const newRoute = [...(formData.routeOverview || [])];
    newRoute[index] = { ...newRoute[index], [field]: value };
    setFormData({ ...formData, routeOverview: newRoute });
  };

  const removeRouteStop = (index: number) => {
    const newRoute = [...(formData.routeOverview || [])];
    newRoute.splice(index, 1);
    setFormData({ ...formData, routeOverview: newRoute });
  };

  // Itinerary Handlers
  const addItineraryDay = () => {
    const dayNum = (formData.itinerary || []).length + 1;
    setFormData({ 
      ...formData, 
      itinerary: [...(formData.itinerary || []), { 
        day: dayNum, 
        title: `Day ${dayNum}`, 
        description: '', 
        meals: '', 
        stay: '', 
        image: '',
        gallery: [],
        sightseeing: '',
        hotel: '',
        transport: '',
        logistics: { placesCovered: '', distance: '', travelTime: '', pace: '' }
      }] 
    });
  };

  const updateItineraryDay = (index: number, field: string, value: any) => {
    const newItin = [...(formData.itinerary || [])];
    newItin[index] = { ...newItin[index], [field]: value };
    setFormData({ ...formData, itinerary: newItin });
  };

  const removeItineraryDay = (index: number) => {
    const newItin = [...(formData.itinerary || [])];
    newItin.splice(index, 1);
    // Recalculate day numbers
    newItin.forEach((d, i) => { d.day = i + 1; });
    setFormData({ ...formData, itinerary: newItin });
  };

  // Move day up/down for drag-and-drop simulation
  const moveDay = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === formData.itinerary.length - 1) return;
    
    const newItin = [...formData.itinerary];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newItin[index];
    newItin[index] = newItin[targetIndex];
    newItin[targetIndex] = temp;
    
    // Recalculate
    newItin.forEach((d, i) => { d.day = i + 1; });
    setFormData({ ...formData, itinerary: newItin });
  };

  if (loading) return <div>Loading packages...</div>;

  return (
    <div>
      {saveStatus && <div style={{ padding: '1rem', background: '#d4edda', color: '#155724', marginBottom: '1rem' }}>{saveStatus}</div>}
      
      {!isFormOpen ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--color-secondary-navy)', margin: 0 }}>Packages Management</h2>
            <button className="btn btn-primary" onClick={handleAddNew}>+ Add New Package</button>
          </div>
          
          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Package Name</th>
                  <th>Destination</th>
                  <th>Theme</th>
                  <th>Rating</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td><strong>{pkg.title}</strong></td>
                    <td>{pkg.destination}</td>
                    <td>
                      <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                        {pkg.category || 'Leisure'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: '#d97706', fontWeight: 'bold' }}>★ {pkg.rating || 5}</span> <span style={{ fontSize: '0.8rem', color: '#64748b' }}>({pkg.reviewsCount || 0})</span>
                    </td>
                    <td>{pkg.duration}</td>
                    <td>₹{pkg.price?.toLocaleString()}</td>
                    <td>
                      <button onClick={() => handleEdit(pkg)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', marginRight: '0.5rem', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(pkg.id, pkg.title)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <form onSubmit={handleSave} className={styles.formCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>{editingId ? 'Edit Package' : 'Create New Package'}</h3>
            <div>
              <button type="button" className="btn btn-primary" onClick={() => setIsFormOpen(false)} style={{ marginRight: '1rem', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingId ? 'Update Package' : 'Save Package'}</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label>Title <span className="required-star">*</span></label>
              <input required type="text" className={styles.formInput} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label>Slug (URL) <span className="required-star">*</span></label>
              <input required type="text" className={styles.formInput} value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
            </div>
            <div>
              <label>Destination</label>
              <input type="text" className={styles.formInput} value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
            </div>
            <div>
              <label>Price</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="text" className={styles.formInput} value={formData.price ?? ''} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Enter price" style={{ flex: 1, marginBottom: 0 }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', marginBottom: 0, fontWeight: 'normal', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.show_price !== false} onChange={e => setFormData({...formData, show_price: e.target.checked})} style={{ margin: 0, width: 'auto' }} />
                  Show Price
                </label>
              </div>
            </div>
            <div>
              <label>Tax & Permits Amount (Per Person)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="text" className={styles.formInput} value={formData.tax ?? ''} onChange={e => setFormData({...formData, tax: e.target.value})} placeholder="Enter tax amount" style={{ flex: 1, marginBottom: 0 }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', marginBottom: 0, fontWeight: 'normal', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.show_price_breakdown !== false} onChange={e => setFormData({...formData, show_price_breakdown: e.target.checked})} style={{ margin: 0, width: 'auto' }} />
                  Show Price Breakdown
                </label>
              </div>
            </div>
            <div>
              <label>Total Days</label>
              <input type="text" className={styles.formInput} value={formData.durationDays ?? ''} onChange={e => setFormData({...formData, durationDays: e.target.value})} placeholder="e.g. 5" />
            </div>
            <div>
              <label>Total Nights</label>
              <input type="text" className={styles.formInput} value={formData.durationNights ?? ''} onChange={e => setFormData({...formData, durationNights: e.target.value})} placeholder="e.g. 4" />
            </div>
            <div>
              <label>Upload Featured Image / Banner <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'normal' }}>(Recommended size: 1920 × 460 px)</span></label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="text" className={styles.formInput} value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="Image URL or upload below" style={{ flex: 1 }} />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({...formData, image: file.name});
                      compressAndSaveImage(file, `uploaded_image_${file.name}`);
                    }
                  }} 
                  style={{ display: 'none' }} 
                  id="featured-image-upload" 
                />
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => document.getElementById('featured-image-upload')?.click()}
                >
                  Upload File
                </button>
              </div>
            </div>
            <div>
              <label>Banner Code (HTML/Iframe snippet)</label>
              <textarea 
                className={styles.formInput} 
                rows={3}
                value={formData.bannerCode || ''} 
                onChange={e => setFormData({...formData, bannerCode: e.target.value})} 
                placeholder="Enter embed code for banner (optional)"
              />
            </div>
            <div>
              <label>Package Theme / Vibe <span className="required-star">*</span></label>
              <select 
                className={styles.formInput} 
                value={formData.category || 'Leisure'} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Nature">Nature</option>
                <option value="Culture">Culture</option>
                <option value="Leisure">Leisure</option>
                <option value="Adventure">Adventure</option>
                <option value="History">History</option>
                <option value="Religious">Religious</option>
                <option value="Wildlife">Wildlife</option>
                <option value="Beach">Beach</option>
                <option value="Family">Family</option>
                <option value="Honeymoon">Honeymoon</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div>
              <label>Star Rating (1.0 to 5.0) <span className="required-star">*</span></label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className={styles.formInput} 
                  value={formData.rating ?? ''} 
                  onChange={e => setFormData({...formData, rating: e.target.value})} 
                  style={{ flex: 1, marginBottom: 0 }} 
                  placeholder="e.g. 4.8"
                />
                <span style={{ fontSize: '1.1rem', color: '#f59e0b', fontWeight: 'bold' }}>
                  ★ {formData.rating ?? 5}
                </span>
              </div>
            </div>
            <div>
              <label>Reviews Count (Display Label)</label>
              <input 
                type="text" 
                className={styles.formInput} 
                value={formData.reviewsCount ?? ''} 
                onChange={e => setFormData({...formData, reviewsCount: e.target.value})} 
                placeholder="e.g. 128 Reviews"
              />
            </div>
            <div>
              <label>Holiday Categories</label>
              <select 
                className={styles.formInput} 
                value={formData.holidayCategory?.[0] || ''} 
                onChange={e => setFormData({...formData, holidayCategory: [e.target.value]})}
              >
                <option value="">Select Category</option>
                <option value="International Tour Packages">International Tour Packages</option>
                <option value="Domestic Tour Packages">Domestic Tour Packages</option>
                <option value="Honeymoon Tour Packages">Honeymoon Tour Packages</option>
                <option value="Luxury Tour Packages">Luxury Tour Packages</option>
                <option value="Kerala Tour Packages">Kerala Tour Packages</option>
                <option value="Family Tour Packages">Family Tour Packages</option>
                <option value="Culture">Culture</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '2rem', padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#0C2745', fontWeight: 800 }}>👁️ Display & Home Page Visibility Controls</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1.25rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, color: '#15803d', margin: 0 }}>
                <input 
                  type="checkbox" 
                  checked={formData.show_on_home !== false} 
                  onChange={e => setFormData({...formData, show_on_home: e.target.checked})} 
                  style={{ width: '18px', height: '18px', margin: 0, flexShrink: 0 }}
                />
                <span>Show on Home Page (Trending Packages)</span>
              </label>

              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1.25rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#334155', margin: 0 }}>
                <input 
                  type="checkbox" 
                  checked={formData.show_price !== false} 
                  onChange={e => setFormData({...formData, show_price: e.target.checked})} 
                  style={{ width: '18px', height: '18px', margin: 0, flexShrink: 0 }}
                />
                <span>Display Package Price</span>
              </label>

              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1.25rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#334155', margin: 0 }}>
                <input 
                  type="checkbox" 
                  checked={formData.status !== 'Inactive'} 
                  onChange={e => setFormData({...formData, status: e.target.checked ? 'Active' : 'Inactive'})} 
                  style={{ width: '18px', height: '18px', margin: 0, flexShrink: 0 }}
                />
                <span>Package Active Status</span>
              </label>
            </div>
          </div>

          <h4>Package Overview Section</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Short Description (Used in cards)</label>
              <textarea className={styles.formInput} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Introduction</label>
              <textarea className={styles.formInput} value={formData.overview?.introduction || ''} onChange={e => setFormData({...formData, overview: {...formData.overview, introduction: e.target.value}})} rows={2} />
            </div>
            <div>
              <label>Destinations Covered</label>
              <input type="text" className={styles.formInput} value={formData.overview?.destinationsCovered || ''} onChange={e => setFormData({...formData, overview: {...formData.overview, destinationsCovered: e.target.value}})} />
            </div>
            <div>
              <label>Ideal Travelers</label>
              <input type="text" className={styles.formInput} value={formData.overview?.idealTravelers || ''} onChange={e => setFormData({...formData, overview: {...formData.overview, idealTravelers: e.target.value}})} />
            </div>
          </div>

          <h4>Route Overview Timeline</h4>
          <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            {(formData.routeOverview || []).map((stop: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <input placeholder="Destination" className={styles.formInput} value={stop.destination} onChange={e => updateRouteStop(idx, 'destination', e.target.value)} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', color: '#666' }}>Days:</label>
                  <input type="text" className={styles.formInput} style={{ width: '80px' }} value={stop.days ?? ''} onChange={e => updateRouteStop(idx, 'days', e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', color: '#666' }}>Nights:</label>
                  <input type="text" className={styles.formInput} style={{ width: '80px' }} value={stop.nights ?? ''} onChange={e => updateRouteStop(idx, 'nights', e.target.value)} />
                </div>
                <button type="button" className="btn btn-primary" onClick={() => removeRouteStop(idx)}>Remove</button>
              </div>
            ))}
            <button type="button" className="btn btn-primary" onClick={addRouteStop}>+ Add Route Stop</button>
          </div>

          <h4>Day-wise Itinerary Builder</h4>
          <div style={{ marginBottom: '2rem' }}>
            {(formData.itinerary || []).map((day: any, idx: number) => (
              <div key={idx} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '1rem', background: '#f9f9f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <strong>Day {day.day}</strong>
                  <div>
                    <button type="button" onClick={() => moveDay(idx, 'up')} disabled={idx === 0} style={{ marginRight: '0.5rem' }}>↑</button>
                    <button type="button" onClick={() => moveDay(idx, 'down')} disabled={idx === (formData.itinerary?.length || 0) - 1} style={{ marginRight: '1rem' }}>↓</button>
                    <button type="button" className="btn btn-primary" onClick={() => removeItineraryDay(idx)} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Delete Day</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Title</label>
                    <input className={styles.formInput} value={day.title} onChange={e => updateItineraryDay(idx, 'title', e.target.value)} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Description</label>
                    <textarea className={styles.formInput} rows={3} value={day.description} onChange={e => updateItineraryDay(idx, 'description', e.target.value)} />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label>Sightseeing</label>
                      <input className={styles.formInput} value={day.sightseeing || ''} onChange={e => updateItineraryDay(idx, 'sightseeing', e.target.value)} />
                    </div>
                    <div>
                      <label>Hotel</label>
                      <input className={styles.formInput} value={day.hotel || ''} onChange={e => updateItineraryDay(idx, 'hotel', e.target.value)} />
                    </div>
                    <div>
                      <label>Transport</label>
                      <input className={styles.formInput} value={day.transport || ''} onChange={e => updateItineraryDay(idx, 'transport', e.target.value)} />
                    </div>
                    <div>
                      <label>Meals</label>
                      <input className={styles.formInput} value={day.meals || ''} onChange={e => updateItineraryDay(idx, 'meals', e.target.value)} />
                    </div>
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label>Main Day Image URL <span style={{ fontSize: '0.8rem', color: '#666' }}>(Recommended size: 800 × 600 px)</span></label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input className={styles.formInput} value={day.image || ''} onChange={e => updateItineraryDay(idx, 'image', e.target.value)} style={{ flex: 1 }} />
                        {day.image && (
                          <button 
                            type="button"
                            className="btn btn-primary"
                            style={{ padding: '0.3rem 0.6rem', backgroundColor: '#e11d48', borderColor: '#e11d48' }}
                            onClick={() => updateItineraryDay(idx, 'image', '')}
                          >
                            x
                          </button>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              updateItineraryDay(idx, 'image', file.name);
                              compressAndSaveImage(file, `uploaded_image_${file.name}`);
                            }
                          }} 
                          style={{ display: 'none' }} 
                          id={`day-image-upload-${idx}`} 
                        />
                        <button 
                          type="button" 
                          className="btn btn-primary"
                          style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }} 
                          onClick={() => document.getElementById(`day-image-upload-${idx}`)?.click()}
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                    <div>
                      <label>Gallery Images <span style={{ fontSize: '0.8rem', color: '#666' }}>(Recommended size: 1200 × 800 px)</span></label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {(day.gallery || []).map((imgUrl: string, imgIdx: number) => (
                          <div key={imgIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input 
                              className={styles.formInput} 
                              value={imgUrl} 
                              onChange={(e) => {
                                const newGallery = [...(day.gallery || [])];
                                newGallery[imgIdx] = e.target.value;
                                updateItineraryDay(idx, 'gallery', newGallery);
                              }}
                              style={{ flex: 1, marginBottom: 0 }}
                            />
                            <button 
                              type="button"
                              className="btn btn-primary"
                              style={{ padding: '0.3rem 0.6rem', backgroundColor: '#e11d48', borderColor: '#e11d48' }}
                              onClick={() => {
                                const newGallery = [...(day.gallery || [])];
                                newGallery.splice(imgIdx, 1);
                                updateItineraryDay(idx, 'gallery', newGallery);
                              }}
                            >
                              x
                            </button>
                          </div>
                        ))}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input 
                            type="file" 
                            accept="image/*" 
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length > 0) {
                                const newNames = files.map(f => f.name);
                                const currentGallery = [...(day.gallery || [])];
                                updateItineraryDay(idx, 'gallery', [...currentGallery, ...newNames]);
                                
                                files.forEach(file => {
                                  compressAndSaveImage(file, `uploaded_image_${file.name}`);
                                });
                              }
                            }} 
                            style={{ display: 'none' }} 
                            id={`day-gallery-upload-${idx}`} 
                          />
                          <button 
                            type="button" 
                            className="btn btn-primary"
                            style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap', alignSelf: 'flex-start' }} 
                            onClick={() => document.getElementById(`day-gallery-upload-${idx}`)?.click()}
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
            <button type="button" className="btn btn-primary" onClick={addItineraryDay}>+ Add Day</button>
          </div>

          <h4>Dynamic Lists</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <h5>Highlights</h5>
              {(formData.highlights || []).map((h: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input className={styles.formInput} value={h} onChange={e => handleArrayChange('highlights', idx, e.target.value)} />
                  <button type="button" onClick={() => removeArrayItem('highlights', idx)}>x</button>
                </div>
              ))}
              <button type="button" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => addArrayItem('highlights')}>+ Add</button>
            </div>
            <div>
              <h5>Inclusions</h5>
              {(formData.inclusions || []).map((h: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input className={styles.formInput} value={h} onChange={e => handleArrayChange('inclusions', idx, e.target.value)} />
                  <button type="button" onClick={() => removeArrayItem('inclusions', idx)}>x</button>
                </div>
              ))}
              <button type="button" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => addArrayItem('inclusions')}>+ Add</button>
            </div>
            <div>
              <h5>Exclusions</h5>
              {(formData.exclusions || []).map((h: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input className={styles.formInput} value={h} onChange={e => handleArrayChange('exclusions', idx, e.target.value)} />
                  <button type="button" onClick={() => removeArrayItem('exclusions', idx)}>x</button>
                </div>
              ))}
              <button type="button" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => addArrayItem('exclusions')}>+ Add</button>
            </div>
          </div>
          
          {/* Related Tour Packages mapping */}
          <div className={styles.formCard}>
            <h4 className={styles.formCardTitle}>Related Tour Packages Mapping</h4>
            <input
              type="text"
              placeholder="Search tour packages by title or country..."
              className={styles.searchBar}
              value={relatedSearch}
              onChange={(e) => setRelatedSearch(e.target.value)}
            />
            <div className={styles.checklistGrid}>
              {packages
                .filter(p => String(p.id) !== String(formData.id) && String(p.id) !== String(editingId))
                .filter(p => !relatedSearch || p.title?.toLowerCase().includes(relatedSearch.toLowerCase()) || p.destination?.toLowerCase().includes(relatedSearch.toLowerCase()))
                .map(tour => {
                  const isChecked = (formData.relatedTours || []).map(String).includes(String(tour.id));
                  return (
                    <label key={tour.id} className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          const current = (formData.relatedTours || []).map(String);
                          const tourIdStr = String(tour.id);
                          const updated = e.target.checked
                            ? [...current, tourIdStr]
                            : current.filter((id: string) => id !== tourIdStr);
                          setFormData({ ...formData, relatedTours: updated });
                        }}
                      />
                      <span>{tour.title}</span>
                    </label>
                  );
                })}
            </div>
          </div>
          
          {/* SEO Settings Card */}
          <div className={styles.formCard} style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <h4 className={styles.formCardTitle}>SEO Settings</h4>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.9rem' }}>
                Meta Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="Enter meta title"
                value={formData.meta_title || ''}
                onChange={e => setFormData({ ...formData, meta_title: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border, #cbd5e1)', borderRadius: 'var(--radius-md, 8px)', marginBottom: 0 }}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.25rem', textAlign: 'right' }}>
                {(formData.meta_title || '').length}/60
              </span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.9rem' }}>
                Meta Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                rows={3}
                className={styles.formInput}
                placeholder="Enter meta description"
                value={formData.meta_description || ''}
                onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border, #cbd5e1)', borderRadius: 'var(--radius-md, 8px)', marginBottom: 0 }}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.25rem', textAlign: 'right' }}>
                {(formData.meta_description || '').length}/160
              </span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.9rem' }}>
                URL Slug <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ padding: '0.75rem', background: '#f1f5f9', border: '1px solid var(--color-border, #cbd5e1)', borderRight: 'none', borderRadius: 'var(--radius-md, 8px) 0 0 var(--radius-md, 8px)', fontSize: '0.8rem', color: 'var(--color-text-secondary, #64748b)', fontWeight: 600 }}>/holidays/</span>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="enter-url-slug"
                  style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--color-border, #cbd5e1)', borderRadius: '0 var(--radius-md, 8px) var(--radius-md, 8px) 0', marginBottom: 0 }}
                  value={formData.url_slug || formData.slug || ''}
                  onChange={e => setFormData({ ...formData, url_slug: e.target.value, slug: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.9rem' }}>Canonical URL</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="https://www.example.com/holidays/slug"
                value={formData.canonical_url || ''}
                onChange={e => setFormData({ ...formData, canonical_url: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border, #cbd5e1)', borderRadius: 'var(--radius-md, 8px)', marginBottom: 0 }}
              />
            </div>
          </div>
          
          <div style={{ textAlign: 'right', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>{editingId ? 'Update Package' : 'Save Package'}</button>
          </div>
        </form>
      )}
    </div>
  );
}
