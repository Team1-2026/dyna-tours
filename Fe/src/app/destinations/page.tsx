'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { api, Destination, getImageUrl, isDestinationDeleted } from '@/lib/api';
import styles from './destinations.module.css';

const defaultDestinations: Array<{
  id: string;
  name: string;
  type: 'domestic' | 'international';
  overview: string;
  banner_image: string;
  url_slug?: string;
}> = [
  {
    id: 'kerala',
    name: 'Kerala',
    type: 'domestic',
    overview: 'God\'s Own Country is a tropical paradise with serene backwaters, rolling tea hills, and rich cultural heritage.',
    banner_image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    url_slug: 'kerala',
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    type: 'domestic',
    overview: 'Land of historic Dravidian temples, misty hill stations, and vibrant cultural traditions.',
    banner_image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    url_slug: 'tamil-nadu',
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    type: 'domestic',
    overview: 'A magnificent blend of silicon hubs, ancient Hampi ruins, and misty Coorg coffee plantations.',
    banner_image: 'https://images.unsplash.com/photo-1600100397608-f010f4438317?auto=format&fit=crop&w=1000&q=80',
    url_slug: 'karnataka',
  },
  {
    id: 'goa',
    name: 'Goa',
    type: 'domestic',
    overview: 'India\'s beach capital featuring sun-kissed coastlines, Portuguese heritage, and vibrant nightlife.',
    banner_image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    url_slug: 'goa',
  },
  {
    id: 'delhi',
    name: 'Delhi',
    type: 'domestic',
    overview: 'The storied capital city brimming with iconic monuments, bustling bazaars, and delectable cuisine.',
    banner_image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
    url_slug: 'delhi',
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    type: 'domestic',
    overview: 'Land of maharajas, grand desert forts, royal palaces, and timeless cultural splendor.',
    banner_image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80',
    url_slug: 'rajasthan',
  },
  {
    id: 'thailand',
    name: 'Thailand',
    type: 'international',
    overview: 'The Land of Smiles offering vibrant Bangkok street life, ornate temples, and world-class tropical islands.',
    banner_image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1000&q=80',
    url_slug: 'thailand',
  },
  {
    id: 'singapore',
    name: 'Singapore',
    type: 'international',
    overview: 'A futuristic garden city combining architectural marvels, luxury shopping, and multicultural delicacies.',
    banner_image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=80',
    url_slug: 'singapore',
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    type: 'international',
    overview: 'Iconic Petronas Towers, lush rainforests, and multicultural charm across bustling Kuala Lumpur and Penang.',
    banner_image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80',
    url_slug: 'malaysia',
  },
  {
    id: 'uae',
    name: 'UAE & Dubai',
    type: 'international',
    overview: 'Ultra-modern skyline wonders, golden desert dunes, and opulent luxury experiences in Dubai and Abu Dhabi.',
    banner_image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
    url_slug: 'uae',
  },
  {
    id: 'europe',
    name: 'Europe',
    type: 'international',
    overview: 'Enchanting historic capitals, Swiss alpine panoramas, romantic canals, and Mediterranean coastlines.',
    banner_image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
    url_slug: 'europe',
  },
];

const fallbackImages: Record<string, string> = {
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
  'tamil-nadu': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
  karnataka: 'https://images.unsplash.com/photo-1600100397608-f010f4438317?auto=format&fit=crop&w=1000&q=80',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1000&q=80',
  rajasthan: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80',
  thailand: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1000&q=80',
  singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=80',
  malaysia: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1000&q=80',
  uae: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80',
  europe: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
  nepal: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
  morocco: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1000&q=80',
};

const resolveDestinationImage = (dest: any): string => {
  if (dest.banner_image && typeof dest.banner_image === 'string' && dest.banner_image.trim()) {
    return getImageUrl(dest.banner_image);
  }
  if (Array.isArray(dest.gallery) && dest.gallery.length > 0) {
    const first = dest.gallery[0];
    const url = typeof first === 'string' ? first : first?.url;
    if (url) return getImageUrl(url);
  }
  const key = (dest.url_slug || dest.id || dest.name || '').toLowerCase();
  for (const [k, v] of Object.entries(fallbackImages)) {
    if (key.includes(k)) return v;
  }
  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80';
};

const stripHtml = (html?: string | null) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
};

