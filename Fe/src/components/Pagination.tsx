'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '3rem',
        marginBottom: '2rem'
      }}
    >
      {totalItems !== undefined && itemsPerPage !== undefined && (
        <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
          Showing Page {currentPage} of {totalPages} ({totalItems} Total Results)
        </span>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {/* Previous Button */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => {
            if (currentPage > 1) {
              onPageChange(currentPage - 1);
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }
          }}
          style={{
            padding: '0.55rem 1rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
            color: currentPage === 1 ? '#94a3b8' : '#0f172a',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          ← Prev
        </button>

        {/* Page Numbers */}
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => {
                onPageChange(p);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                border: isActive ? '1px solid #dc2626' : '1px solid #cbd5e1',
                background: isActive ? '#dc2626' : '#ffffff',
                color: isActive ? '#ffffff' : '#0f172a',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 12px rgba(220, 38, 38, 0.25)' : 'none'
              }}
            >
              {p}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => {
            if (currentPage < totalPages) {
              onPageChange(currentPage + 1);
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }
          }}
          style={{
            padding: '0.55rem 1rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: currentPage === totalPages ? '#f1f5f9' : '#ffffff',
            color: currentPage === totalPages ? '#94a3b8' : '#0f172a',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
