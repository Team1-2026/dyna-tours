import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Discover Luxury Hotels & Vacation Stays | Dyna Tours',
  description: 'Search and book handpicked 5-star resorts, boutique hotels, and premium retreats. Compare amenities, rooms, and special holiday deals with Dyna Tours.',
  keywords: ['luxury hotels', '5-star resorts', 'vacation stays', 'boutique hotels', 'hotel booking', 'Munnar resort', 'Blanket hotel'],
};

export default function HotelsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
