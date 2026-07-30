'use client';

import React from 'react';

export const COUNTRY_CODES = [
  { code: '+91', country: 'IN', flag: '🇮🇳', label: '+91 (India)' },
  { code: '+1', country: 'US', flag: '🇺🇸', label: '+1 (USA/Canada)' },
  { code: '+44', country: 'GB', flag: '🇬🇧', label: '+44 (UK)' },
  { code: '+971', country: 'AE', flag: '🇦🇪', label: '+971 (UAE)' },
  { code: '+65', country: 'SG', flag: '🇸🇬', label: '+65 (Singapore)' },
  { code: '+61', country: 'AU', flag: '🇦🇺', label: '+61 (Australia)' },
  { code: '+966', country: 'SA', flag: '🇸🇦', label: '+966 (Saudi Arabia)' },
  { code: '+974', country: 'QA', flag: '🇶🇦', label: '+974 (Qatar)' },
  { code: '+968', country: 'OM', flag: '🇴🇲', label: '+968 (Oman)' },
  { code: '+965', country: 'KW', flag: '🇰🇼', label: '+965 (Kuwait)' },
  { code: '+973', country: 'BH', flag: '🇧🇭', label: '+973 (Bahrain)' },
  { code: '+60', country: 'MY', flag: '🇲🇾', label: '+60 (Malaysia)' },
  { code: '+66', country: 'TH', flag: '🇹🇭', label: '+66 (Thailand)' },
  { code: '+49', country: 'DE', flag: '🇩🇪', label: '+49 (Germany)' },
  { code: '+33', country: 'FR', flag: '🇫🇷', label: '+33 (France)' },
];

interface CountryCodeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function CountryCodeSelect({ value, onChange, className, style }: CountryCodeSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      style={{
        padding: '0.75rem 0.5rem',
        borderRadius: 'var(--radius-md, 8px)',
        border: '1px solid var(--color-border, #cbd5e1)',
        backgroundColor: '#ffffff',
        fontSize: '0.9rem',
        fontWeight: 600,
        color: 'var(--color-secondary-navy, #0f172a)',
        cursor: 'pointer',
        outline: 'none',
        flexShrink: 0,
        width: '105px',
        ...style
      }}
      aria-label="Country phone code"
    >
      {COUNTRY_CODES.map((item) => (
        <option key={`${item.country}-${item.code}`} value={item.code}>
          {item.flag} {item.code}
        </option>
      ))}
    </select>
  );
}
