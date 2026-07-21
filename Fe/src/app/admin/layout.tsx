import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Dyna Tours',
  description: 'Dyna Tours administration panel for managing destinations, hotels, room listings, and client enquiry submissions.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
