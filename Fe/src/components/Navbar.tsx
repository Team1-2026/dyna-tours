'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileDestOpen, setMobileDestOpen] = useState(false);
  const [mobileHolidaysOpen, setMobileHolidaysOpen] = useState(false);
  const pathname = usePathname();

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileDestOpen(false);
    setMobileHolidaysOpen(false);
  }, [pathname]);

  const domesticDestinations = [
    { name: 'Kerala', path: '/destinations/kerala' },
    { name: 'Tamil Nadu', path: '/destinations/tamil-nadu' },
    { name: 'Karnataka', path: '/destinations/karnataka' },
    { name: 'Goa', path: '/destinations/goa' },
    { name: 'Delhi', path: '/destinations/delhi' },
    { name: 'Other Domestic', path: '/destinations/other-domestic' },
  ];

  const internationalDestinations = [
    { name: 'Thailand', path: '/destinations/thailand' },
    { name: 'Singapore', path: '/destinations/singapore' },
    { name: 'Malaysia', path: '/destinations/malaysia' },
    { name: 'UAE', path: '/destinations/uae' },
    { name: 'Europe', path: '/destinations/europe' },
    { name: 'Other International', path: '/destinations/other-international' },
  ];

  const holidayCategories = [
    { name: 'Domestic Tour Packages', path: '/holidays/domestic-tour-packages' },
    { name: 'International Tour Packages', path: '/holidays/international-tour-packages' },
    { name: 'Kerala Tour Packages', path: '/holidays/kerala-tour-packages' },
    { name: 'Honeymoon Tour Packages', path: '/holidays/honeymoon-tour-packages' },
    { name: 'Day Excursions', path: '/holidays/day-excursions' },
    { name: 'Luxury Tour Packages', path: '/holidays/luxury-tour-packages' },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`${styles.container} container`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <img src="/images/logo.jpg" alt="Dyna Tours" className={styles.logoImg} />
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            <li>
              <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
                Home
              </Link>
            </li>

            {/* Destinations Dropdown */}
            <li className={styles.dropdown}>
              <span className={`${styles.navLink} ${pathname.startsWith('/destinations') ? styles.active : ''}`}>
                Destinations
                <svg className={styles.dropdownIcon} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
              <div className={styles.dropdownMenu}>
                <div className={styles.submenu}>
                  <span className={styles.submenuHeader}>Domestic</span>
                  <div className={styles.submenuList}>
                    {domesticDestinations.map((dest) => (
                      <Link key={dest.path} href={dest.path}>
                        {dest.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className={styles.submenu}>
                  <span className={styles.submenuHeader}>International</span>
                  <div className={styles.submenuList}>
                    {internationalDestinations.map((dest) => (
                      <Link key={dest.path} href={dest.path}>
                        {dest.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </li>

            <li>
              <Link href="/hotels" className={`${styles.navLink} ${pathname.startsWith('/hotels') ? styles.active : ''}`}>
                Hotels
              </Link>
            </li>
            {/* Holidays Dropdown */}
            <li className={styles.dropdown}>
              <Link href="/holidays" className={`${styles.navLink} ${pathname.startsWith('/holidays') ? styles.active : ''}`}>
                Holidays
                <svg className={styles.dropdownIcon} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </Link>
              <div className={styles.dropdownMenu} style={{ gridTemplateColumns: '1fr', width: '280px', padding: '1rem' }}>
                <div className={styles.submenu}>
                  <div className={styles.submenuList}>
                    {holidayCategories.map((cat) => (
                      <Link key={cat.path} href={cat.path}>
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </li>
            <li>
              <Link href="/visa" className={`${styles.navLink} ${pathname.startsWith('/visa') ? styles.active : ''}`}>
                Visa
              </Link>
            </li>
            <li>
              <Link href="/flights" className={`${styles.navLink} ${pathname.startsWith('/flights') ? styles.active : ''}`}>
                Flights
              </Link>
            </li>
            <li>
              <Link href="/group-tours" className={`${styles.navLink} ${pathname.startsWith('/group-tours') ? styles.active : ''}`}>
                Group Tours
              </Link>
            </li>
            <li>
              <Link href="/about" className={`${styles.navLink} ${pathname.startsWith('/about') ? styles.active : ''}`}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className={`${styles.navLink} ${pathname.startsWith('/contact-us') ? styles.active : ''}`}>
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        {/* CTA Button */}
        <div className={styles.navActions}>
          <Link href="/holidays" className="btn btn-primary btn-sm">
            Book a Holiday
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className={styles.menuButton} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileDrawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <ul className={styles.mobileNavList}>
          <li>
            <Link href="/" className={`${styles.mobileNavLink} ${pathname === '/' ? styles.mobileActive : ''}`}>
              Home
            </Link>
          </li>
          
          {/* Mobile Destinations Accordion */}
          <li>
            <button 
              className={styles.mobileDropdownBtn}
              onClick={() => setMobileDestOpen(!mobileDestOpen)}
            >
              <span>Destinations</span>
              <svg className={`${styles.mobileDropdownIcon} ${mobileDestOpen ? styles.rotated : ''}`} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className={`${styles.mobileSubmenuContainer} ${mobileDestOpen ? styles.submenuOpen : ''}`}>
              <div className={styles.mobileSubmenuHeader}>Domestic</div>
              <div className={styles.mobileSubmenuGrid}>
                {domesticDestinations.map((dest) => (
                  <Link key={dest.path} href={dest.path} className={styles.mobileSubmenuLink}>
                    {dest.name}
                  </Link>
                ))}
              </div>
              <div className={styles.mobileSubmenuHeader} style={{ marginTop: '0.75rem' }}>International</div>
              <div className={styles.mobileSubmenuGrid}>
                {internationalDestinations.map((dest) => (
                  <Link key={dest.path} href={dest.path} className={styles.mobileSubmenuLink}>
                    {dest.name}
                  </Link>
                ))}
              </div>
            </div>
          </li>

          <li>
            <Link href="/hotels" className={`${styles.mobileNavLink} ${pathname.startsWith('/hotels') ? styles.mobileActive : ''}`}>
              Hotels
            </Link>
          </li>
          {/* Mobile Holidays Dropdown */}
          <li>
            <button 
              className={styles.mobileDropdownBtn}
              onClick={() => setMobileHolidaysOpen(!mobileHolidaysOpen)}
              aria-expanded={mobileHolidaysOpen}
            >
              Holidays
              <svg 
                className={`${styles.mobileDropdownIcon} ${mobileHolidaysOpen ? styles.rotated : ''}`} 
                viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className={`${styles.mobileSubmenuContainer} ${mobileHolidaysOpen ? styles.submenuOpen : ''}`}>
              <div className={styles.mobileSubmenuGrid} style={{ gridTemplateColumns: '1fr' }}>
                <Link href="/holidays" className={styles.mobileSubmenuLink}>All Packages</Link>
                {holidayCategories.map((cat) => (
                  <Link key={cat.path} href={cat.path} className={styles.mobileSubmenuLink}>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </li>
          <li>
            <Link href="/visa" className={`${styles.mobileNavLink} ${pathname.startsWith('/visa') ? styles.mobileActive : ''}`}>
              Visa
            </Link>
          </li>
          <li>
            <Link href="/flights" className={`${styles.mobileNavLink} ${pathname.startsWith('/flights') ? styles.mobileActive : ''}`}>
              Flights
            </Link>
          </li>
          <li>
            <Link href="/group-tours" className={`${styles.mobileNavLink} ${pathname.startsWith('/group-tours') ? styles.mobileActive : ''}`}>
              Group Tours
            </Link>
          </li>

          <li className={styles.mobileCtaLi}>
            <Link href="/holidays" className="btn btn-primary btn-full">
              Book a Holiday
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
