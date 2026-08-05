'use client';

import React, { useState, useRef } from 'react';
import { validateImageFile } from '@/lib/imageValidation';

interface ImageItem {
  url: string;
  caption?: string;
}

interface DragDropUploaderProps {
  images: (string | ImageItem)[];
  onImagesChange: (images: (string | ImageItem)[]) => void;
  maxImages?: number;
  label?: string;
}

export default function DragDropUploader({
  images,
  onImagesChange,
  maxImages = 15,
  label = 'Gallery Images (Drag & Drop or Select Multiple)'
}: DragDropUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = (fileList: FileList | File[]) => {
    setErrorMsg(null);
    const validUrls: string[] = [];

    Array.from(fileList).forEach(file => {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        setErrorMsg(validation.error || 'Invalid image file.');
        return;
      }
      // Create local object URL for preview/upload
      const objectUrl = URL.createObjectURL(file);
      validUrls.push(objectUrl);
    });

    if (validUrls.length > 0) {
      const updated = [...images, ...validUrls].slice(0, maxImages);
      onImagesChange(updated);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onImagesChange(updated);
  };

  return (
    <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.5rem' }}>
        {label} <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(WebP, SVG, PNG up to 1 MB)</span>
      </label>

      {errorMsg && (
        <div style={{ padding: '0.6rem 1rem', background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '8px', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: isDragging ? '2px dashed #dc2626' : '2px dashed #cbd5e1',
          background: isDragging ? 'rgba(220, 38, 38, 0.04)' : '#f8fafc',
          borderRadius: '12px',
          padding: '1.75rem 1rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '1rem'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/webp,image/svg+xml,image/png,image/jpeg"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#64748b" strokeWidth="2" style={{ margin: '0 auto 0.5rem', display: 'block' }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.925rem' }}>
          Drag & Drop multiple images here, or <span style={{ color: '#dc2626', textDecoration: 'underline' }}>browse files</span>
        </p>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem', display: 'block' }}>
          Supports WebP, SVG, PNG files (Max 1 MB each)
        </span>
      </div>

      {/* Sequential Image Preview Grid with Remove (×) Buttons */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.85rem' }}>
          {images.map((img, idx) => {
            const url = typeof img === 'string' ? img : img.url;
            return (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '90px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  background: '#ffffff'
                }}
              >
                <img
                  src={url}
                  alt={`Uploaded ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Close / Remove Image Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(idx);
                  }}
                  title="Remove image"
                  aria-label="Remove image"
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  ×
                </button>
                <span style={{ position: 'absolute', bottom: '2px', left: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '1px 4px', borderRadius: '4px' }}>
                  #{idx + 1}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
