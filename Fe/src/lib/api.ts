// Next.js API Client to communicate with the Laravel Backend
import { eVisaDestinations as mockVisas, schengenCountries, otherCountries, VisaCountry } from '@/data/visaData';
export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (
      hostname === 'localhost' || 
      hostname === '127.0.0.1' || 
      hostname.startsWith('192.168.') || 
      hostname.startsWith('10.') || 
      hostname.startsWith('172.') ||
      hostname.endsWith('.local')
    ) {
      return `http://${hostname}:8000/api`;
    }
    if (hostname.endsWith('logiclabz.in') || hostname.endsWith('prds.in.net')) {
      return 'https://backdyna.logiclabz.in/api';
    }
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://backdyna.logiclabz.in/api';
  }
  return 'http://127.0.0.1:8000/api';
};

export const BASE_URL = getBaseUrl();

export const formatPrice = (val: any): string => {
  if (val === null || val === undefined || val === '') return '';
  let str = String(val).trim();
  // Strip all leading currency symbols (₹, Rs, Rs., INR)
  str = str.replace(/^(₹|\s|Rs\.?|INR)+/gi, '').trim();
  const num = Number(str.replace(/,/g, ''));
  if (!isNaN(num) && num > 0) {
    return `₹${num.toLocaleString('en-IN')}`;
  }
  return str ? `₹${str}` : '';
};

export const getImageUrl = (url?: string | null): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const origin = getBaseUrl().replace(/\/api$/, '');
  if (trimmed.startsWith('/storage') || trimmed.startsWith('/uploads')) {
    return `${origin}${trimmed}`;
  }
  if (trimmed.startsWith('storage/') || trimmed.startsWith('uploads/')) {
    return `${origin}/${trimmed}`;
  }
  return trimmed;
};

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
  show_on_home?: boolean;
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
  banner_heading?: string | null;
  banner_tagline?: string | null;
  status?: string | null;

  order_no?: number | null;

  // Related items mapping
  related_tours?: string[] | null;
  related_hotels?: string[] | null;
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
  is_visible?: boolean;
  show_details?: boolean;
  banner_image?: string | null;
  banner_heading?: string | null;
  banner_tagline?: string | null;
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

export interface CruiseItineraryDay {
  day: string;
  title: string;
  description: string;
  accommodation?: string;
}

export interface CruiseFaq {
  question: string;
  answer: string;
}

export interface CruiseReview {
  name: string;
  rating: number;
  comment: string;
}

export interface Cruise {
  id: string;
  name: string;
  destination: string;
  duration: string;
  price?: number | null;
  show_price?: boolean;
  short_description: string;
  about?: string | null;
  banner_image?: string | null;
  banner_title?: string | null;
  banner_tagline?: string | null;
  gallery?: string[] | null;
  highlights?: string[] | null;
  itinerary?: CruiseItineraryDay[] | null;
  inclusions?: string[] | null;
  exclusions?: string[] | null;
  need_to_know?: string[] | null;
  faqs?: CruiseFaq[] | null;
  reviews?: CruiseReview[] | null;
  featured?: boolean;
  order_no?: number | null;
  status?: string;
  meta_title?: string | null;
  meta_description?: string | null;
  url_slug?: string | null;
  canonical_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CruisePageData {
  id?: number;
  banner_title: string;
  banner_tagline: string;
  banner_image?: string | null;
  overview_heading: string;
  overview_description?: string | null;
  overview_image?: string | null;
  overview_cta_text: string;
  cta_heading: string;
  cta_description?: string | null;
  cta_image?: string | null;
  cta_button1_text: string;
  cta_button2_text: string;
  faqs?: CruiseFaq[] | null;
  meta_title?: string | null;
  meta_description?: string | null;
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
  const url = `${getBaseUrl()}${endpoint}`;
  
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
      let errorMessage = `API error ${res.status}`;
      try {
        const json = JSON.parse(errText);
        if (json.errors && typeof json.errors === 'object' && Object.keys(json.errors).length > 0) {
          const formattedFields = Object.entries(json.errors)
            .map(([field, msgs]: [string, any]) => {
              const fieldName = field.replace(/_/g, ' ').toUpperCase();
              const msg = Array.isArray(msgs) ? msgs.join(', ') : String(msgs);
              return `[${fieldName}]: ${msg}`;
            })
            .join(' | ');
          errorMessage = `Validation Error: ${formattedFields}`;
        } else if (json.message) {
          errorMessage = `${json.message} (HTTP ${res.status})`;
        } else if (json.error) {
          errorMessage = `${json.error} (HTTP ${res.status})`;
        }
      } catch {
        if (errText) errorMessage = `${errText} (HTTP ${res.status})`;
      }
      const errObj: any = new Error(errorMessage);
      errObj.status = res.status;
      throw errObj;
    }

