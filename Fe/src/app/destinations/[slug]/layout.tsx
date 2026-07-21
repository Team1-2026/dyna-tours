import type { Metadata } from 'next';
import React from 'react';
import { getBaseUrl } from '@/lib/api';

const API_URL = getBaseUrl();

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

const stripHtml = (html: string) => html ? html.replace(/<[^>]*>/g, '') : '';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    return {
      title: 'Destination Guide | Dyna Tours',
      description: 'Explore scenic attractions, luxury hotel accommodations, and tour packages with Dyna Tours.',
    };
  }

  try {
    const res = await fetch(`${API_URL}/destinations/${slug}`, {
      next: { revalidate: 3600 } // cache for an hour
    });
    
    if (res.ok) {
      const destination = await res.json();
      if (destination && destination.name) {
        const title = destination.meta_title || `${destination.name} Travel Guide & Tour Packages | Dyna Tours`;
        const description = destination.meta_description || (destination.overview 
          ? stripHtml(destination.overview).substring(0, 160) + '...'
          : `Explore scenic attractions, luxury hotel accommodations, and specially curated packages in ${destination.name} with Dyna Tours.`);
        const canonical = destination.canonical_url || undefined;

        return {
          title,
          description,
          alternates: canonical ? { canonical } : undefined,
          openGraph: {
            title,
            description,
            type: 'website',
            images: destination.banner_image ? [{ url: destination.banner_image }] : [],
          }
        };
      }
    }
  } catch (error) {
    console.error('Error fetching metadata for destination', slug, error);
  }

  // Fallback metadata if API fails
  const name = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${name} Vacation Packages & Stays | Dyna Tours`,
    description: `Explore custom tour itineraries and luxury hotel stays in ${name}. Plan your perfect vacation with Dyna Tours.`,
  };
}

export default function DestinationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
