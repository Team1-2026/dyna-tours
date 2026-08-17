'use client';

import React, { useState } from 'react';

interface VisaFlagProps {
  flag?: string;
  countryName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
}

// Convert emoji flag (e.g. 🇸🇬) to 2-letter ISO country code (e.g. 'sg')
export const emojiToCountryCode = (flagEmoji?: string): string | null => {
  if (!flagEmoji) return null;
  const str = flagEmoji.trim();
  
  // If it's already a 2-letter ISO code
  if (/^[a-zA-Z]{2}$/.test(str)) {
    return str.toLowerCase();
  }

  // Convert regional indicator symbols to letters
  const codePoints = Array.from(str).map(char => char.codePointAt(0) || 0);
  if (codePoints.length >= 2 && codePoints[0] >= 0x1f1e6 && codePoints[0] <= 0x1f1ff && codePoints[1] >= 0x1f1e6 && codePoints[1] <= 0x1f1ff) {
    const char1 = String.fromCharCode(codePoints[0] - 0x1f1e6 + 65);
    const char2 = String.fromCharCode(codePoints[1] - 0x1f1e6 + 65);
    return `${char1}${char2}`.toLowerCase();
  }

  return null;
};

// Map country names to 2-letter ISO country codes
export const countryNameToCode = (name?: string): string | null => {
  if (!name) return null;
  const clean = name.toLowerCase().trim();

  const map: Record<string, string> = {
    'singapore': 'sg',
    'vietnam': 'vn',
    'thailand': 'th',
    'malaysia': 'my',
    'united arab emirates': 'ae',
    'uae': 'ae',
    'dubai': 'ae',
    'united kingdom': 'gb',
    'uk': 'gb',
    'great britain': 'gb',
    'england': 'gb',
    'united states': 'us',
    'usa': 'us',
    'america': 'us',
    'japan': 'jp',
    'cambodia': 'kh',
    'china': 'cn',
    'south korea': 'kr',
    'korea': 'kr',
    'indonesia': 'id',
    'bali': 'id',
    'turkey': 'tr',
    'türkiye': 'tr',
    'egypt': 'eg',
    'sri lanka': 'lk',
    'maldives': 'mv',
    'azerbaijan': 'az',
    'georgia': 'ge',
    'france': 'fr',
    'germany': 'de',
    'italy': 'it',
    'spain': 'es',
    'switzerland': 'ch',
    'netherlands': 'nl',
    'belgium': 'be',
    'austria': 'at',
    'canada': 'ca',
    'australia': 'au',
    'schengen': 'eu',
    'europe': 'eu',
    'bhutan': 'bt',
    'brazil': 'br',
    'denmark': 'dk',
    'fiji': 'fj',
    'greece': 'gr',
    'hong kong': 'hk',
    'hungary': 'hu',
    'india': 'in',
    'kenya': 'ke',
    'mauritius': 'mu',
    'mexico': 'mx',
    'morocco': 'ma',
    'nepal': 'np',
    'new zealand': 'nz',
    'norway': 'no',
    'oman': 'om',
    'philippines': 'ph',
    'poland': 'pl',
    'portugal': 'pt',
    'qatar': 'qa',
    'russia': 'ru',
    'saudi arabia': 'sa',
    'seychelles': 'sc',
    'south africa': 'za',
    'sweden': 'se',
    'taiwan': 'tw',
    'uzbekistan': 'uz',
    'armenia': 'am',
    'kazakhstan': 'kz',
  };

  if (map[clean]) return map[clean];

  for (const [key, code] of Object.entries(map)) {
    if (clean.includes(key)) return code;
  }

  return null;
};

// Resolve flag image URL
export const getVisaFlagUrl = (flag?: string, countryName?: string): string => {
  if (flag && (flag.startsWith('http://') || flag.startsWith('https://') || flag.startsWith('data:') || flag.startsWith('/'))) {
    return flag;
  }

  const codeFromFlag = emojiToCountryCode(flag);
  if (codeFromFlag) {
    return `https://flagcdn.com/w160/${codeFromFlag}.png`;
  }

  const codeFromName = countryNameToCode(countryName);
  if (codeFromName) {
    return `https://flagcdn.com/w160/${codeFromName}.png`;
  }

  return 'https://flagcdn.com/w160/un.png';
};

export const VisaFlag: React.FC<VisaFlagProps> = ({
  flag,
  countryName = '',
  size = 'md',
  className = '',
  style = {},
}) => {
  const [imgError, setImgError] = useState(false);
  const flagUrl = getVisaFlagUrl(flag, countryName);

  // Dimension presets
  const dimensions = {
    sm: { width: 28, height: 20, fontSize: '1.2rem', borderRadius: '3px' },
    md: { width: 44, height: 32, fontSize: '1.8rem', borderRadius: '4px' },
    lg: { width: 72, height: 50, fontSize: '3rem', borderRadius: '6px' },
    xl: { width: 96, height: 68, fontSize: '4rem', borderRadius: '8px' },
  }[size];

  if (imgError) {
    return (
      <span
        className={className}
        style={{
          fontSize: dimensions.fontSize,
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
        title={countryName || 'Country Flag'}
      >
        {flag || '🏳️'}
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
        boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: dimensions.borderRadius,
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        background: '#f1f5f9',
        ...style,
      }}
    >
      <img
        src={flagUrl}
        alt={countryName ? `${countryName} Flag` : 'Country Flag'}
        onError={() => setImgError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </span>
  );
};

export default VisaFlag;
