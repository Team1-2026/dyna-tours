'use client';

import React, { useEffect, useState } from 'react';
import ResolvedImage from './ResolvedImage';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex: number;
}

export default function ImageZoomModal({ isOpen, onClose, images, initialIndex }: ImageZoomModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, images]);

  if (!isOpen || images.length === 0) return null;

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImageUrl = images[currentIndex] || '';

  return (
    <div 
      style={styles.overlay} 
      onClick={onClose}
    >
      {/* Top bar controls */}
      <div style={styles.topBar}>
        <div style={styles.counter}>
          Image {currentIndex + 1} of {images.length}
        </div>
        <button 
          type="button"
          style={styles.closeBtn} 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close lightbox"
        >
          &times;
        </button>
      </div>

      {/* Prev Navigation Button */}
      {images.length > 1 && (
        <button 
          type="button"
          style={{ ...styles.navBtn, left: '24px' }} 
          onClick={handlePrev}
          aria-label="Previous image"
        >
          &#10094;
        </button>
      )}

      {/* Main Image Container */}
      <div 
        style={styles.imageWrapper}
        onClick={(e) => e.stopPropagation()}
      >
        <ResolvedImage 
          src={currentImageUrl} 
          alt={`Gallery zoom view ${currentIndex + 1}`} 
          style={styles.image}
        />
      </div>

      {/* Next Navigation Button */}
      {images.length > 1 && (
        <button 
          type="button"
          style={{ ...styles.navBtn, right: '24px' }} 
          onClick={handleNext}
          aria-label="Next image"
        >
          &#10095;
        </button>
      )}
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 15, 30, 0.9)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    animation: 'fadeIn 0.25s ease-out',
    userSelect: 'none' as const,
  },
  topBar: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    padding: '20px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10000,
  },
  counter: {
    color: '#f8fafc',
    fontSize: '0.95rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    background: 'rgba(0, 0, 0, 0.4)',
    padding: '6px 14px',
    borderRadius: '20px',
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: '#ffffff',
    fontSize: '28px',
    lineHeight: '28px',
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  imageWrapper: {
    position: 'relative' as const,
    maxWidth: '85vw',
    maxHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '80vh',
    objectFit: 'contain' as const,
    borderRadius: '12px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  navBtn: {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#ffffff',
    fontSize: '20px',
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    zIndex: 10000,
    outline: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
};
