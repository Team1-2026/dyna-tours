'use client';

import React, { useState, useEffect } from 'react';
import { groupToursApi, GroupTourEnquiry } from '@/lib/api';
import styles from './admin.module.css';

export default function GroupTourEnquiriesAdmin() {
  const [enquiries, setEnquiries] = useState<GroupTourEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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

  const filteredEnquiries = enquiries.filter((enq) => {
    if (!fromDate && !toDate) return true;
    if (!enq.created_at) return false;
    const d = new Date(enq.created_at);
    if (isNaN(d.getTime())) return false;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const enqDateStr = `${year}-${month}-${day}`;

    if (fromDate && enqDateStr < fromDate) return false;
    if (toDate && enqDateStr > toDate) return false;
    return true;
  });

  const downloadCSV = () => {
    if (!filteredEnquiries || filteredEnquiries.length === 0) return;

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

    const rows = filteredEnquiries.map((enq) => {
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
    let downloadFileName = `group_tour_enquiries_${dateStr}.csv`;
    if (fromDate && toDate) {
      downloadFileName = `group_tour_enquiries_${fromDate}_to_${toDate}.csv`;
    } else if (fromDate) {
      downloadFileName = `group_tour_enquiries_from_${fromDate}.csv`;
    } else if (toDate) {
      downloadFileName = `group_tour_enquiries_to_${toDate}.csv`;
    }
    link.setAttribute('download', downloadFileName);
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
            {fromDate || toDate ? (
              <>
                Showing <strong>{filteredEnquiries.length}</strong> of {enquiries.length} {enquiries.length === 1 ? 'enquiry' : 'enquiries'}
              </>
            ) : (
              <>
                Total: {enquiries.length} {enquiries.length === 1 ? 'enquiry' : 'enquiries'}
              </>
            )}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Date range filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.35rem 0.65rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <label htmlFor="gtEnquiryFromDate" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>From:</label>
              <input 
                id="gtEnquiryFromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{
                  fontSize: '0.825rem',
                  padding: '0.3rem 0.5rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  color: 'var(--color-secondary-navy)',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <label htmlFor="gtEnquiryToDate" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>To:</label>
              <input 
                id="gtEnquiryToDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{
                  fontSize: '0.825rem',
                  padding: '0.3rem 0.5rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  color: 'var(--color-secondary-navy)',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>
            {(fromDate || toDate) && (
              <button
                type="button"
                onClick={() => {
                  setFromDate('');
                  setToDate('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.2rem 0.4rem',
                  borderRadius: '4px'
                }}
                title="Clear date filter"
              >
                ✕ Clear
              </button>
            )}
          </div>

          <button 
            onClick={downloadCSV} 
            className={styles.saveBtn} 
            disabled={filteredEnquiries.length === 0}
            style={{ 
              marginTop: 0, 
              backgroundColor: '#059669', 
              color: '#ffffff',
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px',
              opacity: filteredEnquiries.length === 0 ? 0.6 : 1,
              cursor: filteredEnquiries.length === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 600
            }}
            title={filteredEnquiries.length === 0 ? 'No enquiries to download' : 'Download group tour enquiries'}
          >
            <span>📥 Download</span>
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
            {filteredEnquiries.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  {enquiries.length === 0 ? (
                    'No enquiries found.'
                  ) : (
                    <div>
                      <div>No enquiries found matching the selected date range.</div>
                      <button
                        onClick={() => {
                          setFromDate('');
                          setToDate('');
                        }}
                        style={{
                          marginTop: '0.75rem',
                          background: 'var(--color-secondary-navy)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.4rem 0.85rem',
                          borderRadius: '6px',
                          fontSize: '0.825rem',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Clear Date Filter
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              filteredEnquiries.map(enq => {
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
            })
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
