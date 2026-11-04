'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';
import { contactPageApi, api } from '@/lib/api';

const DEFAULT_POPULAR_DESTINATIONS = [
  { name: 'Kerala', path: '/destinations/kerala' },
  { name: 'Thailand', path: '/destinations/thailand' },
  { name: 'Singapore', path: '/destinations/singapore' },
  { name: 'Malaysia', path: '/destinations/malaysia' },
  { name: 'UAE', path: '/destinations/uae' },
  { name: 'Europe', path: '/destinations/europe' },
  { name: 'Goa', path: '/destinations/goa' },
  { name: 'Tamil Nadu', path: '/destinations/tamil-nadu' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [phone, setPhone] = useState('+91 97464 70555');
  const [contactEmail, setContactEmail] = useState('info@dynatoursindia.com');
  const [address, setAddress] = useState('First Floor, Marks Square Building, M C Road, Changanassery, Kerala – 686103');
  const [mapsUrl, setMapsUrl] = useState('https://maps.google.com/?q=Dyna+Tours+India+Changanassery');
  const [popularDestinations, setPopularDestinations] = useState<{ name: string; path: string }[]>(DEFAULT_POPULAR_DESTINATIONS);

  const pathname = usePathname();

  useEffect(() => {
    contactPageApi.getPage().then((data) => {
      if (data) {
        if (data.phone_numbers && data.phone_numbers.length > 0) {
          const primaryPhone = data.phone_numbers[0]?.number;
          if (primaryPhone) {
            setPhone(primaryPhone);
          }
        }
        if (data.email_addresses && data.email_addresses.length > 0) {
          setContactEmail(data.email_addresses[0].email);
        }
        if (data.office_address) {
          setAddress(data.office_address);
        }
        if (data.google_maps_url) {
          setMapsUrl(data.google_maps_url);
        }
      }
    }).catch((err) => {
      console.error('Failed to fetch footer contact details', err);
    });

    api.getDestinations().then((dests) => {
      if (Array.isArray(dests) && dests.length > 0) {
        const valid = dests.filter(d => 
          !d.parent_id && 
          !['other-domestic', 'other-international'].includes((d.url_slug || d.id || '').toLowerCase()) &&
          d.status?.toLowerCase() !== 'inactive'
        );

        if (valid.length > 0) {
          const priorityOrder: Record<string, number> = {
            'kerala': 1,
            'thailand': 2,
            'singapore': 3,
            'malaysia': 4,
            'uae': 5,
            'europe': 6,
            'goa': 7,
            'tamil-nadu': 8,
            'karnataka': 9,
            'delhi': 10,
          };

          const sorted = [...valid].sort((a, b) => {
            const hasA = a.order_no !== null && a.order_no !== undefined;
            const hasB = b.order_no !== null && b.order_no !== undefined;
            if (hasA && hasB) return (a.order_no as number) - (b.order_no as number);
            if (hasA) return -1;
            if (hasB) return 1;

            const keyA = (a.url_slug || a.id || '').toLowerCase();
            const keyB = (b.url_slug || b.id || '').toLowerCase();
            const pA = priorityOrder[keyA] ?? 99;
            const pB = priorityOrder[keyB] ?? 99;
            return pA - pB;
          });

          const mapped = sorted.slice(0, 8).map(d => ({
            name: d.name,
            path: `/destinations/${d.url_slug || d.id}`,
          }));

          if (mapped.length > 0) {
            setPopularDestinations(mapped);
          }
        }
      }
    }).catch((err) => {
      console.error('Failed to load destinations in footer', err);
    });
  }, []);

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000); // clear message after 5s
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container`}>
        {/* Brand & Info Column */}
        <div className={styles.brandCol}>
          <div className={styles.logoContainer}>
            <Link href="/" className={styles.logo}>
              <img src="/images/logo.jpg" alt="Dyna Tours" className={styles.logoImg} />
            </Link>
          </div>
          <p className={styles.description}>
            Discover the world's most breathtaking destinations with our expertly curated tours. We combine premium luxury with authentic local experiences.
          </p>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>
            </div>
            <div className={styles.contactItem}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </div>
            <div className={styles.contactItem}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">{address}</a>
            </div>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className={styles.linksCol}>
          <h3 className={styles.colTitle}>Popular Destinations</h3>
          <ul className={styles.linksList}>
            {popularDestinations.map((dest) => (
              <li key={dest.path}>
                <Link href={dest.path}>{dest.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links Column */}
        <div className={styles.linksCol}>
          <h3 className={styles.colTitle}>Travel Information</h3>
          <ul className={styles.linksList}>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact-us">Contact Us</Link></li>
            <li><Link href="/holidays">All Tour Packages</Link></li>
            <li><a href="https://dynatours.blogspot.com/" target="_blank" rel="noopener noreferrer">Travel Blog</a></li>
            {/* <li><Link href="/dashboard">Track My Booking</Link></li> */}
            <li><Link href="/visa">Visa</Link></li>
            <li><Link href="/about#services">Why Choose Us</Link></li>
            <li>
              <Link 
                href="/#client-reviews"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '')) {
                    const el = document.getElementById('client-reviews') || document.getElementById('testimonials');
                    if (el) {
                      e.preventDefault();
                      el.scrollIntoView({ behavior: 'smooth' });
                      window.history.pushState(null, '', '#client-reviews');
                    }
                  }
                }}
              >
                Client Reviews
              </Link>
            </li>
            <li><Link href="/#faq">FAQs & Help</Link></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className={styles.newsletterCol}>
          <h3 className={styles.colTitle}>Newsletter</h3>
          <p className={styles.newsletterText}>
            Subscribe to get early travel deals, holiday updates, and luxury destination guides.
          </p>
          <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Your email address"
              className={styles.newsletterInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className={styles.successMessage}>
              ✓ Successfully subscribed! Check your inbox soon.
            </p>
          )}
        </div>
      </div>

      {/* Footer Bottom Row */}
      <div className={styles.footerBottom}>
        <div className={`${styles.bottomContainer} container`}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Dyna Tours. All rights reserved. Developed by <a href="https://www.logiclabz.co.in" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>LogicLabz</a>.
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
