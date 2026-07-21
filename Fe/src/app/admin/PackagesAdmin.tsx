'use client';

import React, { useState, useEffect } from 'react';
import { getPackages, createPackage, updatePackage, deletePackage } from '@/lib/api';
import styles from './admin.module.css';

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
    relatedTours: []
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
    
    // Auto-generate duration string
    const dataToSave = {
      ...formData,
      duration: `${formData.durationDays} Days / ${formData.durationNights || 0} Nights`
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
            <h2 style={{ color: 'var(--color-secondary-navy)' }}>Packages Management</h2>
            <button className="btn btn-primary" onClick={handleAddNew}>+ Add New Package</button>
          </div>
          
          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Package Name</th>
                  <th>Destination</th>
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
              <button type="submit" className="btn btn-primary">Save Package</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label>Title *</label>
              <input required type="text" className={styles.formInput} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label>Slug (URL) *</label>
              <input required type="text" className={styles.formInput} value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
            </div>
            <div>
              <label>Destination</label>
              <input type="text" className={styles.formInput} value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} />
            </div>
            <div>
              <label>Price</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="number" className={styles.formInput} value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} style={{ flex: 1, marginBottom: 0 }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', marginBottom: 0, fontWeight: 'normal', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.show_price !== false} onChange={e => setFormData({...formData, show_price: e.target.checked})} style={{ margin: 0, width: 'auto' }} />
                  Show Price
                </label>
              </div>
            </div>
            <div>
              <label>Tax & Permits Amount (Per Person)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="number" className={styles.formInput} value={formData.tax || 0} onChange={e => setFormData({...formData, tax: Number(e.target.value)})} style={{ flex: 1, marginBottom: 0 }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', marginBottom: 0, fontWeight: 'normal', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.show_price_breakdown !== false} onChange={e => setFormData({...formData, show_price_breakdown: e.target.checked})} style={{ margin: 0, width: 'auto' }} />
                  Show Price Breakdown
                </label>
              </div>
            </div>
            <div>
              <label>Total Days</label>
              <input type="number" className={styles.formInput} value={formData.durationDays} onChange={e => setFormData({...formData, durationDays: Number(e.target.value)})} />
            </div>
            <div>
              <label>Total Nights</label>
              <input type="number" className={styles.formInput} value={formData.durationNights || 0} onChange={e => setFormData({...formData, durationNights: Number(e.target.value)})} />
            </div>
            <div>
              <label>Upload Featured Image <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 'normal' }}>(Max size: 2MB)</span></label>
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
                  <input type="number" className={styles.formInput} style={{ width: '80px' }} value={stop.days || 0} onChange={e => updateRouteStop(idx, 'days', Number(e.target.value))} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', color: '#666' }}>Nights:</label>
                  <input type="number" className={styles.formInput} style={{ width: '80px' }} value={stop.nights} onChange={e => updateRouteStop(idx, 'nights', Number(e.target.value))} />
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
                      <label>Main Day Image URL <span style={{ fontSize: '0.8rem', color: '#666' }}>(Upload or URL)</span></label>
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
                      <label>Gallery Images <span style={{ fontSize: '0.8rem', color: '#666' }}>(Multiple Upload)</span></label>
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
          
          <h4>Related Tours</h4>
          <div style={{ marginBottom: '2rem' }}>
            <select 
              multiple 
              className={styles.formInput} 
              style={{ height: '150px' }}
              value={formData.relatedTours || []} 
              onChange={e => {
                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                setFormData({...formData, relatedTours: selectedOptions});
              }}
            >
              {packages.filter(p => p.id !== formData.id).map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <small style={{ color: '#666' }}>Hold Cmd/Ctrl to select multiple.</small>
          </div>
          
          <div style={{ textAlign: 'right', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>Save Package</button>
          </div>
        </form>
      )}
    </div>
  );
}
