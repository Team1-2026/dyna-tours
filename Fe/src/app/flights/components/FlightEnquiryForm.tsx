'use client';

import React, { useState } from 'react';
import styles from '../page.module.css';

export default function FlightEnquiryForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'flight',
          target_id: 'flight_service'
        })
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '', email: '', phone: '', trip_type: 'Round Trip', from: '', to: '',
          departure_date: '', return_date: '', num_adults: '1', num_children: '0',
          num_infants: '0', cabin_class: 'Economy', preferred_airline: '', message: ''
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert('Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone Number *</label>
            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className={styles.darkInput} placeholder="Mobile Number" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email Address *</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className={styles.darkInput} placeholder="Email Address" />
          </div>
        </div>

        <h3 className={styles.formSectionHeading}>Travel Details</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>From (Origin) *</label>
            <input required type="text" name="from" value={formData.from} onChange={handleChange} className={styles.darkInput} placeholder="City or Airport" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>To (Destination) *</label>
            <input required type="text" name="to" value={formData.to} onChange={handleChange} className={styles.darkInput} placeholder="City or Airport" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Departure Date *</label>
            <input required type="date" name="departure_date" value={formData.departure_date} onChange={handleChange} className={styles.darkInput} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Return Date {formData.trip_type === 'One Way' ? '' : '*'}</label>
            <input required={formData.trip_type !== 'One Way'} disabled={formData.trip_type === 'One Way'} type="date" name="return_date" value={formData.return_date} onChange={handleChange} className={styles.darkInput} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.65rem' }}>
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
