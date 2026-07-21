'use client';

import React from 'react';
import Link from 'next/link';
import styles from './TourCard.module.css';
import { Tour } from '@/data/toursData';

interface TourCardProps {
  tour: Tour;
  layout?: 'horizontal' | 'vertical';
}

export default function TourCard({ tour, layout = 'vertical' }: TourCardProps) {
  // Render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(
          <svg key={i} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
          </svg>
        );
      } else if (i - rating < 1) {
        // Half star
        stars.push(
          <svg key={i} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <defs>
              <linearGradient id={`halfStar-${tour.id}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#d1d5db" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path 
              fill={`url(#halfStar-${tour.id})`} 
              d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" 
            />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} viewBox="0 0 24 24" width="16" height="16" fill="#d1d5db">
            <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
          </svg>
        );
      }
    }
    return stars;
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem(`uploaded_image_${imagePath}`);
      if (storedData) return storedData;
    }
    if (imagePath.startsWith('/') || imagePath.startsWith('http')) return imagePath;
    return `/images/${imagePath}`;
  };

  return (
    <div className={`${styles.card} ${layout === 'horizontal' ? styles.cardHorizontal : ''}`}>
      {/* Tour Image */}
      <div className={styles.imageContainer}>
        <div 
          className={styles.image} 
          style={{ backgroundImage: `url("${getImageUrl(tour.image)}")` }} 
          aria-label={tour.title}
        />
        <span className={styles.categoryBadge}>{tour.category}</span>
        {tour.show_price !== false && (
          <div className={styles.priceBadge}>
            <span className={styles.priceLabel}>From</span>
            <span className={styles.priceValue}>₹{tour.price.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Tour Content */}
      <div className={styles.content}>
        {/* Rating and Duration */}
        <div className={styles.meta}>
          <div className={styles.rating}>
            <div className={styles.stars}>{renderStars(tour.rating)}</div>
            <span className={styles.ratingValue}>{tour.rating}</span>
            <span className={styles.reviewsCount}>({tour.reviewsCount})</span>
          </div>
          <div className={styles.duration}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            <span>{tour.durationDays} Days</span>
          </div>
        </div>

        {/* Title and Destination */}
        <h3 className={styles.title}>
          <Link href={`/tour-packages/${tour.id}`}>{tour.title}</Link>
        </h3>
        <p className={styles.destination}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{tour.destination}</span>
        </p>

        <p className={styles.description}>
          {layout === 'horizontal' 
            ? tour.description 
            : (tour.description.length > 110 
                ? `${tour.description.substring(0, 107)}...` 
                : tour.description)}
        </p>

        {layout === 'horizontal' && (
          <div className={styles.highlightsContainer}>
            <h4 className={styles.highlightsTitle}>Highlights include:</h4>
            <ul className={styles.highlightsList}>
              {tour.highlights.slice(0, 3).map((hl, idx) => (
                <li key={idx} className={styles.highlightItem}>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#10b981" strokeWidth="3">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Card Actions */}
        <div className={`${styles.footer} ${styles.footerActions}`}>
          <Link 
            href={`/holidays/${tour.holidayCategory && tour.holidayCategory.length > 0 ? tour.holidayCategory[0].toLowerCase().replace(/ /g, '-') : 'all-packages'}/${tour.id}`} 
            className="btn btn-primary"
            style={{ padding: '0.5rem', backgroundColor: '#0f172a', borderColor: '#0f172a', color: 'white', textAlign: 'center', fontSize: '0.875rem' }}
          >
            View Details
          </Link>
          <a 
            href="https://wa.me/12345678900" 
            target="_blank" 
            rel="noreferrer" 
            className="btn btn-primary" 
            style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}
          >
            Enquire
          </a>
        </div>
      </div>
    </div>
  );
}
