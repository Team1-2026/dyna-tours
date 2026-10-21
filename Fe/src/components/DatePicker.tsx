'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTodayDateString } from '@/lib/dateUtils';

interface DatePickerProps {
  id?: string;
  name: string;
  value: string; // 'YYYY-MM-DD'
  onChange: (e: { target: { name: string; value: string } }) => void;
  minDate?: string; // 'YYYY-MM-DD' (defaults to today)
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  style?: React.CSSProperties;
  triggerStyle?: React.CSSProperties;
  align?: 'left' | 'right' | 'auto';
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DatePicker({
  id,
  name,
  value,
  onChange,
  minDate = getTodayDateString(),
  required = false,
  disabled = false,
  placeholder = 'dd / mm / yyyy',
  className = '',
  triggerClassName = '',
  style = {},
  triggerStyle = {},
  align = 'left'
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial view month/year from value or minDate or today
  const getInitialYearMonth = () => {
    const baseDate = value || minDate || getTodayDateString();
    const [y, m] = baseDate.split('-').map(Number);
    if (y && m) {
      return { year: y, month: m - 1 };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  };

  const [viewDate, setViewDate] = useState(getInitialYearMonth);

  // Sync viewDate if value changes
  useEffect(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      if (y && m) {
        setViewDate({ year: y, month: m - 1 });
      }
    }
  }, [value]);

  // Close on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const todayStr = getTodayDateString();
  const effectiveMin = minDate || todayStr;

  // Check if prev month is disabled (if all dates in previous month are before effectiveMin)
  const isPrevMonthDisabled = () => {
    if (!effectiveMin) return false;
    const [minY, minM] = effectiveMin.split('-').map(Number);
    if (viewDate.year < minY) return true;
    if (viewDate.year === minY && viewDate.month <= minM - 1) return true;
    return false;
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPrevMonthDisabled()) return;
    setViewDate(prev => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(prev => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const handleSelectDate = (day: number) => {
    const yStr = String(viewDate.year);
    const mStr = String(viewDate.month + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const dateStr = `${yStr}-${mStr}-${dStr}`;

    // Disallow if before minDate
    if (effectiveMin && dateStr < effectiveMin) {
      return;
    }

    onChange({ target: { name, value: dateStr } });
    setIsOpen(false);
  };

  // Days calculations for calendar grid
  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewDate.year, viewDate.month, 1).getDay();

  // Days of previous month to pad first row
  const prevMonthDays = new Date(viewDate.year, viewDate.month, 0).getDate();

  // Format value for display: DD / MM / YYYY
  const formatDisplay = (val: string) => {
    if (!val) return '';
    const parts = val.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${d} / ${m} / ${y}`;
    }
    return val;
  };

  return (
    <div 
      ref={containerRef} 
      style={{ position: 'relative', width: '100%', ...style }}
      className={className}
    >
      {/* Hidden text input for HTML form accessibility & validation */}
      <input
        type="text"
        id={id}
        name={name}
        value={value || ''}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none',
          width: '1px',
          height: '1px',
          bottom: 0,
          left: '50%'
        }}
        onChange={() => {}}
      />

      {/* Visible Trigger Box */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) setIsOpen(prev => !prev);
        }}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsOpen(prev => !prev);
          }
        }}
        className={triggerClassName}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 0.85rem',
          backgroundColor: disabled ? '#f8fafc' : '#ffffff',
          borderRadius: '8px',
          border: isOpen ? '1px solid var(--color-primary-red, #dc2626)' : '1px solid var(--color-border, #cbd5e1)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 3px rgba(220, 38, 38, 0.15)' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          minHeight: '42px',
          boxSizing: 'border-box',
          ...triggerStyle
        }}
      >
        <span style={{ 
          fontSize: '0.9rem', 
          color: value ? 'var(--color-text-primary, #0f172a)' : '#64748b',
          fontWeight: value ? 600 : 400
        }}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <CalendarIcon style={{ width: '18px', height: '18px', color: '#64748b', flexShrink: 0 }} />
      </div>

      {/* Calendar Dropdown Modal */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            ...(align === 'right' ? { right: 0 } : { left: 0 }),
            zIndex: 9999,
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.18), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            padding: '1rem',
            width: '290px',
            maxWidth: 'calc(100vw - 32px)',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
        >
          {/* Header Month / Year & Arrows */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
              {MONTH_NAMES[viewDate.month]} {viewDate.year}
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={isPrevMonthDisabled()}
                title={isPrevMonthDisabled() ? 'Previous months are in the past' : 'Previous month'}
                style={{
                  background: 'none',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '4px',
                  cursor: isPrevMonthDisabled() ? 'not-allowed' : 'pointer',
                  opacity: isPrevMonthDisabled() ? 0.3 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronLeft style={{ width: '16px', height: '16px', color: '#334155' }} />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                title="Next month"
                style={{
                  background: 'none',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronRight style={{ width: '16px', height: '16px', color: '#334155' }} />
              </button>
            </div>
          </div>

          {/* Weekday Names */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '0.5rem' }}>
            {WEEK_DAYS.map(w => (
              <span key={w} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                {w}
              </span>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {/* Days from previous month */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => {
              const dayNum = prevMonthDays - firstDayOfWeek + idx + 1;
              return (
                <div
                  key={`prev-${idx}`}
                  style={{
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    color: '#cbd5e1',
                    pointerEvents: 'none',
                    userSelect: 'none'
                  }}
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const yStr = String(viewDate.year);
              const mStr = String(viewDate.month + 1).padStart(2, '0');
              const dStr = String(day).padStart(2, '0');
              const dateStr = `${yStr}-${mStr}-${dStr}`;

              const isPast = effectiveMin ? dateStr < effectiveMin : false;
              const isSelected = value === dateStr;
              const isToday = dateStr === todayStr;

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleSelectDate(day)}
                  style={{
                    height: '34px',
                    border: 'none',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.825rem',
                    fontWeight: isSelected ? 700 : (isToday ? 700 : 500),
                    cursor: isPast ? 'not-allowed' : 'pointer',
                    backgroundColor: isSelected 
                      ? 'var(--color-primary-red, #dc2626)' 
                      : (isToday ? '#eff6ff' : 'transparent'),
                    color: isSelected 
                      ? '#ffffff' 
                      : (isPast ? '#cbd5e1' : (isToday ? '#1d4ed8' : '#0f172a')),
                    opacity: isPast ? 0.35 : 1,
                    textDecoration: isPast ? 'line-through' : 'none',
                    boxShadow: isToday && !isSelected ? 'inset 0 0 0 1px #93c5fd' : 'none',
                    transition: 'background-color 0.15s, color 0.15s'
                  }}
                  title={isPast ? 'Past dates are disabled' : (isToday ? 'Today' : dateStr)}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Helper Footer */}
          <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => {
                if (todayStr >= effectiveMin) {
                  onChange({ target: { name, value: todayStr } });
                  setIsOpen(false);
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.75rem',
                color: 'var(--color-primary-red, #dc2626)',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '2px 4px'
              }}
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange({ target: { name, value: '' } });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.75rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '2px 4px'
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
