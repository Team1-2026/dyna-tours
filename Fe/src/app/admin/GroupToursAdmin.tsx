import React, { useState, useEffect } from 'react';
import { groupToursApi, GroupTour } from '@/lib/api';
import styles from './admin.module.css';
import RichTextEditor from '@/components/RichTextEditor';

export default function GroupToursAdmin() {
  const [tours, setTours] = useState<GroupTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTour, setEditingTour] = useState<GroupTour | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    loadTours();
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
    } as GroupTour);
  };

  const handleEdit = (tour: GroupTour) => {
    setIsCreating(false);
    setEditingTour({ ...tour });
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
      if (isCreating) {
        await groupToursApi.createTour(editingTour);
      } else if (editingTour.id) {
        await groupToursApi.updateTour(editingTour.id, editingTour);
      }
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
      setEditingTour(null);
      loadTours();
    } catch (err) {
      console.error(err);
      setSaveStatus('Error saving tour');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (!editingTour) return;
    
    let parsedValue: any = value;
    if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    } else if (name === 'starting_price' || name === 'featured_order') {
      parsedValue = Number(value);
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

  if (loading && tours.length === 0) return <div>Loading Group Tours...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: 'var(--color-secondary-navy)' }}>Group Tours Management</h2>
        {!editingTour && (
          <button onClick={handleAddNew} className={styles.saveBtn}>+ Add Group Tour</button>
        )}
      </div>

      {saveStatus && <div style={{ background: '#e6ffe6', padding: '10px', marginBottom: '20px', borderRadius: '4px', color: '#006600' }}>{saveStatus}</div>}

      {editingTour ? (
        <form onSubmit={handleSave} style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>{isCreating ? 'Create New Tour' : 'Edit Tour'}</h3>
            <button type="button" onClick={() => setEditingTour(null)} style={{ background: '#ccc', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tour Name *</label>
              <input type="text" name="name" value={editingTour.name || ''} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Destination *</label>
              <input type="text" name="destination" value={editingTour.destination || ''} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type *</label>
              <select name="type" value={editingTour.type} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="domestic">Domestic</option>
                <option value="international">International</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Duration *</label>
              <input type="text" name="duration" placeholder="e.g. 5 Days / 4 Nights" value={editingTour.duration || ''} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Starting Price *</label>
              <input type="number" name="starting_price" value={editingTour.starting_price || 0} onChange={handleChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Departure Date</label>
              <input type="date" name="departure_date" value={editingTour.departure_date ? editingTour.departure_date.split('T')[0] : ''} onChange={handleChange} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status *</label>
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
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Visibility</label>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label><input type="checkbox" name="is_visible" checked={editingTour.is_visible} onChange={handleChange} /> Is Visible on Site</label>
                <label><input type="checkbox" name="is_featured" checked={editingTour.is_featured} onChange={handleChange} /> Is Featured (Carousel)</label>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Thumbnail Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'block', marginBottom: '10px' }} />
            {editingTour.image && <img src={editingTour.image} alt="Thumbnail" style={{ height: '100px', borderRadius: '4px', objectFit: 'cover' }} />}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Full Details (Rich Text)</label>
            <RichTextEditor 
              value={editingTour.full_details || ''}
              onChange={(val) => setEditingTour({ ...editingTour, full_details: val })}
            />
          </div>

          <button type="submit" className={styles.saveBtn}>Save Tour</button>
        </form>
      ) : (
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Destination</th>
              <th>Price</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map(tour => (
              <tr key={tour.id}>
                <td>
                  {tour.image ? <img src={tour.image} alt={tour.name} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} /> : 'No image'}
                </td>
                <td style={{ fontWeight: 'bold' }}>{tour.name}</td>
                <td>{tour.destination}</td>
                <td>₹{tour.starting_price.toLocaleString('en-IN')}</td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem',
                    background: tour.status === 'Available' ? '#e6ffe6' : tour.status === 'Sold Out' ? '#ffe6e6' : '#fff3e6',
                    color: tour.status === 'Available' ? '#006600' : tour.status === 'Sold Out' ? '#cc0000' : '#cc6600'
                  }}>
                    {tour.status}
                  </span>
                </td>
                <td>{tour.is_featured ? '⭐ Yes' : 'No'}</td>
                <td>
                  <button onClick={() => handleEdit(tour)} style={{ background: 'var(--color-primary-blue)', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => tour.id && handleDelete(tour.id)} style={{ background: 'var(--color-primary-red)', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
