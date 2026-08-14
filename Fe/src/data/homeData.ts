export interface HeroSlide {
  id: string;
  subtitle: string;
  title: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  bgImage: string;
  bgVideo?: string;
  badge?: string;
}

export interface ExclusiveOffer {
  id: string;
  category: 'holiday' | 'hotel' | 'visa' | 'flight' | 'festival' | 'cruise';
  title: string;
  description: string;
  discountBadge: string;
  validity: string;
  bgImage: string;
  ctaText: string;
  ctaLink: string;
  code?: string;
}

export interface TravelTheme {
  id: string;
  name: string;
  image: string;
  link: string;
  iconName: string;
  count: number;
  category?: 'domestic' | 'international' | 'both';
  subtitle?: string;
  startingPrice?: string;
}

export interface VisaCountryCard {
  id: string;
  country: string;
  code: string;
  flagUrl: string;
  visaType: string;
  processingTime: string;
  startingPrice: string;
  popular?: boolean;
}

export interface StatCounter {
  id: string;
  number: number;
  suffix: string;
  label: string;
  iconName: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  location: string;
  destinationVisited: string;
  rating: number;
  review: string;
  date: string;
  verified: boolean;
}

export interface HomePageData {
  heroSlides: HeroSlide[];
  offers: ExclusiveOffer[];
  themes: TravelTheme[];
  visaCountries: VisaCountryCard[];
  stats: StatCounter[];
  blogs: BlogPost[];
  testimonials: Testimonial[];
  aboutContent: {
    title: string;
    subtitle: string;
    description1: string;
    description2: string;
    videoThumbnail: string;
    youtubeUrl: string;
    yearsExperience: number;
  };
  ctaBanner: {
    title: string;
    description: string;
    bgImage: string;
    primaryBtnText: string;
    primaryBtnLink: string;
    whatsappNumber: string;
  };
}

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: '1',
    subtitle: 'LUXURY REDEFINED',
    title: 'Experience The World Beyond Ordinary',
    description: 'Bespoke international holiday packages, private yacht cruises, and curated cultural expeditions crafted for discerning travelers.',
    primaryCtaText: 'Explore Packages',
    primaryCtaLink: '/holidays',
    secondaryCtaText: 'Contact Us',
    secondaryCtaLink: '/contact-us',
    bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85',
    badge: 'Trending Destinations 2026',
  },
  {
    id: '2',
    subtitle: 'ROYAL INDIAN HERITAGE',
    title: 'Incredible Journeys Across Mystic India',
    description: 'From majestic palaces of Rajasthan to serene backwaters of Kerala and snowy heights of Kashmir.',
    primaryCtaText: 'Discover India',
    primaryCtaLink: '/holidays?category=Domestic',
    secondaryCtaText: 'Custom Itinerary',
    secondaryCtaLink: '/contact-us',
    bgImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2000&q=85',
    badge: 'Popular Choice',
  },
  {
    id: '3',
    subtitle: 'ISLAND PARADISE',
    title: 'Unwind in Pure Azure Luxury',
    description: 'Overwater bungalows, pristine coral reefs, and exclusive private beach retreats in Maldives, Bali & Seychelles.',
    primaryCtaText: 'View Honeymoon Tours',
    primaryCtaLink: '/holidays?category=Honeymoon',
    secondaryCtaText: 'Get Quote',
    secondaryCtaLink: '/contact-us',
    bgImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=2000&q=85',
    badge: 'Special Savings',
  },
  {
    id: '4',
    subtitle: 'EUROPEAN ESCAPADES',
    title: 'Enchanting Cities & Swiss Alps',
    description: 'Traverse timeless cobblestone streets, iconic landmarks, and snow-draped alpine peaks with seamless express visas.',
    primaryCtaText: 'Explore Europe',
    primaryCtaLink: '/holidays?search=Europe',
    secondaryCtaText: 'Apply Visa',
    secondaryCtaLink: '/visa',
    bgImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=85',
    badge: 'Best Seller',
  },
];

