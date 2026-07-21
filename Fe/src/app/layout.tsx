import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import './globals.css';

// Premium Sans Font for Application
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Dyna Tours | Luxury Tours & Curated Travel Experiences',
  description: 'Embark on unforgettable journeys across the globe with Dyna Tours. We design bespoke and premium travel packages featuring Zermatt, Kyoto, Amalfi Coast, and Serengeti.',
  keywords: ['travel agency', 'luxury tours', 'vacation packages', 'swiss alps tour', 'kyoto temple tour', 'amalfi coast travel', 'serengeti safari'],
  authors: [{ name: 'Dyna Tours Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable}`} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        fontFamily: 'var(--font-manrope), sans-serif',
        // Define Font Variables mapping
        ['--font-sans' as any]: 'var(--font-manrope), sans-serif',
        ['--font-headings' as any]: 'var(--font-manrope), sans-serif'
      }}>
        <Navbar />
        <main style={{ flex: '1 0 auto', paddingTop: '80px' }}>
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
