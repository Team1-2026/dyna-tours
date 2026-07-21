import type { Metadata } from 'next';
import React from 'react';
import { toursData } from '@/data/toursData';

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return {
      title: 'Luxury Tours | Dyna Tours',
      description: 'Explore bespoke travel itineraries and premium holiday packages with Dyna Tours.',
    };
  }

  const tour = toursData.find(t => t.id === id);

  if (tour) {
    const title = `${tour.title} (${tour.duration}) | Dyna Tours`;
    const description = tour.description 
      ? tour.description.substring(0, 160) + '...'
      : `Embark on the ${tour.title} with Dyna Tours. Experience luxury itineraries, expert guides, and curated travel arrangements.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        images: [{ url: tour.image }],
      }
    };
  }

  // Fallback
  return {
    title: 'Luxury Tour Details | Dyna Tours',
    description: 'Explore bespoke travel itineraries and premium holiday packages with Dyna Tours.',
  };
}

export default function TourLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
