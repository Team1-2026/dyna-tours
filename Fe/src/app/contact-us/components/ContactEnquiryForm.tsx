'use client';

import React, { useState } from 'react';
import styles from '../contact.module.css';
import { contactPageApi } from '@/lib/api';
import CountryCodeSelect from '@/components/CountryCodeSelect';
import { isValidPhone, validatePhoneByCountry } from '@/lib/phoneValidation';

export default function ContactEnquiryForm() {
  const [countryCode, setCountryCode] = useState('+91');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    num_people: 1,
    travel_date: '',
    message: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneCheck = validatePhoneByCountry(formData.phone, countryCode);
    if (!phoneCheck.isValid) {
      setSubmitError(phoneCheck.message || 'Please enter a valid phone number.');
      return;
    }
    setFormSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    try {
      const res = await contactPageApi.submitContactEnquiry({
        name: formData.name,
        phone: `${countryCode} ${formData.phone}`,
        email: formData.email,
        num_people: Number(formData.num_people),
        travel_date: formData.travel_date,
        message: formData.message,
      });

      setSubmitSuccess(res.message || 'Thank you! Your enquiry has been submitted successfully.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        num_people: 1,
        travel_date: '',
        message: ''
      });
    } catch (err: any) {
      setSubmitError('Failed to submit enquiry. Please check your details and try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Send Us a Message</h2>
      <p className={styles.formSub}>Fill out the form below and our travel consultants will get back to you within 2 hours.</p>

      {submitSuccess && (
        <div className={styles.toastSuccess}>
          <span>✓</span> {submitSuccess}
        </div>
      )}

      {submitError && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          ⚠️ {submitError}
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        <div className={styles.formGroupGrid}>
          <div className={styles.formField}>
            <label className={styles.label}>Full Name <span>*</span></label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="e.g. Rahul Sharma" 
              value={formData.name} 
              onChange={handleInputChange} 
              className={styles.input} 
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>Email Address <span>*</span></label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="e.g. rahul@example.com" 
              value={formData.email} 
              onChange={handleInputChange} 
              className={styles.input} 
            />
          </div>
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Phone Number <span className="required-star">*</span></label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', width: '100%' }}>
            <CountryCodeSelect 
              value={countryCode} 
              onChange={(code) => setCountryCode(code)} 
              style={{ flexShrink: 0 }}
            />
            <input 
              type="tel" 
              name="phone" 
              required 
              placeholder="Enter mobile number" 
              value={formData.phone} 
              onChange={handleInputChange} 
              className={styles.input} 
              style={{ flex: 1, minWidth: 0 }}
            />
          </div>
        </div>

          <div className={styles.formField}>
            <label className={styles.label}>Number of Travellers</label>
            <input 
              type="number" 
              name="num_people" 
              min={1} 
              value={formData.num_people} 
              onChange={handleInputChange} 
              className={styles.input} 
            />
          </div>

        <div className={styles.formField}>
          <label className={styles.label}>Preferred Travel Dates</label>
          <input 
            type="date" 
            name="travel_date" 
            value={formData.travel_date} 
            onChange={handleInputChange} 
            className={styles.input} 
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Your Message / Enquiry <span>*</span></label>
          <textarea 
            name="message" 
            required 
            rows={4} 
            placeholder="Tell us about your travel plans, preferred destinations, budget, or questions..." 
            value={formData.message} 
            onChange={handleInputChange} 
            className={styles.textarea} 
          />
        </div>

        <button type="submit" disabled={formSubmitting} className={styles.submitBtn}>
          {formSubmitting ? 'Sending Enquiry...' : 'Submit Enquiry'}
          {!formSubmitting && <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>}
        </button>
      </form>
    </div>
  );
}
