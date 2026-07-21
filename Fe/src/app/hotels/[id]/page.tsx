import React from 'react';
import Link from 'next/link';
import { api, Hotel } from '@/lib/api';
import HotelPageClient from './HotelPageClient';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function HotelDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-primary-red)' }}>Hotel Not Found</h2>
        <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
          Invalid request parameters.
        </p>
        <Link href="/hotels" className="btn btn-primary" style={{ marginTop: '2.5rem' }}>
          Back to Directory
        </Link>
      </div>
    );
  }

  let hotel: Hotel | null = null;
  let relatedHotels: Hotel[] = [];

  try {
    // Fetch hotel details
    hotel = await api.getHotel(id);

    if (hotel && hotel.related_hotels && hotel.related_hotels.length > 0) {
      const relatedIds = hotel.related_hotels;
      const allHotels = await api.getHotels();
      relatedHotels = allHotels.filter(h => relatedIds.includes(h.id));
    }
  } catch (error) {
    console.error('Error fetching hotel details on server:', error);
  }

  if (!hotel) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-primary-red)' }}>Hotel Not Found</h2>
        <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
          Please make sure the backend Laravel server is running or check the URL.
        </p>
        <Link href="/hotels" className="btn btn-primary" style={{ marginTop: '2.5rem' }}>
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <HotelPageClient 
      initialHotel={hotel} 
      initialRelatedHotels={relatedHotels} 
      id={id} 
    />
  );
}
