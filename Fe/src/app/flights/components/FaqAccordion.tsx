'use client';
import React, { useState } from 'react';
import styles from '../page.module.css';

export default function FaqAccordion({ faqs }: { faqs: { question: string, answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className={styles.faqContainer}>
      {faqs.map((faq, index) => (
        <div key={index} className={styles.faqItem}>
          <div className={styles.faqQuestion} onClick={() => toggle(index)}>
            <span>{faq.question}</span>
            <svg 
              className={`${styles.faqIcon} ${openIndex === index ? styles.open : ''}`} 
              width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <div className={`${styles.faqAnswer} ${openIndex === index ? styles.open : ''}`}>
            {faq.answer}
          </div>
        </div>
      ))}
    </div>
  );
}
