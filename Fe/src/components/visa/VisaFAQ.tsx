'use client';

import React, { useState } from 'react';
import styles from '../../app/visa/page.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

interface VisaFAQProps {
  faqs: FAQItem[];
}

export default function VisaFAQ({ faqs }: VisaFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section bg-light" id="faq">
      <div className="container">
        <div className="section-title-wrap">
          <span className="section-subtitle">Quick answers</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>

        <div className={styles.faqContainer}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`${styles.faqItem} ${openIndex === index ? styles.faqItemOpen : ''}`}
            >
              <button 
                className={styles.faqQuestion} 
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span>{faq.question}</span>
                <svg 
                  className={`${styles.faqIcon} ${openIndex === index ? styles.faqIconRotated : ''}`} 
                  viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div 
                className={styles.faqAnswer}
                style={{ 
                  maxHeight: openIndex === index ? '200px' : '0',
                  opacity: openIndex === index ? 1 : 0
                }}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
