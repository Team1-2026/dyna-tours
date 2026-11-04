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
  linkTo?: string;
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
  showPrice?: boolean;
  popular?: boolean;
  urlSlug?: string;
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
  link?: string;
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
    linkTo: '/holidays?offer=europe-summer',
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
    linkTo: '/hotels?location=Maldives',
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
    linkTo: '/visa',
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
    linkTo: '/cruise',
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
    id: 'uae',
    country: 'United Arab Emirates (UAE)',
    code: 'AE',
    flagUrl: 'https://flagcdn.com/w160/ae.png',
    visaType: 'Tourist / Express eVisa',
    processingTime: '24-48 Hours',
    startingPrice: '₹6,500',
    showPrice: true,
    popular: true,
    urlSlug: 'uae',
  },
  {
    id: 'france',
    country: 'Schengen (Europe)',
    code: 'EU',
    flagUrl: 'https://flagcdn.com/w160/eu.png',
    visaType: 'Multiple Entry Tourist',
    processingTime: '5-10 Business Days',
    startingPrice: '₹7,500',
    showPrice: true,
    popular: true,
    urlSlug: 'france',
  },
  {
    id: 'uk',
    country: 'United Kingdom',
    code: 'GB',
    flagUrl: 'https://flagcdn.com/w160/gb.png',
    visaType: 'Standard Visitor Visa',
    processingTime: '7-12 Business Days',
    startingPrice: '₹12,000',
    showPrice: true,
    popular: true,
    urlSlug: 'uk',
  },
  {
    id: 'singapore',
    country: 'Singapore',
    code: 'SG',
    flagUrl: 'https://flagcdn.com/w160/sg.png',
    visaType: 'E-Visa (30 Days)',
    processingTime: '3-4 Business Days',
    startingPrice: '₹2,999',
    showPrice: true,
    popular: true,
    urlSlug: 'singapore',
  },
  {
    id: 'thailand',
    country: 'Thailand',
    code: 'TH',
    flagUrl: 'https://flagcdn.com/w160/th.png',
    visaType: 'Visa on Arrival / eVisa',
    processingTime: '24 Hours',
    startingPrice: '₹2,499',
    showPrice: true,
    popular: true,
    urlSlug: 'thailand',
  },
  {
    id: 'malaysia',
    country: 'Malaysia',
    code: 'MY',
    flagUrl: 'https://flagcdn.com/w160/my.png',
    visaType: 'eNTRI / Tourist Visa',
    processingTime: '2-3 Business Days',
    startingPrice: '₹2,199',
    showPrice: true,
    popular: false,
    urlSlug: 'malaysia',
  },
  {
    id: 'japan',
    country: 'Japan',
    code: 'JP',
    flagUrl: 'https://flagcdn.com/w160/jp.png',
    visaType: 'Short-term Tourist',
    processingTime: '4-6 Business Days',
    startingPrice: '₹4,999',
    showPrice: true,
    popular: false,
    urlSlug: 'japan',
  },
  {
    id: 'usa',
    country: 'United States of America',
    code: 'US',
    flagUrl: 'https://flagcdn.com/w160/us.png',
    visaType: 'B1/B2 Tourist Visa',
    processingTime: 'Appointment Assistance',
    startingPrice: '₹14,500',
    showPrice: true,
    popular: true,
    urlSlug: 'usa',
  },
  {
    id: 'canada',
    country: 'Canada',
    code: 'CA',
    flagUrl: 'https://flagcdn.com/w160/ca.png',
    visaType: 'Visitor Visa (10 Yrs)',
    processingTime: '15-20 Business Days',
    startingPrice: '₹11,000',
    showPrice: true,
    popular: false,
    urlSlug: 'canada',
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
    title: 'Japan Tourism: Explore the Land of the Rising Sun',
    excerpt: 'From neon-lit streets and ancient temples to Mount Fuji and tranquil cherry blossoms, discover the best of Japan.',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    date: '09 Sep 2026',
    readTime: '5 min read',
    category: 'International Guide',
    slug: 'japan-tourism-explore-land-of-rising-sun',
    link: 'https://dynatours.blogspot.com/2026/09/japan-tourism-explore-land-of-rising-sun.html',
  },
  {
    id: 'b2',
    title: 'Rajasthan Tourism: Explore the Land of Kings, Forts, Palaces & Culture',
    excerpt: 'Experience royal grandeur, iconic hill forts of Jaipur, romantic lakes of Udaipur, and golden sand dunes of Jaisalmer.',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
    date: '09 Sep 2026',
    readTime: '6 min read',
    category: 'Incredible India',
    slug: 'rajasthan-tourism-explore-land-of-kings',
    link: 'https://dynatours.blogspot.com/2026/09/rajasthan-tourism-explore-land-of-kings.html',
  },
  {
    id: 'b3',
    title: 'Top Hidden Gems in Kerala You Must Visit Beyond Alleppey',
    excerpt: 'Uncover misty tea estates of Munnar and Vagamon, tranquil backwaters, and wildlife sanctuaries tucked in the Western Ghats.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    date: '24 Aug 2026',
    readTime: '4 min read',
    category: 'Kerala Special',
    slug: 'hidden-gems-in-kerala',
    link: 'https://dynatours.blogspot.com/',
  },
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Neenu Thomas',
    photo: '',
    location: 'New Delhi',
    destinationVisited: 'Azerbaijan Tour',
    rating: 5,
    review: 'Our trip to Azerbaijan with Dyna Tours was absolutely wonderful! The entire itinerary was well-organized, the hotels and transfers were seamless. Thank you for making our holiday so memorable and stress-free.',
    date: 'June 2026',
    verified: true,
  },
  {
    id: 't2',
    name: 'Suresh',
    photo: '',
    location: 'Kochi, Kerala',
    destinationVisited: 'Lakshadweep',
    rating: 5,
    review: 'Our Lakshadweep trip with Dyna Tours India was a wonderful experience! The cruise, beautiful beaches, and crystal-clear waters made our family holiday truly memorable. Thank you to the team for the excellent arrangements and support throughout our journey. We look forward to travelling with you again!',
    date: 'May 2026',
    verified: true,
  },
  {
    id: 't3',
    name: 'Sukanya & Friends',
    photo: '/storage/uploads/whatsapp-image-2026-11-04-at-120532-pm_1793774156.jpeg',
    location: 'Bengaluru',
    destinationVisited: 'Bali',
    rating: 5,
    review: 'We had a good experience with Dyna. We booked our Bali trip and from first day all are organised well. Accommodation also planned in good hotels. Itinerary covered almost all places we would like to visit without any rush. Well recommended.',
    date: 'January 2026',
    verified: true,
  },
  {
    id: 't4',
    name: 'Priya Sundaram',
    photo: '',
    location: 'Chennai',
    destinationVisited: 'Dubai & Abu Dhabi 6-Day Tour',
    rating: 5,
    review: 'The VIP desert safari and private yacht cruise were highlights of our trip. Prompt support on WhatsApp 24/7!',
    date: 'April 2026',
    verified: true,
  },
];
