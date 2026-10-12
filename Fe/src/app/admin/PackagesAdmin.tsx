'use client';

import React, { useState, useEffect } from 'react';
import { getPackages, createPackage, updatePackage, deletePackage, uploadImage, getImageUrl } from '@/lib/api';
import styles from './admin.module.css';
import ResolvedImage from '@/components/ResolvedImage';

import SectionVisibilityToggle from '@/components/admin/SectionVisibilityToggle';

// Helper to compress uploaded images via Canvas before storing/sending
const compressImageFile = (file: File, maxWidth = 1600, quality = 0.75): Promise<string> => {
  return new Promise((resolve) => {
    if (file.type === 'image/svg+xml' || file.size < 40 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxWidth) {
          const ratio = Math.min(maxWidth / width, maxWidth / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve((e.target?.result as string) || '');
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve((e.target?.result as string) || '');
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

const base64ToFile = (base64String: string, filename = 'image.png'): File => {
  const arr = base64String.split(',');
  const mime = arr[0]?.match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1] || '');
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const ensureServerImageUrl = async (urlOrBase64?: string | null): Promise<string> => {
  if (!urlOrBase64 || !urlOrBase64.startsWith('data:image/')) {
    return urlOrBase64 || '';
  }
  try {
    const file = base64ToFile(urlOrBase64, `migrated_${Date.now()}.png`);
    const res = await uploadImage(file);
    return res.url;
  } catch (err) {
    console.error('Failed to convert base64 image to server URL:', err);
    return urlOrBase64;
  }
};

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
    packageSummary: '',
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
  termsAndConditions: [''],
  cancellationPolicy: [''],
  quickInfo: [],
  bannerCode: '',
  relatedTours: [],
  meta_title: '',
  meta_description: '',
  canonical_url: ''
});

export default function PackagesAdmin() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(getEmptyPackage());

  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [relatedSearch, setRelatedSearch] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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

  const handleAddNew = () => {
    setFormData(getEmptyPackage());
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (pkg: any) => {
    const pkgCopy = JSON.parse(JSON.stringify(pkg));
    pkgCopy.title = pkgCopy.title ?? '';
    pkgCopy.slug = pkgCopy.slug ?? '';
    pkgCopy.destination = pkgCopy.destination ?? '';
    pkgCopy.tourType = pkgCopy.tourType ?? '';
    pkgCopy.image = pkgCopy.image ?? '';
    pkgCopy.description = pkgCopy.description ?? '';
    pkgCopy.bannerCode = pkgCopy.bannerCode ?? '';
    pkgCopy.price = pkgCopy.price ?? 0;
    pkgCopy.tax = pkgCopy.tax ?? 0;
    pkgCopy.durationDays = pkgCopy.durationDays ?? 1;
    pkgCopy.durationNights = pkgCopy.durationNights ?? 0;
    pkgCopy.rating = pkgCopy.rating ?? 5;
    pkgCopy.reviewsCount = pkgCopy.reviewsCount ?? 0;
    pkgCopy.show_price = pkgCopy.show_price !== false;
    pkgCopy.show_price_breakdown = pkgCopy.show_price_breakdown !== false;
    pkgCopy.relatedTours = pkgCopy.relatedTours ?? [];
    pkgCopy.meta_title = pkgCopy.meta_title ?? '';
    pkgCopy.meta_description = pkgCopy.meta_description ?? '';
    pkgCopy.canonical_url = pkgCopy.canonical_url ?? '';

    const sanitizeStringArray = (arr: any): string[] => {
      if (typeof arr === 'string') {
        const split = arr.split('\n').map((s: string) => s.trim()).filter(Boolean);
        return split.length > 0 ? split : [''];
      }
      if (!Array.isArray(arr) || arr.length === 0) {
        return [''];
      }
      const filtered = arr.map((item: any) => (item === null || item === undefined ? '' : String(item)));
      return filtered.length > 0 ? filtered : [''];
    };

    pkgCopy.highlights = sanitizeStringArray(pkgCopy.highlights);
    pkgCopy.inclusions = sanitizeStringArray(pkgCopy.inclusions);
    pkgCopy.exclusions = sanitizeStringArray(pkgCopy.exclusions);
    pkgCopy.termsAndConditions = sanitizeStringArray(pkgCopy.termsAndConditions !== undefined ? pkgCopy.termsAndConditions : pkgCopy.terms_and_conditions);
    pkgCopy.cancellationPolicy = sanitizeStringArray(pkgCopy.cancellationPolicy !== undefined ? pkgCopy.cancellationPolicy : pkgCopy.cancellation_policy);

    if (!pkgCopy.overview || typeof pkgCopy.overview !== 'object') {
      pkgCopy.overview = {
        packageSummary: typeof pkgCopy.overview === 'string' ? pkgCopy.overview : '',
        introduction: '',
        destinationsCovered: '',
        idealTravelers: '',
        experienceSummary: ''
      };
    } else {
      pkgCopy.overview = {
        packageSummary: pkgCopy.overview.packageSummary ?? pkgCopy.overview.summary ?? '',
        introduction: pkgCopy.overview.introduction ?? '',
        destinationsCovered: pkgCopy.overview.destinationsCovered ?? '',
        idealTravelers: pkgCopy.overview.idealTravelers ?? '',
        experienceSummary: pkgCopy.overview.experienceSummary ?? ''
      };
    }

    let holidayCat = pkgCopy.holidayCategory !== undefined ? pkgCopy.holidayCategory : (pkgCopy.holiday_category || []);
    if (typeof holidayCat === 'string') {
      holidayCat = [holidayCat];
    } else if (!Array.isArray(holidayCat)) {
      holidayCat = ['Domestic Tour Packages'];
    }
    pkgCopy.holidayCategory = holidayCat.filter(Boolean);

    setFormData(pkgCopy);
    setEditingId(pkg.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete ${title}?`)) {
      await deletePackage(id);
      await fetchPackages();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Preparing & uploading images...');

    try {
      // Auto-migrate any base64 images to server URLs before saving
      let cleanedImage = formData.image;
      if (cleanedImage?.startsWith('data:image/')) {
        cleanedImage = await ensureServerImageUrl(cleanedImage);
      }

      const cleanedItinerary = await Promise.all(
        (formData.itinerary || []).map(async (day: any) => {
          let dayImage = day.image;
          if (dayImage?.startsWith('data:image/')) {
            dayImage = await ensureServerImageUrl(dayImage);
          }
          let dayGallery = day.gallery || [];
          if (Array.isArray(dayGallery)) {
            dayGallery = await Promise.all(
              dayGallery.map(async (gUrl: string) => {
                if (gUrl?.startsWith('data:image/')) {
                  return await ensureServerImageUrl(gUrl);
                }
                return gUrl;
              })
            );
          }
          return {
            ...day,
            image: dayImage,
            gallery: dayGallery
          };
        })
      );

      setSaveStatus('Saving package...');

      // Auto-generate duration string and parse numeric fields
      const dataToSave = {
        ...formData,
        image: cleanedImage,
        itinerary: cleanedItinerary,
        price: formData.price === '' || formData.price === null || formData.price === undefined ? 0 : Number(formData.price),
        tax: formData.tax === '' || formData.tax === null || formData.tax === undefined ? 0 : Number(formData.tax),
        durationDays: formData.durationDays === '' || formData.durationDays === null || formData.durationDays === undefined ? 1 : Number(formData.durationDays),
        durationNights: formData.durationNights === '' || formData.durationNights === null || formData.durationNights === undefined ? 0 : Number(formData.durationNights),
        rating: formData.rating === '' || formData.rating === null || formData.rating === undefined ? 5 : Number(formData.rating),
        reviewsCount: formData.reviewsCount === '' || formData.reviewsCount === null || formData.reviewsCount === undefined ? 0 : Number(formData.reviewsCount),
        duration: `${formData.durationDays || 1} Days / ${formData.durationNights || 0} Nights`
      };

      if (editingId) {
        await updatePackage(editingId, dataToSave);
      } else {
        await createPackage(dataToSave);
      }
      setSaveStatus('Saved Successfully!');
      setIsFormOpen(false);
      fetchPackages();
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      console.error('Save package error:', err);
      setSaveStatus(`Error saving package: ${err?.message || 'Please check input values'}`);
    }
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const newArr = [...(formData[field] || [])];
    newArr[index] = value ?? '';
    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayItem = (field: string) => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ''] });
  };

  const removeArrayItem = (field: string, index: number) => {
    const newArr = [...(formData[field] || [])];
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
        <div className={styles.panelCard}>
          <div className={styles.tableHeaderToolbar}>
            <h3 className={styles.panelTitle} style={{ margin: 0 }}>Packages Management</h3>
            
            <div className={styles.toolbarFilters}>
              <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Search package..."
                  className={styles.toolbarSearchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <select 
                className={`searchSelect ${styles.toolbarSelect}`}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Domestic Tour Packages">Domestic Tour Packages</option>
                <option value="International Tour Packages">International Tour Packages</option>
                <option value="Honeymoon Tour Packages">Honeymoon Tour Packages</option>
                <option value="Luxury Tour Packages">Luxury Tour Packages</option>
                <option value="Kerala Tour Packages">Kerala Tour Packages</option>
                <option value="Leisure">Leisure</option>
                <option value="Nature">Nature</option>
                <option value="Culture">Culture</option>
                <option value="Adventure">Adventure</option>
              </select>

              <select 
                className={`searchSelect ${styles.toolbarSelect}`}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Draft / Inactive</option>
              </select>

              <button type="button" className={styles.filterBtn}>
                <span>🎛️</span> Filter
              </button>
            </div>

            <button className="btn btn-primary" onClick={handleAddNew}>
              + Add New Package
            </button>
          </div>

          <div className={styles.tableContainer}>
            {(() => {
              const filteredPackages = packages.filter((pkg) => {
                const titleMatch = (pkg.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                   (pkg.destination || '').toLowerCase().includes(searchQuery.toLowerCase());
                const catMatch = !categoryFilter || (pkg.holidayCategory && pkg.holidayCategory.includes(categoryFilter)) || pkg.category === categoryFilter;
                const statMatch = !statusFilter || (statusFilter === 'Active' ? pkg.status !== 'Inactive' : pkg.status === 'Inactive');
                return titleMatch && catMatch && statMatch;
              });

              if (filteredPackages.length === 0) {
                return (
                  <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    No packages found. Click "+ Add New Package" to add one.
                  </div>
                );
              }

              return (
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Sl No</th>
                      <th>Package Name</th>
                      <th>Destination</th>
                      <th>Category</th>
                      <th>Duration</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPackages.map((pkg, idx) => (
                      <tr key={pkg.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <ResolvedImage
                              src={pkg.image || (pkg.gallery && pkg.gallery[0]) || ''}
                              alt={pkg.title}
                              style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                            />
                            <span style={{ fontWeight: 700, color: 'var(--color-secondary-navy)' }}>{pkg.title}</span>
                          </div>
                        </td>
                        <td>📍 {pkg.destination || 'India'}</td>
                        <td>
                          <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                            {pkg.category || 'Leisure'}
                          </span>
                        </td>
                        <td>⏳ {pkg.duration || `${pkg.durationDays || 1} Days`}</td>
                        <td style={{ fontWeight: 700, color: 'var(--color-primary-red)' }}>
                          {pkg.show_price !== false && pkg.price ? `₹${Number(pkg.price).toLocaleString('en-IN')}` : 'Price on Request'}
                        </td>
                        <td>
                          <span className={`${styles.statusPill} ${pkg.status === 'Inactive' ? styles.statusDraft : styles.statusActive}`}>
                            {pkg.status === 'Inactive' ? 'Draft' : 'Active'}
                          </span>
                        </td>
                        <td>
                          <a 
                            href={`/tour-packages/${pkg.slug || pkg.id}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className={`${styles.tableActionBtn} ${styles.actionView}`}
                          >
                            View
                          </a>
                          <button 
                            type="button" 
                            onClick={() => handleEdit(pkg)} 
                            className={`${styles.tableActionBtn} ${styles.actionEdit}`}
                          >
                            Edit
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleDelete(pkg.id || pkg.slug, pkg.title)} 
                            className={`${styles.tableActionBtn} ${styles.actionDelete}`}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}
          </div>

          <div className={styles.tableFooterRow}>
            <span>Showing 1 to {packages.length} of {packages.length} entries</span>
            <div className={styles.paginationWrapper}>
              <button className={styles.paginationBtn}>Previous</button>
              <button className={`${styles.paginationBtn} ${styles.paginationBtnActive}`}>1</button>
              <button className={styles.paginationBtn}>Next</button>
            </div>
          </div>
        </div>
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
              <input 
                required 
                type="text" 
                className={styles.formInput} 
                value={formData.title ?? ''} 
                onChange={e => {
                  const titleVal = e.target.value;
                  const autoSlug = titleVal.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                  setFormData({...formData, title: titleVal, slug: formData.slug && formData.slug !== autoSlug ? formData.slug : autoSlug});
                }} 
              />
            </div>
            <div>
              <label>Slug (URL) <span className="required-star">*</span></label>
              <input required type="text" className={styles.formInput} value={formData.slug ?? ''} onChange={e => setFormData({...formData, slug: e.target.value})} />
            </div>
            <div>
              <label>Destination</label>
              <input type="text" className={styles.formInput} value={formData.destination ?? ''} onChange={e => setFormData({...formData, destination: e.target.value})} />
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
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {formData.image && (
                  <div style={{ position: 'relative', width: '56px', height: '42px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                    <img 
                      src={getImageUrl(formData.image)} 
                      alt="Featured preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                <input 
                  type="text" 
                  className={styles.formInput} 
                  value={formData.image ?? ''} 
                  onChange={e => setFormData({...formData, image: e.target.value})} 
                  placeholder="Image URL (e.g. /storage/uploads/... or https://...)" 
                  style={{ flex: 1, marginBottom: 0 }} 
                />
                {formData.image?.startsWith('data:image/') && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', whiteSpace: 'nowrap', backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}
                    onClick={async () => {
                      setUploadingField('featured');
                      const cleanUrl = await ensureServerImageUrl(formData.image);
                      setFormData((prev: any) => ({ ...prev, image: cleanUrl }));
                      setUploadingField(null);
                    }}
                    title="Convert Base64 to Server URL"
                  >
                    ⚡ Convert to Server URL
                  </button>
                )}
                {formData.image && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
                    onClick={() => setFormData({ ...formData, image: '' })}
                    title="Clear image"
                  >
                    ✕
                  </button>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadingField('featured');
                      try {
                        const res = await uploadImage(file);
                        if (res && res.url) {
                          setFormData((prev: any) => ({ ...prev, image: res.url }));
                        }
                      } catch (uploadErr: any) {
                        console.error('Backend upload failed:', uploadErr);
                        alert(`Upload failed: ${uploadErr?.message || 'Server error'}`);
                      } finally {
                        setUploadingField(null);
                        e.target.value = '';
                      }
                    }
                  }} 
                  style={{ display: 'none' }} 
                  id="featured-image-upload" 
                />
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ whiteSpace: 'nowrap' }}
                  disabled={uploadingField === 'featured'}
                  onClick={() => document.getElementById('featured-image-upload')?.click()}
                >
                  {uploadingField === 'featured' ? 'Uploading...' : 'Upload File'}
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
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Holiday Categories (select all that apply)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.25rem' }}>
                {[
                  'Domestic Tour Packages',
                  'International Tour Packages',
                  'Kerala Tour Packages',
                  'Honeymoon Tour Packages',
                  'Luxury Tour Packages',
                  'Day Excursions',
                  'Family Tour Packages',
                  'Culture'
                ].map(catName => {
                  const isChecked = Array.isArray(formData.holidayCategory) && formData.holidayCategory.includes(catName);
                  return (
                    <label 
                      key={catName} 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.4rem', 
                        padding: '0.45rem 0.85rem', 
                        borderRadius: '6px', 
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        border: isChecked ? '1.5px solid #dc2626' : '1px solid #cbd5e1',
                        background: isChecked ? '#fef2f2' : '#ffffff',
                        color: isChecked ? '#b91c1c' : '#334155',
                        fontWeight: isChecked ? 600 : 500,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          const current = Array.isArray(formData.holidayCategory) ? [...formData.holidayCategory] : [];
                          const updated = e.target.checked 
                            ? Array.from(new Set([...current, catName]))
                            : current.filter(c => c !== catName);
                          setFormData({ ...formData, holidayCategory: updated });
                        }}
                        style={{ margin: 0, width: '16px', height: '16px' }}
                      />
                      <span>{catName}</span>
                    </label>
                  );
                })}
              </div>
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
              <textarea className={styles.formInput} value={formData.description ?? ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Package Summary (Shown on package details page)</label>
              <textarea 
                className={styles.formInput} 
                value={formData.overview?.packageSummary !== undefined ? formData.overview.packageSummary : (formData.overview?.summary || '')} 
                onChange={e => setFormData({...formData, overview: {...(formData.overview || {}), packageSummary: e.target.value}})} 
                rows={3} 
                placeholder="Enter full package summary displayed on the package details page..." 
              />
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
              <div key={`stop-${idx}`} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <input placeholder="Destination" className={styles.formInput} value={stop.destination ?? ''} onChange={e => updateRouteStop(idx, 'destination', e.target.value)} />
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
                    <input className={styles.formInput} value={day.title ?? ''} onChange={e => updateItineraryDay(idx, 'title', e.target.value)} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Day Description / Overview</label>
                    <textarea className={styles.formInput} rows={3} value={day.description ?? ''} onChange={e => updateItineraryDay(idx, 'description', e.target.value)} />
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
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {day.image && (
                          <div style={{ position: 'relative', width: '48px', height: '36px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1', background: '#f8fafc' }}>
                            <img 
                              src={getImageUrl(day.image)} 
                              alt="Day preview" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                              onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                            />
                          </div>
                        )}
                        <input className={styles.formInput} value={day.image || ''} onChange={e => updateItineraryDay(idx, 'image', e.target.value)} placeholder="Image URL (e.g. /storage/uploads/...)" style={{ flex: 1, marginBottom: 0 }} />
                        {day.image?.startsWith('data:image/') && (
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', whiteSpace: 'nowrap', backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}
                            onClick={async () => {
                              setUploadingField(`day-${idx}`);
                              const cleanUrl = await ensureServerImageUrl(day.image);
                              updateItineraryDay(idx, 'image', cleanUrl);
                              setUploadingField(null);
                            }}
                            title="Convert Base64 to Server URL"
                          >
                            ⚡ Convert
                          </button>
                        )}
                        {day.image && (
                          <button 
                            type="button"
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.6rem', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
                            onClick={() => updateItineraryDay(idx, 'image', '')}
                            title="Clear image"
                          >
                            ✕
                          </button>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUploadingField(`day-${idx}`);
                              try {
                                const res = await uploadImage(file);
                                if (res && res.url) {
                                  updateItineraryDay(idx, 'image', res.url);
                                }
                              } catch (uploadErr: any) {
                                console.error('Backend upload failed:', uploadErr);
                                alert(`Upload failed: ${uploadErr?.message || 'Server error'}`);
                              } finally {
                                setUploadingField(null);
                                e.target.value = '';
                              }
                            }
                          }} 
                          style={{ display: 'none' }} 
                          id={`day-image-upload-${idx}`} 
                        />
                        <button 
                          type="button" 
                          className="btn btn-primary"
                          style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }} 
                          disabled={uploadingField === `day-${idx}`}
                          onClick={() => document.getElementById(`day-image-upload-${idx}`)?.click()}
                        >
                          {uploadingField === `day-${idx}` ? 'Uploading...' : 'Upload'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label>Gallery Images <span style={{ fontSize: '0.8rem', color: '#666' }}>(Recommended size: 1200 × 800 px)</span></label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {(day.gallery || []).map((imgUrl: string, imgIdx: number) => (
                          <div key={`day-gallery-${imgIdx}`} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            {imgUrl && (
                              <div style={{ position: 'relative', width: '40px', height: '32px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1', background: '#f8fafc' }}>
                                <img 
                                  src={getImageUrl(imgUrl)} 
                                  alt={`Gallery ${imgIdx + 1}`} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                                />
                              </div>
                            )}
                            <input 
                              className={styles.formInput} 
                              value={imgUrl ?? ''} 
                              placeholder="Image URL (e.g. /storage/uploads/...)"
                              onChange={(e) => {
                                const newGallery = [...(day.gallery || [])];
                                newGallery[imgIdx] = e.target.value;
                                updateItineraryDay(idx, 'gallery', newGallery);
                              }}
                              style={{ flex: 1, marginBottom: 0 }}
                            />
                            {imgUrl?.startsWith('data:image/') && (
                              <button
                                type="button"
                                className="btn btn-secondary"
                                style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem', whiteSpace: 'nowrap', backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }}
                                onClick={async () => {
                                  const cleanUrl = await ensureServerImageUrl(imgUrl);
                                  const newGallery = [...(day.gallery || [])];
                                  newGallery[imgIdx] = cleanUrl;
                                  updateItineraryDay(idx, 'gallery', newGallery);
                                }}
                                title="Convert Base64 to Server URL"
                              >
                                ⚡ Convert
                              </button>
                            )}
                            <button 
                              type="button" 
                              className="btn btn-secondary" 
                              style={{ padding: '0.4rem 0.6rem', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }} 
                              onClick={() => {
                                const newGallery = [...(day.gallery || [])];
                                newGallery.splice(imgIdx, 1);
                                updateItineraryDay(idx, 'gallery', newGallery);
                              }}
                              title="Remove image"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input 
                            type="file" 
                            accept="image/*" 
                            multiple
                            onChange={async (e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length > 0) {
                                setUploadingField(`gallery-${idx}`);
                                const uploadedUrls: string[] = [];
                                for (const file of files) {
                                  try {
                                    const res = await uploadImage(file);
                                    if (res && res.url) {
                                      uploadedUrls.push(res.url);
                                    }
                                  } catch (uploadErr: any) {
                                    console.error('Backend upload failed:', uploadErr);
                                    alert(`Upload failed for ${file.name}: ${uploadErr?.message || 'Server error'}`);
                                  }
                                }
                                if (uploadedUrls.length > 0) {
                                  setFormData((prev: any) => {
                                    const newItin = [...(prev.itinerary || [])];
                                    const currentDay = newItin[idx] || {};
                                    const currentGallery = [...(currentDay.gallery || [])];
                                    newItin[idx] = { ...currentDay, gallery: [...currentGallery, ...uploadedUrls] };
                                    return { ...prev, itinerary: newItin };
                                  });
                                }
                                setUploadingField(null);
                                e.target.value = '';
                              }
                            }} 
                            style={{ display: 'none' }} 
                            id={`day-gallery-upload-${idx}`} 
                          />
                          <button 
                            type="button" 
                            className="btn btn-primary" 
                            style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap', alignSelf: 'flex-start' }} 
                            disabled={uploadingField === `gallery-${idx}`}
                            onClick={() => document.getElementById(`day-gallery-upload-${idx}`)?.click()}
                          >
                            {uploadingField === `gallery-${idx}` ? 'Uploading...' : '+ Add Images'}
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
                <div key={`hl-${idx}`} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input className={styles.formInput} value={h ?? ''} onChange={e => handleArrayChange('highlights', idx, e.target.value)} />
                  <button type="button" onClick={() => removeArrayItem('highlights', idx)}>x</button>
                </div>
              ))}
              <button type="button" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => addArrayItem('highlights')}>+ Add</button>
            </div>
            <div>
              <h5>Inclusions</h5>
              {(formData.inclusions || []).map((h: string, idx: number) => (
                <div key={`inc-${idx}`} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input className={styles.formInput} value={h ?? ''} onChange={e => handleArrayChange('inclusions', idx, e.target.value)} />
                  <button type="button" onClick={() => removeArrayItem('inclusions', idx)}>x</button>
                </div>
              ))}
              <button type="button" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => addArrayItem('inclusions')}>+ Add</button>
            </div>
            <div>
              <h5>Exclusions</h5>
              {(formData.exclusions || []).map((h: string, idx: number) => (
                <div key={`exc-${idx}`} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input className={styles.formInput} value={h ?? ''} onChange={e => handleArrayChange('exclusions', idx, e.target.value)} />
                  <button type="button" onClick={() => removeArrayItem('exclusions', idx)}>x</button>
                </div>
              ))}
              <button type="button" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => addArrayItem('exclusions')}>+ Add</button>
            </div>
          </div>

          {/* Terms & Conditions and Cancellation Policy */}
          <div className={styles.formCard} style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <h4 className={styles.formCardTitle}>📜 Terms & Conditions & Policies</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <h5 style={{ marginBottom: '0.75rem', fontWeight: 600, color: '#1e293b' }}>Terms & Conditions</h5>
                {((formData.termsAndConditions && formData.termsAndConditions.length > 0) ? formData.termsAndConditions : ['']).map((term: string, idx: number) => (
                  <div key={`tc-${idx}`} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input 
                      className={styles.formInput} 
                      value={term ?? ''} 
                      placeholder="e.g. Booking amount is non-refundable upon confirmation."
                      onChange={e => handleArrayChange('termsAndConditions', idx, e.target.value)} 
                    />
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      style={{ padding: '0.3rem 0.6rem', backgroundColor: '#e11d48', borderColor: '#e11d48' }}
                      onClick={() => removeArrayItem('termsAndConditions', idx)}
                    >
                      x
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', marginTop: '0.25rem' }} 
                  onClick={() => addArrayItem('termsAndConditions')}
                >
                  + Add Term
                </button>
              </div>

              <div>
                <h5 style={{ marginBottom: '0.75rem', fontWeight: 600, color: '#1e293b' }}>Cancellation Policy</h5>
                {((formData.cancellationPolicy && formData.cancellationPolicy.length > 0) ? formData.cancellationPolicy : ['']).map((policy: string, idx: number) => (
                  <div key={`cp-${idx}`} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input 
                      className={styles.formInput} 
                      value={policy ?? ''} 
                      placeholder="e.g. 100% refund if cancelled 30 days prior to departure."
                      onChange={e => handleArrayChange('cancellationPolicy', idx, e.target.value)} 
                    />
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      style={{ padding: '0.3rem 0.6rem', backgroundColor: '#e11d48', borderColor: '#e11d48' }}
                      onClick={() => removeArrayItem('cancellationPolicy', idx)}
                    >
                      x
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', marginTop: '0.25rem' }} 
                  onClick={() => addArrayItem('cancellationPolicy')}
                >
                  + Add Policy
                </button>
              </div>
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
