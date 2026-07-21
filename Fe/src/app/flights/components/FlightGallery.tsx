'use client';
import React, { useState } from 'react';
import styles from '../page.module.css';

export default function FlightGallery({ images }: { images: string[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className={styles.galleryGrid}>
        {images.map((img, idx) => (
          <div key={idx} className={styles.galleryItem} onClick={() => openLightbox(idx)}>
            <img src={img} alt={`Flight Gallery ${idx + 1}`} loading="lazy" />
          </div>
        ))}
      </div>

      <div className={`${styles.lightbox} ${lightboxOpen ? styles.active : ''}`} onClick={() => setLightboxOpen(false)}>
        <span className={styles.closeLightbox}>&times;</span>
        {lightboxOpen && (
          <img src={images[currentIndex]} alt="Lightbox Preview" className={styles.lightboxImg} onClick={(e) => e.stopPropagation()} />
        )}
      </div>
    </>
  );
}
