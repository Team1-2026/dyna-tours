'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function BookingSuccessPage() {
  const [bookingRef, setBookingRef] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    // Get the most recent booking from localStorage
    const existingBookingsStr = localStorage.getItem('dyna_bookings');
    if (existingBookingsStr) {
      try {
        const existingBookings = JSON.parse(existingBookingsStr);
        if (existingBookings && existingBookings.length > 0) {
          const latestBooking = existingBookings[0];
          setBookingRef(latestBooking.ref);
          setEmail(latestBooking.email);
        }
      } catch (err) {
        console.error('Failed to parse bookings from localStorage', err);
      }
    }
  }, []);

  return (
    <div className="container" style={{ padding: '6rem 0', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#ffffff', padding: '3rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '500px', width: '100%' }}>
        <div style={{ 
          width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-primary-green)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#fff' 
        }}>
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>
        
        <h2 style={{ fontSize: '1.75rem', color: 'var(--color-secondary-navy)', marginBottom: '1rem', fontFamily: 'var(--font-manrope)' }}>
          Booking Secured!
        </h2>
        
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Your reservation has been processed successfully. We've emailed confirmation documents and packing lists to <strong>{email || 'your email address'}</strong>.
        </p>
        
        {bookingRef && (
          <div style={{ 
            background: '#f1f5f9', padding: '1rem', borderRadius: '8px', 
            fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-secondary-navy)',
            marginBottom: '2rem', letterSpacing: '1px'
          }}>
            Ref: {bookingRef}
          </div>
        )}

        <Link href="/" className="btn btn-secondary btn-full">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
