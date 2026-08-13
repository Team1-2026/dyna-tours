import React, { useState, useEffect } from 'react';
import { groupToursApi, GroupTour, GroupTourDetails, getImageUrl } from '@/lib/api';
import styles from './admin.module.css';
import RichTextEditor from '@/components/RichTextEditor';

const parseDetails = (tour: GroupTour | null): GroupTourDetails => {
  if (!tour || !tour.full_details) return {};
  if (typeof tour.full_details === 'object') return tour.full_details as GroupTourDetails;
  try {
    return JSON.parse(tour.full_details);
  } catch (e) {
    return {};
  }
};

export default function GroupToursAdmin() {
  const [tours, setTours] = useState<GroupTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTour, setEditingTour] = useState<GroupTour | null>(null);
  const [details, setDetails] = useState<GroupTourDetails>({});
  const [isCreating, setIsCreating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [relatedSearch, setRelatedSearch] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customServiceInput, setCustomServiceInput] = useState('');

  const DEFAULT_AVAILABLE_SERVICES = [
    'Breakfast Included',
    'Hotel Stay',
    'Transportation',
    'Sightseeing',
    'Tour Assistance 24x7',
    'Visa Assistance',
    'Flight Included',
    'Entry Tickets & Passes',
    'Professional Tour Manager',
    'Travel Insurance',
    'Daily Meals (Lunch & Dinner)',
    'Boat / Cruise Rides',
    'Train Transfers',
  ];

  const clearFormState = () => {
    setEditingTour(null);
    setIsCreating(false);
    setDetails({});
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('group_tour_is_creating');
      sessionStorage.removeItem('group_tour_editing_id');
      sessionStorage.removeItem('group_tour_draft_editing_tour');
      sessionStorage.removeItem('group_tour_draft_details');
      if (window.location.hash) {
        try {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (e) {
          window.location.hash = '';
        }
      }
    }
  };

  useEffect(() => {
    loadTours();
    const onAddNew = () => {
      handleAddNew();
    };
    const onViewAll = () => {
      clearFormState();
    };
    window.addEventListener('admin:add-new-group-tour', onAddNew);
    window.addEventListener('admin:view-group-tours', onViewAll);
    return () => {
      window.removeEventListener('admin:add-new-group-tour', onAddNew);
      window.removeEventListener('admin:view-group-tours', onViewAll);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && editingTour) {
      sessionStorage.setItem('group_tour_draft_editing_tour', JSON.stringify(editingTour));
      sessionStorage.setItem('group_tour_draft_details', JSON.stringify(details));
    }
  }, [editingTour, details]);

  const loadTours = async () => {
    setLoading(true);
    try {
      const data = await groupToursApi.getTours();
      setTours(data);

      if (typeof window !== 'undefined') {
        const isCreatingSaved = sessionStorage.getItem('group_tour_is_creating') === 'true' || window.location.hash === '#add-group-tour';
        const editingIdSaved = sessionStorage.getItem('group_tour_editing_id') || (window.location.hash.startsWith('#edit-group-tour-') ? window.location.hash.replace('#edit-group-tour-', '') : null);
        const savedDraftTour = sessionStorage.getItem('group_tour_draft_editing_tour');
        const savedDraftDetails = sessionStorage.getItem('group_tour_draft_details');

        if (isCreatingSaved) {
          setIsCreating(true);
          if (savedDraftTour) {
            try { setEditingTour(JSON.parse(savedDraftTour)); } catch(e) { handleAddNew(); }
          } else {
            handleAddNew();
          }
          if (savedDraftDetails) {
            try { setDetails(JSON.parse(savedDraftDetails)); } catch(e) {}
          }
        } else if (editingIdSaved) {
          const found = data.find(t => String(t.id) === String(editingIdSaved));
          if (found) {
            setIsCreating(false);
            if (savedDraftTour) {
              try { setEditingTour(JSON.parse(savedDraftTour)); } catch(e) { handleEdit(found); }
            } else {
              handleEdit(found);
            }
            if (savedDraftDetails) {
              try { setDetails(JSON.parse(savedDraftDetails)); } catch(e) {}
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setIsCreating(true);
    const initialDetails: GroupTourDetails = {
      quick_info: {
        trip_from: 'Kochi (COK)',
        trip_to: '',
        group_size: '20–30 Travellers',
        accommodation_type: 'Deluxe / Premium Hotels',
        transportation_type: 'A/C Coach / Private Vehicle',
      },
      overview: '',
      features: [
        'Breakfast Included',
        'Hotel Stay',
        'Transportation',
        'Sightseeing',
        'Tour Assistance 24x7',
        'Visa Assistance',
        'Flight Included'
      ],
      highlights: [],
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Tour Commencement',
          desc: 'Arrive at destination, meet your tour representative, transfer to hotel and check-in.',
          places: [],
          highlights: ['Meet & Greet', 'Hotel Check-in'],
          meals: 'Dinner',
          overnight: ''
        }
      ],
      flight_details: {
        onward: { from: '', to: '', departure_date: '', departure_time: '', arrival_date: '', arrival_time: '', duration: '' },
        return: { from: '', to: '', departure_date: '', departure_time: '', arrival_date: '', arrival_time: '', duration: '' }
      },
      hotels: [],
      inclusions: [
        'Hotel Accommodation',
        'Daily Breakfast & Specified Meals',
        'Sightseeing & Transfers as per itinerary',
        'Professional Tour Manager / Guide Assistance',
        'All Applicable Driver Allowances & Tolls'
      ],
      exclusions: [
        'Personal Expenses (Laundry, Telephone, Minibar)',
        'Optional Tours & Entrance Fees Not Mentioned',
        'Tips & Gratuities',
        'GST / TCS as per government regulations'
      ],
      terms_and_conditions: [
        'Advance booking amount is non-refundable upon confirmation.',
        'Full balance payment must be cleared prior to departure.',
        'Itinerary is subject to change due to weather or operational conditions.'
      ],
      need_to_know: [
        {
          title: '📌 Reporting & Check-in',
          rules: [
            'Standard hotel check-in time: 02:00 PM. Check-out time: 11:00 AM.',
            'Report at airport 3 hours prior to departure.'
          ]
        }
      ]
    };
    setDetails(initialDetails);
    const maxOrder = tours.length > 0 ? Math.max(...tours.map(t => Number(t.featured_order || 0))) : 0;
    const newTour: GroupTour = {
      name: '',
      destination: '',
      type: 'international',
      duration: '',
      starting_price: 0,
      status: 'Available',
      is_visible: true,
      is_featured: false,
      featured_order: maxOrder + 1,
      banner_image: '',
      banner_title: '',
      banner_tagline: '',
      gallery: [],
    } as GroupTour;

    setEditingTour(newTour);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('group_tour_is_creating', 'true');
      sessionStorage.removeItem('group_tour_editing_id');
      sessionStorage.setItem('group_tour_draft_editing_tour', JSON.stringify(newTour));
      sessionStorage.setItem('group_tour_draft_details', JSON.stringify(initialDetails));
      window.location.hash = 'add-group-tour';
    }
  };

  const handleEdit = (tour: GroupTour) => {
    setIsCreating(false);
    const parsedDet = parseDetails(tour);
    const editTourObj = {
      ...tour,
      gallery: Array.isArray(tour.gallery) ? tour.gallery : [],
    };
    setDetails(parsedDet);
    setEditingTour(editTourObj);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('group_tour_editing_id', String(tour.id));
      sessionStorage.removeItem('group_tour_is_creating');
      sessionStorage.setItem('group_tour_draft_editing_tour', JSON.stringify(editTourObj));
      sessionStorage.setItem('group_tour_draft_details', JSON.stringify(parsedDet));
      window.location.hash = `edit-group-tour-${tour.id}`;
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this group tour?')) return;
    try {
      await groupToursApi.deleteTour(id);
      clearFormState();
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
        full_details: JSON.stringify(details),
      };

      if (isCreating) {
        await groupToursApi.createTour(payload);
      } else if (editingTour.id) {
        await groupToursApi.updateTour(editingTour.id, payload);
      }
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
      clearFormState();
      loadTours();
    } catch (err: any) {
      console.error(err);
      setSaveStatus(`❌ ${err?.message || 'Error saving tour'}`);
      setTimeout(() => setSaveStatus(null), 6000);
    }
  };

  const updateQuickInfo = (field: string, value: string) => {
    setDetails(prev => ({
      ...prev,
      quick_info: {
        ...(prev.quick_info || {}),
        [field]: value,
      }
    }));
  };

  const updateFlightInfo = (leg: 'onward' | 'return', field: string, value: string) => {
    setDetails(prev => ({
      ...prev,
      flight_details: {
        ...(prev.flight_details || {}),
        [leg]: {
          ...(prev.flight_details?.[leg] || {}),
          [field]: value,
        }
      }
    }));
  };

  const handleOrderChange = async (tour: GroupTour, newOrder: number) => {
    if (!tour.id) return;
    try {
      await groupToursApi.updateTour(tour.id, { ...tour, featured_order: newOrder });
      setTours(prev => prev.map(t => t.id === tour.id ? { ...t, featured_order: newOrder } : t));
    } catch (err) {
      console.error('Failed to update featured order', err);
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
            <button type="button" onClick={() => clearFormState()} style={{ background: '#ccc', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
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
              <input 
                type="number" 
                name="featured_order" 
                value={editingTour.featured_order !== undefined && editingTour.featured_order !== null ? editingTour.featured_order : ''} 
                onChange={handleChange} 
                min={0} 
                placeholder="e.g. 1" 
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
              />
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


          {/* Section 1: Tour Overview */}
          <div className={styles.formCard} style={{ marginTop: '20px' }}>
            <h4 className={styles.formCardTitle}>📝 Tour Overview</h4>
            <textarea 
              rows={4} 
              value={details.overview || ''} 
              onChange={e => setDetails(prev => ({ ...prev, overview: e.target.value }))} 
              placeholder="Detailed tour narrative and overview..." 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }} 
            />
          </div>

          {/* Section 2: Included Services */}
          <div className={styles.formCard} style={{ marginTop: '20px' }}>
            <h4 className={styles.formCardTitle}>🛡️ Included Services (Checklist Mapping)</h4>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', color: '#64748b' }}>
              Select the included services for this group tour package (checked items will be displayed on the website):
            </label>

            {(() => {
              const selectedFeatures = Array.isArray(details.features) ? details.features.filter(Boolean) : [];
              const combinedServices = Array.from(new Set([...DEFAULT_AVAILABLE_SERVICES, ...selectedFeatures]));

              const handleToggleService = (service: string, isChecked: boolean) => {
                const updated = isChecked
                  ? [...selectedFeatures, service]
                  : selectedFeatures.filter(s => s !== service);
                setDetails(prev => ({ ...prev, features: updated }));
              };

              const handleAddCustomService = () => {
                const trimmed = customServiceInput.trim();
                if (!trimmed) return;
                if (!selectedFeatures.includes(trimmed)) {
                  setDetails(prev => ({ ...prev, features: [...selectedFeatures, trimmed] }));
                }
                setCustomServiceInput('');
              };

              return (
                <>
                  <div className={styles.checklistGrid}>
                    {combinedServices.map((service) => {
                      const checked = selectedFeatures.includes(service);
                      return (
                        <label key={service} className={styles.checklistItem}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => handleToggleService(service, e.target.checked)}
                          />
                          <span>{service}</span>
                        </label>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Add custom service (e.g. 🍷 Welcome Drink, 🕌 Temple Pass)..."
                      value={customServiceInput}
                      onChange={(e) => setCustomServiceInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomService();
                        }
                      }}
                      style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.9rem' }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddCustomService}
                      style={{ padding: '8px 16px', whiteSpace: 'nowrap', fontSize: '0.9rem' }}
                    >
                      + Add Custom Service
                    </button>
                  </div>
                </>
              );
            })()}
          </div>

          {/* Section 3: Key Highlights */}
          <div className={styles.formCard} style={{ marginTop: '20px' }}>
            <h4 className={styles.formCardTitle}>⭐ Key Highlights</h4>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: '#64748b' }}>Enter each key highlight on a new line</label>
            <textarea 
              rows={6} 
              value={Array.isArray(details.highlights) ? details.highlights.join('\n') : ''} 
              onChange={e => {
                const lines = e.target.value.split('\n');
                setDetails(prev => ({ ...prev, highlights: lines }));
              }} 
              placeholder="e.g. Visit the Eiffel Tower (2nd Level)&#10;Seine River Cruise&#10;Mt. Titlis Cable Car" 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }} 
            />
          </div>

          {/* Section 4: Quick Tour Info */}
          <div className={styles.formCard} style={{ marginTop: '20px' }}>
            <h4 className={styles.formCardTitle}>⚡ Quick Tour Info</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Trip From</label>
                <input 
                  type="text" 
                  value={details.quick_info?.trip_from || ''} 
                  onChange={e => updateQuickInfo('trip_from', e.target.value)} 
                  placeholder="e.g. Kochi (COK)" 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Trip To</label>
                <input 
                  type="text" 
                  value={details.quick_info?.trip_to || ''} 
                  onChange={e => updateQuickInfo('trip_to', e.target.value)} 
                  placeholder="e.g. France • Switzerland • Italy" 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Group Size</label>
                <input 
                  type="text" 
                  value={details.quick_info?.group_size || ''} 
                  onChange={e => updateQuickInfo('group_size', e.target.value)} 
                  placeholder="e.g. 20–30 Travellers" 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Accommodation Category</label>
                <input 
                  type="text" 
                  value={details.quick_info?.accommodation_type || ''} 
                  onChange={e => updateQuickInfo('accommodation_type', e.target.value)} 
                  placeholder="e.g. Premium 4★ Hotels" 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Transportation Type</label>
                <input 
                  type="text" 
                  value={details.quick_info?.transportation_type || ''} 
                  onChange={e => updateQuickInfo('transportation_type', e.target.value)} 
                  placeholder="e.g. Luxury Private A/C Coach" 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} 
                />
              </div>
            </div>
          </div>

          {/* Section 5: Day-wise Itinerary Builder */}
          <div className={styles.formCard} style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 className={styles.formCardTitle} style={{ margin: 0 }}>📅 Day-wise Itinerary Builder</h4>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => {
                  const currentItin = details.itinerary || [];
                  setDetails(prev => ({
                    ...prev,
                    itinerary: [
                      ...currentItin,
                      {
                        day: currentItin.length + 1,
                        title: '',
                        desc: '',
                        places: [],
                        highlights: [],
                        meals: 'Breakfast & Dinner',
                        overnight: ''
                      }
                    ]
                  }));
                }}
                style={{ padding: '6px 12px', fontSize: '0.875rem' }}
              >
                + Add Day
              </button>
            </div>

            {(details.itinerary || []).map((day, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 800, color: '#0c2745' }}>Day {idx + 1}</span>
                  <div>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (idx === 0) return;
                        const current = [...(details.itinerary || [])];
                        const temp = current[idx];
                        current[idx] = current[idx - 1];
                        current[idx - 1] = temp;
                        current.forEach((d, i) => d.day = i + 1);
                        setDetails(prev => ({ ...prev, itinerary: current }));
                      }}
                      disabled={idx === 0}
                      style={{ marginRight: '6px', padding: '2px 8px', cursor: 'pointer' }}
                    >
                      ↑
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const current = [...(details.itinerary || [])];
                        if (idx === current.length - 1) return;
                        const temp = current[idx];
                        current[idx] = current[idx + 1];
                        current[idx + 1] = temp;
                        current.forEach((d, i) => d.day = i + 1);
                        setDetails(prev => ({ ...prev, itinerary: current }));
                      }}
                      disabled={idx === (details.itinerary || []).length - 1}
                      style={{ marginRight: '10px', padding: '2px 8px', cursor: 'pointer' }}
                    >
                      ↓
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const current = (details.itinerary || []).filter((_, i) => i !== idx);
                        current.forEach((d, i) => d.day = i + 1);
                        setDetails(prev => ({ ...prev, itinerary: current }));
                      }}
                      style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Delete Day
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Day Title (e.g. Arrival in Paris)" 
                    value={day.title} 
                    onChange={e => {
                      const current = [...(details.itinerary || [])];
                      current[idx].title = e.target.value;
                      setDetails(prev => ({ ...prev, itinerary: current }));
                    }}
                    style={{ width: '100%', padding: '6px 10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Overnight Stay (e.g. Paris)" 
                    value={day.overnight || ''} 
                    onChange={e => {
                      const current = [...(details.itinerary || [])];
                      current[idx].overnight = e.target.value;
                      setDetails(prev => ({ ...prev, itinerary: current }));
                    }}
                    style={{ width: '100%', padding: '6px 10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>

                <textarea 
                  rows={2} 
                  placeholder="Day Description..." 
                  value={day.desc} 
                  onChange={e => {
                    const current = [...(details.itinerary || [])];
                    current[idx].desc = e.target.value;
                    setDetails(prev => ({ ...prev, itinerary: current }));
                  }}
                  style={{ width: '100%', padding: '6px 10px', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px', resize: 'vertical' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Places Covered (comma-separated)" 
                    value={Array.isArray(day.places) ? day.places.join(', ') : ''} 
                    onChange={e => {
                      const current = [...(details.itinerary || [])];
                      current[idx].places = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setDetails(prev => ({ ...prev, itinerary: current }));
                    }}
                    style={{ width: '100%', padding: '6px 10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Meals (e.g. Breakfast & Dinner)" 
                    value={day.meals || ''} 
                    onChange={e => {
                      const current = [...(details.itinerary || [])];
                      current[idx].meals = e.target.value;
                      setDetails(prev => ({ ...prev, itinerary: current }));
                    }}
                    style={{ width: '100%', padding: '6px 10px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Section 6: Flight Details */}
          <div className={styles.formCard} style={{ marginTop: '20px' }}>
            <h4 className={styles.formCardTitle}>✈️ Flight Details</h4>
            
            <div style={{ marginBottom: '15px', padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#0c2745' }}>🛫 Onward Flight</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <input type="text" placeholder="From (e.g. Kochi COK)" value={details.flight_details?.onward?.from || ''} onChange={e => updateFlightInfo('onward', 'from', e.target.value)} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                <input type="text" placeholder="To (e.g. Paris CDG)" value={details.flight_details?.onward?.to || ''} onChange={e => updateFlightInfo('onward', 'to', e.target.value)} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                <input type="text" placeholder="Duration (e.g. 12h 45m)" value={details.flight_details?.onward?.duration || ''} onChange={e => updateFlightInfo('onward', 'duration', e.target.value)} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="text" placeholder="Departure Date/Time (e.g. 15 Sep 2026, 09:30 PM)" value={details.flight_details?.onward?.departure_date || ''} onChange={e => updateFlightInfo('onward', 'departure_date', e.target.value)} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                <input type="text" placeholder="Arrival Date/Time (e.g. 16 Sep 2026, 08:15 AM)" value={details.flight_details?.onward?.arrival_date || ''} onChange={e => updateFlightInfo('onward', 'arrival_date', e.target.value)} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#0c2745' }}>🛬 Return Flight</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <input type="text" placeholder="From (e.g. Paris CDG)" value={details.flight_details?.return?.from || ''} onChange={e => updateFlightInfo('return', 'from', e.target.value)} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                <input type="text" placeholder="To (e.g. Kochi COK)" value={details.flight_details?.return?.to || ''} onChange={e => updateFlightInfo('return', 'to', e.target.value)} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                <input type="text" placeholder="Duration (e.g. 11h 55m)" value={details.flight_details?.return?.duration || ''} onChange={e => updateFlightInfo('return', 'duration', e.target.value)} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="text" placeholder="Departure Date/Time (e.g. 22 Sep 2026, 09:45 PM)" value={details.flight_details?.return?.departure_date || ''} onChange={e => updateFlightInfo('return', 'departure_date', e.target.value)} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                <input type="text" placeholder="Arrival Date/Time (e.g. 23 Sep 2026, 01:55 PM)" value={details.flight_details?.return?.arrival_date || ''} onChange={e => updateFlightInfo('return', 'arrival_date', e.target.value)} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
            </div>
          </div>

          {/* Section 7: Accommodation Details */}
          <div className={styles.formCard} style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 className={styles.formCardTitle} style={{ margin: 0 }}>🏨 Accommodation Details (Hotels Table)</h4>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => {
                  const current = details.hotels || [];
                  setDetails(prev => ({
                    ...prev,
                    hotels: [...current, { city: '', hotel_name: '', rating: '★★★★', check_in: '', check_out: '' }]
                  }));
                }}
                style={{ padding: '6px 12px', fontSize: '0.875rem' }}
              >
                + Add Hotel Row
              </button>
            </div>

            {(details.hotels || []).map((hotel, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 0.8fr 1fr 1fr auto', gap: '8px', alignItems: 'center', marginBottom: '10px', background: '#f8fafc', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <input type="text" placeholder="City" value={hotel.city} onChange={e => {
                  const current = [...(details.hotels || [])];
                  current[idx].city = e.target.value;
                  setDetails(prev => ({ ...prev, hotels: current }));
                }} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                
                <input type="text" placeholder="Hotel Name" value={hotel.hotel_name} onChange={e => {
                  const current = [...(details.hotels || [])];
                  current[idx].hotel_name = e.target.value;
                  setDetails(prev => ({ ...prev, hotels: current }));
                }} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                
                <input type="text" placeholder="Rating (e.g. ★★★★)" value={hotel.rating} onChange={e => {
                  const current = [...(details.hotels || [])];
                  current[idx].rating = e.target.value;
                  setDetails(prev => ({ ...prev, hotels: current }));
                }} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                
                <input type="text" placeholder="Check-in Date" value={hotel.check_in} onChange={e => {
                  const current = [...(details.hotels || [])];
                  current[idx].check_in = e.target.value;
                  setDetails(prev => ({ ...prev, hotels: current }));
                }} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />
                
                <input type="text" placeholder="Check-out Date" value={hotel.check_out} onChange={e => {
                  const current = [...(details.hotels || [])];
                  current[idx].check_out = e.target.value;
                  setDetails(prev => ({ ...prev, hotels: current }));
                }} style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }} />

                <button 
                  type="button" 
                  onClick={() => {
                    const current = (details.hotels || []).filter((_, i) => i !== idx);
                    setDetails(prev => ({ ...prev, hotels: current }));
                  }}
                  style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', width: '28px', height: '28px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Section 8: Package Inclusions & Exclusions */}
          <div className={styles.formCard} style={{ marginTop: '20px' }}>
            <h4 className={styles.formCardTitle}>✓ Package Inclusions & Exclusions</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#16a34a' }}>✓ Package Inclusions (One per line)</label>
                <textarea 
                  rows={6} 
                  value={Array.isArray(details.inclusions) ? details.inclusions.join('\n') : ''} 
                  onChange={e => {
                    const lines = e.target.value.split('\n');
                    setDetails(prev => ({ ...prev, inclusions: lines }));
                  }} 
                  placeholder="Return Economy Airfare&#10;Daily Breakfast&#10;Luxury Coach Transfers" 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#dc2626' }}>✕ Package Exclusions (One per line)</label>
                <textarea 
                  rows={6} 
                  value={Array.isArray(details.exclusions) ? details.exclusions.join('\n') : ''} 
                  onChange={e => {
                    const lines = e.target.value.split('\n');
                    setDetails(prev => ({ ...prev, exclusions: lines }));
                  }} 
                  placeholder="Personal Expenses&#10;Tips & Porterage&#10;GST / TCS" 
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }} 
                />
              </div>
            </div>
          </div>

          {/* Section 9: Terms & Conditions */}
          <div className={styles.formCard} style={{ marginTop: '20px' }}>
            <h4 className={styles.formCardTitle}>📜 Terms & Conditions</h4>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.85rem', color: '#64748b' }}>Enter each booking term / condition on a new line</label>
            <textarea 
              rows={5} 
              value={Array.isArray(details.terms_and_conditions) ? details.terms_and_conditions.join('\n') : ''} 
              onChange={e => {
                const lines = e.target.value.split('\n');
                setDetails(prev => ({ ...prev, terms_and_conditions: lines }));
              }} 
              placeholder="Advance booking amount of ₹10,000 per seat is non-refundable upon confirmation.&#10;Full payment must be completed at least 21 days prior to departure.&#10;Visa approval is subject to embassy discretion." 
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }} 
            />
          </div>

          {/* Section 10: Need to Know Policies */}
          <div className={styles.formCard} style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 className={styles.formCardTitle} style={{ margin: 0 }}>📌 Need to Know Policies</h4>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => {
                  const current = details.need_to_know || [];
                  setDetails(prev => ({
                    ...prev,
                    need_to_know: [...current, { title: '', rules: [] }]
                  }));
                }}
                style={{ padding: '6px 12px', fontSize: '0.875rem' }}
              >
                + Add Policy Topic
              </button>
            </div>

            {(details.need_to_know || []).map((topic, idx) => (
              <div key={idx} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Topic Title (e.g. 📌 Check-in & Reporting Times)" 
                    value={topic.title} 
                    onChange={e => {
                      const current = [...(details.need_to_know || [])];
                      current[idx].title = e.target.value;
                      setDetails(prev => ({ ...prev, need_to_know: current }));
                    }}
                    style={{ flex: 1, padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => {
                      const current = (details.need_to_know || []).filter((_, i) => i !== idx);
                      setDetails(prev => ({ ...prev, need_to_know: current }));
                    }}
                    style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 10px', cursor: 'pointer' }}
                  >
                    Delete Topic
                  </button>
                </div>
                <textarea 
                  rows={3} 
                  placeholder="Topic Rules/Points (One rule per line)" 
                  value={Array.isArray(topic.rules) ? topic.rules.join('\n') : ''} 
                  onChange={e => {
                    const current = [...(details.need_to_know || [])];
                    current[idx].rules = e.target.value.split('\n');
                    setDetails(prev => ({ ...prev, need_to_know: current }));
                  }}
                  style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
                />
              </div>
            ))}
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
                      <th>Featured Order</th>
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
                          <input 
                            type="number" 
                            defaultValue={tour.featured_order ?? 0}
                            min={0}
                            onBlur={(e) => {
                              const val = Number(e.target.value);
                              if (val !== tour.featured_order) {
                                handleOrderChange(tour, val);
                              }
                            }}
                            style={{ width: '65px', padding: '4px 6px', border: '1px solid #cbd5e1', borderRadius: '4px', fontWeight: 700, textAlign: 'center' }}
                          />
                        </td>
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
