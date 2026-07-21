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
    id: "swiss-alps-adventure",
    title: "Swiss Alps Peaks & Valleys Tour",
    destination: "Zermatt & Interlaken, Switzerland",
    category: "Adventure",
    price: 1899,
    duration: "7 Days / 6 Nights",
    durationDays: 7,
    rating: 4.9,
    reviewsCount: 142,
    description: "Embark on an alpine journey of a lifetime. Experience the majestic Matterhorn, ride the scenic Glacier Express, and hike through the pristine green valleys of Lauterbrunnen. This adventure combines premium comfort with the thrill of Europe's highest peaks.",
    highlights: [
      "Panoramic train ride on the world-famous Glacier Express",
      "Guided hike in the car-free village of Zermatt with Matterhorn views",
      "Cable car ride to the Top of Europe (Jungfraujoch)",
      "Traditional Swiss fondue tasting dinner in Interlaken"
    ],
    relatedTours: ["kyoto-cultural-immersion", "amalfi-coast-escape"],
    routeOverview: [
      { destination: "Zurich", nights: 1 },
      { destination: "Zermatt", nights: 2 },
      { destination: "Interlaken", nights: 3 }
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Zurich & Transfer to Zermatt",
        description: "Your Swiss odyssey begins as you touch down at Zurich Airport. Your private chauffeur will be waiting in the arrivals hall to assist with your luggage and escort you to a luxury Mercedes V-Class. Enjoy a scenic 3.5-hour drive through the heart of the Swiss Alps, passing crystal-clear lakes and emerald valleys as you ascend toward the car-free village of Zermatt.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 2,
        title: "Gornergrat Cogwheel Railway & Matterhorn Views",
        description: "Ride Europe's highest open-air cogwheel railway up to Gornergrat (3,089m). Enjoy breathtaking, panoramic views of the Matterhorn and surrounding glaciers. Embark on a gentle guided hike back down to Riffelsee.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 3,
        title: "Glacier Express to Andermatt & Interlaken",
        description: "Board the Glacier Express, 'the slowest express train in the world.' Sit back in your panoramic coach as you cross deep valleys, climb mountain passes, and travel through the heart of the Swiss Alps before transferring to Interlaken.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 4,
        title: "Jungfraujoch - Top of Europe Experience",
        description: "Ascend to Jungfraujoch, the highest railway station in Europe at 3,454 meters. Explore the Ice Palace, step out onto the Sphinx Observation Terrace for views of the Aletsch Glacier, and play in the snow.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 5,
        title: "Lauterbrunnen Valley & Trümmelbach Falls",
        description: "Discover the valley of 72 waterfalls. Walk through Lauterbrunnen and visit the subterranean Trümmelbach Falls, where glacier meltwater thunders through the mountain. Spend the afternoon canoeing on Lake Brienz.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 6,
        title: "Leisure Day in Interlaken & Farewell Dinner",
        description: "Enjoy a day at your own pace. Opt for paragliding over Interlaken, shopping, or taking a cruise on Lake Thun. In the evening, gather for a traditional Swiss fondue and raclette farewell dinner.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 7,
        title: "Departure from Zurich",
        description: "Transfer back to Zurich airport by train for your departure flight, taking home unforgettable memories of the Swiss peaks.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      }
    ],
    inclusions: [
      "6 nights in boutique 4-star alpine hotels",
      "Daily buffet breakfasts and 3 premium dinners",
      "1st class Swiss Travel Pass for all trains and buses",
      "All cable cars and mountain railways tickets mentioned",
      "Certified local mountain guides"
    ],
    exclusions: [
      "International flights to/from Zurich",
      "Lunch and dinner meals not specified",
      "Travel insurance (highly recommended)",
      "Optional adventure activities like paragliding"
    ],
    image: "/images/swiss_alps.png",
    gallery: ["/images/swiss_alps.png"],
    holidayCategory: ["International Tour Packages", "Luxury Tour Packages"],
    quickInfo: [{icon:"🍽", text:"Breakfast Included"}, {icon:"🏨", text:"4-Star Hotel"}, {icon:"🚆", text:"Swiss Travel Pass"}, {icon:"📞", text:"Tour Assistance 24x7"}],
    featured: true
  },
  {
    id: "kyoto-cultural-explorer",
    title: "Kyoto Zen Gardens & Shrine Heritage",
    destination: "Kyoto, Japan",
    category: "Culture",
    price: 1499,
    duration: "5 Days / 4 Nights",
    durationDays: 5,
    rating: 4.8,
    reviewsCount: 96,
    description: "Immerse yourself in the ancient traditions of Japan's cultural capital. From the shimmering golden walls of Kinkaku-ji to the thousands of vermilion gates at Fushimi Inari, this curated experience brings you closer to Zen philosophy, tea ceremonies, and artisan history.",
    highlights: [
      "Exclusive private tea ceremony hosted by a certified Tea Master",
      "Early morning walk through the Arashiyama Bamboo Grove",
      "Guided sunset stroll through the historic Gion district",
      "Stay in a traditional Japanese Ryokan with onsen bath experience"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Kyoto & Gion Sunset Walk",
        description: "Arrive in Kyoto via Shinkansen (bullet train) from Tokyo. Check into your premium ryokan. In the evening, enjoy a guided stroll through Gion, Kyoto's famous geisha district, as the lanterns light up.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 2,
        title: "Golden Pavilion & Ryoan-ji Rock Garden",
        description: "Visit Kinkaku-ji (Golden Pavilion), reflecting beautifully over its pond. Next, head to Ryoan-ji Temple to contemplate Japan's most famous Zen rock garden. Have a traditional Buddhist vegetarian lunch (Shojin Ryori).",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 3,
        title: "Fushimi Inari Gates & Kiyomizu-dera Temple",
        description: "Rise early to hike through the thousands of vermilion torii gates at Fushimi Inari Shrine. In the afternoon, visit the wooden stage of Kiyomizu-dera for stunning panoramic views of Kyoto.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 4,
        title: "Arashiyama Bamboo Forest & Tea Ceremony",
        description: "Walk the towering bamboo paths of Arashiyama. Visit Tenryu-ji Temple and its scenic gardens. In the afternoon, participate in a private, meditative Matcha tea ceremony in a historic wooden tea house.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 5,
        title: "Nishiki Market & Departure",
        description: "Explore the narrow streets of Nishiki Market, tasting local delicacies and picking up handmade souvenirs. Transfer to Kansai Airport or Kyoto Station for your onwards journey.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      }
    ],
    inclusions: [
      "3 nights in a premium boutique hotel and 1 night in a traditional luxury Ryokan",
      "Daily breakfasts and traditional Kaiseki multi-course dinner",
      "Private English-speaking local cultural guides",
      "All entrance fees to temples, gardens, and shrines",
      "Private tea ceremony experience"
    ],
    exclusions: [
      "Flights to Japan and airport taxes",
      "Shinkansen tickets to/from Kyoto (can be booked via JR Pass)",
      "Personal items and gratuities"
    ],
    image: "/images/kyoto_japan.png",
    gallery: ["/images/kyoto_japan.png"],
    holidayCategory: ["International Tour Packages"],
    quickInfo: [{icon:"🍽", text:"Breakfast Included"}, {icon:"🏨", text:"Ryokan Stay"}, {icon:"🍵", text:"Tea Ceremony"}, {icon:"📞", text:"Tour Assistance 24x7"}],
    featured: true
  },
  {
    id: "amalfi-coast-escape",
    title: "Amalfi Coast & Capri Cliffside Escape",
    destination: "Positano & Capri, Italy",
    category: "Leisure",
    price: 2199,
    duration: "6 Days / 5 Nights",
    durationDays: 6,
    rating: 4.95,
    reviewsCount: 184,
    description: "Indulge in the ultimate Mediterranean getaway. Cruise along the dramatic coastline, explore the colorful cliffside villages of Positano and Ravello, swim in the Blue Grotto of Capri, and savor authentic regional cuisine with views of the azure sea.",
    highlights: [
      "Private boat excursion around the Isle of Capri and the Blue Grotto",
      "Exclusive lemon farm tour and limoncello tasting in Sorrento",
      "Scenic drive along the cliffside roads with local Italian drivers",
      "Cooking class with a local chef overlooking the Mediterranean"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Sorrento & Welcome Aperitivo",
        description: "Arrive in Naples and transfer to Sorrento. Check into your cliffside hotel. Join the group for a welcome aperitivo on the terrace, watching the sunset over Mount Vesuvius.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 2,
        title: "Positano Exploration & Scenic Amalfi Drive",
        description: "Drive along the winding coastal roads to Positano. Take a guided walk through its narrow, flower-draped streets down to the beach. Continue to the town of Amalfi to visit its medieval cathedral.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 3,
        title: "Capri Yacht Cruise & Blue Grotto Swim",
        description: "Board a private yacht for a full-day cruise to Capri. Sail past the Faraglioni rock formations, visit the glowing Blue Grotto, and enjoy free time to shop and dine in Capri town.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 4,
        title: "Ravello Gardens & Cooking Masterclass",
        description: "Head high into the hills to Ravello. Explore the panoramic gardens of Villa Rufolo. In the afternoon, learn to make fresh pasta and tiramisu at a family-run cliffside estate, followed by dinner.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 5,
        title: "Pompeii Guided Tour & Limoncello Tasting",
        description: "Take a morning excursion to the archaeological site of Pompeii, frozen in time by Mt. Vesuvius. Return to Sorrento for a farewell dinner at a lemon grove farm with limoncello tasting.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 6,
        title: "Departure from Naples",
        description: "Enjoy a final breakfast overlooking the bay before transferring back to Naples airport for your return flight home.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      }
    ],
    inclusions: [
      "5 nights in 4-star and 5-star cliffside boutique hotels",
      "Daily buffet breakfasts, 2 dinners, and 1 lunch",
      "Private yacht cruise to Capri with drinks & snacks",
      "Private Mercedes minivan transfers for all sightseeing",
      "Entrance tickets and expert guides for Pompeii"
    ],
    exclusions: [
      "Flights to Naples",
      "City tourist taxes (paid locally)",
      "Optional tips for drivers and captains"
    ],
    image: "/images/amalfi_coast.png",
    gallery: ["/images/amalfi_coast.png"],
    holidayCategory: ["International Tour Packages", "Honeymoon Tour Packages", "Luxury Tour Packages"],
    quickInfo: [{icon:"🍽", text:"Breakfast & Dinner"}, {icon:"🏨", text:"5-Star Hotel"}, {icon:"🛥", text:"Yacht Cruise"}, {icon:"📞", text:"Tour Assistance 24x7"}],
    featured: true
  },
  {
    id: "serengeti-wildlife-safari",
    title: "Serengeti & Ngorongoro Big Five Safari",
    destination: "Serengeti National Park, Tanzania",
    category: "Nature",
    price: 2499,
    duration: "6 Days / 5 Nights",
    durationDays: 6,
    rating: 4.88,
    reviewsCount: 74,
    description: "Witness the greatest wildlife spectacle on Earth. Traverse the endless plains of the Serengeti, descend into the massive Ngorongoro Crater, spot lions, leopards, elephants, rhinos, and buffaloes, and stay in luxurious eco-tented lodges under the African stars.",
    highlights: [
      "Daily game drives in customized open-roof 4x4 Land Cruisers",
      "Full-day expedition in the UNESCO-listed Ngorongoro Crater",
      "Stay in premium luxury tented camps with roaring campfires",
      "Authentic Maasai cultural village visit and dance ritual"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arusha to Lake Manyara National Park",
        description: "Meet your guide in Arusha and drive to Lake Manyara. Famous for tree-climbing lions and flocks of pink flamingos, enjoy your first afternoon game drive before settling into your lodge.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 2,
        title: "Ngorongoro Crater Exploration",
        description: "Descend 600 meters into the Ngorongoro Crater, a volcanic caldera hosting over 30,000 animals. Spend the day spotting black rhinos, prides of lions, and elephants. Picnic lunch inside the crater.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 3,
        title: "Journey to the Serengeti Plains",
        description: "Drive into the endless plains of the Serengeti, looking out for wildlife along the way. Arrive at your luxury safari camp in time for sunset drinks around the boma fire.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 4,
        title: "Full Day Serengeti Game Drives",
        description: "Embark on morning and afternoon game drives. Seek out cheetahs hunting, leopards lounging in acacia trees, and watch the herds of wildebeest and zebras migrating across the golden savannah.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 5,
        title: "Sunrise Balloon Safari & Maasai Culture",
        description: "Optionally drift over the Serengeti in a hot air balloon at sunrise. Later, visit a Maasai boma (village) to learn about their nomadic lifestyle, beadwork, and traditional jumping dances.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 6,
        title: "Return to Arusha & Departure",
        description: "Take a short morning game drive as you leave the park. Fly or drive back to Arusha for your outbound flight or Zanzibar beach extension.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      }
    ],
    inclusions: [
      "5 nights in luxury safari lodges and tented camps",
      "All meals (Breakfast, Lunch, Dinner) throughout the safari",
      "Private 4x4 safari vehicle with professional driver-guide",
      "All national park fees, crater service fees, and conservation fees",
      "Bottled water and binoculars provided in the safari vehicle"
    ],
    exclusions: [
      "International flights to/from Kilimanjaro (JRO)",
      "Optional Hot Air Balloon Safari (₹550 per person)",
      "Tanzania tourist visa",
      "Tips for safari guide (approx. ₹20/day recommended)"
    ],
    image: "/images/serengeti_safari.png",
    gallery: ["/images/serengeti_safari.png"],
    holidayCategory: ["International Tour Packages"],
    quickInfo: [{icon:"🍽", text:"All Meals Included"}, {icon:"🏨", text:"Luxury Tents"}, {icon:"🚙", text:"4x4 Safari"}, {icon:"📞", text:"Tour Assistance 24x7"}],
    featured: true
  },
  {
    id: "romance-in-paris",
    title: "Paris Art, Romance & Gastronomy Tour",
    destination: "Paris, France",
    category: "History",
    price: 1299,
    duration: "5 Days / 4 Nights",
    durationDays: 5,
    rating: 4.75,
    reviewsCount: 112,
    description: "Fall in love with the City of Light. Walk through the cobblestone streets of Montmartre, skip the lines at the Louvre and Musée d'Orsay, sail down the Seine River on a dinner cruise, and discover the secrets of French baking in a private pastry kitchen.",
    highlights: [
      "VIP skip-the-line access to the Louvre Museum and Eiffel Tower",
      "Seine River gourmet dinner cruise with live violin music",
      "Private French macaron baking class in a Parisian kitchen",
      "Chauffeur-driven vintage car tour of Paris landmarks"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Paris & Seine Dinner Cruise",
        description: "Arrive in Paris and check into your boutique hotel in Saint-Germain-des-Prés. In the evening, embark on a luxury dinner cruise on the Seine River, gliding past the illuminated Notre-Dame and Eiffel Tower.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 2,
        title: "Louvre Masterpieces & Montmartre Walk",
        description: "Enjoy a VIP guided tour of the Louvre, seeing the Mona Lisa and Venus de Milo. In the afternoon, explore the artistic hill of Montmartre, visiting the Sacré-Cœur and local artists at Place du Tertre.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 3,
        title: "Eiffel Tower Summit & Macaron Class",
        description: "Ascend to the summit of the Eiffel Tower for panoramic city views. In the afternoon, join an expert pastry chef to learn the delicate art of making French macarons, enjoying them with champagne.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 4,
        title: "Palace of Versailles Excursion",
        description: "Take a short train trip to the Palace of Versailles. Guided tour of the Hall of Mirrors and the King's State Apartments, followed by a leisurely stroll through the fountain gardens.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 5,
        title: "Marais Boutiques & Departure",
        description: "Spend your final morning shopping and cafe-hopping in the trendy Le Marais district. Pick up gourmet chocolates and baguettes before heading to the airport.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      }
    ],
    inclusions: [
      "4 nights in a 4-star boutique hotel in central Paris",
      "Daily French breakfasts and 1 gourmet dinner cruise",
      "Skip-the-line museum passes and Eiffel Tower tickets",
      "Macaron baking masterclass",
      "Public transport pass for Paris Metro"
    ],
    exclusions: [
      "Flights to Paris",
      "Airport transfers (available as add-on)",
      "Meals not specified"
    ],
    image: "/images/paris_france.png",
    gallery: ["/images/paris_france.png"],
    holidayCategory: ["International Tour Packages", "Honeymoon Tour Packages"],
    quickInfo: [{icon:"🍽", text:"Breakfast Included"}, {icon:"🏨", text:"Boutique Hotel"}, {icon:"🥖", text:"Baking Class"}, {icon:"📞", text:"Tour Assistance 24x7"}]
  },
  {
    id: "maldives-paradise",
    title: "Maldives Luxury Overwater Villa Resort",
    destination: "Ari Atoll, Maldives",
    category: "Leisure",
    price: 2999,
    duration: "7 Days / 6 Nights",
    durationDays: 7,
    rating: 4.98,
    reviewsCount: 65,
    description: "Escape to absolute paradise. Stay in a private overwater villa suspended over a turquoise lagoon. Swim with manta rays, relax with daily couples massage treatments, dine under the ocean at a glass restaurant, and soak in the endless horizon.",
    highlights: [
      "Stay in an overwater villa with direct lagoon access and private pool",
      "Scenic round-trip seaplane transfers from Malé Airport",
      "Sub-aquatic dining experience at a glass underwater restaurant",
      "Private sunset dolphin cruise with champagne"
    ],
    itinerary: [
      {
        day: 1,
        title: "Seaplane Flight to Resort & Villa Welcome",
        description: "Arrive in Malé and board your seaplane. Soar over coral atolls before landing at your private island resort. Check into your overwater villa and enjoy a complimentary bottle of champagne.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 2,
        title: "Snorkeling Safari & Manta Ray Swim",
        description: "Join the marine biologist for a speedboat trip to nearby reefs. Snorkel alongside manta rays, sea turtles, and colorful reef fish. Afternoon free for beach relaxation.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 3,
        title: "Overwater Spa Treatment & Yoga",
        description: "Start the day with a sunrise yoga session on the deck. Later, indulge in a 90-minute signature couples massage at the overwater spa with glass floor panels.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 4,
        title: "Underwater Restaurant Lunch",
        description: "Dine five meters below the sea surface at the resort's glass dome restaurant. Watch sharks and fish swim around you while enjoying a 5-course gourmet tasting menu.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 5,
        title: "Water Sports & Sunset Dolphin Cruise",
        description: "Try paddleboarding or windsurfing. In the evening, board a traditional wooden Dhoni for a sunset cruise, looking for schools of spinner dolphins leaping in the waves.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 6,
        title: "Private Beach BBQ Dinner",
        description: "Enjoy a day at leisure. In the evening, experience a private torch-lit barbecue dinner directly on the sandy beach under the canopy of stars, with your personal chef.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 7,
        title: "Seaplane Transfer to Malé",
        description: "Bid farewell to paradise. Take the seaplane back to Malé for your flight home, feeling completely rejuvenated.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      }
    ],
    inclusions: [
      "6 nights in a Luxury Overwater Pool Villa",
      "All-Inclusive meal package (Breakfast, Lunch, Dinner, Drinks)",
      "Round-trip seaplane transfers from Malé International Airport",
      "Sunset dolphin cruise and snorkeling gear rental",
      "One 90-minute spa treatment per adult"
    ],
    exclusions: [
      "International flights to Malé (MLE)",
      "Motorized water sports (jetski, flyboard)",
      "Souvenirs and laundry services"
    ],
    image: "/images/maldives.png",
    gallery: ["/images/maldives.png"],
    holidayCategory: ["International Tour Packages", "Honeymoon Tour Packages", "Luxury Tour Packages"],
    quickInfo: [{icon:"🍽", text:"All Inclusive"}, {icon:"🏨", text:"Overwater Villa"}, {icon:"✈", text:"Seaplane Transfer"}, {icon:"📞", text:"Tour Assistance 24x7"}]
  }
,
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
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 2,
        title: "Munnar Sightseeing",
        description: "Visit Eravikulam National Park, Mattupetty Dam, and Tea Museum.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 3,
        title: "Thekkady Wildlife Safari",
        description: "Transfer to Thekkady and enjoy an afternoon boat ride in Periyar Wildlife Sanctuary.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
      },
      {
        day: 4,
        title: "Alleppey Houseboat & Departure",
        description: "Transfer to Alleppey for a day cruise in a traditional houseboat, followed by departure from Cochin.",
        image: "/images/kyoto_japan.png",
        gallery: [
          "/images/kyoto_japan.png", 
          "/images/maldives.png", 
          "/images/swiss_alps.png", 
          "/images/blanket_hotel_pool.jpg", 
          "/images/blanket_hotel_room1.jpg",
          "/images/blanket_hotel_mist.jpg"
        ],
        sightseeing: "Lake Thun, Spiez Castle",
        meals: "Welcome Dinner (Included)",
        hotel: "The Omnia, Mountain Lodge",
        transport: "Private Chauffeur Transfer",
        logistics: {
          placesCovered: "Zurich, Visp, Tasch, Zermatt",
          distance: "240 km",
          travelTime: "3h 30m approx.",
          pace: "Relaxed"
        }
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
  }
