import type { Metadata } from 'next';
import React from 'react';
import { getBaseUrl } from '@/lib/api';

const API_URL = getBaseUrl();

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

const stripHtml = (html: string) => html ? html.replace(/<[^>]*>/g, '') : '';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return {
      title: 'Hotel Booking | Dyna Tours',
      description: 'Stay in ultimate comfort. Plan your perfect vacation with Dyna Tours.',
    };
  }

  try {
    const res = await fetch(`${API_URL}/hotels/${id}`, {
      next: { revalidate: 3600 }
    });

    if (res.ok) {
      const hotel = await res.json();
      if (hotel && hotel.name) {
        const title = hotel.meta_title || `Book ${hotel.name} | ${hotel.category} Hotel in ${hotel.location} | Dyna Tours`;
        const description = hotel.meta_description || (hotel.short_description
          ? stripHtml(hotel.short_description).substring(0, 160) + '...'
          : `Book your luxury stay at ${hotel.name} in ${hotel.location}. View rooms, rates, amenities, and nearby attractions.`);
        const canonical = hotel.canonical_url || undefined;

        return {
          title,
          description,
          alternates: canonical ? { canonical } : undefined,
          openGraph: {
            title: hotel.og_title || title,
            description: hotel.og_description || description,
            type: 'website',
            images: hotel.gallery && hotel.gallery.length > 0 ? [{ url: typeof hotel.gallery[0] === 'string' ? hotel.gallery[0] : (hotel.gallery[0] as any)?.url || '' }] : [],
          }
        };
      }
    }
  } catch (error) {
    console.error('Error fetching metadata for hotel', id, error);
  }

  // Fallback metadata if API fails
  const name = id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `Book ${name} | Luxury Accommodations | Dyna Tours`,
    description: `Stay in ultimate comfort at ${name}. Discover amenities, room categories, and booking enquiries with Dyna Tours.`,
  };
}

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
