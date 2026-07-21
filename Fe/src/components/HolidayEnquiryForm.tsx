'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';

export default function HolidayEnquiryForm({ categoryName }: { categoryName: string }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    num_children: '',
    children_ages: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await api.submitEnquiry({
        type: 'package',
        target_id: categoryName,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        num_children: formData.num_children ? parseInt(formData.num_children) : 0,
        children_ages: formData.children_ages,
        message: formData.message,
      });
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        num_children: '',
        children_ages: '',
        message: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h4 style={{ color: 'var(--color-primary-green)', marginBottom: '1rem' }}>✓ Enquiry Submitted!</h4>
        <p>Thank you for reaching out. Our travel experts will get back to you with a customized quote soon.</p>
        <button type="button" className="btn btn-outline" onClick={() => setSuccess(false)} style={{ marginTop: '1rem' }}>Submit Another Enquiry</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {error && <div style={{ color: 'red', fontSize: '0.9rem' }}>{error}</div>}
      <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', width: '100%', outline: 'none' }} />
      <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone No:" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', width: '100%', outline: 'none' }} />
      <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', width: '100%', outline: 'none' }} />
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <input type="number" name="num_children" value={formData.num_children} onChange={handleChange} min="0" placeholder="No: of Child" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', width: '50%', outline: 'none' }} />
        <input type="text" name="children_ages" value={formData.children_ages} onChange={handleChange} placeholder="Children Ages (e.g. 5, 8)" style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', width: '50%', outline: 'none' }} />
      </div>

      <textarea required name="message" value={formData.message} onChange={handleChange} placeholder="Message / Travel Plans..." rows={3} style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', width: '100%', outline: 'none', resize: 'vertical' }}></textarea>
      
      <button type="submit" disabled={submitting} className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }}>
        {submitting ? 'Submitting...' : 'Submit Enquiry'}
      </button>
    </form>
  );
}
