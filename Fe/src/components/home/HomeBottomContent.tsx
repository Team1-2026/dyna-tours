'use client';

import React from 'react';

interface HomeBottomContentProps {
  title?: string;
  subtitle?: string;
  content?: string;
}

export const defaultBottomContentHtml = `
  <h2>Why Travel With Dyna Tours India?</h2>
  <p>At <strong>Dyna Tours India</strong>, we believe every journey should be an extraordinary story. Whether you are seeking a tranquil beach getaway in Dubai, a heritage expedition across India, or a seamless international visa application, our dedicated travel architects design custom travel packages tailored precisely to your budget and dreams.</p>
  
  <h3>Our Key Travel Services & Highlights</h3>
  <ul>
    <li><strong>Handcrafted Domestic & International Packages:</strong> Curated travel itineraries with luxury hotel stays, guided sightseeing, and private transfers.</li>
    <li><strong>Express Visa Assistance:</strong> Swift 24-48 hour tourist visa processing for Dubai, Singapore, Thailand, Schengen, and over 50 countries.</li>
    <li><strong>Verified Customer Support:</strong> 24/7 global concierge assistance to ensure smooth flight check-ins, transfers, and emergency support.</li>
  </ul>

  <h4>Explore Popular Categories</h4>
  <p style="text-align: justify;">Discover our curated <a href="/destinations" target="_self">Popular Travel Destinations</a> or check out our exclusive <a href="/visas" target="_self">Visa Services</a> to start planning your dream holiday today!</p>
`;

export const HomeBottomContent: React.FC<HomeBottomContentProps> = ({
  title,
  subtitle,
  content,
}) => {
  const htmlToRender = content && content.trim().length > 0 ? content : defaultBottomContentHtml;

  return (
    <section className="py-16 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-10">
            {subtitle && (
              <span className="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-2 block">
                {subtitle}
              </span>
            )}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {title}
            </h2>
          </div>
        )}

        {/* Rich HTML Content Container */}
        <div
          className="prose prose-slate max-w-none 
            prose-headings:font-bold prose-headings:text-slate-900
            prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:mb-4 prose-h1:mt-6
            prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:text-red-700
            prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mb-3 prose-h3:mt-5
            prose-h4:text-lg prose-h4:font-bold prose-h4:mb-2 prose-h4:mt-4
            prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ul:space-y-2
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-ol:space-y-2
            prose-li:text-slate-700
            prose-a:text-red-600 prose-a:font-semibold prose-a:underline hover:prose-a:text-red-700
            prose-strong:text-slate-900 prose-strong:font-bold"
          dangerouslySetInnerHTML={{ __html: htmlToRender }}
        />
      </div>
    </section>
  );
};
