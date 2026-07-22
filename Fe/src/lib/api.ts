// Next.js API Client to communicate with the Laravel Backend
import { eVisaDestinations as mockVisas, VisaCountry } from '@/data/visaData';
export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      if (hostname.endsWith('logiclabz.in')) {
        return 'https://backdyna.logiclabz.in/api';
      }
      return `${window.location.origin}/api`;
    }
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://backdyna.logiclabz.in/api';
  }
  return 'http://127.0.0.1:8000/api';
};

export const BASE_URL = getBaseUrl();

export interface GalleryImage {
  url: string;
  section: 'banner' | 'gallery' | 'featured' | 'other';
}

export interface Destination {
  id: string;
  name: string;
  type: 'domestic' | 'international';
  parent_id: string | null;
  overview: string;
  how_to_reach: string | null;
  best_time_to_visit: string | null;
  banner_image: string | null;
  gallery: (string | GalleryImage)[] | null;
  top_attractions: Array<{
    name: string;
    fee: string;
    timings: string;
    highlights: string;
    note?: string;
  }> | null;
  show_packages: boolean;
  show_hotels: boolean;
  sub_destinations?: Destination[];
  hotels?: Hotel[];

  // SEO fields
  meta_title?: string | null;
  meta_description?: string | null;
  url_slug?: string | null;
  canonical_url?: string | null;

  // Location fields
  country?: string | null;
  state?: string | null;
  city?: string | null;

  order_no?: number | null;

  // Related items mapping
  related_tours?: string[] | null;
}

export interface Room {
  id?: number;
  hotel_id?: string;
  type: string;
  size?: string | null;
  view?: string | null;
  bed_type?: string | null;
  breakfast?: string | null;
  occupancy?: string | null;
  image?: string | null;
  
  // Category enhancements
  description?: string | null;
  images?: string[] | null;
  amenities?: string[] | null;
  price?: number | null;
  remaining_rooms?: number | null;
  video_url?: string | null;
}

export interface Facility {
  id: number;
  name: string;
  icon: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Hotel {
  id: string;
  name: string;
  destination_id: string;
  short_description: string;
  about: string;
  location: string;
  distance_from_attractions: string | null;
  category: string;
  gallery: (string | GalleryImage)[] | null;
  facilities: Facility[] | null;
  featured: boolean;
  show_rooms: boolean;
  show_offer_label: boolean;
  show_price: boolean;
  price: number | null;
  offer_label: string | null;
  rooms?: Room[];
  destination?: Destination;

  // Hotel admin fields
  order_no?: number | null;
  status?: string;

  // SEO fields
  meta_title?: string | null;
  meta_description?: string | null;
  url_slug?: string | null;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;

  // Location fields
  country?: string | null;
  state?: string | null;
  city?: string | null;

  // Terms info
  inclusions?: string | null;
  exclusions?: string | null;
  terms_conditions?: string | null;

  // Related items mapping
  related_hotels?: string[] | null;
  video_url?: string | null;
}

export interface Enquiry {
  id?: number;
  type: 'destination' | 'hotel' | 'package' | 'flight' | string;
  target_id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  created_at?: string;
  // Destination/Package fields
  num_people?: number;
  travel_date?: string;
  // Hotel fields
  check_in?: string;
  check_out?: string;
  num_adults?: number;
  num_children?: number;
  children_ages?: string;
  // Flight fields
  from?: string;
  to?: string;
  trip_type?: string;
  cabin_class?: string;
  departure_date?: string;
  return_date?: string;
  num_infants?: number;
  preferred_airline?: string;
}

// Token helper methods
const TOKEN_KEY = 'dyna_admin_token';

const authHelper = {
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },
  clearToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  }
};

