<?php

namespace Database\Seeders;

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
    }
}
