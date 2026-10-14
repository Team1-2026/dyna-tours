'use client';

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

  const downloadCSV = () => {
    if (!enquiries || enquiries.length === 0) return;

    const headers = [
      'ID',
      'Date & Time',
      'Tour Name',
      'Page URL',
      'Customer Name',
      'Email',
      'Phone',
      'Travellers',
      'Status',
      'Message'
    ];

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = enquiries.map((enq) => {
      const tourName = enq.group_tour?.name || enq.message?.match(/Interested in ([^\n|]+)/)?.[1]?.trim() || 'General / Unsure';
      const pageUrl = enq.group_tour ? `/group-tours/${enq.group_tour.id}` : '/group-tours';
      const dateTime = enq.created_at
        ? `${new Date(enq.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${new Date(enq.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`
        : '';

      return [
        escapeCSV(enq.id),
        escapeCSV(dateTime),
        escapeCSV(tourName),
        escapeCSV(pageUrl),
        escapeCSV(enq.name),
        escapeCSV(enq.email),
        escapeCSV(enq.phone),
        escapeCSV(enq.num_travellers),
        escapeCSV(enq.status || 'New'),
        escapeCSV(enq.message || ''),
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.map(escapeCSV).join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `group_tour_enquiries_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return <div>Loading enquiries...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--color-secondary-navy)' }}>Group Tour Enquiries</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            Total: {enquiries.length} {enquiries.length === 1 ? 'enquiry' : 'enquiries'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={downloadCSV} 
            className={styles.saveBtn} 
            disabled={enquiries.length === 0}
            style={{ 
              marginTop: 0, 
              backgroundColor: '#059669', 
              color: '#ffffff',
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px',
              opacity: enquiries.length === 0 ? 0.6 : 1,
              cursor: enquiries.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 600
            }}
            title="Download group tour enquiries as CSV"
          >
            <span>📥 Download CSV</span>
          </button>
          <button onClick={loadEnquiries} className={styles.saveBtn} style={{ marginTop: 0, backgroundColor: 'var(--color-secondary-navy)', color: '#ffffff' }}>
            🔄 Refresh
          </button>
        </div>
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
              <th style={{ width: '140px' }}>Date & Time</th>
              <th style={{ width: '220px' }}>Name / Contact</th>
              <th style={{ width: '220px' }}>Tour / Page URL</th>
              <th style={{ width: '90px', textAlign: 'center' }}>Travellers</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>No enquiries found.</td></tr>
            )}
            {enquiries.map(enq => {
              const pageUrl = enq.group_tour ? `/group-tours/${enq.group_tour.id}` : '/group-tours';
              return (
                <tr key={enq.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {enq.created_at ? (
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-secondary-navy)' }}>
                          {new Date(enq.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          {new Date(enq.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-secondary-navy)' }}>{enq.name}</div>
                    <div style={{ fontSize: '0.825rem', color: '#64748b' }}>{enq.email}</div>
                    <div style={{ fontSize: '0.825rem', color: '#64748b' }}>{enq.phone}</div>
                  </td>
                  <td>
                    {enq.group_tour ? (
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-secondary-navy)' }}>
                          {enq.group_tour.name}
                        </div>
                        <a 
                          href={pageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            fontSize: '0.8rem', 
                            color: '#2563eb', 
                            textDecoration: 'underline', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '3px',
                            marginTop: '2px',
                            wordBreak: 'break-all'
                          }}
                          title={`Open ${pageUrl}`}
                        >
                          <span>{pageUrl}</span>
                          <span style={{ fontSize: '10px', textDecoration: 'none' }}>↗</span>
                        </a>
                      </div>
                    ) : (
                      <div>
                        <span style={{ fontWeight: enq.message?.includes('Interested in') ? 600 : 400, color: enq.message?.includes('Interested in') ? 'var(--color-secondary-navy)' : '#94a3b8', fontStyle: enq.message?.includes('Interested in') ? 'normal' : 'italic' }}>
                          {enq.message?.match(/Interested in ([^\n|]+)/)?.[1]?.trim() || 'General / Unsure'}
                        </span>
                        <div>
                          <a 
                            href={pageUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              fontSize: '0.8rem', 
                              color: '#2563eb', 
                              textDecoration: 'underline', 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '3px',
                              marginTop: '2px'
                            }}
                          >
                            <span>{pageUrl}</span>
                            <span style={{ fontSize: '10px', textDecoration: 'none' }}>↗</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{enq.num_travellers}</td>
                  <td style={{ maxWidth: '300px', wordBreak: 'break-word', fontSize: '0.875rem' }} title={enq.message}>
                    {enq.message || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
