import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Dyna Tours',
  description: 'Explore premium guided tours across the globe. Compare adventure travel packages, cultural journeys, and luxury honeymoons with local experts.',
  keywords: ['travel packages', 'guided tours', 'luxury vacation', 'adventure tours', 'honeymoon packages', 'swiss alps', 'kyoto tour', 'amalfi coast'],
};

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
