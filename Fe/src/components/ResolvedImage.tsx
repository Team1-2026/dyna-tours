'use client';
import React, { useState, useEffect } from 'react';

export default function ResolvedImage({ src, alt, className, style, onClick }: { src: string, alt: string, className?: string, style?: React.CSSProperties, onClick?: () => void }) {
  const [resolved, setResolved] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    setLoading(true);
    if (src && typeof window !== 'undefined') {
      try {
        const request = indexedDB.open("DynaToursImages", 1);
        request.onsuccess = (ev) => {
          const db = (ev.target as any).result;
          if (!db.objectStoreNames.contains("images")) {
            setResolved(src);
            setLoading(false);
            return;
          }
          const tx = db.transaction("images", "readonly");
          const getReq = tx.objectStore("images").get(`uploaded_image_${src}`);
          getReq.onsuccess = () => {
            if (getReq.result) {
              setResolved(getReq.result);
            } else {
              setResolved(src);
            }
            setLoading(false);
          };
          getReq.onerror = () => { setResolved(src); setLoading(false); };
        };
        request.onerror = () => { setResolved(src); setLoading(false); };
      } catch(e) {
        setResolved(src);
        setLoading(false);
      }
    } else {
      setResolved(src || '');
      setLoading(false);
    }
  }, [src]);
  
  const combinedStyle = { ...style, ...(onClick ? { cursor: 'pointer' } : {}) };

  if (loading) {
    return <div style={{ minHeight: '100px', width: '100%', backgroundColor: '#f0f0f0', ...combinedStyle }} className={className} />;
  }

  return <img 
    src={resolved} 
    alt={alt} 
    className={className} 
    onClick={onClick} 
    style={Object.keys(combinedStyle).length > 0 ? combinedStyle : undefined} 
  />;
}