,
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
        image: "/images/kyoto_japan.png", // Using existing placeholder images
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
    gallery: ["/images/paris_france.png", "/images/kyoto_japan.png"],
    holidayCategory: ["Domestic Tour Packages", "Culture"],
    quickInfo: [{icon:"🍽", text:"Breakfast Included"}, {icon:"🏨", text:"4-Star Hotels"}, {icon:"🚗", text:"Private Vehicle"}, {icon:"📞", text:"Tour Assistance 24x7"}]
  },
  {
    id: "mystical-azerbaijan-escape",
    slug: "mystical-azerbaijan-escape",
    title: "Mystical Azerbaijan Escape",
    destination: "Baku, Azerbaijan",
    category: "Culture",
    tourType: "City Break",
    price: 45000,
    duration: "3 Nights / 4 Days",
    durationDays: 4,
    rating: 4.7,
    reviewsCount: 112,
    description: "Discover the perfect blend of ancient history and modern architecture in Baku. Explore the UNESCO-listed Old City, witness the futuristic Flame Towers, and experience the rich culture of Azerbaijan.",
    overview: {
      introduction: "Discover the perfect blend of ancient history and modern architecture in Baku.",
      destinationsCovered: "Baku",
      idealTravelers: "Couples, Friends, Solo Travelers",
      experienceSummary: "A fascinating city break filled with history, culture, and modern marvels."
    },
    routeOverview: [
      { destination: "Baku", nights: 3 }
    ],
    highlights: [
      "Old City (Icherisheher) Walking Tour",
      "Flame Towers Observation Deck",
      "Heydar Aliyev Center Visit",
      "Caspian Sea Promenade",
      "Mud Volcanoes Excursion"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Baku",
        description: "Airport pickup, transfer to hotel. Evening walk along the Baku Boulevard.",
        image: "/images/swiss_alps.png",
        meals: "Dinner",
        stay: "Baku"
      },
      {
        day: 2,
        title: "Baku City Tour",
        description: "Explore the Old City, Maiden Tower, and Shirvanshahs' Palace.",
        meals: "Breakfast",
        stay: "Baku"
      },
      {
        day: 3,
        title: "Absheron Peninsula",
        description: "Visit Ateshgah (Fire Temple) and Yanar Dag (Burning Mountain).",
        meals: "Breakfast",
        stay: "Baku"
      },
      {
        day: 4,
        title: "Departure",
        description: "Transfer to Heydar Aliyev International Airport.",
        meals: "Breakfast"
      }
    ],
    inclusions: [
      "3 Nights Accommodation",
      "Daily Breakfast",
      "Airport Transfers",
      "Guided City Tour",
      "E-Visa Assistance"
    ],
    exclusions: [
      "International Flights",
      "Visa Fees",
      "Lunches & Dinners",
      "Travel Insurance"
    ],
    image: "/images/swiss_alps.png",
    gallery: ["/images/swiss_alps.png"],
    holidayCategory: ["International Tour Packages"],
    quickInfo: [{icon:"🍽", text:"Breakfast Included"}, {icon:"🏨", text:"City Center Hotel"}, {icon:"🗣️", text:"English Speaking Guide"}, {icon:"📞", text:"Tour Assistance 24x7"}]
  },
  {
    id: "southern-shores-retreat",
    slug: "southern-shores-retreat",
    title: "Southern Shores Retreat",
    destination: "South India",
    category: "Leisure",
    tourType: "Beach Holiday",
    price: 18500,
    duration: "3 Nights / 4 Days",
    durationDays: 4,
    rating: 4.6,
    reviewsCount: 89,
    description: "Relax on the pristine beaches of Kovalam and witness the mesmerizing sunrise and sunset at Kanyakumari, the southernmost tip of India where three oceans meet.",
    overview: {
      introduction: "Relax on the pristine beaches of Kovalam and witness the mesmerizing sunrise and sunset at Kanyakumari.",
      destinationsCovered: "Kovalam, Kanyakumari",
      idealTravelers: "Couples, Honeymooners, Families",
      experienceSummary: "A relaxing coastal getaway featuring beautiful beaches and iconic landmarks."
    },
    routeOverview: [
      { destination: "Kovalam", nights: 2 },
      { destination: "Kanyakumari", nights: 1 }
    ],
    highlights: [
      "Lighthouse Beach, Kovalam",
      "Vivekananda Rock Memorial",
      "Thiruvalluvar Statue",
      "Sunset at Kanyakumari",
      "Padmanabhapuram Palace"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Trivandrum & Transfer to Kovalam",
        description: "Arrive at Trivandrum Airport. Transfer to Kovalam and relax on the beach.",
        image: "/images/amalfi_coast.png",
        meals: "None",
        stay: "Kovalam"
      },
      {
        day: 2,
        title: "Kovalam Sightseeing",
        description: "Visit Lighthouse Beach, Hawa Beach, and Napier Museum.",
        meals: "Breakfast",
        stay: "Kovalam"
      },
      {
        day: 3,
        title: "Transfer to Kanyakumari",
        description: "Drive to Kanyakumari. Visit Vivekananda Rock Memorial and watch the sunset.",
        meals: "Breakfast",
        stay: "Kanyakumari"
      },
      {
        day: 4,
        title: "Sunrise & Departure",
        description: "Watch the sunrise. Transfer to Trivandrum Airport.",
        meals: "Breakfast"
      }
    ],
    inclusions: [
      "Accommodation",
      "Breakfast",
      "AC Vehicle Transfers",
      "Toll & Parking"
    ],
    exclusions: [
      "Flights/Trains",
      "Entry Fees",
      "Ferry Tickets",
      "Personal Expenses"
    ],
    image: "/images/amalfi_coast.png",
    gallery: ["/images/amalfi_coast.png"],
    holidayCategory: ["Domestic Tour Packages", "Kerala Tour Packages", "Honeymoon Tour Packages"],
    quickInfo: [{icon:"🍽", text:"Breakfast Included"}, {icon:"🏨", text:"Beach Resort"}, {icon:"🚗", text:"Transfers"}, {icon:"📞", text:"Tour Assistance 24x7"}]
  }
];

export const categories = [
  { name: "Domestic Tour Packages", path: "domestic-tour-packages", count: 1, image: "/images/amalfi_coast.png", icon: "🏔️" },
  { name: "International Tour Packages", path: "international-tour-packages", count: 5, image: "/images/swiss_alps.png", icon: "✈️" },
  { name: "Kerala Tour Packages", path: "kerala-tour-packages", count: 1, image: "/images/amalfi_coast.png", icon: "🌴" },
  { name: "Honeymoon Tour Packages", path: "honeymoon-tour-packages", count: 3, image: "/images/maldives.png", icon: "❤️" },
  { name: "Day Excursions", path: "day-excursions", count: 0, image: "/images/paris_france.png", icon: "☀️" },
  { name: "Luxury Tour Packages", path: "luxury-tour-packages", count: 2, image: "/images/amalfi_coast.png", icon: "💎" }
];