    return await res.json() as T;
  } catch (error: any) {
    // Suppress console.error for 404s and handled fallbacks to avoid Next.js dev server error overlays
    if (error && error.status !== 404 && !error.message?.includes('404')) {
      console.warn(`[API] Fetch failed for endpoint: ${endpoint}`, error.message || error);
    }
    throw error;
  }
}

export const api = {
  // Image Upload helper
  uploadImage: async (file: File): Promise<{ message: string; url: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const token = authHelper.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Image upload failed: ${res.statusText} (${errText})`);
    }

    return await res.json();
  },

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
  getDestinations: async (params?: { status?: string }): Promise<Destination[]> => {
    try {
      const query = params?.status ? `?status=${params.status}` : '';
      const list = await apiFetch<Destination[]>(`/destinations${query}`);
      if (params?.status === 'all') return list;
      return list
        .filter(d => !d.status || d.status.toLowerCase() !== 'inactive')
        .map(d => ({
          ...d,
          sub_destinations: d.sub_destinations
            ? d.sub_destinations.filter(sub => !sub.status || sub.status.toLowerCase() !== 'inactive')
            : d.sub_destinations,
        }));
    } catch {
      if (params?.status === 'all') return mockDestinations;
      return mockDestinations
        .filter(d => !d.status || d.status.toLowerCase() !== 'inactive')
        .map(d => ({
          ...d,
          sub_destinations: d.sub_destinations
            ? d.sub_destinations.filter(sub => !sub.status || sub.status.toLowerCase() !== 'inactive')
            : d.sub_destinations,
        }));
    }
  },

  getDestination: async (id: string): Promise<Destination> => {
    try {
      const dest = await apiFetch<Destination>(`/destinations/${id}`);
      if (dest && dest.sub_destinations) {
        dest.sub_destinations = dest.sub_destinations.filter(sub => !sub.status || sub.status.toLowerCase() !== 'inactive');
      }
      return dest;
    } catch {
      const found = mockDestinations.find(d => (d.id === id || String(d.id) === String(id)) && (!d.status || d.status.toLowerCase() !== 'inactive'));
      if (!found) throw new Error('Destination not found');
      return {
        ...found,
        sub_destinations: mockDestinations.filter(d => (d.parent_id === id || String(d.parent_id) === String(id)) && (!d.status || d.status.toLowerCase() !== 'inactive')),
        hotels: mockHotels.filter(h => h.destination_id === id || String(h.destination_id) === String(id)).sort((a, b) => {
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
      const found = mockHotels.find(h => h.id === id || String(h.id) === String(id));
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

  // Cruise operations
  getCruisePage: async (): Promise<CruisePageData> => {
    return await apiFetch<CruisePageData>('/cruise-page');
  },

  updateCruisePage: async (data: Partial<CruisePageData>): Promise<{ message: string; page: CruisePageData }> => {
    return await apiFetch<{ message: string; page: CruisePageData }>('/cruise-page', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getCruises: async (params?: { featured?: boolean; destination?: string; status?: string }): Promise<Cruise[]> => {
    let query = '';
    if (params) {
      const urlParams = new URLSearchParams();
      if (params.featured !== undefined) urlParams.append('featured', String(params.featured));
      if (params.destination) urlParams.append('destination', params.destination);
      if (params.status) urlParams.append('status', params.status);
      query = `?${urlParams.toString()}`;
    }
    return await apiFetch<Cruise[]>(`/cruises${query}`);
  },

  getCruise: async (id: string): Promise<Cruise> => {
    return await apiFetch<Cruise>(`/cruises/${id}`);
  },

  createCruise: async (data: Partial<Cruise>): Promise<{ message: string; cruise: Cruise }> => {
    return await apiFetch<{ message: string; cruise: Cruise }>('/cruises', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCruise: async (id: string, data: Partial<Cruise>): Promise<{ message: string; cruise: Cruise }> => {
    return await apiFetch<{ message: string; cruise: Cruise }>(`/cruises/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCruise: async (id: string): Promise<{ message: string }> => {
    return await apiFetch<{ message: string }>(`/cruises/${id}`, {
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
  getFallbackVisa: (id: string): VisaCountry => {
    const cleanId = (id || '').toLowerCase().trim();
    const found = mockVisas.find(v => v.id.toLowerCase() === cleanId || v.name.toLowerCase() === cleanId);
    if (found) return found;

    const schengen = schengenCountries.find(s => s.id?.toLowerCase() === cleanId || s.name?.toLowerCase() === cleanId);
    if (schengen) {
      return {
        id: schengen.id || cleanId,
        name: schengen.name || cleanId,
        flag: schengen.flag || '🇪🇺',
        type: 'stamped',
        price: schengen.price || '₹7,500',
        processingTime: '10–15 Working Days',
        validity: 'Up to 90 Days',
        biometric: 'Required',
        requirements: [
          'Original Passport with minimum 6 months validity from travel date',
          'Duly filled and signed Schengen visa application form',
          '2 Recent passport-size photographs (35mm x 45mm, white background)',
          'Covering letter outlining trip itinerary',
          'Confirmed round-trip flight tickets & hotel bookings',
          'Travel Medical Insurance with minimum €30,000 coverage',
          'Certified bank statements for the last 6 months',
          'Income Tax Returns (ITR) for the last 3 assessment years'
        ],
        importantNotes: [
          'Biometric enrolment (fingerprints & photo) at VFS application center is required for first-time applicants.',
          'Visa approval and validity period are granted solely at consular discretion.'
        ],
        terms: [
          'Visa application fees and service charges are non-refundable.',
          'Additional documents may be requested by consular officers during processing.'
        ],
        faqs: [
          { question: 'Is biometric appointment mandatory?', answer: 'Yes, biometric enrolment at VFS center is required for Schengen visa processing.' },
          { question: 'How long does processing take?', answer: 'Normal processing time is 10 to 15 working days after submission.' }
        ]
      };
    }

    const other = otherCountries.find(o => o.id?.toLowerCase() === cleanId || o.name?.toLowerCase() === cleanId);
    if (other) {
      return {
        id: other.id || cleanId,
        name: other.name || cleanId,
        flag: other.flag || '✈️',
        type: 'stamped',
        price: other.price || '₹8,500',
        processingTime: '7–12 Working Days',
        validity: 'Up to 180 Days',
        biometric: 'Required',
        requirements: [
          'Original Passport with minimum 6 months validity',
          'Visa application form duly filled and signed',
          'Recent color photographs as per specifications',
          'Confirmed flight & hotel accommodation details',
          'Bank statements for the last 6 months',
          'Employment proof / NOC / Leave approval letter'
        ],
        importantNotes: [
          'Document details must match passport records exactly.'
        ],
        terms: [
          'Visa fees are non-refundable once submitted.'
        ],
        faqs: [
          { question: 'How to apply?', answer: 'Contact Dyna Tours India for complete documentation and application assistance.' }
        ]
      };
    }

    const formattedName = cleanId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return {
      id: cleanId,
      name: formattedName || 'Tourist',
      flag: '🌍',
      type: 'e-visa',
      price: '₹3,500',
      processingTime: '3–5 Working Days',
      validity: '30 Days',
      biometric: 'Not Required',
      requirements: [
        'Valid Passport (minimum 6 months validity)',
        'Recent passport-size photograph',
        'Confirmed flight and hotel accommodation details'
      ],
      importantNotes: [
        'Visa approval and validity are subject to immigration authority discretion.'
      ],
      terms: [
        'Visa fees are strictly non-refundable.'
      ],
      faqs: [
        { question: 'How do I apply?', answer: `Contact Dyna Tours India for assistance with your ${formattedName} tourist visa.` }
      ]
    };
  },

  getVisas: async (): Promise<VisaCountry[]> => {
    try {
      const data = await apiFetch<any[]>('/visas');
      if (data && data.length > 0) {
        return data.map(v => ({
          ...v,
          processingTime: v.processing_time || v.processingTime || '3–5 Working Days',
          entryType: v.entry_type || v.entryType,
          stayPeriod: v.stay_period || v.stayPeriod,
          importantNotes: v.important_notes || v.importantNotes || [],
          requirements: v.requirements || [],
          terms: v.terms || [],
          faqs: v.faqs || []
        }));
      }
      return mockVisas;
    } catch {
      return mockVisas;
    }
  },

  getVisa: async (id: string): Promise<VisaCountry> => {
    try {
      const v = await apiFetch<any>(`/visas/${id}`);
      if (v && v.name) {
        return {
          ...v,
          processingTime: v.processing_time || v.processingTime || '3–5 Working Days',
          entryType: v.entry_type || v.entryType,
          stayPeriod: v.stay_period || v.stayPeriod,
          importantNotes: v.important_notes || v.importantNotes || ['Subject to embassy approval'],
          requirements: v.requirements || ['Passport copy', 'Photograph', 'Flight booking'],
          terms: v.terms || ['Fees are non-refundable'],
          faqs: v.faqs || []
        } as VisaCountry;
      }
      return api.getFallbackVisa(id);
    } catch {
      return api.getFallbackVisa(id);
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

  // Staff operations
  getStaff: async (): Promise<any[]> => {
    return await apiFetch<any[]>('/staff');
  },
  createStaff: async (data: any): Promise<any> => {
    return await apiFetch<any>('/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  updateStaff: async (id: number, data: any): Promise<any> => {
    return await apiFetch<any>(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteStaff: async (id: number): Promise<void> => {
    await apiFetch(`/staff/${id}`, {
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
    id: 'kochi',
    name: 'Kochi',
    type: 'domestic',
    parent_id: 'kerala',
    overview: 'A vibrant port city blending colonial charm and modern culture.',
    how_to_reach: 'Cochin International Airport (COK).',
    best_time_to_visit: 'October to March',
    banner_image: '/images/kerala_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'alleppey',
    name: 'Alleppey',
    type: 'domestic',
    parent_id: 'kerala',
    overview: 'Venice of the East, famed for houseboats and backwater cruises.',
    how_to_reach: 'Nearest Airport: Cochin International Airport (85 km).',
    best_time_to_visit: 'September to March',
    banner_image: '/images/kerala_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'wayanad',
    name: 'Wayanad',
    type: 'domestic',
    parent_id: 'kerala',
    overview: 'Picturesque hill town with spice plantations and waterfalls.',
    how_to_reach: 'Nearest Airport: Calicut International Airport (98 km).',
    best_time_to_visit: 'October to May',
    banner_image: '/images/kerala_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'thekkady',
    name: 'Thekkady',
    type: 'domestic',
    parent_id: 'kerala',
    overview: 'Home to Periyar Wildlife Sanctuary and elephant safaris.',
    how_to_reach: 'Nearest Airport: Madurai (140 km) or Cochin (145 km).',
    best_time_to_visit: 'September to May',
    banner_image: '/images/kerala_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'kovalam',
    name: 'Kovalam',
    type: 'domestic',
    parent_id: 'kerala',
    overview: 'Famous beach destination with crescent-shaped coastlines.',
    how_to_reach: 'Trivandrum International Airport (15 km).',
    best_time_to_visit: 'September to March',
    banner_image: '/images/kerala_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    type: 'domestic',
    parent_id: null,
    overview: 'Land of historic temples, hill stations, and cultural heritage.',
    how_to_reach: 'Chennai or Coimbatore International Airports.',
    best_time_to_visit: 'October to March',
    banner_image: '/images/kerala_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    type: 'domestic',
    parent_id: null,
    overview: 'Blend of tech hubs, ancient ruins, and misty Coorg hills.',
    how_to_reach: 'Bengaluru International Airport.',
    best_time_to_visit: 'October to March',
    banner_image: '/images/kerala_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'goa',
    name: 'Goa',
    type: 'domestic',
    parent_id: null,
    overview: 'India\'s beach capital with nightlife and Portuguese culture.',
    how_to_reach: 'Goa International Airport (GOI/GOX).',
    best_time_to_visit: 'November to February',
    banner_image: '/images/kerala_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'delhi',
    name: 'Delhi',
    type: 'domestic',
    parent_id: null,
    overview: 'Capital city filled with monuments, markets, and history.',
    how_to_reach: 'Indira Gandhi International Airport (DEL).',
    best_time_to_visit: 'October to March',
    banner_image: '/images/kerala_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'other-domestic',
    name: 'Other Domestic Destinations',
    type: 'domestic',
    parent_id: null,
    overview: 'Explore exotic Indian destinations.',
    how_to_reach: 'Various airports across India.',
    best_time_to_visit: 'Year-round',
    banner_image: '/images/kerala_banner.png',
    gallery: [],
    top_attractions: [],
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
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    type: 'international',
    parent_id: 'thailand',
    overview: 'Bustling metropolis with Grand Palace and night markets.',
    how_to_reach: 'Suvarnabhumi (BKK) or Don Mueang (DMK).',
    best_time_to_visit: 'November to February',
    banner_image: '/images/thailand_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'phuket',
    name: 'Phuket',
    type: 'international',
    parent_id: 'thailand',
    overview: 'Island paradise with luxury beach resorts.',
    how_to_reach: 'Phuket International Airport (HKT).',
    best_time_to_visit: 'November to April',
    banner_image: '/images/thailand_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'krabi',
    name: 'Krabi',
    type: 'international',
    parent_id: 'thailand',
    overview: 'Stunning limestone cliffs and clear emerald waters.',
    how_to_reach: 'Krabi International Airport (KBV).',
    best_time_to_visit: 'November to April',
    banner_image: '/images/thailand_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'pattaya',
    name: 'Pattaya',
    type: 'international',
    parent_id: 'thailand',
    overview: 'Coastal resort city known for water sports and entertainment.',
    how_to_reach: '2 hours drive from Bangkok.',
    best_time_to_visit: 'November to February',
    banner_image: '/images/thailand_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'chiang-mai',
    name: 'Chiang Mai',
    type: 'international',
    parent_id: 'thailand',
    overview: 'Mountainous city in northern Thailand with ancient temples.',
    how_to_reach: 'Chiang Mai International Airport (CNX).',
    best_time_to_visit: 'November to February',
    banner_image: '/images/thailand_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'singapore',
    name: 'Singapore',
    type: 'international',
    parent_id: null,
    overview: 'Global financial hub with Gardens by the Bay and Sentosa Island.',
    how_to_reach: 'Changi Airport (SIN).',
    best_time_to_visit: 'Year-round',
    banner_image: '/images/thailand_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    type: 'international',
    parent_id: null,
    overview: 'Kuala Lumpur twin towers, Genting Highlands, and Langkawi.',
    how_to_reach: 'Kuala Lumpur International Airport (KUL).',
    best_time_to_visit: 'November to March',
    banner_image: '/images/thailand_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'uae',
    name: 'UAE',
    type: 'international',
    parent_id: null,
    overview: 'Futuristic Dubai and cultural Abu Dhabi.',
    how_to_reach: 'Dubai (DXB) or Abu Dhabi (AUH) Airports.',
    best_time_to_visit: 'October to April',
    banner_image: '/images/thailand_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'europe',
    name: 'Europe',
    type: 'international',
    parent_id: null,
    overview: 'Discover Paris, Swiss Alps, Rome, and London.',
    how_to_reach: 'Major European hub airports.',
    best_time_to_visit: 'April to October',
    banner_image: '/images/thailand_banner.png',
    gallery: [],
    top_attractions: [],
    show_packages: true,
    show_hotels: true,
  },
  {
    id: 'other-international',
    name: 'Other International Destinations',
    type: 'international',
    parent_id: null,
    overview: 'Explore global destinations worldwide.',
    how_to_reach: 'International flights.',
    best_time_to_visit: 'Year-round',
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
      {
        id: 1,
        hotel_id: 'blanket-hotel-spa-munnar',
        type: 'Blanket Camelia Room',
        size: '320 sq.ft',
        view: 'Garden & Tea Garden View',
        bed_type: 'King Bed',
        breakfast: 'Complimentary Buffet Breakfast Included',
        occupancy: '2 Adults',
        description: 'Elegantly furnished luxury room with modern amenities, wooden flooring, and private balcony overlooking the tea gardens.',
        price: 180,
        image: '/images/blanket_hotel_room1.jpg'
      },
      {
        id: 2,
        hotel_id: 'blanket-hotel-spa-munnar',
        type: 'Executive Valley View Suite',
        size: '450 sq.ft',
        view: 'Panoramic Waterfall & Valley View',
        bed_type: 'King Bed',
        breakfast: 'Complimentary Buffet Breakfast Included',
        occupancy: '2 Adults + 1 Child',
        description: 'Spacious suite featuring floor-to-ceiling glass windows offering breathtaking views of Attukad Waterfalls and the valley.',
        price: 240,
        image: '/images/blanket_hotel_room2.jpg'
      },
      {
        id: 3,
        hotel_id: 'blanket-hotel-spa-munnar',
        type: 'Presidential Honeymoon Suite',
        size: '600 sq.ft',
        view: 'Misty Mountain & Sunset View',
        bed_type: 'Super King Bed',
        breakfast: 'Complimentary Breakfast & Spa Voucher',
        occupancy: '2 Adults',
        description: 'Ultra-luxury suite featuring a private Jacuzzi, living area, and romantic balcony view for an unforgettable getaway.',
        price: 320,
        image: '/images/blanket_hotel_mist.jpg'
      }
    ]
  }
];

const mockFacilities: Facility[] = [
  { id: 1, name: 'Breakfast', icon: 'breakfast', description: 'Delicious fresh hot breakfast options served daily' },
  { id: 2, name: 'Wifi', icon: 'wifi', description: 'High-speed wireless internet connection throughout the property' },
  { id: 3, name: 'Gym', icon: 'gym', description: 'Fully equipped modern fitness center' },
  { id: 4, name: 'Yoga', icon: 'yoga', description: 'Guided morning yoga, meditation, and wellness sessions' },
  { id: 5, name: 'Air conditioning', icon: 'air conditioning', description: 'Climate-controlled air conditioning in rooms and common areas' },
  { id: 6, name: 'Car parking', icon: 'car parking', description: 'Secure, private, complimentary valet and self-parking space' },
  { id: 7, name: 'Jacuzzi', icon: 'jacuzzi', description: 'Relaxing hydrotherapy jacuzzi and heated whirlpool' },
  { id: 8, name: 'Spa', icon: 'spa', description: 'Rejuvenating wellness spa offering body massages and therapies' },
  { id: 9, name: 'Pool', icon: 'pool', description: 'Scenic outdoor infinity swimming pool' },
  { id: 10, name: 'Restaurant', icon: 'restaurant', description: 'Fine-dining restaurant serving local and international cuisines' },
  { id: 11, name: 'Bar', icon: 'bar', description: 'Elegant lounge bar with premium drinks and cocktails' },
  { id: 12, name: 'Indoor games', icon: 'indoor games', description: 'Recreation room with board games, table tennis, and billiards' },
  { id: 13, name: 'Activity', icon: 'activity', description: 'Adventure activities, nature treks, and cycling tours' },
  { id: 14, name: 'Airport Transport', icon: 'airport transport', description: 'Complimentary airport shuttle and local transit arrangements' },
  { id: 15, name: 'sight seeing', icon: 'sight seeing', description: 'Guided local sightseeing tours and scenic viewpoint excursions' }
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
  related_tours?: (number | string)[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  url_slug?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  structured_data?: string;
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
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  url_slug?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  structured_data?: string;
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

// --- About Us Page ---
export interface WhyChooseCard {
  icon: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export interface TrustBadge {
  title: string;
  icon: string;
}

export interface AchievementCounter {
  number: number;
  suffix?: string;
  label: string;
  icon: string;
}

export interface CertificationLogo {
  name: string;
  code: string;
  description?: string;
  image?: string;
}

export interface AboutPage {
  id?: number;
  hero_title: string;
  hero_subtitle: string;
  hero_bg_image: string;
  overview_title: string;
  overview_description: string;
  overview_image_1: string;
  overview_image_2: string;
  years_experience: number;
  founder_name: string;
  founder_title: string;
  founder_image: string;
  founder_message: string;
  founder_quote: string;
  founder_signature: string;
  director2_name?: string;
  director2_title?: string;
  director2_image?: string;
  director2_message?: string;
  director2_quote?: string;
  director2_signature?: string;
  story_subheading?: string;
  services_subtext?: string;
  partner_image_1?: string;
  partner_image_2?: string;
  partner_image_3?: string;
  mission_title: string;
  mission_text: string;
  vision_title: string;
  vision_text: string;
  why_choose_title: string;
  why_choose_cards: WhyChooseCard[];
  services_title: string;
  services_list: ServiceItem[];
  trusted_partner_title: string;
  trusted_partner_description: string;
  trusted_partner_bg_image: string;
  trust_badges: TrustBadge[];
  achievements_title: string;
  achievements_bg_image: string;
  achievement_counters: AchievementCounter[];
  certifications_title: string;
  certification_logos: CertificationLogo[];
  cta_title: string;
  cta_description: string;
  cta_bg_image: string;
  cta_primary_btn_text: string;
  cta_primary_btn_url: string;
  cta_secondary_btn_text: string;
  cta_secondary_btn_url: string;
  meta_title?: string | null;
  meta_description?: string | null;
}

export const aboutPageApi = {
  getPage: async (): Promise<AboutPage> => {
    return await apiFetch<AboutPage>('/about-page');
  },
  updatePage: async (data: Partial<AboutPage>): Promise<{ message: string; page: AboutPage }> => {
    return await apiFetch<{ message: string; page: AboutPage }>('/about-page', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// --- Contact Us Page ---
export interface PhoneNumberItem {
  label: string;
  number: string;
}

export interface EmailAddressItem {
  label: string;
  email: string;
}

export interface SocialLinkItem {
  platform: string;
  url: string;
  icon: string;
}

export interface QuickContactCardItem {
  title: string;
  description: string;
  action_text: string;
  action_url: string;
  icon: string;
}

export interface WhyContactCardItem {
  title: string;
  description: string;
  icon: string;
}

export interface ContactPage {
  id?: number;
  hero_title: string;
  hero_subtitle: string;
  hero_bg_image: string;
  hero_cta_primary_text: string;
  hero_cta_primary_url: string;
  hero_cta_secondary_text: string;
  hero_cta_secondary_url: string;
  office_name: string;
  office_address: string;
  google_maps_url: string;
  phone_numbers: PhoneNumberItem[];
  email_addresses: EmailAddressItem[];
  business_hours_weekday: string;
  business_hours_weekend: string;
  brand_tagline: string;
  brand_description: string;
  social_links: SocialLinkItem[];
  quick_contact_cards: QuickContactCardItem[];
  why_contact_cards: WhyContactCardItem[];
  map_embed_url: string;
}

export interface ContactSubmitPayload {
  name: string;
  phone: string;
  email: string;
  num_people?: number;
  travel_date?: string;
  message: string;
}

export const contactPageApi = {
  getPage: async (): Promise<ContactPage> => {
    return await apiFetch<ContactPage>('/contact-page');
  },
  updatePage: async (data: Partial<ContactPage>): Promise<{ message: string; page: ContactPage }> => {
    return await apiFetch<{ message: string; page: ContactPage }>('/contact-page', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  submitContactEnquiry: async (payload: ContactSubmitPayload): Promise<{ message: string }> => {
    return await apiFetch<{ message: string }>('/contact/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// --- Home Page CMS API ---
export const homePageApi = {
  getHomePageData: async (): Promise<any> => {
    try {
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('dyna_home_cms_data');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            const remote = await apiFetch<any>('/home-page').catch(() => null);
            return { ...(remote || {}), ...parsed };
          } catch {}
        }
      }
      return await apiFetch<any>('/home-page');
    } catch {
      return null;
    }
  },
};

// --- Section Visibility Management ---
export interface SectionVisibility {
  packages: boolean;
  destinations: boolean;
  themes: boolean;
  visa: boolean;
  hotels: boolean;
}

export const defaultSectionVisibility: SectionVisibility = {
  packages: true,
  destinations: true,
  themes: true,
  visa: true,
  hotels: true,
};

export const getSectionVisibility = (): SectionVisibility => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('dyna_section_visibility');
    if (local) {
      try {
        return { ...defaultSectionVisibility, ...JSON.parse(local) };
      } catch {}
    }
  }
  return defaultSectionVisibility;
};

export const setSectionVisibility = (visibility: SectionVisibility): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dyna_section_visibility', JSON.stringify(visibility));
    window.dispatchEvent(new Event('dyna_section_visibility_changed'));
  }
};




