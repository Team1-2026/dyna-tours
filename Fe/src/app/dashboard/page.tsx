'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './dashboard.module.css';

interface Booking {
  ref: string;
  tourId: string;
  tourTitle: string;
  tourImage: string;
  destination: string;
  pricePaid: number;
  travelers: number;
  travelDate: string;
  fullName: string;
  email: string;
  dateBooked: string;
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  // Read bookings from localStorage post-hydration
  useEffect(() => {
    const saved = localStorage.getItem('dyna_bookings');
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {
        setBookings([]);
      }
    } else {
      setBookings([]);
    }
  }, []);

  // Cancel reservation
  const handleCancelBooking = (ref: string) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${ref}? This action cannot be undone.`)) {
      return;
    }

    if (bookings) {
      const updated = bookings.filter((b) => b.ref !== ref);
      setBookings(updated);
      localStorage.setItem('dyna_bookings', JSON.stringify(updated));
      alert(`Booking ${ref} was successfully cancelled. Refund has been initiated.`);
    }
  };

  // View receipt summary
  const handleViewReceipt = (booking: Booking) => {
    alert(`
=========================================
          DYNA TOURS & TRAVELS
            OFFICIAL RECEIPT
=========================================
Booking Ref:   ${booking.ref}
Date Issued:   ${booking.dateBooked}
Lead Guest:    ${booking.fullName}
Email:         ${booking.email}

Tour Details:  ${booking.tourTitle}
Destination:   ${booking.destination}
Travel Date:   ${new Date(booking.travelDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}

Guests count:  ${booking.travelers} traveler(s)
Total Paid:    ₹${booking.pricePaid.toLocaleString()}
Payment:       Credit Card (Simulated)
Status:        SECURED & CONFIRMED
=========================================
Thank you for exploring the world with Dyna Tours!
    `);
  };

  // Prevent rendering before localStorage is parsed
  if (bookings === null) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', fontWeight: 600 }}>
          Retrieving your bookings...
        </p>
      </div>
    );
  }

  // Profile metadata derivation
  const activeCount = bookings.length;
  const totalSpend = bookings.reduce((sum, b) => sum + b.pricePaid, 0);
  const primaryName = activeCount > 0 ? bookings[0].fullName : 'Traveler';
  const primaryEmail = activeCount > 0 ? bookings[0].email : 'explore@dynatours.com';

  return (
    <section className={styles.pageWrapper}>
      <div className="container">
        <h1 className={styles.dashboardTitle}>My Travel Dashboard</h1>

        <div className={styles.layout}>
          {/* Left Column: Profile Card */}
          <aside className={styles.profileCard}>
            <div className={styles.avatar}>
              {primaryName.substring(0, 2).toUpperCase()}
            </div>
            <h2 className={styles.username}>{primaryName}</h2>
            <p className={styles.userEmail}>{primaryEmail}</p>
            
            <span className={styles.loyaltyBadge}>
              {activeCount > 2 ? 'Explorer Gold Elite' : 'Dyna Explorer'}
            </span>

            <div className={styles.profileStats}>
              <div className={styles.statItem}>
                <span className={styles.statVal}>{activeCount}</span>
                <span className={styles.statLabel}>Trips</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>${totalSpend.toLocaleString()}</span>
                <span className={styles.statLabel}>Spent</span>
              </div>
            </div>
          </aside>

          {/* Right Column: Bookings Listing */}
          <div className={styles.bookingsArea}>
            <h2 className={styles.sectionHeader}>Upcoming Tours</h2>

            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div key={booking.ref} className={styles.bookingCard}>
                  {/* Tour Image */}
                  <div 
                    className={styles.image} 
                    style={{ backgroundImage: `url(${booking.tourImage})` }} 
                  />
                  
                  {/* Tour Info */}
                  <div className={styles.content}>
                    <div className={styles.header}>
                      <h3 className={styles.tourTitle}>
                        <Link href={`/tour-packages/${booking.tourId}`}>{booking.tourTitle}</Link>
                      </h3>
                      <span className={styles.refNum}>{booking.ref}</span>
                    </div>

                    <div className={styles.details}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Destination</span>
                        <span className={styles.detailVal}>{booking.destination}</span>
                      </div>
                      
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Travel Date</span>
                        <span className={styles.detailVal}>
                          {new Date(booking.travelDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Total Paid</span>
                        <span className={`${styles.detailVal} ${styles.priceVal}`}>
                          ₹{booking.pricePaid.toLocaleString()}
                        </span>
                      </div>

                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Travelers</span>
                        <span className={styles.detailVal}>{booking.travelers} guest(s)</span>
                      </div>

                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Receipt Status</span>
                        <span className={`${styles.statusBadge} ${styles.statusConfirmed}`}>
                          ✓ Confirmed
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className={styles.actions}>
                      <button 
                        type="button" 
                        className={styles.cancelBtn}
                        onClick={() => handleCancelBooking(booking.ref)}
                      >
                        Cancel Reservation
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleViewReceipt(booking)}
                      >
                        View Receipt
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </div>
                <h3 className={styles.emptyTitle}>No Bookings Yet</h3>
                <p className={styles.emptyText}>
                  Explore our luxury tour packages and secure your next travel experience. Your booked itineraries will show up here.
                </p>
                <Link href="/tours" className="btn btn-primary">
                  Find Tour Packages
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
