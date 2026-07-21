import React from 'react';
import Link from 'next/link';
import { api, Destination } from '@/lib/api';
import DestinationPageClient from './DestinationPageClient';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function DestinationPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-primary-red)' }}>Destination Not Found</h2>
        <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
          Invalid request parameters.
        </p>
        <Link href="/" className="btn btn-primary" style={{ marginTop: '2.5rem' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  let destination: Destination | null = null;
  try {
    destination = await api.getDestination(slug);
  } catch (error) {
    console.error('Error loading destination details on server:', error);
  }

  if (!destination) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-primary-red)' }}>Destination Not Found</h2>
        <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
          Please make sure the backend Laravel server is running or check the URL.
        </p>
        <Link href="/" className="btn btn-primary" style={{ marginTop: '2.5rem' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  return <DestinationPageClient initialDestination={destination} slug={slug} />;
}
