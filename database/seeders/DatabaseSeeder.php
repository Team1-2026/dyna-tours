<?php

namespace Database\Seeders;

use App\Models\Cruise;
use App\Models\Destination;
use App\Models\Facility;
use App\Models\Hotel;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 0. Seed Facilities
        $facilitiesData = [
            ['name' => 'Breakfast', 'icon' => 'breakfast', 'description' => 'Delicious fresh hot breakfast options served daily'],
            ['name' => 'Wifi', 'icon' => 'wifi', 'description' => 'High-speed wireless internet connection throughout the property'],
            ['name' => 'Gym', 'icon' => 'gym', 'description' => 'Fully equipped modern fitness center'],
            ['name' => 'Yoga', 'icon' => 'yoga', 'description' => 'Guided morning yoga, meditation, and wellness sessions'],
            ['name' => 'Air conditioning', 'icon' => 'air conditioning', 'description' => 'Climate-controlled air conditioning in rooms and common areas'],
            ['name' => 'Car parking', 'icon' => 'car parking', 'description' => 'Secure, private, complimentary valet and self-parking space'],
            ['name' => 'Jacuzzi', 'icon' => 'jacuzzi', 'description' => 'Relaxing hydrotherapy jacuzzi and heated whirlpool'],
            ['name' => 'Spa', 'icon' => 'spa', 'description' => 'Rejuvenating wellness spa offering body massages and therapies'],
            ['name' => 'Pool', 'icon' => 'pool', 'description' => 'Scenic outdoor infinity swimming pool'],
            ['name' => 'Restaurant', 'icon' => 'restaurant', 'description' => 'Fine-dining restaurant serving local and international cuisines'],
            ['name' => 'Bar', 'icon' => 'bar', 'description' => 'Elegant lounge bar with premium drinks and cocktails'],
            ['name' => 'Indoor games', 'icon' => 'indoor games', 'description' => 'Recreation room with board games, table tennis, and billiards'],
            ['name' => 'Activity', 'icon' => 'activity', 'description' => 'Adventure activities, nature treks, and cycling tours'],
            ['name' => 'Airport Transport', 'icon' => 'airport transport', 'description' => 'Complimentary airport shuttle and local transit arrangements'],
            ['name' => 'sight seeing', 'icon' => 'sight seeing', 'description' => 'Guided local sightseeing tours and scenic viewpoint excursions']
        ];

        $dbFacilities = [];
        foreach ($facilitiesData as $fac) {
            $dbFacilities[$fac['name']] = Facility::create($fac);
        }

        // 0b. Seed Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@dynatours.com',
            'password' => bcrypt('password'),
        ]);

        // 1. Seed Domestic States / Main Destinations
        $kerala = Destination::create([
            'id' => 'kerala',
            'name' => 'Kerala',
            'type' => 'domestic',
            'parent_id' => null,
            'overview' => 'Known as God\'s Own Country, Kerala is a tropical paradise in South India, famous for its serene backwaters, mist-covered hill stations, emerald tea plantations, and rich cultural heritage.',
            'how_to_reach' => 'Well-connected by 4 international airports (Kochi, Thiruvananthapuram, Kozhikode, Kannur) and an extensive railway network linking major Indian cities.',
            'best_time_to_visit' => 'September to March (Winter) is pleasant; June to August (Monsoon) is famous for Ayurveda wellness and lush green landscapes.',
            'banner_image' => '/images/kerala_banner.png',
            'gallery' => ['/images/kerala_banner.png', '/images/kerala_backwaters.png'],
            'top_attractions' => [],
            'show_packages' => true,
            'show_hotels' => true,
            'country' => 'India',
            'state' => 'Kerala',
            'meta_title' => 'Kerala Travel Guide: Backwaters & Hill Stations | Dyna Tours',
            'meta_description' => 'Plan your trip to God\'s Own Country. Explore backwaters, beaches, Ayurveda, and top attractions.',
            'url_slug' => 'kerala',
            'canonical_url' => 'http://localhost:3000/destinations/kerala',
            'related_tours' => ['kerala-backwater-tour', 'hills-of-munnar-tour'],
        ]);

        Destination::create([
            'id' => 'tamil-nadu',
            'name' => 'Tamil Nadu',
            'type' => 'domestic',
            'overview' => 'A land of historical temples, beautiful hill stations (Ooty, Kodaikanal), and rich classical music and dance traditions.',
            'banner_image' => '/images/tamil_nadu.png',
        ]);

        Destination::create([
            'id' => 'karnataka',
            'name' => 'Karnataka',
            'type' => 'domestic',
            'overview' => 'From the tech hub of Bengaluru to the historical heritage of Hampi and the wildlife of Kabini, Karnataka offers a diverse travel experience.',
            'banner_image' => '/images/karnataka.png',
        ]);

        Destination::create([
            'id' => 'goa',
            'name' => 'Goa',
            'type' => 'domestic',
            'overview' => 'India\'s pocket-sized paradise, famous for its golden sand beaches, colonial Portuguese architecture, and vibrant nightlife.',
            'banner_image' => '/images/goa.png',
        ]);

        Destination::create([
            'id' => 'delhi',
            'name' => 'Delhi',
            'type' => 'domestic',
            'overview' => 'The capital city of India, combining ancient Mughal architecture with the modern bustle of New Delhi.',
            'banner_image' => '/images/delhi.png',
        ]);

        Destination::create([
            'id' => 'other-domestic',
            'name' => 'Other Domestic Destinations',
            'type' => 'domestic',
            'overview' => 'Explore the hidden gems across the vast landscapes of India, from Kashmir to Rajasthan and the North-East.',
            'banner_image' => '/images/other_domestic.png',
        ]);

        // 2. Seed Kerala Sub-Destinations
        $munnar = Destination::create([
            'id' => 'munnar',
            'name' => 'Munnar',
            'type' => 'domestic',
            'parent_id' => 'kerala',
            'overview' => 'Munnar is one of the most iconic hill stations in India, located in the Idukki district of Kerala. Nestled at an altitude of around 1,600 meters above sea level, Munnar is known for its endless stretches of tea plantations, mist-covered valleys, rolling hills, and cool mountain climate. Once a favored summer retreat of the British colonial administration, Munnar has grown into a world-renowned tourist destination that attracts honeymoon couples, nature lovers, photographers, and adventure seekers from across the globe. The region is defined by its unique geography, where three mountain streams—Mudhirapuzha, Nallathanni, and Kundala—merge to form the beautiful landscape that Munnar is famous for.',
            'how_to_reach' => "Nearest Airport : Cochin International Airport ; 110 Kms away.\nNearest Railway Station : Aluva Railway Station ; 110 Kms away and Ernakulam South or North Railway station ; 125 Kms away.",
            'best_time_to_visit' => "Winter (September – February):\nBest season for tourism. Ideal weather for sightseeing, honeymoon trips, and outdoor activities.\n\nSummer (March – May):\nPleasant climate compared to cities. Suitable for nature escapes and relaxed travel.\n\nMonsoon (June – August):\nMunnar turns into a lush green paradise with waterfalls and misty landscapes. Best for nature lovers and photography.\n\nRecommended Travel Period: September to February",
            'banner_image' => '/images/munnar_banner.png',
            'gallery' => ['/images/munnar_banner.png', '/images/munnar_attraction1.png', '/images/munnar_attraction2.png'],
            'top_attractions' => [
                [
                    'name' => 'Eravikulam National Park',
                    'fee' => 'INR 125 (Indian adults), INR 420 (foreign tourists) approximately',
                    'timings' => '07:30 AM – 04:00 PM',
                    'highlights' => 'Nilgiri Tahr spotting, Anamudi Peak views, trekking routes, rolling grasslands',
                    'note' => 'Note: Entry is controlled and tickets are issued in time slots during peak season',
                ],
                [
                    'name' => 'Mattupetty Dam',
                    'fee' => 'Free (boating charges extra)',
                    'timings' => '09:30 AM – 05:00 PM',
                    'highlights' => 'Speed boating, reservoir views, tea garden surroundings',
                    'note' => 'Activities: Boating, sightseeing, photography',
                ],
                [
                    'name' => 'Echo Point',
                    'fee' => 'Free / nominal parking fee',
                    'timings' => '06:00 AM – 07:30 PM',
                    'highlights' => 'Echo effect, lake views, misty hills',
                    'note' => 'Best Time: Morning and late afternoon',
                ],
                [
                    'name' => 'Top Station',
                    'fee' => 'Free (forest entry or parking charges may apply)',
                    'timings' => '06:00 AM – 06:00 PM',
                    'highlights' => 'Sunrise views, cloud-covered valleys, Tamil Nadu border view point',
                    'note' => 'Best For: Photography and sightseeing',
                ]
            ],
            'show_packages' => true,
            'show_hotels' => true,
            'country' => 'India',
            'state' => 'Kerala',
            'city' => 'Munnar',
            'meta_title' => 'Munnar Tourism: Stays, Packages & Attractions | Dyna Tours',
            'meta_description' => 'Explore tea plantations, waterfalls, national parks, and local guides in Munnar. Book custom holiday packages.',
            'url_slug' => 'munnar',
            'canonical_url' => 'http://localhost:3000/destinations/munnar',
        ]);

        // Seed other Kerala popular places
        foreach (['Kochi', 'Alleppey', 'Wayanad', 'Thekkady', 'Kovalam'] as $kPlace) {
            Destination::create([
                'id' => strtolower($kPlace),
                'name' => $kPlace,
                'type' => 'domestic',
                'parent_id' => 'kerala',
                'overview' => "$kPlace is a popular destination in Kerala, attracting visitors from all over the world with its scenic beauty, local experiences, and unique character.",
                'banner_image' => "/images/" . strtolower($kPlace) . ".png",
                'show_packages' => true,
                'show_hotels' => true,
            ]);
        }

        // 3. Seed International States / Main Countries
        $thailand = Destination::create([
            'id' => 'thailand',
            'name' => 'Thailand',
            'type' => 'international',
            'parent_id' => null,
            'overview' => 'Thailand, famously known as "The Land of Smiles", is one of the most popular travel destinations in Southeast Asia. Known for its golden temples, tropical beaches, vibrant nightlife, rich culture, and world-class hospitality, Thailand offers an unforgettable travel experience for every type of traveler. From bustling Bangkok city life to the serene islands of Phuket, Krabi, and Koh Samui, Thailand is a perfect blend of culture, adventure, relaxation, and luxury.',
            'how_to_reach' => "Nearest Airport:\nThailand is well connected with multiple international airports. The main entry points include:\n● Suvarnabhumi International Airport (Bangkok – BKK)\n● Don Mueang International Airport (Bangkok – DMK)\n● Phuket International Airport (HKT)\n● Chiang Mai International Airport (CNX)\nThese airports offer direct and connecting flights from major cities across India, the Middle East, Europe, and Asia.",
            'best_time_to_visit' => "November to February (Best Season):\nCool and dry weather, perfect for sightseeing, beach activities, and outdoor tours.\n\nMarch to May:\nHot season, suitable for island trips and water activities.\n\nJune to October:\nMonsoon season with lush greenery and fewer crowds, ideal for budget travelers.",
            'banner_image' => '/images/thailand_banner.png',
            'gallery' => ['/images/thailand_banner.png', '/images/thailand_beach.png', '/images/thailand_temple.png'],
            'top_attractions' => [],
            'show_packages' => true,
            'show_hotels' => true,
        ]);

        Destination::create([
            'id' => 'singapore',
            'name' => 'Singapore',
            'type' => 'international',
            'overview' => 'A global financial hub known for its cleanliness, futuristic gardens (Gardens by the Bay), theme parks, and multicultural heritage.',
            'banner_image' => '/images/singapore.png',
        ]);

        Destination::create([
            'id' => 'malaysia',
            'name' => 'Malaysia',
            'type' => 'international',
            'overview' => 'A land of diverse attractions, from the bustling skyscrapers of Kuala Lumpur to the historic streets of Penang and the rainforests of Borneo.',
            'banner_image' => '/images/malaysia.png',
        ]);

        Destination::create([
            'id' => 'uae',
            'name' => 'UAE',
            'type' => 'international',
            'overview' => 'Home to Dubai and Abu Dhabi, the UAE offers architectural wonders, luxury shopping malls, desert safaris, and pristine beaches.',
            'banner_image' => '/images/uae.png',
        ]);

        Destination::create([
            'id' => 'europe',
            'name' => 'Europe',
            'type' => 'international',
            'overview' => 'Explore the historical monuments of Paris, the romantic canals of Venice, and the scenic mountain ranges of Switzerland.',
            'banner_image' => '/images/europe.png',
        ]);

        Destination::create([
            'id' => 'other-international',
            'name' => 'Other International Destinations',
            'type' => 'international',
            'overview' => 'Discover incredible destinations across Asia, America, Africa, and Australia with our curated international tours.',
            'banner_image' => '/images/other_international.png',
        ]);

        // 4. Seed Thailand Sub-Destinations (which are rendered as clickable popular destinations in Thailand)
        foreach (['Bangkok', 'Phuket', 'Krabi', 'Pattaya', 'Chiang Mai'] as $tPlace) {
            Destination::create([
                'id' => strtolower(str_replace(' ', '-', $tPlace)),
                'name' => $tPlace,
                'type' => 'international',
                'parent_id' => 'thailand',
                'overview' => "$tPlace is one of Thailand's top travel destinations, famous for its local landmarks, culture, and unique tourist activities.",
                'banner_image' => "/images/" . strtolower(str_replace(' ', '-', $tPlace)) . ".png",
                'show_packages' => true,
                'show_hotels' => true,
            ]);
        }

        // 5. Seed Hotels
        $blanketHotel = Hotel::create([
            'id' => 'blanket-hotel-spa-munnar',
            'name' => 'Blanket Hotel & Spa',
            'destination_id' => 'munnar',
            'short_description' => 'Blanket Hotel and Spa is a luxury 5-star resort set amidst the misty hills of Munnar. Located in Pallivasal near the scenic Attukad Waterfalls, the resort offers a serene escape surrounded by lush tea plantations and breathtaking valley views. Designed for travelers seeking comfort, elegance, and nature in harmony, Blanket Munnar delivers a refined stay experience in one of Kerala’s most picturesque destinations.',
            'about' => 'Blanket Hotel and Spa is a luxury 5-star resort located in Pallivasal, Munnar, surrounded by misty hills, tea plantations, and scenic waterfalls. The resort offers a peaceful and elegant stay experience designed for relaxation and comfort. Blending modern luxury with natural beauty, the property provides well-appointed rooms, panoramic valley views, and premium hospitality services. It is a preferred choice for honeymoon couples, families, and travelers looking for a calm getaway in nature. Blanket Munnar is known for its serene atmosphere, quality service, and breathtaking surroundings, making it one of the most sought-after luxury resorts in Munnar.',
            'location' => 'Pallivasal, Munnar, Kerala',
            'distance_from_attractions' => 'Near Attukad Waterfalls, 8 Kms from Munnar Town',
            'category' => '5-Star',
            'gallery' => [
                '/images/blanket_hotel_mist.jpg',
                '/images/blanket_hotel_waterfall.jpg',
                '/images/blanket_hotel_room1.jpg',
                '/images/blanket_hotel_room2.jpg',
                '/images/blanket_hotel_pool.jpg'
            ],
            'featured' => true,
            'show_rooms' => true,
            'show_offer_label' => true,
            'show_price' => true,
            'price' => 180.00,
            'offer_label' => 'Special 15% Off',
            'order_no' => 1,
            'status' => 'Active',
            'country' => 'India',
            'state' => 'Kerala',
            'city' => 'Munnar',
            'inclusions' => '<ul><li>Daily Buffet Breakfast at the multi-cuisine restaurant</li><li>Complimentary high-speed Wi-Fi access</li><li>Free entry to the fitness center and indoor games room</li><li>Access to the infinity swimming pool overlooking the valley</li><li>Complimentary guided soft trekking and tea garden walks</li><li>Welcome drink and fruit basket on arrival</li></ul>',
            'exclusions' => '<ul><li>Airfare, train fare, or airport transfers (available on request)</li><li>Personal expenses such as laundry, telephone calls, and minibar usage</li><li>Spa therapies and beauty treatments</li><li>Lunch and Dinner options not included in the standard plan</li><li>Local sightseeing vehicle charges</li></ul>',
            'terms_conditions' => '<ul><li>Standard Check-in time is 2:00 PM and Check-out is 11:00 AM.</li><li>Cancellations received 7 days prior to check-in will receive a full refund.</li><li>A valid Government-issued photo ID is required for all guests at check-in.</li><li>Extra bed charges apply for third guest above 12 years of age.</li><li>Pets are strictly not allowed on the resort premises.</li></ul>',
            'meta_title' => 'Book Blanket Hotel & Spa Munnar | Luxury 5-Star Resort',
            'meta_description' => 'Stay in luxury at Blanket Hotel & Spa, Munnar. Panoramic valley views, infinity pool, spa, and cozy rooms. Book now!',
            'url_slug' => 'blanket-hotel-spa-munnar',
            'canonical_url' => 'http://localhost:3000/hotels/blanket-hotel-spa-munnar',
            'related_hotels' => [],
        ]);

        // Associate Blanket Hotel with all seeded facilities
        $blanketHotel->facilities()->attach(
            array_map(fn($f) => $f->id, array_values($dbFacilities))
        );

        // 6. Seed Room Categories for Blanket Hotel & Spa
        Room::create([
            'hotel_id' => $blanketHotel->id,
            'type' => 'Blanket Camelia',
            'size' => '320 sq.ft',
            'view' => 'Garden View',
            'bed_type' => 'Queen Bed',
            'breakfast' => 'Included',
            'occupancy' => '2 Adults',
            'image' => '/images/blanket_camelia.jpg',
            'description' => 'Charming and cozy rooms featuring lovely views of the manicured gardens and surrounding greenery.',
            'images' => ['/images/blanket_camelia.jpg', '/images/blanket_hotel_room1.jpg'],
            'amenities' => ['Wifi', 'AC', 'TV', 'Tea Maker', 'Safe'],
            'price' => 150.00,
            'remaining_rooms' => 5,
        ]);

        Room::create([
            'hotel_id' => $blanketHotel->id,
            'type' => 'Blanket Premier',
            'size' => '360 sq.ft',
            'view' => 'Valley View',
            'bed_type' => 'King Bed',
            'breakfast' => 'Included',
            'occupancy' => '2 Adults',
            'image' => '/images/blanket_hotel_room2.jpg',
            'description' => 'Elegant rooms equipped with a private balcony offering stunning panoramic views of the misty Munnar valley.',
            'images' => ['/images/blanket_hotel_room2.jpg', '/images/blanket_hotel_room1.jpg'],
            'amenities' => ['Wifi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Safe'],
            'price' => 180.00,
            'remaining_rooms' => 2,
        ]);

        Room::create([
            'hotel_id' => $blanketHotel->id,
            'type' => 'Blanket Valley Club',
            'size' => '400 sq.ft',
            'view' => 'Panoramic Valley View',
            'bed_type' => 'King Bed',
            'breakfast' => 'Included',
            'occupancy' => '2 Adults + 1 Child',
            'image' => '/images/blanket_hotel_room1.jpg',
            'description' => 'Exclusive and spacious club category rooms offering premier comfort, custom amenities, and elevated valley views.',
            'images' => ['/images/blanket_hotel_room1.jpg', '/images/blanket_hotel_room2.jpg'],
            'amenities' => ['Wifi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Safe'],
            'price' => 220.00,
            'remaining_rooms' => 1,
        ]);

        Room::create([
            'hotel_id' => $blanketHotel->id,
            'type' => 'Blanket Honeymoon Pavilion',
            'size' => '420 sq.ft',
            'view' => 'Waterfall View',
            'bed_type' => 'King Bed',
            'breakfast' => 'Included',
            'occupancy' => '2 Adults',
            'image' => '/images/blanket_hotel_room2.jpg',
            'description' => 'Romantic pavilion designed specifically for couples, featuring an intimate seating area and direct views of Attukad Waterfalls.',
            'images' => ['/images/blanket_hotel_room2.jpg', '/images/blanket_hotel_room1.jpg'],
            'amenities' => ['Wifi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Special Decor', 'Safe'],
            'price' => 250.00,
            'remaining_rooms' => 4,
        ]);

        Room::create([
            'hotel_id' => $blanketHotel->id,
            'type' => 'Blanket Presidential Suite',
            'size' => '650 sq.ft',
            'view' => '360 Valley View',
            'bed_type' => 'King Bed & Twin Beds',
            'breakfast' => 'Included',
            'occupancy' => '4 Adults',
            'image' => '/images/blanket_hotel_pool.jpg',
            'description' => 'The ultimate luxury retreat featuring two massive bedrooms, a separate living and dining space, and 360-degree views of the tea hills.',
            'images' => ['/images/blanket_hotel_pool.jpg', '/images/blanket_hotel_room1.jpg', '/images/blanket_hotel_room2.jpg'],
            'amenities' => ['Wifi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Dining Area', 'Kitchenette', 'Safe'],
            'price' => 400.00,
            'remaining_rooms' => 1,
        ]);

        // 3. Seed Cruise Packages
        Cruise::create([
            'id' => 'maldives-colombo',
            'name' => 'MALDIVES - COLOMBO',
            'destination' => 'Kochi, Maldives, Colombo',
            'duration' => '5 Nights / 6 Days',
            'price' => 45000,
            'show_price' => true,
            'short_description' => 'Experience a breathtaking ocean voyage from Kochi to the white sand lagoons of Maldives and the vibrant city of Colombo.',
            'about' => 'Set sail on a luxurious cruise across the Indian Ocean. Enjoy world-class dining, poolside relaxation, Broadway-style entertainment, and curated island shore excursions.',
            'banner_image' => 'https://images.unsplash.com/photo-1548574505-5e2386903d8f?auto=format&fit=crop&w=1200&q=80',
            'gallery' => [
                'https://images.unsplash.com/photo-1548574505-5e2386903d8f?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
            ],
            'highlights' => [
                'All-inclusive gourmet dining across specialty onboard restaurants',
                'Guided island excursions in Male & Colombo',
                'Onboard casino, theater shows & infinity pool lounge',
                '24x7 oceanfront stateroom butler service'
            ],
            'itinerary' => [
                ['day' => 1, 'title' => 'Embarkation at Kochi Port', 'description' => 'Board the cruise ship in Kochi. Welcome cocktail dinner and sail away party.'],
                ['day' => 2, 'title' => 'Cruising the Arabian Sea', 'description' => 'Full day at sea. Enjoy spa treatments, deck games, and live theatrical performances.'],
                ['day' => 3, 'title' => 'Maldives Island Paradise', 'description' => 'Arrive in Male, Maldives. Snorkeling, beach bungalow lunch, and sunset catamaran cruise.'],
                ['day' => 4, 'title' => 'Colombo City Tour & Shopping', 'description' => 'Dock in Colombo. Guided city tour, Pettah market, and tea tasting experience.'],
                ['day' => 5, 'title' => 'Gala Dinner at Sea', 'description' => 'Captain\'s Farewell Gala dinner with live music and fireworks.'],
                ['day' => 6, 'title' => 'Disembarkation at Kochi', 'description' => 'Return to Kochi port. Breakfast onboard and disembarkation with fond memories.']
            ],
            'inclusions' => ['Luxury Stateroom Stay', 'All Daily Meals & Soft Drinks', 'Port Taxes & Gratuities', 'Access to Onboard Shows & Pools'],
            'exclusions' => ['Personal Expenses & Casino', 'Alcoholic Packages (Unless Upgraded)', 'Flight/Train to Kochi Port'],
            'need_to_know' => ['Valid passport with at least 6 months validity required.', 'Sri Lanka & Maldives entry permits handled at port.'],
            'faqs' => [
                ['question' => 'Is Wi-Fi available onboard?', 'answer' => 'Yes, satellite Wi-Fi packages are available for purchase onboard.'],
                ['question' => 'What clothing should I pack?', 'answer' => 'Smart casuals for day time, swimwear for pool deck, and elegant attire for Captain\'s Gala Night.']
            ],
            'reviews' => [],
            'featured' => true,
            'order_no' => 1,
            'status' => 'Active',
            'meta_title' => 'Maldives - Colombo Cruise Package | Dyna Tours',
            'meta_description' => 'Book 5 Nights 6 Days luxury cruise from Kochi to Maldives and Colombo with Dyna Tours India.',
            'url_slug' => 'maldives-colombo',
            'canonical_url' => 'http://localhost:3000/cruise/maldives-colombo'
        ]);

        Cruise::create([
            'id' => 'singapore-far-east',
            'name' => 'SINGAPORE & FAR EAST OCEAN SAIL',
            'destination' => 'Singapore, Penang, Phuket',
            'duration' => '6 Nights / 7 Days',
            'price' => 65000,
            'show_price' => true,
            'short_description' => 'Sail aboard Genting Dream / Spectrum of the Seas covering Singapore, Malaysia, and Thailand.',
            'about' => 'Experience Asia\'s finest cruise liner with water slides, zip-lining, international buffets, and tropical port stops.',
            'banner_image' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
            'gallery' => [
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
            ],
            'highlights' => [
                'Waterpark & zip line on top deck',
                'Shore excursions in Penang & Phuket beaches',
                'Duty-free shopping onboard'
            ],
            'itinerary' => [
                ['day' => 1, 'title' => 'Depart Singapore Marina Bay', 'description' => 'Check-in at Singapore cruise terminal and sail towards Penang.'],
                ['day' => 2, 'title' => 'Penang Heritage Stop', 'description' => 'Explore George Town street art and local delicacies.'],
                ['day' => 3, 'title' => 'Phuket Tropical Island', 'description' => 'Enjoy Patong beach and island hopping.'],
                ['day' => 4, 'title' => 'Fun Day at Sea', 'description' => 'Enjoy onboard entertainment and water slides.'],
                ['day' => 5, 'title' => 'Return to Singapore Port', 'description' => 'Disembarkation at Singapore terminal.']
            ],
            'inclusions' => ['Oceanview Cabin', 'All Meals Onboard', 'Port Taxes'],
            'exclusions' => ['Airfare to Singapore', 'Singapore Tourist Visa'],
            'need_to_know' => ['Passport valid for 6 months required.'],
            'faqs' => [],
            'reviews' => [],
            'featured' => true,
            'order_no' => 2,
            'status' => 'Active',
            'meta_title' => 'Singapore & Far East Cruise Package | Dyna Tours',
            'meta_description' => 'Sail across Singapore, Penang & Phuket with Dyna Tours.',
            'url_slug' => 'singapore-far-east',
            'canonical_url' => 'http://localhost:3000/cruise/singapore-far-east'
        ]);

        Cruise::create([
            'id' => 'mediterranean-magic',
            'name' => 'MEDITERRANEAN MAGIC CRUISE',
            'destination' => 'Barcelona, Rome, Athens, Santorini',
            'duration' => '8 Nights / 9 Days',
            'price' => 125000,
            'show_price' => true,
            'short_description' => 'Discover ancient history, cliffside Greek villages, and romantic European ports on Costa / MSC Cruises.',
            'about' => 'Sailing through Spain, Italy, and Greece with luxury amenities, fine wine, and architectural wonders.',
            'banner_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
            'gallery' => [
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
            ],
            'highlights' => [
                'Santorini white-and-blue cliffside views',
                'Rome Colosseum & Vatican tour options',
                'Authentic Mediterranean cuisine'
            ],
            'itinerary' => [
                ['day' => 1, 'title' => 'Barcelona Sail-away', 'description' => 'Board ship in Barcelona.'],
                ['day' => 2, 'title' => 'Rome Port (Civitavecchia)', 'description' => 'Excursion to Vatican & Colosseum.'],
                ['day' => 3, 'title' => 'Santorini Island', 'description' => 'Sunset in Oia village.'],
                ['day' => 4, 'title' => 'Athens Heritage', 'description' => 'Visit Acropolis & Parthenon.']
            ],
            'inclusions' => ['Balcony Cabin Stay', 'All Gourmet Dining', 'Port Charges'],
            'exclusions' => ['Schengen Visa', 'Flight to Barcelona'],
            'need_to_know' => ['Schengen Visa required before departure.'],
            'faqs' => [],
            'reviews' => [],
            'featured' => true,
            'order_no' => 3,
            'status' => 'Active',
            'meta_title' => 'Mediterranean Cruise Package | Dyna Tours',
            'meta_description' => 'Explore Barcelona, Rome & Santorini on a Mediterranean Cruise.',
            'url_slug' => 'mediterranean-magic',
            'canonical_url' => 'http://localhost:3000/cruise/mediterranean-magic'
        ]);
    }
}
