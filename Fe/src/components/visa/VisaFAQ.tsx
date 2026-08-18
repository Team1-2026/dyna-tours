'use client';

import React, { useState } from 'react';
import styles from '../../app/visa/page.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

interface VisaFAQProps {
  faqs?: FAQItem[];
}

export default function VisaFAQ({ faqs }: VisaFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section bg-light" id="faq" style={{ padding: '4rem 0' }}>
      <div className="container">
        <div className="section-title-wrap" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span 
            className="section-subtitle" 
            style={{ 
              display: 'block', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              fontWeight: 700, 
              color: 'var(--color-primary-red)', 
              marginBottom: '0.5rem',
              fontSize: '0.85rem'
            }}
          >
            Quick answers
          </span>
          <h2 
            className="section-title" 
            style={{ 
              fontSize: '2.25rem', 
              fontWeight: 800, 
              color: 'var(--color-secondary-navy)' 
            }}
          >
            Frequently Asked Questions
          </h2>
        </div>

        <div className={styles.faqContainer}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
              >
                <button 
                  type="button"
                  className={styles.faqQuestion} 
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.faqQuestionText}>{faq.question}</span>
                  <span className={`${styles.faqIconWrapper} ${isOpen ? styles.faqIconRotated : ''}`}>
                    <svg 
                      viewBox="0 0 24 24" 
                      width="18" 
                      height="18" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                <div 
                  className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerOpen : ''}`}
                >
                  <div className={styles.faqAnswerContent}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
