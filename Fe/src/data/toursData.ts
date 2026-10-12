export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  image?: string;
  gallery?: string[];
  sightseeing?: string;
  meals?: string;
  hotel?: string;
  stay?: string;
  transport?: string;
  logistics?: {
    placesCovered?: string;
    distance?: string;
    travelTime?: string;
    pace?: string;
  };
}

export interface Tour {
  id: string;
  slug?: string;
  title: string;
  destination: string;
  category: string;
  tourType?: string;
  price: number;
  show_price?: boolean;
  show_price_breakdown?: boolean;
  tax?: number;
  duration: string;
  durationDays: number;
  durationNights?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  overview?: {
    packageSummary?: string;
    introduction?: string;
    destinationsCovered?: string;
    idealTravelers?: string;
    experienceSummary?: string;
  } | string;
  highlights: string[];
  routeOverview?: { destination: string; nights: number; days?: number }[];
  itinerary: ItineraryItem[];
  inclusions: string[];
  exclusions: string[];
  image: string;
  gallery: string[];
  holidayCategory: string[];
  termsAndConditions?: string[];
  cancellationPolicy?: string[];
  quickInfo?: { icon: string; text: string }[];
  featured?: boolean;
  relatedTours?: string[];
}

export const toursData: Tour[] = [
  {
    id: "kerala-delight-tour",
    title: "Kerala Delight Tour",
    destination: "Kerala, India",
    category: "Nature",
    price: 24999,
    duration: "3 Nights / 4 Days",
    durationDays: 4,
    rating: 4.8,
    reviewsCount: 154,
    description: "Experience the beauty of Kerala with this 3 Nights / 4 Days holiday package covering Munnar, Thekkady, and Alleppey. Enjoy scenic landscapes, comfortable accommodation, sightseeing, and seamless transportation for a memorable vacation.",
    highlights: [
      "Tea Plantation Visit",
      "Houseboat Cruise",
      "Wildlife Safari",
      "Scenic Hill Stations",
      "Local Cultural Experience"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival at Cochin & Transfer to Munnar",
        description: "Arrival, Transfer, Local Sightseeing. Enjoy the beautiful drive through the hills of Munnar.",
        image: "/images/amalfi_coast.png",
        gallery: [
          "/images/amalfi_coast.png"
        ],
        sightseeing: "Tea Gardens, Attukad Waterfalls",
        meals: "Welcome Dinner (Included)",
        hotel: "Luxury Hill Resort",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Cochin, Adimali, Munnar",
          distance: "130 km",
          travelTime: "4h approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 2,
        title: "Munnar Sightseeing",
        description: "Visit Eravikulam National Park, Mattupetty Dam, and Tea Museum.",
        image: "/images/amalfi_coast.png",
        gallery: [
          "/images/amalfi_coast.png"
        ],
        sightseeing: "Eravikulam National Park, Mattupetty Dam",
        meals: "Breakfast Included",
        hotel: "Luxury Hill Resort",
        transport: "Private Chauffeur Transfer"
      },
      {
        day: 3,
        title: "Thekkady Wildlife Safari",
        description: "Transfer to Thekkady and enjoy an afternoon boat ride in Periyar Wildlife Sanctuary.",
        image: "/images/amalfi_coast.png",
        gallery: [
          "/images/amalfi_coast.png"
        ],
        sightseeing: "Periyar Wildlife Sanctuary, Spice Plantation",
        meals: "Breakfast Included",
        hotel: "Jungle Lodge Thekkady",
        transport: "Private Chauffeur Transfer"
      },
      {
        day: 4,
        title: "Alleppey Houseboat & Departure",
        description: "Transfer to Alleppey for a day cruise in a traditional houseboat, followed by departure from Cochin.",
        image: "/images/amalfi_coast.png",
        gallery: [
          "/images/amalfi_coast.png"
        ],
        sightseeing: "Alleppey Backwaters",
        meals: "Breakfast Included",
        hotel: "N/A",
        transport: "Departure Transfer"
      }
    ],
    inclusions: [
      "Accommodation",
      "Meals (Breakfast)",
      "Transportation",
      "Sightseeing",
      "Taxes"
    ],
    exclusions: [
      "Personal Expenses",
      "Flight Tickets",
      "Entry Fees",
      "Additional Activities"
    ],
    image: "/images/amalfi_coast.png",
    gallery: ["/images/amalfi_coast.png"],
    holidayCategory: ["Domestic Tour Packages", "Kerala Tour Packages", "Honeymoon Tour Packages"],
    quickInfo: [{icon:"🍽", text:"Breakfast Included"}, {icon:"🏨", text:"Hotel Stay"}, {icon:"🚗", text:"Transportation"}, {icon:"👀", text:"Sightseeing"}, {icon:"📞", text:"Tour Assistance 24x7"}]
  },
  {
    id: "golden-temple-heritage-circuit",
    slug: "golden-temple-heritage-circuit",
    title: "Golden Temple Heritage Circuit",
    destination: "North India",
    category: "Culture",
    tourType: "Heritage Tour",
    price: 32000,
    duration: "6 Nights / 7 Days",
    durationDays: 7,
    rating: 4.9,
    reviewsCount: 231,
    description: "Explore some of North India's most iconic destinations on this heritage circuit. Visit the sacred Golden Temple, witness the patriotic Wagah Border Ceremony, discover Tibetan culture in McLeod Ganj, and relax amidst the scenic beauty of Dalhousie and Khajjiar.",
    overview: {
      introduction: "Explore some of North India's most iconic destinations on this heritage circuit.",
      destinationsCovered: "Amritsar, Dharamshala, Dalhousie",
      idealTravelers: "Families, Couples, Culture Enthusiasts",
      experienceSummary: "A perfect blend of spirituality, patriotism, Tibetan culture, and serene hill stations."
    },
    routeOverview: [
      { destination: "Amritsar", nights: 2 },
      { destination: "Dharamshala", nights: 2 },
      { destination: "Dalhousie", nights: 2 }
    ],
    highlights: [
      "Golden Temple Visit",
      "Wagah Border Ceremony",
      "McLeod Ganj Exploration",
      "Khajjiar (Mini Switzerland of India)",
      "Scenic Hill Stations"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Amritsar",
        description: "Arrival, Hotel Check-in, Golden Temple Visit, Wagah Border Ceremony",
        image: "/images/paris_france.png",
        meals: "Dinner",
        stay: "Amritsar"
      },
      {
        day: 2,
        title: "Amritsar Sightseeing",
        description: "Visit Jallianwala Bagh, Partition Museum, and local markets.",
        meals: "Breakfast",
        stay: "Amritsar"
      },
      {
        day: 3,
        title: "Transfer to Dharamshala",
        description: "Drive to Dharamshala. Check-in and relax.",
        meals: "Breakfast & Dinner",
        stay: "Dharamshala"
      },
      {
        day: 4,
        title: "McLeod Ganj Exploration",
        description: "Visit Dalai Lama Temple, Bhagsu Waterfall, and Tibetan markets.",
        meals: "Breakfast",
        stay: "Dharamshala"
      },
      {
        day: 5,
        title: "Transfer to Dalhousie",
        description: "Scenic drive to Dalhousie. Evening free for leisure.",
        meals: "Breakfast & Dinner",
        stay: "Dalhousie"
      },
      {
        day: 6,
        title: "Khajjiar Excursion",
        description: "Visit Khajjiar, known as the Mini Switzerland of India.",
        meals: "Breakfast",
        stay: "Dalhousie"
      },
      {
        day: 7,
        title: "Departure",
        description: "Transfer to the airport/railway station for your onward journey.",
        meals: "Breakfast"
      }
    ],
    inclusions: [
      "Accommodation in 4-Star Hotels",
      "Meals as per itinerary",
      "Private AC Vehicle for sightseeing",
      "Airport Transfers",
      "Taxes"
    ],
    exclusions: [
      "Flights",
      "Personal Expenses",
      "Entry Tickets",
      "Activities Not Mentioned"
    ],
    image: "/images/paris_france.png",
    gallery: ["/images/paris_france.png"],
    holidayCategory: ["Domestic Tour Packages", "Culture"],
    quickInfo: [{icon:"🍽", text:"Breakfast Included"}, {icon:"🏨", text:"4-Star Hotels"}, {icon:"🚗", text:"Private Vehicle"}, {icon:"📞", text:"Tour Assistance 24x7"}]
  },
  {
    id: "kerala-hills-lakes-backwater-escape",
    slug: "kerala-hills-lakes-backwater-escape",
    title: "Kerala Hills, Lakes & Backwater Escape",
    destination: "Kerala, India",
    category: "Nature",
    price: 24999,
    duration: "3 Nights / 4 Days",
    durationDays: 4,
    durationNights: 3,
    rating: 4.9,
    reviewsCount: 168,
    show_price: true,
    show_price_breakdown: true,
    description: "Experience the pristine beauty of Kerala with this 3 Nights / 4 Days tour package covering Trivandrum, Kovalam beach, and Kanyakumari. Enjoy breathtaking sunsets, historic landmarks, comfortable accommodation, and hassle-free transfers.",
    overview: {
      introduction: "Arrive at Trivandrum Airport and transfer to Kovalam beach. Enjoy sightseeing, beach relaxation, Kovalam lighthouse, and a memorable trip to Kanyakumari for sunrise and sunset views.",
      destinationsCovered: "Trivandrum, Kovalam, Kanyakumari",
      idealTravelers: "Families, Couples, Nature Enthusiasts",
      experienceSummary: "Beach Relaxation, Cultural Heritage & Breathtaking Coastal Views"
    },
    highlights: [
      "Arrival in Trivandrum & Transfer to Kovalam",
      "Kovalam Sightseeing & Beach Relaxation",
      "Transfer to Kanyakumari & Sunset View",
      "Sunrise & Departure"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Trivandrum & Transfer to Kovalam",
        description: "Arrive at Trivandrum Airport/Railway Station. Transfer to Kovalam and relax on the beach.",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80"
        ],
        sightseeing: "Kovalam Beach, Lighthouse",
        meals: "Welcome Drink",
        hotel: "Kovalam Beach Resort",
        transport: "Private Car Transfer"
      },
      {
        day: 2,
        title: "Kovalam Sightseeing",
        description: "Explore Kovalam beaches, Samudra Beach, Hawa Beach, and local artisan markets.",
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80"
        ],
        sightseeing: "Samudra Beach, Hawa Beach",
        meals: "Breakfast Included",
        hotel: "Kovalam Beach Resort",
        transport: "Private Vehicle"
      },
      {
        day: 3,
        title: "Transfer to Kanyakumari",
        description: "Drive to Kanyakumari. Visit Vivekananda Rock Memorial, Thiruvalluvar Statue, and enjoy the sunset.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80"
        ],
        sightseeing: "Vivekananda Rock Memorial, Sunset View Point",
        meals: "Breakfast Included",
        hotel: "Kanyakumari Ocean View Hotel",
        transport: "Private Vehicle"
      },
      {
        day: 4,
        title: "Sunrise & Departure",
        description: "Watch the breathtaking sunrise at Kanyakumari beach. Transfer to Trivandrum Airport/Railway Station for departure.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
        ],
        sightseeing: "Kanyakumari Sunrise Point",
        meals: "Breakfast Included",
        hotel: "N/A",
        transport: "Departure Transfer"
      }
    ],
    inclusions: [
      "Accommodation in 3-Star / 4-Star Beach Hotels",
      "Daily Breakfast Included",
      "Private Air-Conditioned Vehicle for Transfers & Sightseeing",
      "Driver Charges, Tolls, Parking & Taxes"
    ],
    exclusions: [
      "Airfare or Trainfare",
      "Entry fees to monuments & attractions",
      "Personal expenses such as laundry, phone calls, tips",
      "Anything not mentioned in Inclusions"
    ],
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80"
    ],
    holidayCategory: ["Domestic Tour Packages", "Kerala Tour Packages", "Honeymoon Tour Packages"],
    quickInfo: [{icon:"🍽", text:"Breakfast Included"}, {icon:"🏨", text:"Beach Resort"}, {icon:"🚗", text:"Transfers"}, {icon:"📞", text:"Tour Assistance 24x7"}]
  },
  {
    id: "golden-triangle-heritage-escape",
    slug: "golden-triangle-heritage-escape",
    title: "Golden Triangle Heritage Escape",
    destination: "Delhi - Agra - Jaipur",
    category: "Culture",
    tourType: "Heritage & Luxury",
    price: 29999,
    show_price: true,
    show_price_breakdown: true,
    tax: 0,
    duration: "5 Nights / 6 Days",
    durationDays: 6,
    durationNights: 5,
    rating: 4.9,
    reviewsCount: 195,
    description: "Immerse yourself in India's golden heritage spanning Delhi, the Taj Mahal in Agra, and the majestic pink palaces of Jaipur with private guided tours.",
    overview: {
      packageSummary: "Explore the iconic Golden Triangle circuit with Delhi, Agra, and Jaipur.",
      introduction: "Discover the magnificent architectural wonders of the Mughal and Rajput empires.",
      destinationsCovered: "Delhi, Agra, Jaipur",
      idealTravelers: "Couples, Families, Culture Buffs",
      experienceSummary: "Iconic monuments, vibrant bazaars, and royal palatial hospitality."
    },
    highlights: [
      "Private sunrise tour of the Taj Mahal",
      "Amber Fort Elephant/Jeep experience",
      "Qutub Minar and Old Delhi rickshaw ride",
      "Chauffeured luxury air-conditioned sedan throughout"
    ],
    routeOverview: [
      { destination: "Delhi", nights: 2, days: 2 },
      { destination: "Agra", nights: 1, days: 2 },
      { destination: "Jaipur", nights: 2, days: 2 }
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Delhi & Heritage Welcome",
        description: "Arrive in Delhi. Check into hotel and explore India Gate and Connaught Place.",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
        sightseeing: "India Gate, Connaught Place",
        meals: "Welcome Dinner",
        hotel: "5-Star Luxury Delhi Hotel",
        transport: "Chauffeured Luxury Sedan"
      }
    ],
    inclusions: [
      "Luxury 5-Star Hotel Stays",
      "Daily Buffet Breakfast",
      "Private Monument Entry & Guided Tours",
      "All Inter-city Transfers & Tolls"
    ],
    exclusions: [
      "Flights",
      "Personal Expenses",
      "Gratuities"
    ],
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80"
    ],
    holidayCategory: ["Luxury Tour Packages", "Culture"],
    quickInfo: [{icon:"🍽", text:"Breakfast Included"}, {icon:"🏨", text:"5-Star Hotels"}, {icon:"🚗", text:"Private Transfers"}, {icon:"📞", text:"24x7 Assistance"}]
  },
  {
    id: "bhutan-himalayan-escape",
    slug: "bhutan-himalayan-escape",
    title: "Bhutan Himalayan Escape",
    destination: "Bhutan",
    category: "Leisure",
    tourType: "Himalayan Expedition",
    price: 54999,
    show_price: true,
    show_price_breakdown: true,
    tax: 0,
    duration: "6 Nights / 7 Days",
    durationDays: 7,
    durationNights: 6,
    rating: 5.0,
    reviewsCount: 88,
    description: "Journey into the Land of the Thunder Dragon. Hike to Tiger's Nest monastery, explore Thimphu's vibrant Dzongs, and soak in pristine Himalayan mountain vistas.",
    overview: {
      packageSummary: "7-day serene expedition to Thimphu, Punakha, and Paro in mystical Bhutan.",
      introduction: "Experience the serenity, peace, and rich Buddhist culture of high-altitude Bhutan.",
      destinationsCovered: "Paro, Thimphu, Punakha",
      idealTravelers: "Nature Lovers, Adventure Enthusiasts, Spiritual Seekers",
      experienceSummary: "Ancient monasteries, pine-scented valleys, and gentle Bhutanese warmth."
    },
    highlights: [
      "Trek to Tiger's Nest (Paro Taktsang)",
      "Punakha Suspension Bridge and Dzong",
      "Dochula Pass Himalayan Panorama",
      "Sustainable Development Fee & Visa assistance included"
    ],
    routeOverview: [
      { destination: "Thimphu", nights: 2, days: 2 },
      { destination: "Punakha", nights: 2, days: 2 },
      { destination: "Paro", nights: 2, days: 3 }
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive in Paro - Transfer to Thimphu",
        description: "Arrive at Paro International Airport. Scenic mountain drive to the capital city Thimphu.",
        image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80",
        sightseeing: "Buddha Dordenma, Memorial Chorten",
        meals: "Dinner Included",
        hotel: "Heritage Bhutanese Resort",
        transport: "Private Mountain Vehicle"
      }
    ],
    inclusions: [
      "3-Star / 4-Star Certified Accommodations",
      "All Meals (Breakfast, Lunch & Dinner)",
      "Bhutan Entry Permits & Visa Processing",
      "English-Speaking Licensed Bhutanese Guide",
      "Private Transport with Chauffeur"
    ],
    exclusions: [
      "International Airfare to Paro",
      "Personal expenses",
      "Travel Insurance"
    ],
    image: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80"
    ],
    holidayCategory: ["International Tour Packages", "Leisure", "Culture"],
    quickInfo: [{icon:"🍽", text:"All Meals Included"}, {icon:"🏨", text:"Resort Stay"}, {icon:"🚗", text:"All Transfers"}, {icon:"📞", text:"Local Guide"}]
  }
];

export const categories = [
  { name: "Domestic Tour Packages", path: "domestic-tour-packages", count: 3, image: "/images/amalfi_coast.png", icon: "🏔️" },
  { name: "International Tour Packages", path: "international-tour-packages", count: 0, image: "/images/swiss_alps.png", icon: "✈️" },
  { name: "Kerala Tour Packages", path: "kerala-tour-packages", count: 2, image: "/images/amalfi_coast.png", icon: "🌴" },
  { name: "Honeymoon Tour Packages", path: "honeymoon-tour-packages", count: 2, image: "/images/maldives.png", icon: "❤️" },
  { name: "Day Excursions", path: "day-excursions", count: 0, image: "/images/paris_france.png", icon: "☀️" },
  { name: "Luxury Tour Packages", path: "luxury-tour-packages", count: 0, image: "/images/amalfi_coast.png", icon: "💎" }
];
