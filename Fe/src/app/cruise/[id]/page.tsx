import React from 'react';
import Link from 'next/link';
import { api, Cruise } from '@/lib/api';
import CruiseDetailClient from './CruiseDetailClient';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  try {
    const cruise = await api.getCruise(id);
    if (cruise) {
      return {
        title: cruise.meta_title || `${cruise.name} | Dyna Tours India`,
        description: cruise.meta_description || cruise.short_description,
      };
    }
  } catch {
    // fallback
  }
  return {
    title: 'Cruise Package | Dyna Tours India',
    description: 'Explore luxury cruise vacations with Dyna Tours India.',
  };
}

export default async function CruiseDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-primary-red)' }}>Cruise Package Not Found</h2>
        <Link href="/cruise" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          Back to Cruise Holidays
        </Link>
      </div>
    );
  }

  let cruise: Cruise | null = null;
  let relatedCruises: Cruise[] = [];

  try {
    cruise = await api.getCruise(id);
    const allCruises = await api.getCruises({ status: 'Active' });
    relatedCruises = allCruises.filter(c => c.id !== id).slice(0, 3);
  } catch (err) {
    console.error('Error fetching cruise package details:', err);
  }

  if (!cruise) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-primary-red)' }}>Cruise Package Not Found</h2>
        <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
          The requested cruise itinerary does not exist or has been removed.
        </p>
        <Link href="/cruise" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          Back to Cruise Holidays
        </Link>
      </div>
    );
  }

  return <CruiseDetailClient cruise={cruise} relatedCruises={relatedCruises} />;
}
