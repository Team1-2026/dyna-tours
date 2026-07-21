'use client';

import React, { useEffect, useState } from 'react';
import styles from './admin.module.css';
import { api, CrmChatLead, CrmChatLeadDetail, CrmChatSource, CrmChatStatus } from '@/lib/api';

const STATUS_OPTIONS: { value: CrmChatStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'closed', label: 'Closed' },
];

const SOURCE_OPTIONS: { value: '' | CrmChatSource; label: string }[] = [
  { value: '', label: 'All sources' },
  { value: 'website', label: 'Website chat' },
  { value: 'google_chat', label: 'Google Chat' },
];

function sourceLabel(source: CrmChatSource): string {
  return source === 'google_chat' ? 'Google Chat' : 'Website';
}

export default function CrmAdmin() {
  const [leads, setLeads] = useState<CrmChatLead[]>([]);
  const [selected, setSelected] = useState<CrmChatLeadDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'' | CrmChatSource>('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({
    requirements: '',
    notes: '',
    status: 'new' as CrmChatStatus,
    phone: '',
  });

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCrmChats({
        status: statusFilter || undefined,
        search: search.trim() || undefined,
        source: sourceFilter || undefined,
      });
      setLeads(data);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load CRM chats' });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, sourceFilter]);

  const openLead = async (source: CrmChatSource, id: number) => {
    try {
      const detail = await api.getCrmChat(source, id);
      setSelected(detail);
      setForm({
        requirements: detail.requirements || '',
        notes: detail.notes || '',
        status: detail.status,
        phone: detail.phone || '',
      });
      setMessage(null);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load chat details' });
    }
  };

  const saveLead = async () => {
    if (!selected) return;
    setIsSaving(true);
    try {
      const payload: Partial<CrmChatLead> = {
        requirements: form.requirements,
        notes: form.notes,
        status: form.status,
      };

      if (selected.source === 'website') {
        payload.phone = form.phone || null;
      }

      await api.updateCrmChat(selected.source, selected.id, payload);
      setMessage({ type: 'success', text: 'Lead updated' });
      await fetchLeads();
      await openLead(selected.source, selected.id);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to update lead' });
    }
    setIsSaving(false);
  };

  const deleteLead = async () => {
    if (!selected) return;
    if (!window.confirm(`Delete CRM lead for ${selected.name || selected.email}?`)) return;

    try {
      await api.deleteCrmChat(selected.source, selected.id);
      setSelected(null);
      setMessage({ type: 'success', text: 'Lead deleted' });
      await fetchLeads();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to delete lead' });
    }
  };

  return (
    <div className={styles.adminSection || undefined}>
      {message && (
        <div
          style={{
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '4px',
            background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
          }}
        >
          {message.text}
        </div>
      )}

      {!selected ? (
        <div className={styles.panelCard}>
          <div className={styles.tableHeaderToolbar}>
            <h3 className={styles.panelTitle} style={{ margin: 0 }}>Chat CRM</h3>
            <div className={styles.toolbarFilters} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                className={styles.searchBar}
                placeholder="Search name, email, requirements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void fetchLeads();
                }}
                style={{ minWidth: 220 }}
              />
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as '' | CrmChatSource)}
                style={{ padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0' }}
              >
                {SOURCE_OPTIONS.map((option) => (
                  <option key={option.value || 'all'} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0' }}
              >
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <button type="button" className={styles.btnPublish} onClick={() => void fetchLeads()}>
                Refresh
              </button>
            </div>
          </div>

          {isLoading ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading...</p>
          ) : leads.length === 0 ? (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No chat leads yet. Website visitors and Google Chat users will appear here.
            </p>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Requirements</th>
                    <th>Messages</th>
                    <th>Last activity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={`${lead.source}-${lead.id}`}>
                      <td>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          {lead.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={lead.avatar_url}
                              alt=""
                              width={36}
                              height={36}
                              style={{ borderRadius: '999px', objectFit: 'cover' }}
                            />
                          ) : null}
                          <div>
                            <div style={{ fontWeight: 700 }}>{lead.name || '—'}</div>
                            <div>✉ {lead.email || 'No email'}</div>
                            {lead.phone && <div>📞 {lead.phone}</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.badge}>{sourceLabel(lead.source)}</span>
                      </td>
                      <td>
                        <span className={styles.badge}>{lead.status.replace('_', ' ')}</span>
                      </td>
                      <td style={{ maxWidth: 280, whiteSpace: 'pre-wrap' }}>
                        {lead.requirements ? lead.requirements.slice(0, 140) : '—'}
                      </td>
                      <td>{lead.message_count ?? 0}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {lead.last_message_at
                          ? new Date(lead.last_message_at).toLocaleString()
                          : lead.created_at
                            ? new Date(lead.created_at).toLocaleString()
                            : '—'}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                          onClick={() => void openLead(lead.source, lead.id)}
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)', gap: '1.25rem' }}>
          <div className={styles.panelCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem', cursor: 'pointer', marginBottom: '1rem' }}
                  onClick={() => setSelected(null)}
                >
                  ← Back to list
                </button>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                  {selected.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selected.avatar_url}
                      alt=""
                      width={48}
                      height={48}
                      style={{ borderRadius: '999px', objectFit: 'cover' }}
                    />
                  ) : null}
                  <div>
                    <h3 className={styles.panelTitle} style={{ margin: 0 }}>{selected.name || 'Unnamed lead'}</h3>
                    <div style={{ color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
                      <span className={styles.badge} style={{ marginRight: '0.5rem' }}>
                        {sourceLabel(selected.source)}
                      </span>
                      ✉ {selected.email || 'No email'}
                      {selected.phone ? ` · 📞 ${selected.phone}` : ''}
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#991b1b' }}
                onClick={() => void deleteLead()}
              >
                Delete
              </button>
            </div>

            <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as CrmChatStatus }))}
                style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0' }}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {selected.source === 'website' && (
              <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                <label>Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0' }}
                />
              </div>
            )}

            <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
              <label>Requirements</label>
              <textarea
                rows={5}
                value={form.requirements}
                onChange={(e) => setForm((prev) => ({ ...prev, requirements: e.target.value }))}
                placeholder="Destination, dates, budget, travelers..."
                style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
            </div>

            <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
              <label>Internal notes</label>
              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Follow-up notes for the sales team..."
                style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
            </div>

            <button
              type="button"
              className={styles.btnPublish}
              disabled={isSaving}
              onClick={() => void saveLead()}
            >
              {isSaving ? 'Saving...' : 'Save CRM details'}
            </button>
          </div>

          <div className={styles.panelCard}>
            <h3 className={styles.panelTitle}>Conversation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '70vh', overflowY: 'auto' }}>
              {(selected.messages || []).length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>No messages stored yet.</p>
              ) : (
                selected.messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '90%',
                      padding: '0.75rem 0.9rem',
                      borderRadius: '1rem',
                      background: msg.role === 'user' ? 'var(--color-primary-red)' : '#f1f5f9',
                      color: msg.role === 'user' ? '#fff' : 'var(--color-text-primary)',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', opacity: 0.75, marginBottom: '0.25rem' }}>
                      {msg.role === 'user'
                        ? 'Customer'
                        : msg.role === 'staff'
                          ? 'Staff (Google Chat)'
                          : 'AI'}{' '}
                      · {new Date(msg.created_at).toLocaleString()}
                    </div>
                    {msg.content}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
