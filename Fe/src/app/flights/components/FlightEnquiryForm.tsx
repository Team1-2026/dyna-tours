'use client';

import React, { useState } from 'react';
import styles from '../page.module.css';

import { api } from '@/lib/api';

import CountryCodeSelect from '@/components/CountryCodeSelect';
import { isValidPhone, validatePhoneByCountry } from '@/lib/phoneValidation';

export default function FlightEnquiryForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    trip_type: 'Round Trip',
    from: '',
    to: '',
    departure_date: '',
    return_date: '',
    num_adults: '1',
    num_children: '0',
    num_infants: '0',
    cabin_class: 'Economy',
    preferred_airline: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'departure_date') {
      setFormData(prev => ({
        ...prev,
        departure_date: value,
        return_date: (prev.return_date && prev.return_date < value) ? value : prev.return_date
      }));
      return;
    }
    if (name === 'return_date') {
      if (formData.departure_date && value && value < formData.departure_date) {
        alert('Return date must be equal to or greater than departure date.');
        setFormData(prev => ({ ...prev, return_date: prev.departure_date }));
        return;
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneCheck = validatePhoneByCountry(formData.phone, countryCode);
    if (!phoneCheck.isValid) {
      alert(phoneCheck.message || 'Please enter a valid phone number.');
      return;
    }
    if (formData.trip_type !== 'One Way' && formData.departure_date && formData.return_date && formData.return_date < formData.departure_date) {
      alert('Return date must be equal to or greater than departure date.');
      return;
    }
    setLoading(true);

    try {
      await api.submitEnquiry({
        type: 'flight',
        target_id: 'flight_service',
        name: formData.name,
        email: formData.email,
        phone: `${countryCode} ${formData.phone}`,
        from: formData.from,
        to: formData.to,
        trip_type: formData.trip_type,
        departure_date: formData.departure_date,
        return_date: formData.return_date,
        num_adults: Number(formData.num_adults) || 1,
        num_children: Number(formData.num_children) || 0,
        num_infants: Number(formData.num_infants) || 0,
        cabin_class: formData.cabin_class,
        preferred_airline: formData.preferred_airline,
        message: formData.message,
      });

      setSuccess(true);
      setFormData({
        name: '', email: '', phone: '', trip_type: 'Round Trip', from: '', to: '',
        departure_date: '', return_date: '', num_adults: '1', num_children: '0',
        num_infants: '0', cabin_class: 'Economy', preferred_airline: '', message: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error: any) {
      console.error('Flight enquiry error:', error);
      alert(error?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formCard} id="enquiry">
      <h2 className={styles.formHeaderTitle}>Book Your Flight</h2>
      <p className={styles.formHeaderSubtitle}>Send us your flight request details for instant assistance.</p>
      
      {success && (
        <div className={styles.alertSuccess}>
          ✓ Thank you! Your flight enquiry has been submitted successfully. Our team will contact you shortly.
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.flightForm}>
        <h3 className={styles.formSectionHeading}>Passenger Details</h3>
        
        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>Full Name *</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className={styles.darkInput} placeholder="Enter your full name" />
        </div>

        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>Phone Number *</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', width: '100%' }}>
            <CountryCodeSelect value={countryCode} onChange={setCountryCode} style={{ flexShrink: 0 }} />
            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className={styles.darkInput} placeholder="Enter mobile number" style={{ flex: 1, minWidth: 0 }} />
          </div>
        </div>

        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>Email Address *</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className={styles.darkInput} placeholder="Email Address" />
        </div>

        <h3 className={styles.formSectionHeading}>Travel Details</h3>
        
        <div className={styles.formRowGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Trip Type</label>
            <select name="trip_type" value={formData.trip_type} onChange={handleChange} className={styles.darkSelect}>
              <option value="One Way">One Way</option>
              <option value="Round Trip">Round Trip</option>
              <option value="Multi-City">Multi-City</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Cabin Class</label>
            <select name="cabin_class" value={formData.cabin_class} onChange={handleChange} className={styles.darkSelect}>
              <option value="Economy">Economy</option>
              <option value="Premium Economy">Premium Economy</option>
              <option value="Business">Business</option>
              <option value="First Class">First Class</option>
            </select>
          </div>
        </div>

        <div className={styles.formRowGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>From (Origin) *</label>
            <input required type="text" name="from" value={formData.from} onChange={handleChange} className={styles.darkInput} placeholder="City or Airport" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>To (Destination) *</label>
            <input required type="text" name="to" value={formData.to} onChange={handleChange} className={styles.darkInput} placeholder="City or Airport" />
          </div>
        </div>

        <div className={styles.formRowGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Departure Date *</label>
            <input required min={new Date().toISOString().split('T')[0]} type="date" name="departure_date" value={formData.departure_date} onChange={handleChange} className={styles.darkInput} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Return Date {formData.trip_type === 'One Way' ? '' : '*'}</label>
            <input required={formData.trip_type !== 'One Way'} disabled={formData.trip_type === 'One Way'} min={formData.departure_date || new Date().toISOString().split('T')[0]} type="date" name="return_date" value={formData.return_date} onChange={handleChange} className={styles.darkInput} />
          </div>
        </div>

        <div className={styles.formRowGrid3}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Adults (12+)</label>
            <input type="number" min="1" name="num_adults" value={formData.num_adults} onChange={handleChange} className={styles.darkInput} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Children (2-11)</label>
            <input type="number" min="0" name="num_children" value={formData.num_children} onChange={handleChange} className={styles.darkInput} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Infants (0-2)</label>
            <input type="number" min="0" name="num_infants" value={formData.num_infants} onChange={handleChange} className={styles.darkInput} />
          </div>
        </div>

        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>Preferred Airline (Optional)</label>
          <input type="text" name="preferred_airline" value={formData.preferred_airline} onChange={handleChange} className={styles.darkInput} placeholder="e.g. Emirates, Air India" />
        </div>

        <div className={styles.formGroupFull}>
          <label className={styles.formLabel}>Special Requirements / Message</label>
          <textarea name="message" value={formData.message} onChange={handleChange} className={styles.darkTextarea} rows={2} placeholder="Dietary needs, wheelchair, seat preference..."></textarea>
        </div>

        <button type="submit" disabled={loading} className={styles.redSubmitBtn}>
          {loading ? 'Sending Request...' : 'Book Your Flight'}
        </button>
      </form>
    </div>
  );
}