export const defaultOffers: ExclusiveOffer[] = [
  {
    id: 'offer-1',
    category: 'holiday',
    title: 'Early Bird Summer Special - Europe 2026',
    description: 'Flat ₹25,000 OFF per couple on all premium 10+ days Europe group & customized tours.',
    discountBadge: 'FLAT ₹25,000 OFF',
    validity: 'Valid till 15th Aug 2026',
    bgImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80',
    ctaText: 'Claim Offer',
    ctaLink: '/holidays?offer=europe-summer',
    code: 'SUMMER2026',
  },
  {
    id: 'offer-2',
    category: 'hotel',
    title: 'Luxury Maldives Overwater Villa Upgrade',
    description: 'Complimentary All-Inclusive Upgrade & Speedboat Transfers for 4+ Night stays.',
    discountBadge: 'FREE ALL-INCLUSIVE',
    validity: 'Limited Availability',
    bgImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80',
    ctaText: 'View Resort Deals',
    ctaLink: '/hotels?location=Maldives',
    code: 'MALDIVESVIP',
  },
  {
    id: 'offer-3',
    category: 'visa',
    title: 'Express Schengen & UK Visa Assistance',
    description: 'Guaranteed document check and appointment booking within 48 hours.',
    discountBadge: 'FAST TRACK 48H',
    validity: 'Always Available',
    bgImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80',
    ctaText: 'Apply Now',
    ctaLink: '/visa',
    code: 'EXPRESSVISA',
  },
  {
    id: 'offer-4',
    category: 'cruise',
    title: 'Royal Caribbean & Costa Cruise Bonanza',
    description: 'Kids sail FREE + Complimentary $200 onboard credit per stateroom.',
    discountBadge: 'KIDS SAIL FREE',
    validity: 'Valid on Select Sailings',
    bgImage: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1000&q=80',
    ctaText: 'Book Cruise',
    ctaLink: '/cruise',
    code: 'SAILFREE',
  },
];

export const defaultThemes: TravelTheme[] = [
  {
    id: '1',
    name: 'Domestic Tour Packages',
    subtitle: 'Kerala, Rajasthan, Himachal, Kashmir & Goa',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    link: '/holidays/domestic-tour-packages',
    iconName: 'Compass',
    count: 52,
    category: 'domestic',
    startingPrice: '₹12,499',
  },
  {
    id: '2',
    name: 'International Tour Packages',
    subtitle: 'Switzerland, Europe, Japan, Bali & Dubai',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    link: '/holidays/international-tour-packages',
    iconName: 'Landmark',
    count: 78,
    category: 'international',
    startingPrice: '₹45,999',
  },
  {
    id: '3',
    name: 'Kerala Tour Packages',
    subtitle: 'Munnar, Houseboats, Wayanad, Kovalam & Thekkady',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    link: '/holidays/kerala-tour-packages',
    iconName: 'Palmtree',
    count: 45,
    category: 'domestic',
    startingPrice: '₹9,999',
  },
  {
    id: '4',
    name: 'Honeymoon Tour Packages',
    subtitle: 'Maldives, Bali, Kashmir, Paris & Munnar',
    image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80',
    link: '/holidays/honeymoon-tour-packages',
    iconName: 'Heart',
    count: 65,
    category: 'both',
    startingPrice: '₹18,500',
  },
  {
    id: '5',
    name: 'Day Excursions',
    subtitle: 'Local Sightseeing, Backwater Cruises & City Trips',
    image: 'https://images.unsplash.com/photo-1476514525535-ce74f452223d?auto=format&fit=crop&w=800&q=80',
    link: '/holidays/day-excursions',
    iconName: 'Sun',
    count: 24,
    category: 'domestic',
    startingPrice: '₹2,499',
  },
  {
    id: '6',
    name: 'Luxury Tour Packages',
    subtitle: '5-Star Palaces, Overwater Villas & Private Yacht Tours',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    link: '/holidays/luxury-tour-packages',
    iconName: 'Crown',
    count: 34,
    category: 'both',
    startingPrice: '₹35,000',
  },
];

export const defaultVisaCountries: VisaCountryCard[] = [
  {
    id: '1',
    country: 'United Arab Emirates (UAE)',
    code: 'AE',
    flagUrl: 'https://flagcdn.com/w160/ae.png',
    visaType: 'Tourist / Express eVisa',
    processingTime: '24-48 Hours',
    startingPrice: '₹6,499',
    popular: true,
  },
  {
    id: '2',
    country: 'Schengen (Europe)',
    code: 'EU',
    flagUrl: 'https://flagcdn.com/w160/eu.png',
    visaType: 'Multiple Entry Tourist',
    processingTime: '5-10 Business Days',
    startingPrice: '₹9,999',
    popular: true,
  },
  {
    id: '3',
    country: 'United Kingdom',
    code: 'GB',
    flagUrl: 'https://flagcdn.com/w160/gb.png',
    visaType: 'Standard Visitor Visa',
    processingTime: '7-12 Business Days',
    startingPrice: '₹14,500',
    popular: true,
  },
  {
    id: '4',
    country: 'Singapore',
    code: 'SG',
    flagUrl: 'https://flagcdn.com/w160/sg.png',
    visaType: 'E-Visa (30 Days)',
    processingTime: '3-4 Business Days',
    startingPrice: '₹2,999',
    popular: true,
  },
  {
    id: '5',
    country: 'Thailand',
    code: 'TH',
    flagUrl: 'https://flagcdn.com/w160/th.png',
    visaType: 'Visa on Arrival / eVisa',
    processingTime: '24 Hours',
    startingPrice: '₹2,499',
    popular: true,
  },
  {
    id: '6',
    country: 'Malaysia',
    code: 'MY',
    flagUrl: 'https://flagcdn.com/w160/my.png',
    visaType: 'eNTRI / Tourist Visa',
    processingTime: '2-3 Business Days',
    startingPrice: '₹2,199',
    popular: false,
  },
  {
    id: '7',
    country: 'Japan',
    code: 'JP',
    flagUrl: 'https://flagcdn.com/w160/jp.png',
    visaType: 'Short-term Tourist',
    processingTime: '4-6 Business Days',
    startingPrice: '₹3,499',
    popular: false,
  },
  {
    id: '8',
    country: 'United States of America',
    code: 'US',
    flagUrl: 'https://flagcdn.com/w160/us.png',
    visaType: 'B1/B2 Tourist Visa',
    processingTime: 'Appointment Assistance',
    startingPrice: '₹16,999',
    popular: true,
  },
  {
    id: '9',
    country: 'Canada',
    code: 'CA',
    flagUrl: 'https://flagcdn.com/w160/ca.png',
    visaType: 'Visitor Visa (10 Yrs)',
    processingTime: '15-20 Business Days',
    startingPrice: '₹12,499',
    popular: false,
  },
];

