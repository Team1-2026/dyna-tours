import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';
import { api } from '@/lib/api';

interface Staff {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export default function StaffAdmin() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isCreating, setIsCreating] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const data = await api.getStaff();
      setStaffList(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (staff: Staff) => {
    if (!window.confirm(`Are you sure you want to delete staff member ${staff.name}?`)) return;
    
    try {
      await api.deleteStaff(staff.id);
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('Failed to delete staff member');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (selectedStaff) {
        await api.updateStaff(selectedStaff.id, formData);
      } else {
        await api.createStaff(formData);
      }
      setIsCreating(false);
      setSelectedStaff(null);
      setFormData({ name: '', email: '', password: '' });
      fetchStaff();
    } catch (error: any) {
      console.error('Error saving staff:', error);
      alert('Error saving data: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setFormData({ name: staff.name, email: staff.email, password: '' });
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setSelectedStaff(null);
    setFormData({ name: '', email: '', password: '' });
  };

  if (loading) return <div>Loading staff data...</div>;

  return (
    <div>
      {isCreating ? (
        <div className={styles.editorGrid}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className={styles.formCard}>
              <h4 className={styles.formCardTitle}>{selectedStaff ? 'Edit Staff Member' : 'Add New Staff'}</h4>
              <form onSubmit={handleSave}>
                <div className={styles.formRow}>
                  <div className="formGroup">
                    <label>Name</label>
                    <input 
                      type="text" 
                      required 
                      className={styles.input} 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                  <div className="formGroup">
                    <label>Email</label>
                    <input 
                      type="email" 
                      required 
                      className={styles.input} 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className="formGroup">
                    <label>Password {selectedStaff && '(leave blank to keep unchanged)'}</label>
                    <input 
                      type="password" 
                      required={!selectedStaff} 
                      minLength={8}
                      className={styles.input} 
                      value={formData.password} 
                      onChange={e => setFormData({...formData, password: e.target.value})} 
                    />
                  </div>
                </div>
                <div className={styles.formActions} style={{ marginTop: '2rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Staff'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.panelCard}>
          <div className={styles.tableHeaderToolbar}>
            <h3 className={styles.panelTitle} style={{ margin: 0 }}>Staff Management</h3>
            <div className={styles.toolbarFilters}></div>
            <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
              + Add New Staff
            </button>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Sl No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff, idx) => (
                  <tr key={staff.id}>
                    <td>{idx + 1}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-secondary-navy)' }}>{staff.name}</td>
                    <td>{staff.email}</td>
                    <td>{new Date(staff.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        type="button" 
                        onClick={() => startEdit(staff)} 
                        className={`${styles.tableActionBtn} ${styles.actionEdit}`}
                      >
                        Edit
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleDelete(staff)} 
                        className={`${styles.tableActionBtn} ${styles.actionDelete}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {staffList.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{textAlign: 'center', padding: '2rem'}}>No staff members found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {staffList.length > 0 && (
            <div className={styles.tableFooterRow}>
              <span>Showing 1 to {staffList.length} of {staffList.length} entries</span>
              <div className={styles.paginationWrapper}>
                <button className={styles.paginationBtn}>Previous</button>
                <button className={`${styles.paginationBtn} ${styles.paginationBtnActive}`}>1</button>
                <button className={styles.paginationBtn}>Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
