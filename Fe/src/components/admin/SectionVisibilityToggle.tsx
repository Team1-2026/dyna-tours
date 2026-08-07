'use client';

import React, { useState, useEffect } from 'react';
import { getSectionVisibility, setSectionVisibility, SectionVisibility, defaultSectionVisibility } from '@/lib/api';

interface SectionVisibilityToggleProps {
  sectionKey: keyof SectionVisibility;
  title: string;
  description?: string;
}

export default function SectionVisibilityToggle({
  sectionKey,
  title,
  description,
}: SectionVisibilityToggleProps) {
  const [visibility, setVisibilityState] = useState<SectionVisibility>(defaultSectionVisibility);

  useEffect(() => {
    setVisibilityState(getSectionVisibility());

    const handleChanged = () => {
      setVisibilityState(getSectionVisibility());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('dyna_section_visibility_changed', handleChanged);
      return () => {
        window.removeEventListener('dyna_section_visibility_changed', handleChanged);
      };
    }
  }, []);

  const isEnabled = visibility[sectionKey] !== false;

  const handleToggle = () => {
    const updated = {
      ...visibility,
      [sectionKey]: !isEnabled,
    };
    setVisibilityState(updated);
    setSectionVisibility(updated);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        backgroundColor: isEnabled ? '#f0fdf4' : '#fef2f2',
        border: `1px solid ${isEnabled ? '#bbf7d0' : '#fecaca'}`,
        marginBottom: '1.25rem',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ flex: 1, paddingRight: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>{isEnabled ? '👁️' : '🙈'}</span>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: isEnabled ? '#166534' : '#991b1b' }}>
            {title}
          </h4>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '0.725rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              backgroundColor: isEnabled ? '#dcfce7' : '#fee2e2',
              color: isEnabled ? '#15803d' : '#b91c1c',
            }}
          >
            {isEnabled ? 'Enabled on Home Page' : 'Disabled on Home Page'}
          </span>
        </div>
        {description && (
          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.825rem', color: isEnabled ? '#15803d' : '#991b1b', opacity: 0.85 }}>
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleToggle}
        style={{
          position: 'relative',
          width: '52px',
          height: '28px',
          borderRadius: '9999px',
          backgroundColor: isEnabled ? '#16a34a' : '#dc2626',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          transition: 'background-color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
        aria-label={`Toggle ${title} on Home Page`}
      >
        <span
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: isEnabled ? 'translateX(24px)' : 'translateX(0)',
            transition: 'transform 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        />
      </button>
    </div>
  );
}
