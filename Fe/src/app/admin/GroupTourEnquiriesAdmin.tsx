import React, { useState, useEffect } from 'react';
import { groupToursApi, GroupTourEnquiry } from '@/lib/api';
import styles from './admin.module.css';

export default function GroupTourEnquiriesAdmin() {
  const [enquiries, setEnquiries] = useState<GroupTourEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await groupToursApi.getEnquiries();
      setEnquiries(data);
    } catch (err) {
      console.error(err);
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
      <h2 style={{ margin: '0 0 20px 0', color: 'var(--color-secondary-navy)' }}>Group Tour Enquiries</h2>
      
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name / Contact</th>
            <th>Tour Interested In</th>
            <th>Travellers</th>
            <th>Message</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center' }}>No enquiries found.</td></tr>
          )}
          {enquiries.map(enq => (
            <tr key={enq.id}>
              <td style={{ whiteSpace: 'nowrap' }}>
                {enq.created_at ? new Date(enq.created_at).toLocaleDateString() : 'N/A'}
              </td>
              <td>
                <div style={{ fontWeight: 'bold' }}>{enq.name}</div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>{enq.email}</div>
                <div style={{ fontSize: '0.85em', color: '#666' }}>{enq.phone}</div>
              </td>
              <td>
                {enq.group_tour ? (
                  <span style={{ fontWeight: 600 }}>{enq.group_tour.name}</span>
                ) : 'General / Not specified'}
              </td>
              <td style={{ textAlign: 'center' }}>{enq.num_travellers}</td>
              <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={enq.message}>
                {enq.message || '-'}
              </td>
              <td>
                <select 
                  value={enq.status} 
                  onChange={(e) => enq.id && updateStatus(enq.id, e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: getStatusColor(enq.status).bg,
                    color: getStatusColor(enq.status).color,
                    fontWeight: 600
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
  );
}
