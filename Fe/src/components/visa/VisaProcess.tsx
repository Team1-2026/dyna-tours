import React from 'react';
import styles from '../../app/visa/page.module.css';

export default function VisaProcess() {
  const steps = [
    {
      id: 1,
      title: 'Enquiry & Consultation',
      subtitle: 'Start here',
      desc: 'Share your travel plans. We assess your requirements and recommend the right visa.',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      )
    },
    {
      id: 2,
      title: 'Document Collection & Verification',
      subtitle: 'Accuracy check',
      desc: 'Submit your documents. We thoroughly verify them for complete embassy compliance.',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      id: 3,
      title: 'Visa Application Preparation',
      subtitle: 'We prepare everything',
      desc: 'We prepare your application and organize all supporting documents for submission.',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      )
    },
    {
      id: 4,
      title: 'Application Submission',
      subtitle: 'Embassy / Online',
      desc: 'We submit your application and assist with any required biometric appointments.',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      )
    },
    {
      id: 5,
      title: 'Processing & Status Updates',
      subtitle: 'Stay informed',
      desc: 'We actively monitor your application status and keep you updated on progress.',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      id: 6,
      title: 'Visa Approval & Passport Collection',
      subtitle: 'Ready to travel',
      desc: 'Upon approval, we notify you instantly and assist with passport collection.',
      icon: (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    }
  ];

  return (
    <section className="section bg-light" id="visa-process" style={{ paddingBottom: '2rem' }}>
      <div className="container">
        <div className="section-title-wrap">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
             <span className="section-subtitle" style={{ color: 'var(--color-primary-red)', fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '0.5rem' }}>OUR VISA PROCESS</span>
             <h2 className="section-title" style={{ color: 'var(--color-secondary-navy)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Visa Journey Made Simple</h2>
             <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--color-primary-red)" style={{ transform: 'rotate(90deg)' }}>
               <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
             </svg>
          </div>
          <p className={styles.processIntro} style={{ maxWidth: '600px', margin: '0 auto' }}>
            From enquiry to visa approval, we make your journey smooth, transparent and hassle-free.
          </p>
        </div>

        <div className={styles.journeyWrapper}>
          <div className={styles.journeySvgContainer}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.journeySvg}>
              <path 
                d="M 5 25 L 90 25 C 97 25, 97 50, 90 50 L 10 50 C 3 50, 3 75, 10 75 L 95 75" 
                fill="none"
                stroke="var(--color-secondary-navy)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M 95 75 C 98 75, 100 70, 100 65"
                fill="none"
                stroke="var(--color-secondary-navy)"
                strokeWidth="2"
                strokeDasharray="6,6"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            
            <div className={styles.journeyDot} style={{ top: '25%', left: '33.33%' }} />
            <div className={styles.journeyDot} style={{ top: '25%', left: '66.66%' }} />
            <div className={styles.journeyDot} style={{ top: '75%', left: '33.33%' }} />
            <div className={styles.journeyDot} style={{ top: '75%', left: '66.66%' }} />
            
            <div className={styles.middlePlaneNode}>
              <div className={styles.planeDashedCircle}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--color-primary-red)" style={{ transform: 'rotate(45deg)' }}>
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
            </div>

            <div className={styles.endPlaneNode}>
               <svg viewBox="0 0 24 24" width="32" height="32" fill="var(--color-secondary-navy)" style={{ transform: 'rotate(45deg)' }}>
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
            </div>
          </div>

          <div className={styles.journeyGrid}>
            {steps.map((step) => (
              <div key={step.id} className={styles.journeyCardWrapper}>
                <div className={styles.journeyCard}>
                  <div className={styles.journeyCardNumber}>
                    {String(step.id).padStart(2, '0')}
                  </div>
                  <div className={styles.journeyCardIconWrapper}>
                    {step.icon}
                  </div>
                  <h3 className={styles.journeyCardTitle}>{step.title}</h3>
                  <p className={styles.journeyCardDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
