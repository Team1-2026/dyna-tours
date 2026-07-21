import React from 'react';

interface AmenityIconProps {
  name: string;
  size?: number;
  className?: string;
}

export const AmenityIcon: React.FC<AmenityIconProps> = ({ name, size = 20, className }) => {
  const normName = name.toLowerCase().trim();

  // Common SVG properties
  const svgProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: className,
  };

  switch (normName) {
    // Wifi
    case 'wifi':
      return (
        <svg {...svgProps}>
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth={3} />
        </svg>
      );

    // Breakfast
    case 'breakfast':
      return (
        <svg {...svgProps}>
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
      );

    // Pool
    case 'pool':
    case 'swimming pool':
      return (
        <svg {...svgProps}>
          <path d="M2 10a4 4 0 0 0 8 0 4 4 0 0 0 8 0 4 4 0 0 0 4 0" />
          <path d="M2 14a4 4 0 0 0 8 0 4 4 0 0 0 8 0 4 4 0 0 0 4 0" />
          <path d="M2 18a4 4 0 0 0 8 0 4 4 0 0 0 8 0 4 4 0 0 0 4 0" />
        </svg>
      );

    // Gym
    case 'gym':
    case 'fitness':
      return (
        <svg {...svgProps}>
          <rect x="2" y="9" width="3" height="6" rx="1" />
          <rect x="5" y="5" width="2" height="14" rx="1" />
          <line x1="7" y1="12" x2="17" y2="12" strokeWidth="2.5" />
          <rect x="17" y="5" width="2" height="14" rx="1" />
          <rect x="19" y="9" width="3" height="6" rx="1" />
        </svg>
      );

    // Spa
    case 'spa':
    case 'wellness':
      return (
        <svg {...svgProps}>
          <path d="M12 2S4.5 8.5 4.5 13a7.5 7.5 0 0 0 15 0c0-4.5-7.5-11-7.5-11Z" />
          <path d="M12 22V12" />
          <path d="M12 12c2-2.5 5-3.5 7.5-3.5" />
          <path d="M12 15c-2-2-5-2.5-7.5-2.5" />
        </svg>
      );

    // Restaurant
    case 'restaurant':
    case 'dining':
      return (
        <svg {...svgProps}>
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2v0a5 5 0 0 0-5 5v8c0 1.1.9 2 2 2h3Z" />
          <path d="M19 15v7" />
        </svg>
      );

    // Bar
    case 'bar':
    case 'lounge':
    case 'drinks':
      return (
        <svg {...svgProps}>
          <path d="M18 22H6" />
          <path d="M12 15v7" />
          <path d="M12 15a7 7 0 0 0 7-7V3H5v5a7 7 0 0 0 7 7Z" />
          <path d="M5 8h14" />
        </svg>
      );

    // Indoor games
    case 'indoor games':
    case 'games':
      return (
        <svg {...svgProps}>
          <rect x="2" y="6" width="20" height="12" rx="3" />
          <path d="M6 12h4M8 10v4" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="18" cy="12" r="1.5" />
        </svg>
      );

    // Activity
    case 'activity':
    case 'activities':
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
        </svg>
      );

    // Airport Transport
    case 'airport transport':
    case 'transport':
    case 'cab':
      return (
        <svg {...svgProps}>
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      );

    // Sight seeing
    case 'sight seeing':
    case 'sightseeing':
      return (
        <svg {...svgProps}>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );

    // AC
    case 'ac':
    case 'air conditioning':
      return (
        <svg {...svgProps}>
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
          <path d="m10 4 2-2 2 2" />
          <path d="m10 20 2 2 2-2" />
          <path d="m20 10 2 2-2 2" />
          <path d="m4 10-2 2 2 2" />
        </svg>
      );

    // TV
    case 'tv':
    case 'television':
      return (
        <svg {...svgProps}>
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
          <polyline points="17 2 12 7 7 2" />
        </svg>
      );

    // Mini Bar
    case 'mini bar':
    case 'minibar':
      return (
        <svg {...svgProps}>
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="5" y1="12" x2="19" y2="12" />
          <line x1="9" y1="6" x2="9" y2="8" />
          <line x1="9" y1="15" x2="9" y2="18" />
        </svg>
      );

    // Balcony
    case 'balcony':
    case 'terrace':
      return (
        <svg {...svgProps}>
          <path d="M3 21V3h18v18H3Z" />
          <path d="M3 14h18" />
          <path d="M7 14v7" />
          <path d="M12 14v7" />
          <path d="M17 14v7" />
          <path d="M10 8h4v2h-4z" />
        </svg>
      );

    // Jacuzzi
    case 'jacuzzi':
    case 'bathtub':
    case 'hot tub':
      return (
        <svg {...svgProps}>
          <path d="M2 9h20v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V9Z" />
          <path d="M6 5v4" />
          <path d="M10 5v4" />
          <path d="M14 5v4" />
          <path d="M18 5v4" />
          <circle cx="12" cy="14" r="1" />
          <circle cx="8" cy="15" r="1" />
          <circle cx="16" cy="15" r="1" />
        </svg>
      );

    // Safe
    case 'safe':
    case 'locker':
      return (
        <svg {...svgProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 5V3M12 21v-2M5 12H3M21 12h-2" />
        </svg>
      );

    // Room service
    case 'room service':
      return (
        <svg {...svgProps}>
          <path d="M2 18h20" />
          <path d="M5 18a7 7 0 0 1 14 0" />
          <path d="M12 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
          <path d="M12 6v5" />
        </svg>
      );

    // Coffee / Tea Maker
    case 'coffee maker':
    case 'tea maker':
    case 'coffee/tea maker':
      return (
        <svg {...svgProps}>
          <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
          <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
          <line x1="6" y1="2" x2="6" y2="4" />
          <line x1="10" y1="2" x2="10" y2="4" />
          <line x1="14" y1="2" x2="14" y2="4" />
        </svg>
      );

    // Dining area
    case 'dining area':
    case 'dining':
      return (
        <svg {...svgProps}>
          <rect x="3" y="11" width="18" height="4" rx="1" />
          <line x1="6" y1="15" x2="6" y2="22" />
          <line x1="18" y1="15" x2="18" y2="22" />
          <circle cx="8" cy="6" r="2" />
          <circle cx="16" cy="6" r="2" />
        </svg>
      );

    // Kitchenette
    case 'kitchenette':
    case 'kitchen':
      return (
        <svg {...svgProps}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <line x1="15" y1="4" x2="15" y2="20" />
          <circle cx="18.5" cy="8.5" r="1.5" />
          <circle cx="18.5" cy="12" r="1.5" />
          <circle cx="18.5" cy="15.5" r="1.5" />
          <rect x="5" y="8" width="7" height="8" rx="1" />
        </svg>
      );

    // Special decor
    case 'special decor':
    case 'special decoration':
      return (
        <svg {...svgProps}>
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="m5 3 1 2.5" />
          <path d="m19 15 1 2.5" />
        </svg>
      );

    default:
      return (
        <svg {...svgProps}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
  }
};
