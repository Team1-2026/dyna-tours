import React, { useState, useEffect } from 'react';
import { groupToursApi, GroupTour, getImageUrl } from '@/lib/api';
import styles from './admin.module.css';
import RichTextEditor from '@/components/RichTextEditor';

export default function GroupToursAdmin() {
  const [tours, setTours] = useState<GroupTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTour, setEditingTour] = useState<GroupTour | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [relatedSearch, setRelatedSearch] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadTours();
    const onAddNew = () => {
      handleAddNew();
    };
    const onViewAll = () => {
      setEditingTour(null);
    };
    window.addEventListener('admin:add-new-group-tour', onAddNew);
    window.addEventListener('admin:view-group-tours', onViewAll);
    return () => {
      window.removeEventListener('admin:add-new-group-tour', onAddNew);
      window.removeEventListener('admin:view-group-tours', onViewAll);
    };
  }, []);

  const loadTours = async () => {
    setLoading(true);
    try {
      const data = await groupToursApi.getTours();
      setTours(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setIsCreating(true);
    setEditingTour({
      name: '',
      destination: '',
      type: 'international',
      duration: '',
      starting_price: 0,
      status: 'Available',
      is_visible: true,
      is_featured: false,
      featured_order: 0,
      banner_image: '',
      banner_title: '',
      banner_tagline: '',
      gallery: [],
    } as GroupTour);
  };

  const handleEdit = (tour: GroupTour) => {
    setIsCreating(false);
    setEditingTour({
      ...tour,
      gallery: Array.isArray(tour.gallery) ? tour.gallery : [],
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this group tour?')) return;
    try {
      await groupToursApi.deleteTour(id);
      loadTours();
    } catch (err) {
      console.error(err);
      alert('Failed to delete tour');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour) return;
    setSaveStatus('Saving...');
    try {
      const rawPrice = String(editingTour.starting_price ?? '').trim();
      const rawOrder = String(editingTour.featured_order ?? '').trim();
      const payload = {
        ...editingTour,
        starting_price: rawPrice !== '' ? Number(rawPrice) : 0,
        featured_order: rawOrder !== '' ? Number(rawOrder) : 0,
        gallery: Array.isArray(editingTour.gallery) ? editingTour.gallery : [],
      };

      if (isCreating) {
        await groupToursApi.createTour(payload);
      } else if (editingTour.id) {
        await groupToursApi.updateTour(editingTour.id, payload);
      }
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
      setEditingTour(null);
      loadTours();
    } catch (err: any) {
      console.error(err);
      setSaveStatus(`❌ ${err?.message || 'Error saving tour'}`);
      setTimeout(() => setSaveStatus(null), 6000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (!editingTour) return;
    
    let parsedValue: any = value;
    if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    }
    
    setEditingTour({ ...editingTour, [name]: parsedValue });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingTour) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditingTour({ ...editingTour, image: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingTour) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditingTour({ ...editingTour, banner_image: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingTour) return;
    
    const newImages: string[] = [];
    let readCount = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
        }
        readCount++;
        if (readCount === files.length) {
          setEditingTour((prev) => prev ? ({
            ...prev,
            gallery: [...(Array.isArray(prev.gallery) ? prev.gallery : []), ...newImages]
          }) : null);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    if (!editingTour) return;
    const currentGallery = Array.isArray(editingTour.gallery) ? editingTour.gallery : [];
    setEditingTour({
      ...editingTour,
      gallery: currentGallery.filter((_, idx) => idx !== idxToRemove)
    });
  };

  if (loading && tours.length === 0) return <div>Loading Group Tours...</div>;

  return (
    <div style={{ padding: '20px' }}>
      {saveStatus && <div style={{ background: '#e6ffe6', padding: '10px', marginBottom: '20px', borderRadius: '4px', color: '#006600' }}>{saveStatus}</div>}

      {editingTour ? (
        <form onSubmit={handleSave} style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>{isCreating ? 'Create New Tour' : 'Edit Tour'}</h3>
            <button type="button" onClick={() => setEditingTour(null)} style={{ background: '#ccc', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tour Name <span className="required-star">*</span></label>
              <input type="text" name="name" value={editingTour.name || ''} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Destination <span className="required-star">*</span></label>
              <input type="text" name="destination" value={editingTour.destination || ''} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type <span className="required-star">*</span></label>
              <select name="type" value={editingTour.type} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="domestic">Domestic</option>
                <option value="international">International</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Duration <span className="required-star">*</span></label>
              <input type="text" name="duration" placeholder="e.g. 5 Days / 4 Nights" value={editingTour.duration || ''} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Starting Price <span className="required-star">*</span></label>
              <input type="text" name="starting_price" value={editingTour.starting_price ?? ''} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Departure Date</label>
              <input type="date" name="departure_date" value={editingTour.departure_date ? editingTour.departure_date.split('T')[0] : ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status <span className="required-star">*</span></label>
              <select name="status" value={editingTour.status} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="Available">Available</option>
                <option value="Filling Fast">Filling Fast</option>
                <option value="Limited Seats">Limited Seats</option>
                <option value="Sold Out">Sold Out</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Featured Order (Lower is first)</label>
              <input type="number" name="featured_order" value={editingTour.featured_order || 0} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0C2745' }}>👁️ Visibility & Home Page Controls</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1.1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, color: '#15803d', margin: 0 }}>
                  <input 
                    type="checkbox" 
                    name="is_visible" 
                    checked={editingTour.is_visible} 
                    onChange={handleChange} 
                    style={{ width: '18px', height: '18px', margin: 0, flexShrink: 0 }}
                  />
                  <span>Enable / Show on Site</span>
                </label>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1.1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, color: '#15803d', margin: 0 }}>
                  <input 
                    type="checkbox" 
                    name="is_featured" 
                    checked={editingTour.is_featured} 
                    onChange={handleChange} 
                    style={{ width: '18px', height: '18px', margin: 0, flexShrink: 0 }}
                  />
                  <span>Show on Home Page (Featured Group Tour)</span>
                </label>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Thumbnail Image <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'normal' }}>(Recommended size: 800 × 600 px)</span></label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'block', marginBottom: '10px' }} />
            {editingTour.image && <img src={getImageUrl(editingTour.image)} alt="Thumbnail" style={{ height: '100px', borderRadius: '4px', objectFit: 'cover' }} />}
          </div>

          {/* Hero Banner Section */}
          <div className={styles.formCard} style={{ marginTop: '20px' }}>
            <h4 className={styles.formCardTitle}>🚩 Hero Banner & Header Content</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Banner Title / Heading</label>
                <input 
                  type="text" 
                  name="banner_title" 
                  value={editingTour.banner_title || ''} 
                  onChange={handleChange} 
                  placeholder="e.g. Panoramic Europe – Alpine Grandeur & Cultural Treasures" 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Banner Tagline / Subtitle</label>
                <input 
                  type="text" 
                  name="banner_tagline" 
                  value={editingTour.banner_tagline || ''} 
                  onChange={handleChange} 
                  placeholder="e.g. Discover the Best of Europe in One Unforgettable Journey" 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Banner Background Image <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'normal' }}>(Recommended size: 1920 × 600 px)</span>
              </label>
              <input type="file" accept="image/*" onChange={handleBannerUpload} style={{ display: 'block', marginBottom: '10px' }} />
              {editingTour.banner_image && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={getImageUrl(editingTour.banner_image)} alt="Banner Preview" style={{ height: '120px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                  <button 
                    type="button" 
                    onClick={() => setEditingTour({ ...editingTour, banner_image: '' })}
                    style={{ position: 'absolute', top: '5px', right: '5px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Gallery Images Upload Section */}
          <div className={styles.formCard} style={{ marginTop: '20px' }}>
            <h4 className={styles.formCardTitle}>🖼️ Photo Gallery Images</h4>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Upload Gallery Images <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'normal' }}>(Select multiple images to show in tour gallery)</span>
              </label>
              <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: 'block', marginBottom: '15px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
              {(Array.isArray(editingTour.gallery) ? editingTour.gallery : []).map((imgUrl, idx) => (
                <div key={idx} style={{ position: 'relative', width: '100%', height: '90px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                  <img src={getImageUrl(imgUrl)} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveGalleryImage(idx)}
                    style={{ position: 'absolute', top: '4px', right: '4px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Related Group Tours Mapping */}
          <div className={styles.formCard} style={{ marginTop: '20px' }}>
            <h4 className={styles.formCardTitle}>Related Group Tours Mapping</h4>
            <input
              type="text"
              placeholder="Search group tours by name or destination..."
              className={styles.searchBar}
              value={relatedSearch}
              onChange={(e) => setRelatedSearch(e.target.value)}
            />
            <div className={styles.checklistGrid}>
              {tours
                .filter(t => t.id !== editingTour.id)
                .filter(t => !relatedSearch || t.name?.toLowerCase().includes(relatedSearch.toLowerCase()) || t.destination?.toLowerCase().includes(relatedSearch.toLowerCase()))
                .map(t => {
                  const currentRelated = (editingTour.related_tours || []).map(String);
                  const isChecked = currentRelated.includes(String(t.id));
                  return (
                    <label key={t.id} className={styles.checklistItem}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => {
                          const tIdStr = String(t.id);
                          const updated = e.target.checked
                            ? [...currentRelated, t.id || tIdStr]
                            : currentRelated.filter((id: string) => id !== String(t.id));
                          setEditingTour(prev => prev ? ({ ...prev, related_tours: updated }) : null);
                        }}
                      />
                      <span>{t.name}</span>
                    </label>
                  );
                })}
            </div>
          </div>

          <div className={styles.formCard} style={{ marginTop: '20px' }}>
            <h4 className={styles.formCardTitle}>🔍 SEO & Social Metadata</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Meta Title</label>
                <input type="text" name="meta_title" value={editingTour.meta_title || ''} onChange={handleChange} placeholder="Tour Meta Title" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>URL Slug</label>
                <input type="text" name="url_slug" value={editingTour.url_slug || ''} onChange={handleChange} placeholder="tour-url-slug" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Meta Description</label>
              <textarea name="meta_description" rows={2} value={editingTour.meta_description || ''} onChange={handleChange} placeholder="Tour Meta Description" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Canonical URL</label>
              <input type="text" name="canonical_url" value={editingTour.canonical_url || ''} onChange={handleChange} placeholder="https://dynatours.in/group-tours/tour-slug" style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          </div>

          <button type="submit" className={styles.saveBtn} style={{ marginTop: '20px' }}>
            {isCreating ? 'Save Tour' : 'Update Tour'}
          </button>
        </form>
      ) : (
        <div className={styles.panelCard}>
          {/* Row 1: Title and Add Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className={styles.panelTitle} style={{ margin: 0 }}>Group Tours Management</h3>
            <button className="btn btn-primary" onClick={handleAddNew}>
              + Add Group Tour
            </button>
          </div>

          {/* Row 2: Search and Filter Fields aligned in a single row */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'nowrap', width: '100%' }}>
            <div className={styles.searchWrapper} style={{ flex: 2, minWidth: '220px' }}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search group tour..."
                className={styles.toolbarSearchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              className={`searchSelect ${styles.toolbarSelect}`}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ flex: 1, minWidth: '140px' }}
            >
              <option value="">All Types</option>
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
            </select>

            <select 
              className={`searchSelect ${styles.toolbarSelect}`}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ flex: 1, minWidth: '140px' }}
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Filling Fast">Filling Fast</option>
              <option value="Limited Seats">Limited Seats</option>
              <option value="Sold Out">Sold Out</option>
            </select>

            <button type="button" className={styles.filterBtn} style={{ whiteSpace: 'nowrap' }}>
              <span>🎛️</span> Filter
            </button>
          </div>

          <div className={styles.tableContainer}>
            {(() => {
              const filteredTours = tours.filter((t) => {
                const matchSearch = (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    (t.destination || '').toLowerCase().includes(searchQuery.toLowerCase());
                const matchType = !typeFilter || t.type === typeFilter;
                const matchStatus = !statusFilter || t.status === statusFilter;
                return matchSearch && matchType && matchStatus;
              });

              if (filteredTours.length === 0) {
                return (
                  <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                    No group tours found. Click "+ Add Group Tour" to add one.
                  </div>
                );
              }

              return (
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Sl No</th>
                      <th>Group Tour Name</th>
                      <th>Destination</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTours.map((tour, idx) => (
                      <tr key={tour.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {tour.image ? (
                              <img src={getImageUrl(tour.image)} alt={tour.name} style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                            ) : null}
                            <span style={{ fontWeight: 700, color: 'var(--color-secondary-navy)' }}>{tour.name}</span>
                          </div>
                        </td>
                        <td>📍 {tour.destination}</td>
                        <td style={{ fontWeight: 700, color: 'var(--color-primary-red)' }}>₹{Number(tour.starting_price).toLocaleString('en-IN')}</td>
                        <td>
                          <span className={`${styles.statusPill} ${tour.status === 'Available' ? styles.statusActive : styles.statusDraft}`}>
                            {tour.status}
                          </span>
                        </td>
                        <td>{tour.is_featured ? '⭐ Yes' : 'No'}</td>
                        <td>
                          <a 
                            href={`/group-tours/${tour.url_slug || tour.id}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className={`${styles.tableActionBtn} ${styles.actionView}`}
                          >
                            View
                          </a>
                          <button 
                            type="button" 
                            onClick={() => handleEdit(tour)} 
                            className={`${styles.tableActionBtn} ${styles.actionEdit}`}
                          >
                            Edit
                          </button>
                          <button 
                            type="button" 
                            onClick={() => tour.id && handleDelete(tour.id)} 
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
            <span>Showing 1 to {tours.length} of {tours.length} entries</span>
            <div className={styles.paginationWrapper}>
              <button className={styles.paginationBtn}>Previous</button>
              <button className={`${styles.paginationBtn} ${styles.paginationBtnActive}`}>1</button>
              <button className={styles.paginationBtn}>Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
