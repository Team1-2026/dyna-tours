import React, { useState, useEffect } from 'react';
import { groupToursApi, GroupTourEnquiry } from '@/lib/api';
import styles from './admin.module.css';

export default function GroupTourEnquiriesAdmin() {
  const [enquiries, setEnquiries] = useState<GroupTourEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await groupToursApi.getEnquiries();
      setEnquiries(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to fetch group tour enquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await groupToursApi.updateEnquiryStatus(id, newStatus);
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus as any } : e));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'New': return { bg: '#e3f2fd', color: '#1565c0' };
      case 'Contacted': return { bg: '#fff3e0', color: '#e65100' };
      case 'In Progress': return { bg: '#f3e5f5', color: '#6a1b9a' };
      case 'Converted': return { bg: '#e8f5e9', color: '#2e7d32' };
      case 'Closed': return { bg: '#ffebee', color: '#c62828' };
      default: return { bg: '#f5f5f5', color: '#616161' };
    }
  };

  if (loading) return <div>Loading enquiries...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: 'var(--color-secondary-navy)' }}>Group Tour Enquiries</h2>
        <button onClick={loadEnquiries} className={styles.saveBtn} style={{ marginTop: 0 }}>
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '6px', marginBottom: '20px' }}>
          {error}
        </div>
      )}
      
      <div className={styles.tableContainer}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th style={{ width: '110px' }}>Date</th>
              <th style={{ width: '220px' }}>Name / Contact</th>
              <th style={{ width: '200px' }}>Tour Interested In</th>
              <th style={{ width: '90px', textAlign: 'center' }}>Travellers</th>
              <th>Message</th>
              <th style={{ width: '150px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>No enquiries found.</td></tr>
            )}
            {enquiries.map(enq => (
              <tr key={enq.id}>
                <td style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                  {enq.created_at ? new Date(enq.created_at).toLocaleDateString('en-GB') : 'N/A'}
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--color-secondary-navy)' }}>{enq.name}</div>
                  <div style={{ fontSize: '0.825rem', color: '#64748b' }}>{enq.email}</div>
                  <div style={{ fontSize: '0.825rem', color: '#64748b' }}>{enq.phone}</div>
                </td>
                <td>
                  {enq.group_tour ? (
                    <span style={{ fontWeight: 600, color: 'var(--color-secondary-navy)' }}>{enq.group_tour.name}</span>
                  ) : (
                    <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>General / Unsure</span>
                  )}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{enq.num_travellers}</td>
                <td style={{ maxWidth: '300px', wordBreak: 'break-word', fontSize: '0.875rem' }} title={enq.message}>
                  {enq.message || '-'}
                </td>
                <td>
                  <select 
                    value={enq.status} 
                    onChange={(e) => enq.id && updateStatus(enq.id, e.target.value)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: getStatusColor(enq.status).bg,
                      color: getStatusColor(enq.status).color,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.825rem'
                    }}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