export default function DestinationsDirectoryPage() {
  const [liveDestinations, setLiveDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'domestic' | 'international'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    api.getDestinations().then(data => {
      if (isMounted && Array.isArray(data)) {
        setLiveDestinations(data);
      }
    }).catch(err => {
      console.warn('Could not load destinations:', err);
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  // Merge default list with live destinations
  const mergedDestinations = useMemo(() => {
    const destMap = new Map<string, any>();

    // 1. Seed defaults (filtering out any deleted ones)
    for (const d of defaultDestinations) {
      if (isDestinationDeleted(d.id) || isDestinationDeleted(d.url_slug)) continue;
      destMap.set(d.id.toLowerCase(), d);
    }

    // 2. Overlay / add live destinations from backend
    for (const d of liveDestinations) {
      if (!d) continue;
      if (isDestinationDeleted(d.id) || isDestinationDeleted(d.url_slug)) continue;
      if (d.status && d.status.toLowerCase() === 'inactive') continue;
      // Skip the container pages like 'other-domestic' from card grid
      if (d.id === 'other-domestic' || d.id === 'other-international') continue;

      const key = (d.url_slug || d.id || '').trim().toLowerCase();
      if (!key) continue;

      destMap.set(key, {
        id: d.id,
        name: d.name,
        type: d.type || 'domestic',
        overview: d.overview || '',
        banner_image: d.banner_image || '',
        url_slug: d.url_slug || d.id,
        order_no: d.order_no,
        parent_id: d.parent_id,
      });
    }

    const items = Array.from(destMap.values());
    items.sort((a, b) => {
      const orderA = a.order_no !== null && a.order_no !== undefined ? Number(a.order_no) : Infinity;
      const orderB = b.order_no !== null && b.order_no !== undefined ? Number(b.order_no) : Infinity;
      return orderA - orderB;
    });

    return items;
  }, [liveDestinations]);

  // Filter based on active tab and search query
  const filteredDestinations = useMemo(() => {
    return mergedDestinations.filter(d => {
      // Tab filter
      if (activeTab !== 'all') {
        const destType = (d.type || 'domestic').toLowerCase();
        if (destType !== activeTab) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (d.name || '').toLowerCase().includes(q);
        const overviewMatch = (d.overview || '').toLowerCase().includes(q);
        if (!nameMatch && !overviewMatch) return false;
      }

      return true;
    });
  }, [mergedDestinations, activeTab, searchQuery]);

  return (
    <div className={styles.pageContainer}>
      {/* Hero Banner */}
      <section className={styles.heroBanner}>
        <div className={styles.heroOverlay} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className={styles.heroTitle}>Explore Our Destinations</h1>
          <p className={styles.heroSubtitle}>
            Immerse yourself in breathtaking landscapes, historic culture, and luxury stays across our handpicked domestic and international destinations.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="container">
        {/* Filter & Search Bar */}
        <section className={styles.filterBar}>
          <div className={styles.filterControls}>
            <div className={styles.tabGroup}>
              <button 
                type="button" 
                className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All ({mergedDestinations.length})
              </button>
              <button 
                type="button" 
                className={`${styles.tabBtn} ${activeTab === 'domestic' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('domestic')}
              >
                Domestic ({mergedDestinations.filter(d => (d.type || 'domestic').toLowerCase() === 'domestic').length})
              </button>
              <button 
                type="button" 
                className={`${styles.tabBtn} ${activeTab === 'international' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('international')}
              >
                International ({mergedDestinations.filter(d => (d.type || '').toLowerCase() === 'international').length})
              </button>
            </div>

            <div className={styles.searchBox}>
              <svg className={styles.searchIcon} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search destinations..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Destinations Grid */}
        {filteredDestinations.length > 0 ? (
          <div className={styles.destGrid}>
            {filteredDestinations.map((dest) => {
              const imgUrl = resolveDestinationImage(dest);
              const isDomestic = (dest.type || 'domestic').toLowerCase() === 'domestic';
              const cleanOverview = stripHtml(dest.overview);
              const linkHref = `/destinations/${dest.url_slug || dest.id}`;

              return (
                <div key={dest.id} className={styles.destCard}>
                  <Link href={linkHref} className={styles.cardImgWrap}>
                    <img 
                      src={imgUrl} 
                      alt={dest.name} 
                      className={styles.cardImg}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                    <span className={`${styles.badge} ${isDomestic ? styles.badgeDomestic : ''}`}>
                      {isDomestic ? 'Domestic' : 'International'}
                    </span>
                  </Link>

                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>
                      <Link href={linkHref} style={{ color: 'inherit' }}>
                        {dest.name}
                      </Link>
                    </h3>
                    <p className={styles.cardOverview}>
                      {cleanOverview || 'Explore scenic wonders, luxury resorts, and bespoke holiday packages.'}
                    </p>

                    <div className={styles.cardFooter}>
                      <Link href={linkHref} className={styles.exploreLink}>
                        Explore Guide & Tours
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h3>No destinations found</h3>
            <p>Try searching with another keyword or switch the tab filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
