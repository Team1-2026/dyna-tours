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
    <div className={styles.formContainer} id="enquiry">
      <h2 className={styles.overviewTitle} style={{ textAlign: 'center', marginBottom: '2rem' }}>Book Your Flight</h2>
      
      {success && (
        <div style={{ background: '#dcfce3', color: '#166534', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center', fontWeight: 'bold' }}>
          Thank you! Your flight enquiry has been submitted successfully. Our team will contact you shortly.
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <h3 className={styles.sectionTitle}>Passenger Details</h3>
        
        <div className={styles.formGroup}>
          <label>Full Name *</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className={styles.inputField} placeholder="Enter your full name" />
        </div>
        <div className={styles.formGroup}>
          <label>Email Address *</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className={styles.inputField} placeholder="Enter your email" />
        </div>
        <div className={styles.formGroup}>
          <label>Mobile Number *</label>
          <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className={styles.inputField} placeholder="Enter mobile number" />
        </div>

        <h3 className={styles.sectionTitle}>Travel Details</h3>
        
        <div className={styles.formGroup}>
          <label>Trip Type</label>
          <select name="trip_type" value={formData.trip_type} onChange={handleChange} className={styles.inputField}>
            <option>One Way</option>
            <option>Round Trip</option>
            <option>Multi-City</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Cabin Class</label>
          <select name="cabin_class" value={formData.cabin_class} onChange={handleChange} className={styles.inputField}>
            <option>Economy</option>
            <option>Premium Economy</option>
            <option>Business</option>
            <option>First Class</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>From (Origin) *</label>
          <input required type="text" name="from" value={formData.from} onChange={handleChange} className={styles.inputField} placeholder="City or Airport" />
        </div>
        <div className={styles.formGroup}>
          <label>To (Destination) *</label>
          <input required type="text" name="to" value={formData.to} onChange={handleChange} className={styles.inputField} placeholder="City or Airport" />
        </div>

        <div className={styles.formGroup}>
          <label>Departure Date *</label>
          <input required type="date" name="departure_date" value={formData.departure_date} onChange={handleChange} className={styles.inputField} />
        </div>
        <div className={styles.formGroup}>
          <label>Return Date {formData.trip_type === 'One Way' ? '' : '*'}</label>
          <input required={formData.trip_type !== 'One Way'} disabled={formData.trip_type === 'One Way'} type="date" name="return_date" value={formData.return_date} onChange={handleChange} className={styles.inputField} />
        </div>

        <div className={styles.formGroup}>
          <label>Adults (12+ yrs)</label>
          <input type="number" min="1" name="num_adults" value={formData.num_adults} onChange={handleChange} className={styles.inputField} />
        </div>
        <div className={styles.formGroup}>
          <label>Children (2-11 yrs)</label>
          <input type="number" min="0" name="num_children" value={formData.num_children} onChange={handleChange} className={styles.inputField} />
        </div>
        <div className={styles.formGroup}>
          <label>Infants (0-2 yrs)</label>
          <input type="number" min="0" name="num_infants" value={formData.num_infants} onChange={handleChange} className={styles.inputField} />
        </div>
        <div className={styles.formGroup}>
          <label>Preferred Airline (Optional)</label>
          <input type="text" name="preferred_airline" value={formData.preferred_airline} onChange={handleChange} className={styles.inputField} placeholder="e.g. Emirates, Air India" />
        </div>

        <h3 className={styles.sectionTitle}>Additional Details</h3>
        
        <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
          <label>Special Requirements / Message</label>
          <textarea name="message" value={formData.message} onChange={handleChange} className={styles.inputField} rows={4} placeholder="Any specific dietary requirements, wheelchair assistance, etc."></textarea>
        </div>

        <button type="submit" disabled={loading} className={`${styles.primaryButton} ${styles.submitBtn}`}>
          {loading ? 'Submitting...' : 'Submit Flight Enquiry'}
        </button>
      </form>
    </div>
  );
}
