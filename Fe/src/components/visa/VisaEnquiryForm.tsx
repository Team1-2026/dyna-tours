'use client';

import React, { useState } from 'react';
import styles from '../../app/visa/page.module.css';
import { VisaCountry } from '@/data/visaData';

interface VisaEnquiryFormProps {
  destinations: VisaCountry[];
  preselectedCountry?: string;
}

export default function VisaEnquiryForm({ destinations, preselectedCountry = '' }: VisaEnquiryFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    destinationCountry: preselectedCountry,
    visaType: '',
    travelDate: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Mock API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({
        fullName: '',
        mobileNumber: '',
        emailAddress: '',
        destinationCountry: preselectedCountry,
        visaType: '',
        travelDate: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section bg-white" id="enquiry" style={{ paddingTop: '2rem' }}>
      <div className="container">
        <div className={styles.enquiryWrapper}>
          <div className={styles.enquiryText}>
            <span className="section-subtitle">Response within 24 hours</span>
            <h2 className="section-title">Start Your Visa Enquiry</h2>
            <p className={styles.enquiryDesc}>
              Tell us where you're planning to go and we'll guide you through the process. Our visa experts will review your request and get back to you with the specific requirements and next steps.
            </p>
            <div className={styles.secureBadge}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Your information is secure and will only be used for visa assistance.</span>
            </div>
          </div>

          <div className={styles.enquiryFormCard}>
            {submitStatus === 'success' ? (
              <div className={styles.successMessage}>
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--color-primary-red)" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h3>Enquiry Submitted!</h3>
                <p>Thank you for reaching out. One of our visa experts will contact you within 24 hours.</p>
                <button type="button" className="btn btn-outline" onClick={() => setSubmitStatus('idle')}>
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.formGrid}>
                <div className={styles.inputGroupFull}>
                  <label htmlFor="fullName">Full Name</label>
                  <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Enter your full name" />
                </div>

                <div className={styles.inputGroupHalf}>
                  <label htmlFor="mobileNumber">Mobile Number</label>
                  <input type="tel" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required placeholder="Enter your mobile number" />
                </div>

                <div className={styles.inputGroupHalf}>
                  <label htmlFor="emailAddress">Email Address</label>
                  <input type="email" id="emailAddress" name="emailAddress" value={formData.emailAddress} onChange={handleChange} required placeholder="Enter your email address" />
                </div>

                <div className={styles.inputGroupHalf}>
                  <label htmlFor="destinationCountry">Destination Country</label>
                  <select id="destinationCountry" name="destinationCountry" value={formData.destinationCountry} onChange={handleChange} required>
                    <option value="" disabled>Select destination country</option>
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                    <option value="other">Other / Schengen</option>
                  </select>
                </div>

                <div className={styles.inputGroupHalf}>
                  <label htmlFor="visaType">Visa Type</label>
                  <select id="visaType" name="visaType" value={formData.visaType} onChange={handleChange} required>
                    <option value="" disabled>Choose visa type</option>
                    <option value="Tourist">Tourist Visa</option>
                    <option value="Business">Business Visa</option>
                    <option value="Visit">Visit Visa</option>
                  </select>
                </div>

                <div className={styles.inputGroupFull}>
                  <label htmlFor="travelDate">Tentative Travel Date</label>
                  <input type="date" id="travelDate" name="travelDate" value={formData.travelDate} onChange={handleChange} required />
                </div>

                <div className={styles.inputGroupFull}>
                  <label htmlFor="message">Message (Optional)</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Any specific requirements or questions?"></textarea>
                </div>

                {submitStatus === 'error' && (
                  <div className={styles.errorMessage}>
                    Failed to submit enquiry. Please try again later.
                  </div>
                )}

                <div className={styles.inputGroupFull}>
                  <button type="submit" className={`btn btn-primary btn-full ${styles.submitBtn}`} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
