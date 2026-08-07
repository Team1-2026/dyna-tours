'use client';
import React, { useState, useEffect } from 'react';

import { getImageUrl } from '@/lib/api';

export default function ResolvedImage({ src, alt, className, style, onClick, fill }: { src: string, alt: string, className?: string, style?: React.CSSProperties, onClick?: () => void, fill?: boolean }) {
  const fallback = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80';
  const [resolved, setResolved] = useState<string>('');
  const [imgSrc, setImgSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    if (src && typeof window !== 'undefined') {
      try {
        const request = indexedDB.open("DynaToursImages", 1);
        request.onsuccess = (ev) => {
          const db = (ev.target as any).result;
          if (!db.objectStoreNames.contains("images")) {
            const url = getImageUrl(src);
            setResolved(url);
            setImgSrc(url);
            setLoading(false);
            return;
          }
          const tx = db.transaction("images", "readonly");
          const getReq = tx.objectStore("images").get(`uploaded_image_${src}`);
          getReq.onsuccess = () => {
            const url = getReq.result ? getImageUrl(getReq.result) : getImageUrl(src);
            setResolved(url);
            setImgSrc(url);
            setLoading(false);
          };
          getReq.onerror = () => {
            const url = getImageUrl(src);
            setResolved(url);
            setImgSrc(url);
            setLoading(false);
          };
        };
        request.onerror = () => {
          const url = getImageUrl(src);
          setResolved(url);
          setImgSrc(url);
          setLoading(false);
        };
      } catch(e) {
        const url = getImageUrl(src);
        setResolved(url);
        setImgSrc(url);
        setLoading(false);
      }
    } else {
      const url = getImageUrl(src || '');
      setResolved(url);
      setImgSrc(url);
      setLoading(false);
    }
  }, [src]);
  
  const combinedStyle = { ...style, ...(onClick ? { cursor: 'pointer' } : {}) };

  if (loading) {
    return <div style={{ minHeight: '100px', width: '100%', backgroundColor: '#f0f0f0', ...combinedStyle }} className={className} />;
  }

  return <img 
    src={imgSrc || resolved || fallback} 
    alt={alt} 
    className={className} 
    onClick={onClick} 
    onError={() => setImgSrc(fallback)}
    style={Object.keys(combinedStyle).length > 0 ? combinedStyle : undefined} 
  />;
}