// Helper for fetch wrapper
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  // Attach token if present
  const token = authHelper.getToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      ...options,
      headers
    });

    if (res.status === 401) {
      // Clear token and redirect if on client side
      authHelper.clearToken();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API error ${res.status}: ${errText}`);
    }

    return await res.json() as T;
  } catch (error: any) {
    // Suppress console.error for 404s so Next.js doesn't show an overlay for handled fallbacks
    if (error && !error.message?.includes('API error 404')) {
      console.error(`Fetch failed for endpoint: ${endpoint}`, error);
    }
    throw error;
  }
}

export const api = {
  // Authentication operations
  login: async (email: string, password: string): Promise<{ token: string; user: { name: string; email: string } }> => {
    const res = await apiFetch<{ token: string; user: { name: string; email: string } }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.token) {
      authHelper.setToken(res.token);
    }
    return res;
  },

  logout: async (): Promise<void> => {
    try {
      await apiFetch('/logout', {
        method: 'POST',
      });
    } catch (err) {
      console.error('Logout API failed', err);
    } finally {
      authHelper.clearToken();
    }
  },

  isAuthenticated: (): boolean => {
    return authHelper.getToken() !== null;
  },

  getToken: (): string | null => {
    return authHelper.getToken();
  },

  // Destination operations
  getDestinations: async (): Promise<Destination[]> => {
    try {
      return await apiFetch<Destination[]>('/destinations');
    } catch {
      return mockDestinations;
    }
  },

  getDestination: async (id: string): Promise<Destination> => {
    try {
      return await apiFetch<Destination>(`/destinations/${id}`);
    } catch {
      const found = mockDestinations.find(d => d.id === id);
      if (!found) throw new Error('Destination not found');
      return {
        ...found,
        sub_destinations: mockDestinations.filter(d => d.parent_id === id),
        hotels: mockHotels.filter(h => h.destination_id === id).sort((a, b) => {
          const orderA = a.order_no ?? Infinity;
          const orderB = b.order_no ?? Infinity;
          return orderA - orderB;
        }),
      };
    }
  },

  updateDestination: async (id: string, data: Partial<Destination>): Promise<{ message: string; destination: Destination }> => {
    return await apiFetch<{ message: string; destination: Destination }>(`/destinations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  createDestination: async (data: Partial<Destination>): Promise<{ message: string; destination: Destination }> => {
    return await apiFetch<{ message: string; destination: Destination }>('/destinations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteDestination: async (id: string): Promise<{ message: string }> => {
    return await apiFetch<{ message: string }>(`/destinations/${id}`, {
      method: 'DELETE',
    });
  },

  // Hotel operations
  getHotels: async (params?: { destination_id?: string; category?: string; name?: string; featured?: boolean }): Promise<Hotel[]> => {
    try {
      let query = '';
      if (params) {
        const urlParams = new URLSearchParams();
        if (params.destination_id) urlParams.append('destination_id', params.destination_id);
        if (params.category) urlParams.append('category', params.category);
        if (params.name) urlParams.append('name', params.name);
        if (params.featured !== undefined) urlParams.append('featured', String(params.featured));
        query = `?${urlParams.toString()}`;
      }
      return await apiFetch<Hotel[]>(`/hotels${query}`);
    } catch {
      let filtered = [...mockHotels];
      if (params) {
        if (params.destination_id) filtered = filtered.filter(h => h.destination_id === params.destination_id);
        if (params.category) filtered = filtered.filter(h => h.category === params.category);
        if (params.name) filtered = filtered.filter(h => h.name.toLowerCase().includes(params.name!.toLowerCase()));
        if (params.featured !== undefined) filtered = filtered.filter(h => h.featured === params.featured);
      }
      filtered.sort((a, b) => {
        const orderA = a.order_no ?? Infinity;
        const orderB = b.order_no ?? Infinity;
        return orderA - orderB;
      });
      return filtered;
    }
  },

  getHotel: async (id: string): Promise<Hotel> => {
    try {
      return await apiFetch<Hotel>(`/hotels/${id}`);
    } catch {
      const found = mockHotels.find(h => h.id === id);
      if (!found) throw new Error('Hotel not found');
      return found;
    }
  },

  updateHotel: async (id: string, data: Partial<Hotel>): Promise<{ message: string; hotel: Hotel }> => {
    return await apiFetch<{ message: string; hotel: Hotel }>(`/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  createHotel: async (data: Partial<Hotel>): Promise<{ message: string; hotel: Hotel }> => {
    return await apiFetch<{ message: string; hotel: Hotel }>('/hotels', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteHotel: async (id: string): Promise<{ message: string }> => {
    return await apiFetch<{ message: string }>(`/hotels/${id}`, {
      method: 'DELETE',
    });
  },

  getFacilities: async (): Promise<Facility[]> => {
    try {
      return await apiFetch<Facility[]>('/facilities');
    } catch {
      return mockFacilities;
    }
  },

  createFacility: async (data: Partial<Facility>): Promise<{ message: string; facility: Facility }> => {
    return await apiFetch<{ message: string; facility: Facility }>('/facilities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateFacility: async (id: number, data: Partial<Facility>): Promise<{ message: string; facility: Facility }> => {
    return await apiFetch<{ message: string; facility: Facility }>(`/facilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteFacility: async (id: number): Promise<{ message: string }> => {
    return await apiFetch<{ message: string }>(`/facilities/${id}`, {
      method: 'DELETE',
    });
  },

  // Enquiry operations
  submitEnquiry: async (data: Enquiry): Promise<{ message: string; enquiry: Enquiry }> => {
    return await apiFetch<{ message: string; enquiry: Enquiry }>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getEnquiries: async (): Promise<Enquiry[]> => {
    try {
      return await apiFetch<Enquiry[]>('/enquiries');
    } catch {
      return mockEnquiries;
    }
  },

  // Visa operations
  getVisas: async (): Promise<VisaCountry[]> => {
    try {
      const data = await apiFetch<any[]>('/visas');
      return data.length > 0 ? data.map(v => ({
        ...v,
        processingTime: v.processing_time || v.processingTime,
        entryType: v.entry_type || v.entryType,
        stayPeriod: v.stay_period || v.stayPeriod,
        importantNotes: v.important_notes || v.importantNotes,
      })) : mockVisas;
    } catch {
      return mockVisas;
    }
  },

  getVisa: async (id: string): Promise<VisaCountry> => {
    try {
      const v = await apiFetch<any>(`/visas/${id}`);
      return {
        ...v,
        processingTime: v.processing_time || v.processingTime,
        entryType: v.entry_type || v.entryType,
        stayPeriod: v.stay_period || v.stayPeriod,
        importantNotes: v.important_notes || v.importantNotes,
      } as VisaCountry;
    } catch {
      const found = mockVisas.find(v => v.id === id);
      if (!found) throw new Error('Visa not found');
      return found;
    }
  },

  createVisa: async (data: Partial<VisaCountry>): Promise<{ message: string; visa: VisaCountry }> => {
    const payload = {
      ...data,
      processing_time: data.processingTime,
      entry_type: data.entryType,
      stay_period: data.stayPeriod,
      important_notes: data.importantNotes,
    };
    return await apiFetch<{ message: string; visa: VisaCountry }>('/visas', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateVisa: async (id: string, data: Partial<VisaCountry>): Promise<{ message: string; visa: VisaCountry }> => {
    const payload = {
      ...data,
      processing_time: data.processingTime,
      entry_type: data.entryType,
      stay_period: data.stayPeriod,
      important_notes: data.importantNotes,
    };
    return await apiFetch<{ message: string; visa: VisaCountry }>(`/visas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteVisa: async (id: string): Promise<{ message: string }> => {
    return await apiFetch<{ message: string }>(`/visas/${id}`, {
      method: 'DELETE',
    });
  },

  // CRM chat leads (website + Google Chat)
  getCrmChats: async (params?: {
    status?: string;
    search?: string;
    source?: CrmChatSource;
  }): Promise<CrmChatLead[]> => {
    const urlParams = new URLSearchParams();
    if (params?.status) urlParams.append('status', params.status);
    if (params?.search) urlParams.append('search', params.search);
    if (params?.source) urlParams.append('source', params.source);
    const query = urlParams.toString() ? `?${urlParams.toString()}` : '';
    return await apiFetch<CrmChatLead[]>(`/crm/chats${query}`);
  },

  getCrmChat: async (source: CrmChatSource, id: number): Promise<CrmChatLeadDetail> => {
    return await apiFetch<CrmChatLeadDetail>(`/crm/chats/${source}/${id}`);
  },

  updateCrmChat: async (
    source: CrmChatSource,
    id: number,
    data: Partial<CrmChatLead>,
  ): Promise<{ message: string; lead: CrmChatLead }> => {
    return await apiFetch<{ message: string; lead: CrmChatLead }>(`/crm/chats/${source}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCrmChat: async (source: CrmChatSource, id: number): Promise<{ message: string }> => {
    return await apiFetch<{ message: string }>(`/crm/chats/${source}/${id}`, {
      method: 'DELETE',
    });
  },
};

export type CrmChatStatus = 'new' | 'in_progress' | 'contacted' | 'qualified' | 'closed';
export type CrmChatSource = 'website' | 'google_chat';

export interface CrmChatLead {
  id: number;
  source: CrmChatSource;
  visitor_uuid: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url?: string | null;
  requirements: string | null;
  notes: string | null;
  status: CrmChatStatus;
  agent_conversation_id: string | null;
  last_message_at: string | null;
  created_at?: string;
  updated_at?: string;
  message_count?: number;
}

export interface CrmChatMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

export interface CrmChatLeadDetail extends CrmChatLead {
  messages: CrmChatMessage[];
}

export interface ChatConversationResponse {
  conversation_id: string;
  agent_response: string;
  lead?: {
    name: string | null;
    email: string | null;
    phone: string | null;
    status: string;
  };
}

async function chatFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${getBaseUrl()}${endpoint}`;
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  const res = await fetch(url, {
    cache: 'no-store',
    ...options,
    headers,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Chat API error ${res.status}: ${errText}`);
  }

  return await res.json() as T;
}

export const chatApi = {
  startConversation: async (
    visitorId: string,
    message: string,
    lead: { name: string; email: string; phone?: string },
  ): Promise<ChatConversationResponse> => {
    return chatFetch<ChatConversationResponse>('/chat/start', {
      method: 'POST',
      body: JSON.stringify({
        visitor_id: visitorId,
        message,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || null,
      }),
    });
  },

  continueConversation: async (
    visitorId: string,
    conversationId: string,
    message: string,
  ): Promise<ChatConversationResponse> => {
    return chatFetch<ChatConversationResponse>('/chat/continue', {
      method: 'POST',
      body: JSON.stringify({
        visitor_id: visitorId,
        conversation_id: conversationId,
        message,
      }),
    });
  },

  getMessages: async (
    visitorId: string,
    conversationId: string,
    after?: string,
  ): Promise<{ messages: Array<{ id: string; role: string; content: string; created_at: string }> }> => {
    const params = new URLSearchParams({
      visitor_id: visitorId,
      conversation_id: conversationId,
    });
    if (after) params.append('after', after);
    return chatFetch(`/chat/messages?${params.toString()}`);
  },

  verifyGoogleIdentity: async (
    credential: string,
  ): Promise<{ name: string; email: string; picture: string | null }> => {
    return chatFetch('/chat/google-identity', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
  },
};

// Fallback Mock Data for offline robustness
const mockDestinations: Destination[] = [
  {
    id: 'kerala',
    name: 'Kerala',
    type: 'domestic',
    parent_id: null,
    overview: 'God\'s Own Country is a tropical paradise with serene backwaters, hills, and greenery.',
    how_to_reach: 'Fly to Kochi or Thiruvananthapuram.',
    best_time_to_visit: 'September to March',
    banner_image: '/images/kerala_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'munnar',
    name: 'Munnar',
    type: 'domestic',
    parent_id: 'kerala',
    overview: 'Munnar is one of the most iconic hill stations in India, located in the Idukki district of Kerala. Nestled at an altitude of around 1,600 meters above sea level, Munnar is known for its endless stretches of tea plantations, mist-covered valleys, rolling hills, and cool mountain climate.',
    how_to_reach: 'Nearest Airport : Cochin International Airport ; 110 Kms away.',
    best_time_to_visit: 'September to February',
    banner_image: '/images/munnar_banner.png',
    gallery: [],
    top_attractions: [
      { name: 'Eravikulam National Park', fee: 'INR 125', timings: '07:30 AM – 04:00 PM', highlights: 'Nilgiri Tahr' }
    ],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'thailand',
    name: 'Thailand',
    type: 'international',
    parent_id: null,
    overview: 'Thailand, famously known as "The Land of Smiles", is one of the most popular travel destinations in Southeast Asia.',
    how_to_reach: 'Fly to Bangkok (BKK) or Phuket (HKT).',
    best_time_to_visit: 'November to February',
    banner_image: '/images/thailand_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  }
];

const mockHotels: Hotel[] = [
  {
    id: 'blanket-hotel-spa-munnar',
    name: 'Blanket Hotel & Spa',
    destination_id: 'munnar',
    short_description: 'Blanket Hotel and Spa is a luxury 5-star resort set amidst the misty hills of Munnar.',
    about: 'Blanket Hotel and Spa is a luxury 5-star resort located in Pallivasal, Munnar.',
    location: 'Pallivasal, Munnar, Kerala',
    distance_from_attractions: 'Near Attukad Waterfalls',
    category: '5-Star',
    gallery: [
      '/images/blanket_hotel_mist.jpg',
      '/images/blanket_hotel_waterfall.jpg',
      '/images/blanket_hotel_room1.jpg',
      '/images/blanket_hotel_room2.jpg',
      '/images/blanket_hotel_pool.jpg'
    ],
    facilities: [
      { id: 1, name: 'Wifi', icon: 'wifi', description: 'High-speed wireless internet connection throughout the property' },
      { id: 2, name: 'Spa', icon: 'spa', description: 'Rejuvenating wellness spa offering body massages and therapies' },
      { id: 3, name: 'Pool', icon: 'pool', description: 'Scenic outdoor infinity swimming pool' },
      { id: 4, name: 'Breakfast', icon: 'breakfast', description: 'Delicious fresh hot breakfast options served daily' }
    ],
    featured: true,
    show_rooms: true,
    show_offer_label: true,
    show_price: true,
    price: 180,
    offer_label: 'Special 15% Off',
    order_no: 1,
    rooms: [
      { id: 1, hotel_id: 'blanket-hotel-spa-munnar', type: 'Blanket Camelia', size: '320 sq.ft', view: 'Garden View', bed_type: 'Queen Bed', breakfast: 'Included', occupancy: '2 Adults', image: '/images/blanket_camelia.jpg' }
    ]
  }
];

const mockFacilities: Facility[] = [
  { id: 1, name: 'Breakfast', icon: 'breakfast', description: 'Delicious fresh hot breakfast options served daily' },
  { id: 2, name: 'Wifi', icon: 'wifi', description: 'High-speed wireless internet connection throughout the property' },
  { id: 3, name: 'Gym', icon: 'gym', description: 'Fully equipped modern fitness center' },
  { id: 4, name: 'Spa', icon: 'spa', description: 'Rejuvenating wellness spa offering body massages and therapies' },
  { id: 5, name: 'Pool', icon: 'pool', description: 'Scenic outdoor infinity swimming pool' },
  { id: 6, name: 'Restaurant', icon: 'restaurant', description: 'Fine-dining restaurant serving local and international cuisines' },
  { id: 7, name: 'Bar', icon: 'bar', description: 'Elegant lounge bar with premium drinks and cocktails' },
  { id: 8, name: 'Indoor games', icon: 'indoor games', description: 'Recreation room with board games, table tennis, and billiards' },
  { id: 9, name: 'Activity', icon: 'activity', description: 'Adventure activities, nature treks, and cycling tours' },
  { id: 10, name: 'Airport Transport', icon: 'airport transport', description: 'Complimentary airport shuttle and local transit arrangements' },
  { id: 11, name: 'sight seeing', icon: 'sight seeing', description: 'Guided local sightseeing tours and scenic viewpoint excursions' }
];

const mockEnquiries: Enquiry[] = [];
// --- Holiday Packages ---
export const getPackages = async (): Promise<any[]> => {
  if (typeof window === 'undefined') return [];
  let data;
  const stored = localStorage.getItem('dyna_packages');
  if (stored) {
    let fixedStored = stored;
    const replacements: Record<string, string> = {
      '/images/kerala.jpg': '/images/amalfi_coast.png',
      '/images/kerala_banner.png': '/images/kyoto_japan.png',
      '/images/munnar_banner.png': '/images/maldives.png',
      '/images/thailand_banner.png': '/images/swiss_alps.png'
    };
    Object.entries(replacements).forEach(([oldStr, newStr]) => {
      fixedStored = fixedStored.split(oldStr).join(newStr);
    });
    data = JSON.parse(fixedStored);
  } else {
    const { toursData } = await import('@/data/toursData');
    data = toursData;
  }
  
  // Ensure all standard quickInfo items (including Tour Assistance 24x7) are applied to all packages
  const standardQuickInfo = [
    {icon:"🍽", text:"Breakfast Included"},
    {icon:"🏨", text:"Hotel Stay"},
    {icon:"🚗", text:"Transportation"},
    {icon:"👀", text:"Sightseeing"},
    {icon:"📞", text:"Tour Assistance 24x7"}
  ];

  data = data.map((pkg: any) => {
    // Strictly assign only the standard quick info items, discarding any other custom items (like 4-Star Hotel, Swiss Travel Pass, etc.)
    pkg.quickInfo = [...standardQuickInfo];
    return pkg;
  });
  
  return data;
};

export const getPackageById = async (id: string): Promise<any | null> => {
  const packages = await getPackages();
  return packages.find(p => p.id === id) || null;
};

export const createPackage = async (data: Omit<any, 'id'>): Promise<any> => {
  const newPackage = {
    ...data,
    id: data.slug || `pkg-${Date.now()}`,
  };
  const packages = await getPackages();
  const updated = [newPackage, ...packages];
  localStorage.setItem('dyna_packages', JSON.stringify(updated));
  return newPackage;
};

export const updatePackage = async (id: string, data: Partial<any>): Promise<any> => {
  const packages = await getPackages();
  const index = packages.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Package not found');
  
  const updatedPackage = { ...packages[index], ...data };
  packages[index] = updatedPackage;
  localStorage.setItem('dyna_packages', JSON.stringify(packages));
  return updatedPackage;
};

export const deletePackage = async (id: string): Promise<void> => {
  const packages = await getPackages();
  const updated = packages.filter(p => p.id !== id);
  localStorage.setItem('dyna_packages', JSON.stringify(updated));
};

// --- Group Tours ---
export interface GroupTour {
  id?: number;
  name: string;
  destination: string;
  type: 'domestic' | 'international';
  image?: string;
  duration: string;
  departure_date?: string;
  starting_price: number;
  status: 'Filling Fast' | 'Limited Seats' | 'Available' | 'Sold Out';
  full_details?: string;
  is_visible: boolean;
  is_featured: boolean;
  featured_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface GroupTourPage {
  id?: number;
  title: string;
  tagline: string;
  banner_image: string;
  overview_heading: string;
  overview_description: string;
  overview_image: string;
}

export interface GroupTourEnquiry {
  id?: number;
  name: string;
  email: string;
  phone: string;
  num_travellers: number;
  message?: string;
  group_tour_id?: number;
  status?: 'New' | 'Contacted' | 'In Progress' | 'Converted' | 'Closed';
  created_at?: string;
  group_tour?: GroupTour;
}

export const groupToursApi = {
  // Page Settings
  getPage: async (): Promise<GroupTourPage> => {
    return await apiFetch<GroupTourPage>('/group-tours/page');
  },
  updatePage: async (data: Partial<GroupTourPage>): Promise<{ message: string; page: GroupTourPage }> => {
    return await apiFetch<{ message: string; page: GroupTourPage }>('/group-tours/page', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Tours
  getTours: async (params?: { type?: string; destination?: string; featured?: boolean; visible_only?: boolean }): Promise<GroupTour[]> => {
    const urlParams = new URLSearchParams();
    if (params?.type) urlParams.append('type', params.type);
    if (params?.destination) urlParams.append('destination', params.destination);
    if (params?.featured) urlParams.append('featured', String(params.featured));
    if (params?.visible_only) urlParams.append('visible_only', String(params.visible_only));
    const query = urlParams.toString() ? `?${urlParams.toString()}` : '';
    return await apiFetch<GroupTour[]>(`/group-tours${query}`);
  },
  getTour: async (id: number): Promise<GroupTour> => {
    return await apiFetch<GroupTour>(`/group-tours/${id}`);
  },
  createTour: async (data: Partial<GroupTour>): Promise<{ message: string; tour: GroupTour }> => {
    return await apiFetch<{ message: string; tour: GroupTour }>('/group-tours', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateTour: async (id: number, data: Partial<GroupTour>): Promise<{ message: string; tour: GroupTour }> => {
    return await apiFetch<{ message: string; tour: GroupTour }>(`/group-tours/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteTour: async (id: number): Promise<{ message: string }> => {
    return await apiFetch<{ message: string }>(`/group-tours/${id}`, {
      method: 'DELETE',
    });
  },

  // Enquiries
  submitEnquiry: async (data: Partial<GroupTourEnquiry>): Promise<{ message: string; enquiry: GroupTourEnquiry }> => {
    return await apiFetch<{ message: string; enquiry: GroupTourEnquiry }>('/group-tours/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  getEnquiries: async (params?: { status?: string }): Promise<GroupTourEnquiry[]> => {
    const urlParams = new URLSearchParams();
    if (params?.status) urlParams.append('status', params.status);
    const query = urlParams.toString() ? `?${urlParams.toString()}` : '';
    return await apiFetch<GroupTourEnquiry[]>(`/group-tours/enquiries${query}`);
  },
  updateEnquiryStatus: async (id: number, status: string): Promise<{ message: string; enquiry: GroupTourEnquiry }> => {
    return await apiFetch<{ message: string; enquiry: GroupTourEnquiry }>(`/group-tours/enquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

