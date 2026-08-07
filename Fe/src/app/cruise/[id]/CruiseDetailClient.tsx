'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cruise, api } from '@/lib/api';
import CountryCodeSelect from '@/components/CountryCodeSelect';
import { isValidPhone, validatePhoneByCountry } from '@/lib/phoneValidation';
import styles from './cruiseDetail.module.css';

interface Props {
  cruise: Cruise;
  relatedCruises: Cruise[];
}

export default function CruiseDetailClient({ cruise, relatedCruises }: Props) {
  const [openDay, setOpenDay] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Enquiry Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    travel_date: '',
    num_people: 2,
    num_children: 0,
    children_ages: '',
    message: ''
  });
  const [countryCode, setCountryCode] = useState('+91');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneCheck = validatePhoneByCountry(formData.phone, countryCode);
    if (!phoneCheck.isValid) {
      alert(phoneCheck.message || 'Please enter a valid phone number.');
      return;
    }
    setSubmitting(true);
    setSuccess(false);

    try {
      await api.submitEnquiry({
        type: 'cruise',
        target_id: cruise.id,
        name: formData.name,
        email: formData.email,
        phone: `${countryCode} ${formData.phone}`,
        travel_date: formData.travel_date,
        num_people: Number(formData.num_people),
        num_children: Number(formData.num_children) || 0,
        children_ages: formData.children_ages,
        message: `Cruise: ${cruise.name} | Message: ${formData.message}`
      });
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        travel_date: '',
        num_people: 2,
        num_children: 0,
        children_ages: '',
        message: ''
      });
    } catch (err) {
      console.error(err);
      alert('Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* 1. Banner */}
      <section
        className={styles.heroBanner}
        style={{ backgroundImage: `url(${cruise.banner_image || 'https://images.unsplash.com/photo-1548574505-5e2386903d8f?auto=format&fit=crop&w=1920&q=80'})` }}
      >
        <div className={styles.heroOverlay} />
        <div className="container">
          <div className={styles.heroContent}>
            <nav className={styles.breadcrumb}>
              <Link href="/">Home</Link> &gt; <Link href="/cruise">Cruise</Link> &gt; <span>{cruise.name}</span>
            </nav>
            <h1 className={styles.cruiseTitle}>{cruise.banner_title || cruise.name}</h1>
            {cruise.banner_tagline && (
              <p style={{ color: 'rgba(255, 255, 255, 0.92)', fontSize: '1.1rem', marginTop: '0.4rem', marginBottom: '0.85rem', maxWidth: '750px', lineHeight: 1.5 }}>
                {cruise.banner_tagline}
              </p>
            )}
            <div className={styles.metaBadgeRow}>
              <span>📍 {cruise.destination}</span>
              <span>⏳ {cruise.duration}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className={styles.detailLayout}>
          {/* Main Content Area */}
          <div>
            {/* 2. Cruise Overview */}
            <section className={styles.sectionBlock}>
              <h2 className={styles.blockTitle}>Cruise Overview</h2>
              <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.8 }}>
                {cruise.about || cruise.short_description}
              </p>

              {/* Cruise Gallery */}
              {cruise.gallery && cruise.gallery.length > 0 && (
                <div className={styles.galleryGrid}>
                  {cruise.gallery.slice(0, 4).map((imgUrl, idx) => (
                    <img key={idx} src={imgUrl} alt={`${cruise.name} gallery ${idx + 1}`} className={styles.galleryThumb} />
                  ))}
                </div>
              )}
            </section>

            {/* 3. Cruise Highlights */}
            {cruise.highlights && cruise.highlights.length > 0 && (
              <section className={styles.sectionBlock}>
                <h2 className={styles.blockTitle}>Cruise Highlights</h2>
                <div className={styles.highlightsGrid}>
                  {cruise.highlights.map((highlight, idx) => (
                    <div key={idx} className={styles.highlightCard}>
                      <span>⚓</span>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Cruise Itinerary */}
            {cruise.itinerary && cruise.itinerary.length > 0 && (
              <section className={styles.sectionBlock}>
                <h2 className={styles.blockTitle}>Day-wise Cruise Itinerary</h2>
                <div className={styles.itineraryList}>
                  {cruise.itinerary.map((dayItem, idx) => (
                    <div key={idx} className={styles.itineraryDay}>
                      <div className={styles.itineraryHeader} onClick={() => setOpenDay(openDay === idx ? null : idx)}>
                        <span>{dayItem.day} – {dayItem.title}</span>
                        <span>{openDay === idx ? '▲' : '▼'}</span>
                      </div>
                      {openDay === idx && (
                        <div className={styles.itineraryContent}>
                          <p>{dayItem.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5 & 6. Package Includes & Excludes */}
            {((cruise.inclusions && cruise.inclusions.length > 0) || (cruise.exclusions && cruise.exclusions.length > 0)) && (
              <section className={styles.sectionBlock}>
                <div className={styles.incExcGrid}>
                  <div>
                    <h2 className={styles.blockTitle} style={{ color: '#166534' }}>Package Includes</h2>
                    <ul className={styles.checkList}>
                      {(cruise.inclusions || []).map((inc, idx) => (
                        <li key={idx} className={styles.checkItem}>
                          <span className={styles.checkIcon}>✓</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className={styles.blockTitle} style={{ color: '#991b1b' }}>Package Excludes</h2>
                    <ul className={styles.checkList}>
                      {(cruise.exclusions || []).map((exc, idx) => (
                        <li key={idx} className={styles.checkItem}>
                          <span className={styles.crossIcon}>✕</span>
                          <span>{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* 8. Need to Know */}
            {cruise.need_to_know && cruise.need_to_know.length > 0 && (
              <section className={styles.sectionBlock}>
                <h2 className={styles.blockTitle}>Need to Know</h2>
                <ul className={styles.checkList}>
                  {cruise.need_to_know.map((info, idx) => (
                    <li key={idx} className={styles.checkItem}>
                      <span>ℹ️</span>
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 10. Customer Reviews */}
            {cruise.reviews && cruise.reviews.length > 0 && (
              <section className={styles.sectionBlock}>
                <h2 className={styles.blockTitle}>Customer Reviews</h2>
                {cruise.reviews.map((rev, idx) => (
                  <div key={idx} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#0f172a' }}>{rev.name}</strong>
                      <span style={{ color: '#f59e0b' }}>{'★'.repeat(rev.rating)}</span>
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.95rem' }}>"{rev.comment}"</p>
                  </div>
                ))}
              </section>
            )}

            {/* 11. Cruise FAQs */}
            {cruise.faqs && cruise.faqs.length > 0 && (
              <section className={styles.sectionBlock}>
                <h2 className={styles.blockTitle}>Frequently Asked Questions</h2>
                {cruise.faqs.map((faq, idx) => (
                  <div key={idx} className={styles.faqItem}>
                    <div className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                      <span>{faq.question}</span>
                      <span>{openFaq === idx ? '−' : '+'}</span>
                    </div>
                    {openFaq === idx && (
                      <div className={styles.faqAnswer}>
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* 9. Related Cruise Packages */}
            {relatedCruises.length > 0 && (
              <section className={styles.sectionBlock}>
                <h2 className={styles.blockTitle}>Related Cruise Packages</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                  {relatedCruises.map((rel) => (
                    <div key={rel.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                      <img src={rel.banner_image || 'https://images.unsplash.com/photo-1548574505-5e2386903d8f?auto=format&fit=crop&w=400&q=80'} alt={rel.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                      <div style={{ padding: '1rem' }}>
                        <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.25rem' }}>{rel.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.75rem' }}>{rel.duration}</span>
                        <Link href={`/cruise/${rel.url_slug || rel.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* 12. Sticky Enquiry Form (Desktop) */}
          <div>
            <div className={styles.stickySidebar}>
              <div className={styles.sidebarCard}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
                  Book This Cruise
                </h3>
                {cruise.show_price && cruise.price ? (
                  <div className={styles.sidebarPrice} suppressHydrationWarning style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 800 }}>
                    ₹{Number(cruise.price).toLocaleString('en-IN')} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.7)' }}>/ person</span>
                  </div>
                ) : (
                  <div className={styles.sidebarPrice} style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1rem' }}>
                    Price on Request
                  </div>
                )}

                {success && (
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    ✓ Request sent! Our specialist will reach out soon.
                  </div>
                )}

                <form onSubmit={handleFormSubmit}>
                  <div style={{ marginBottom: '0.6rem' }}>
                    <label htmlFor="name" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.3rem' }}>Full Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      placeholder="John Doe" 
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.07)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        borderRadius: 'var(--radius-md, 8px)',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }} 
                    />
                  </div>

                  <div style={{ marginBottom: '0.6rem' }}>
                    <label htmlFor="phone" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.3rem' }}>Phone Number *</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', width: '100%' }}>
                      <CountryCodeSelect 
                        value={countryCode} 
                        onChange={setCountryCode} 
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.07)', 
                          border: '1px solid rgba(255, 255, 255, 0.15)', 
                          color: '#ffffff', 
                          padding: '0.65rem 0.4rem', 
                          width: '100px',
                          flexShrink: 0,
                          borderRadius: 'var(--radius-md, 8px)'
                        }} 
                      />
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        required 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        placeholder="Phone No." 
                        style={{ 
                          flex: 1, 
                          minWidth: 0,
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          background: 'rgba(255, 255, 255, 0.07)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#ffffff',
                          borderRadius: 'var(--radius-md, 8px)',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
                        }} 
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '0.6rem' }}>
                    <label htmlFor="email" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.3rem' }}>Email Address *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="john@example.com" 
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.07)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        borderRadius: 'var(--radius-md, 8px)',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }} 
                    />
                  </div>

                  <div className={styles.formRowGrid}>
                    <div style={{ marginBottom: 0 }}>
                      <label htmlFor="travel_date" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.3rem' }}>Travel Date</label>
                      <input 
                        type="date" 
                        id="travel_date" 
                        name="travel_date" 
                        value={formData.travel_date} 
                        onChange={handleInputChange} 
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          background: 'rgba(255, 255, 255, 0.07)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#ffffff',
                          borderRadius: 'var(--radius-md, 8px)',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
                        }} 
                      />
                    </div>

                    <div style={{ marginBottom: 0 }}>
                      <label htmlFor="num_people" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.3rem' }}>Travellers</label>
                      <input 
                        type="number" 
                        id="num_people" 
                        name="num_people" 
                        min="1" 
                        value={formData.num_people} 
                        onChange={handleInputChange} 
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          background: 'rgba(255, 255, 255, 0.07)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#ffffff',
                          borderRadius: 'var(--radius-md, 8px)',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
                        }} 
                      />
                    </div>
                  </div>

                  <div className={styles.formRowGrid}>
                    <div style={{ marginBottom: 0 }}>
                      <label htmlFor="num_children" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.3rem' }}>No. of Children</label>
                      <input 
                        type="number" 
                        id="num_children" 
                        name="num_children" 
                        min="0" 
                        value={formData.num_children} 
                        onChange={handleInputChange} 
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          background: 'rgba(255, 255, 255, 0.07)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#ffffff',
                          borderRadius: 'var(--radius-md, 8px)',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
                        }} 
                      />
                    </div>

                    {Number(formData.num_children) > 0 ? (
                      <div style={{ marginBottom: 0 }}>
                        <label htmlFor="children_ages" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.3rem' }}>Children Ages</label>
                        <input 
                          type="text" 
                          id="children_ages" 
                          name="children_ages" 
                          value={formData.children_ages} 
                          onChange={handleInputChange} 
                          placeholder="e.g. 5, 8" 
                          style={{
                            width: '100%',
                            padding: '0.65rem 0.85rem',
                            background: 'rgba(255, 255, 255, 0.07)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#ffffff',
                            borderRadius: 'var(--radius-md, 8px)',
                            fontSize: '0.9rem',
                            boxSizing: 'border-box'
                          }} 
                        />
                      </div>
                    ) : <div />}
                  </div>

                  <div style={{ marginBottom: '0.6rem' }}>
                    <label htmlFor="message" style={{ fontSize: '0.825rem', fontWeight: 700, color: '#ffffff', display: 'block', marginBottom: '0.3rem' }}>Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={2} 
                      value={formData.message} 
                      onChange={handleInputChange} 
                      placeholder="Questions or cabin preference..." 
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.07)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        borderRadius: 'var(--radius-md, 8px)',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }} 
                    />
                  </div>

                  <button 
                    type="submit" 
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'var(--color-primary-red, #e7282b)',
                      color: '#ffffff',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-md, 8px)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      marginTop: '0.6rem'
                    }} 
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