export const defaultStats: StatCounter[] = [
  {
    id: 's1',
    number: 16,
    suffix: '+ Years',
    label: 'Industry Experience',
    iconName: 'Award',
  },
  {
    id: 's2',
    number: 25,
    suffix: 'K+',
    label: 'Happy Travellers',
    iconName: 'Smile',
  },
  {
    id: 's3',
    number: 500,
    suffix: '+',
    label: 'Global Destinations',
    iconName: 'Globe',
  },
  {
    id: 's4',
    number: 98,
    suffix: '%',
    label: 'Customer Satisfaction',
    iconName: 'ThumbsUp',
  },
];

export const defaultBlogs: BlogPost[] = [
  {
    id: 'b1',
    title: '10 Essential Tips for Planning a Seamless European Summer Vacation',
    excerpt: 'From booking Schengen visas ahead to choosing high-speed scenic trains, discover how to maximize your European adventure.',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
    date: '24 Jul 2026',
    readTime: '5 min read',
    category: 'Travel Guide',
    slug: 'tips-for-european-summer-vacation',
  },
  {
    id: 'b2',
    title: 'Top 7 Hidden Gems in Kerala You Must Visit Beyond Alleppey',
    excerpt: 'Uncover misty tea estates of Vagamon, tranquil beaches of Bekal, and wildlife sanctuaries tucked in Western Ghats.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    date: '18 Jul 2026',
    readTime: '4 min read',
    category: 'Kerala Special',
    slug: 'hidden-gems-in-kerala',
  },
  {
    id: 'b3',
    title: 'The Ultimate Maldives Resort Selection Guide for Couples & Families',
    excerpt: 'Deciding between all-inclusive water villas and beachfront family suites? Here is our comprehensive comparison.',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
    date: '10 Jul 2026',
    readTime: '6 min read',
    category: 'Luxury Stay',
    slug: 'maldives-resort-selection-guide',
  },
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Rajesh & Simran Malhotra',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    location: 'New Delhi',
    destinationVisited: 'Switzerland & Paris 10-Day Tour',
    rating: 5,
    review: 'Dyna Tours India organized our dream honeymoon seamlessly! The hotel locations were prime, private transfers were punctual, and the visa process took less than a week.',
    date: 'June 2026',
    verified: true,
  },
  {
    id: 't2',
    name: 'Dr. Ananya Nair',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    location: 'Kochi, Kerala',
    destinationVisited: 'Bali 7-Day Luxury Escape',
    rating: 5,
    review: 'Exceptional hospitality and attention to detail. Every day of our Bali itinerary was curated according to our pace. Highly recommend Dyna Tours!',
    date: 'May 2026',
    verified: true,
  },
  {
    id: 't3',
    name: 'Vikram & Family',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    location: 'Bengaluru',
    destinationVisited: 'Kashmir Magical Winter Tour',
    rating: 5,
    review: 'Our family of six had the best vacation in Gulmarg and Pahalgam. Special thanks to the Dyna Tours team for accommodating senior citizens with extreme care.',
    date: 'January 2026',
    verified: true,
  },
  {
    id: 't4',
    name: 'Priya Sundaram',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    location: 'Chennai',
    destinationVisited: 'Dubai & Abu Dhabi 6-Day Tour',
    rating: 5,
    review: 'The VIP desert safari and private yacht cruise were highlights of our trip. Prompt support on WhatsApp 24/7!',
    date: 'April 2026',
    verified: true,
  },
];
