import React from 'react';
import Link from 'next/link';
import { api, Hotel, isHotelDeleted } from '@/lib/api';
import HotelPageClient from './HotelPageClient';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function HotelDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id || isHotelDeleted(id)) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-primary-red)' }}>Hotel Not Found</h2>
        <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
          The requested hotel is not available.
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

    if (hotel && (isHotelDeleted(hotel.id) || isHotelDeleted(hotel.url_slug) || isHotelDeleted(hotel.name))) {
      hotel = null;
    }

    if (hotel && hotel.related_hotels && hotel.related_hotels.length > 0) {
      const relatedIds = hotel.related_hotels.map((r: any) => String(r).toLowerCase().trim());
      const allHotels = await api.getHotels();
      relatedHotels = allHotels.filter(h => {
        if (!h) return false;
        if (isHotelDeleted(h.id) || isHotelDeleted(h.url_slug) || isHotelDeleted(h.name)) return false;
        if (String(h.id) === String(id) || String(h.url_slug) === String(id)) return false;
        const hid = String(h.id || '').toLowerCase().trim();
        const hslug = String(h.url_slug || '').toLowerCase().trim();
        return relatedIds.includes(hid) || relatedIds.includes(hslug);
      });
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
