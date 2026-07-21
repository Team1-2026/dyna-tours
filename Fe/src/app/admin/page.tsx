'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api, Destination, Hotel, Enquiry, Room, GalleryImage, Facility } from '@/lib/api';
import { toursData } from '@/data/toursData';
import { AmenityIcon } from '@/components/AmenityIcon';
import styles from './admin.module.css';
import RichTextEditor from '@/components/RichTextEditor';
import ImageTabularManager from '@/components/ImageTabularManager';
import PackagesAdmin from './PackagesAdmin';
import VisasAdmin from './VisasAdmin';
import CrmAdmin from './CrmAdmin';
import FlightsAdmin from './FlightsAdmin';
import GroupToursAdmin from './GroupToursAdmin';
import GroupTourPageAdmin from './GroupTourPageAdmin';
import GroupTourEnquiriesAdmin from './GroupTourEnquiriesAdmin';

type TabType = 'dashboard' | 'enquiries' | 'crm' | 'destinations' | 'hotels' | 'bookings' | 'offers' | 'settings' | 'facilities' | 'packages' | 'visas' | 'flights' | 'groupTours' | 'groupTourPage' | 'groupTourEnquiries';

// Hierarchical location data
const COUNTRIES_DATA: Record<string, { states: string[]; cities: Record<string, string[]> }> = {
  India: {
    states: ['Kerala', 'Tamil Nadu', 'Karnataka', 'Goa', 'Delhi', 'Maharashtra', 'Rajasthan'],
    cities: {
      Kerala: ['Munnar', 'Kochi', 'Alleppey', 'Wayanad', 'Thekkady', 'Kovalam', 'Trivandrum'],
      'Tamil Nadu': ['Chennai', 'Ooty', 'Kodaikanal', 'Madurai'],
      Karnataka: ['Bengaluru', 'Mysuru', 'Hampi', 'Coorg'],
      Goa: ['Panaji', 'Calangute', 'Margao'],
      Delhi: ['New Delhi', 'Old Delhi'],
    }
  },
  Thailand: {
    states: ['Bangkok', 'Phuket', 'Krabi', 'Pattaya', 'Chiang Mai'],
    cities: {
      Bangkok: ['Bangkok City'],
      Phuket: ['Phuket Town', 'Patong'],
      Krabi: ['Ao Nang', 'Krabi Town'],
      Pattaya: ['Pattaya Beach'],
      'Chiang Mai': ['Chiang Mai City'],
    }
  },
  Singapore: {
    states: ['Central Region', 'East Region'],
    cities: {}
  },
  Malaysia: {
    states: ['Selangor', 'Penang', 'Sabah'],
    cities: {
      Selangor: ['Kuala Lumpur', 'Petaling Jaya'],
      Penang: ['George Town'],
    }
  },
  UAE: {
    states: ['Dubai', 'Abu Dhabi', 'Sharjah'],
    cities: {
      Dubai: ['Dubai Marina', 'Deira'],
      'Abu Dhabi': ['Yas Island'],
    }
  }
};

const ROOM_AMENITIES_LIST = [
  'Wifi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Jacuzzi', 'Safe', 
  'Room Service', 'Coffee Maker', 'Dining Area', 'Kitchenette'
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('hotels');

  // Core data states
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);

  // Facilities admin states
  const [isCreatingFacility, setIsCreatingFacility] = useState(false);
  const [editingFacilityId, setEditingFacilityId] = useState<number | null>(null);
  const [facilityForm, setFacilityForm] = useState<Partial<Facility>>({
    name: '',
    icon: 'wifi',
    description: ''
  });

  // Selection states
  const [selectedDestId, setSelectedDestId] = useState('');
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);

  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  // Packages admin states
  const [isCreatingPackage, setIsCreatingPackage] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [packageSearchQuery, setPackageSearchQuery] = useState('');

  // Creation modes
  const [isCreatingDest, setIsCreatingDest] = useState(false);
  const [isCreatingHotel, setIsCreatingHotel] = useState(false);

  // Restore editor view state from sessionStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = sessionStorage.getItem('admin_active_tab');
      const savedDestId = sessionStorage.getItem('admin_selected_dest_id');
      const savedHotelId = sessionStorage.getItem('admin_selected_hotel_id');
      const savedCreatingDest = sessionStorage.getItem('admin_is_creating_dest');
      const savedCreatingHotel = sessionStorage.getItem('admin_is_creating_hotel');

      if (savedTab) setActiveTab(savedTab as TabType);
      if (savedDestId) setSelectedDestId(savedDestId);
      if (savedHotelId) setSelectedHotelId(savedHotelId);
      if (savedCreatingDest) setIsCreatingDest(savedCreatingDest === 'true');
      if (savedCreatingHotel) setIsCreatingHotel(savedCreatingHotel === 'true');
    }
  }, []);

  // Sync editor view state to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('admin_active_tab', activeTab);
      sessionStorage.setItem('admin_selected_dest_id', selectedDestId);
      sessionStorage.setItem('admin_selected_hotel_id', selectedHotelId);
      sessionStorage.setItem('admin_is_creating_dest', String(isCreatingDest));
      sessionStorage.setItem('admin_is_creating_hotel', String(isCreatingHotel));
    }
  }, [activeTab, selectedDestId, selectedHotelId, isCreatingDest, isCreatingHotel]);

  // Creation form states
  const [newDest, setNewDest] = useState<Partial<Destination>>({
    id: '', name: '', type: 'domestic', parent_id: null, overview: '',
    show_packages: true, show_hotels: true, country: '', state: '', city: '',
    meta_title: '', meta_description: '', url_slug: '', canonical_url: '',
    gallery: [], top_attractions: [], related_tours: []
  });

  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({
    id: '', name: '', destination_id: '', short_description: '', about: '',
    location: '', distance_from_attractions: '', category: '5-Star', price: 100,
    offer_label: '', featured: false, show_rooms: true, show_offer_label: true,
    show_price: true, order_no: null, status: 'Active', country: '', state: '',
    city: '', inclusions: '', exclusions: '', terms_conditions: '',
    gallery: [], facilities: [], related_hotels: [], rooms: [], video_url: ''
  });

  // Room Builder state
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null); // null means adding a new room
  const [roomForm, setRoomForm] = useState<Partial<Room>>({
    type: '', size: '', view: '', bed_type: '', breakfast: 'Included',
    occupancy: '2 Adults', image: '', description: '', images: [], amenities: [], price: 0, video_url: ''
  });

  // Temporary Image URLs inputs
  const [tempRoomImageUrl, setTempRoomImageUrl] = useState('');

  // Related items search queries
  const [tourSearchQuery, setTourSearchQuery] = useState('');
  const [hotelSearchQuery, setHotelSearchQuery] = useState('');

  // Status states
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Sidebar Layout States
  const [isHotelsMenuOpen, setIsHotelsMenuOpen] = useState(true);
  const [isDestinationsMenuOpen, setIsDestinationsMenuOpen] = useState(true);
  const [isPackagesMenuOpen, setIsPackagesMenuOpen] = useState(true);
  const [isGroupToursMenuOpen, setIsGroupToursMenuOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hotels List Management Table Filters
  const [hotelSearch, setHotelSearch] = useState('');
  const [hotelLocationFilter, setHotelLocationFilter] = useState('');
  const [hotelCategoryFilter, setHotelCategoryFilter] = useState('');
  const [hotelStatusFilter, setHotelStatusFilter] = useState('');

  // Destinations List Management Table Filters
  const [destSearch, setDestSearch] = useState('');
  const [destTypeFilter, setDestTypeFilter] = useState('');

  // Direct delete handlers for tables
  const handleDeleteHotelDirect = async (hotelId: string, hotelName: string) => {
    if (!confirm(`Are you absolutely sure you want to delete the hotel "${hotelName}"?`)) return;
    setSaveStatus('Deleting hotel...');
    try {
      await api.deleteHotel(hotelId);
      setSaveStatus('✓ Hotel deleted successfully!');
      if (selectedHotelId === hotelId) {
        setSelectedHotelId('');
        setSelectedHotel(null);
      }
      refreshData();
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('❌ Failed to delete hotel.');
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleDeleteDestDirect = async (destId: string, destName: string) => {
    if (!confirm(`Are you absolutely sure you want to delete the destination "${destName}"? All associated hotels will be deleted.`)) return;
    setSaveStatus('Deleting destination...');
    try {
      await api.deleteDestination(destId);
      setSaveStatus('✓ Destination deleted successfully!');
      if (selectedDestId === destId) {
        setSelectedDestId('');
        setSelectedDest(null);
      }
      refreshData();
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('❌ Failed to delete destination.');
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  // Image helpers for Featured/Banner/Gallery layouts
  const getBannerImage = (galleryList: (string | GalleryImage)[] | null | undefined) => {
    if (!galleryList) return '';
    const banner = galleryList.find(img => typeof img !== 'string' && img.section === 'banner');
    if (banner && typeof banner !== 'string') return banner.url;
    return '';
  };

  const getFeaturedImage = (galleryList: (string | GalleryImage)[] | null | undefined) => {
    if (!galleryList) return '';
    const feat = galleryList.find(img => typeof img !== 'string' && img.section === 'featured');
    if (feat && typeof feat !== 'string') return feat.url;
    return '';
  };

  const getGalleryImagesOnly = (galleryList: (string | GalleryImage)[] | null | undefined) => {
    if (!galleryList) return [];
    return galleryList.filter(img => {
      if (typeof img === 'string') return true;
      return img.section !== 'banner' && img.section !== 'featured';
    });
  };

  const updateImageInSection = (
    galleryList: (string | GalleryImage)[] | null | undefined, 
    newUrl: string, 
    section: 'banner' | 'featured' | 'gallery' | 'other'
  ) => {
    const currentList: GalleryImage[] = (galleryList || []).map(img => {
      if (typeof img === 'string') return { url: img, section: 'gallery' };
      return { url: img.url || '', section: img.section || 'gallery' };
    });

    if (section === 'banner' || section === 'featured') {
      const idx = currentList.findIndex(img => img.section === section);
      if (idx !== -1) {
        if (newUrl) {
          currentList[idx].url = newUrl;
        } else {
          currentList.splice(idx, 1);
        }
      } else if (newUrl) {
        currentList.push({ url: newUrl, section });
      }
    }
    return currentList;
  };

  const handleFeaturedImageUpdate = (url: string) => {
    const currentGallery = isCreatingHotel ? newHotel.gallery : selectedHotel?.gallery;
    const updated = updateImageInSection(currentGallery, url, 'featured');
    if (isCreatingHotel) {
      setNewHotel(prev => ({ ...prev, gallery: updated }));
    } else {
      setSelectedHotel(prev => prev ? { ...prev, gallery: updated } : null);
    }
  };

  const handleBannerImageUpdate = (url: string) => {
    const currentGallery = isCreatingHotel ? newHotel.gallery : selectedHotel?.gallery;
    const updated = updateImageInSection(currentGallery, url, 'banner');
    if (isCreatingHotel) {
      setNewHotel(prev => ({ ...prev, gallery: updated, banner_image: url }));
    } else {
      setSelectedHotel(prev => prev ? { ...prev, gallery: updated, banner_image: url } : null);
    }
  };

  const handleAddGalleryImage = (url: string) => {
    const currentGallery = isCreatingHotel ? newHotel.gallery : selectedHotel?.gallery;
    const currentList: GalleryImage[] = (currentGallery || []).map(img => {
      if (typeof img === 'string') return { url: img, section: 'gallery' };
      return { url: img.url || '', section: img.section || 'gallery' };
    });
    if (url) {
      currentList.push({ url, section: 'gallery' });
    }
    if (isCreatingHotel) {
      setNewHotel(prev => ({ ...prev, gallery: currentList }));
    } else {
      setSelectedHotel(prev => prev ? { ...prev, gallery: currentList } : null);
    }
  };

  const handleRemoveGalleryImage = (url: string) => {
    const currentGallery = isCreatingHotel ? newHotel.gallery : selectedHotel?.gallery;
    const updated = (currentGallery || []).filter(img => {
      const imgUrl = typeof img === 'string' ? img : img.url;
      return imgUrl !== url;
    }).map(img => {
      if (typeof img === 'string') return { url: img, section: 'gallery' as const };
      return img;
    });
    if (isCreatingHotel) {
      setNewHotel(prev => ({ ...prev, gallery: updated }));
    } else {
      setSelectedHotel(prev => prev ? { ...prev, gallery: updated } : null);
    }
  };

  const handleLocalImageUploadForSection = (e: React.ChangeEvent<HTMLInputElement>, section: 'banner' | 'featured' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64 = event.target.result as string;
        if (section === 'banner') handleBannerImageUpdate(base64);
        else if (section === 'featured') handleFeaturedImageUpdate(base64);
        else handleAddGalleryImage(base64);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Load all initial admin data
  useEffect(() => {
    if (!api.isAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    setLoading(true);
    refreshData();
  }, [router]);

  const refreshData = () => {
    Promise.all([
      api.getEnquiries(),
      api.getDestinations(),
      api.getHotels(),
      api.getFacilities()
    ]).then(([enqData, destData, hotelData, facData]) => {
      setEnquiries(enqData);
      setDestinations(destData);
      setHotels(hotelData);
      setFacilities(facData);

      // Restore selections if valid, otherwise keep empty
      if (selectedDestId) {
        const found = destData.find(d => d.id === selectedDestId);
        if (!found) {
          setSelectedDestId('');
          setSelectedDest(null);
        }
      }
      if (selectedHotelId) {
        const found = hotelData.find(h => h.id === selectedHotelId);
        if (!found) {
          setSelectedHotelId('');
          setSelectedHotel(null);
        }
      }
    }).catch(err => {
      console.error('Failed to load admin dashboard data', err);
    }).finally(() => {
      setLoading(false);
    });
  };

  // Fetch full single destination details when ID changes
  useEffect(() => {
    if (!selectedDestId || isCreatingDest || !api.isAuthenticated()) return;
    api.getDestination(selectedDestId)
      .then(data => {
        setSelectedDest(data);
      })
      .catch(err => console.error(err));
  }, [selectedDestId, isCreatingDest]);

  // Fetch full single hotel details when ID changes
  useEffect(() => {
    if (!selectedHotelId || isCreatingHotel || !api.isAuthenticated()) return;
    api.getHotel(selectedHotelId)
      .then(data => {
        setSelectedHotel(data);
      })
      .catch(err => console.error(err));
  }, [selectedHotelId, isCreatingHotel]);

  // Logout Handler
  const handleLogout = async () => {
    setLoading(true);
    await api.logout();
    router.push('/admin/login');
  };

  // ----------------------------------------------------
  // DESTINATIONS MANAGEMENT
  // ----------------------------------------------------
  const handleDestTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === 'order_no' ? (value === '' ? null : Number(value)) : value;

    if (isCreatingDest) {
      setNewDest(prev => {
        const updated = { ...prev, [name]: parsedValue };
        if (name === 'name' && !prev.url_slug) {
          updated.url_slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
        return updated;
      });
    } else if (selectedDest) {
      setSelectedDest(prev => prev ? { ...prev, [name]: parsedValue } : null);
    }
  };

  const handleDestToggle = (field: 'show_packages' | 'show_hotels') => {
    if (isCreatingDest) {
      setNewDest(prev => ({ ...prev, [field]: !prev[field] }));
    } else if (selectedDest) {
      setSelectedDest(prev => prev ? { ...prev, [field]: !prev[field] } : null);
    }
  };

  const handleDestRelatedTourToggle = (tourId: string) => {
    if (isCreatingDest) {
      const current = newDest.related_tours || [];
      const updated = current.includes(tourId) 
        ? current.filter(id => id !== tourId) 
        : [...current, tourId];
      setNewDest(prev => ({ ...prev, related_tours: updated }));
    } else if (selectedDest) {
      const current = selectedDest.related_tours || [];
      const updated = current.includes(tourId) 
        ? current.filter(id => id !== tourId) 
        : [...current, tourId];
      setSelectedDest(prev => prev ? { ...prev, related_tours: updated } : null);
    }
  };

  const saveDestinationSettings = async () => {
    const dataToSave = isCreatingDest ? newDest : selectedDest;
    if (!dataToSave || (!isCreatingDest && !selectedDestId)) return;

    setSaveStatus('Saving destination details...');
    try {
      if (isCreatingDest) {
        if (!dataToSave.id || !dataToSave.name) {
          alert('Destination ID and Name are required!');
          setSaveStatus(null);
          return;
        }
        const response = await api.createDestination(dataToSave);
        setSaveStatus('✓ Destination created successfully!');
        setIsCreatingDest(false);
        setSelectedDestId(response.destination.id);
        refreshData();
      } else {
        const response = await api.updateDestination(selectedDestId, {
          name: dataToSave.name,
          overview: dataToSave.overview,
          how_to_reach: dataToSave.how_to_reach,
          best_time_to_visit: dataToSave.best_time_to_visit,
          show_packages: dataToSave.show_packages,
          show_hotels: dataToSave.show_hotels,
          banner_image: dataToSave.banner_image,
          gallery: dataToSave.gallery,
          top_attractions: dataToSave.top_attractions,
          meta_title: dataToSave.meta_title,
          meta_description: dataToSave.meta_description,
          url_slug: dataToSave.url_slug,
          canonical_url: dataToSave.canonical_url,
          country: dataToSave.country,
          state: dataToSave.state,
          city: dataToSave.city,
          related_tours: dataToSave.related_tours,
        });
        setSaveStatus('✓ Destination updated successfully!');
        setDestinations(prev => prev.map(d => d.id === selectedDestId ? response.destination : d));
      }
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('❌ Failed to save destination.');
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const deleteDestination = async () => {
    if (!selectedDestId) return;
    if (!confirm(`Are you absolutely sure you want to delete the destination "${selectedDest?.name}"? All associated hotels will be deleted.`)) return;

    setSaveStatus('Deleting destination...');
    try {
      await api.deleteDestination(selectedDestId);
      setSaveStatus('✓ Destination deleted successfully!');
      setSelectedDestId('');
      setSelectedDest(null);
      refreshData();
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('❌ Failed to delete destination.');
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  // ----------------------------------------------------
  // HOTELS MANAGEMENT
  // ----------------------------------------------------
  const handleHotelTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNum = name === 'price' || name === 'order_no';
    const parsedVal = isNum ? (value !== '' ? Number(value) : null) : value;

    if (isCreatingHotel) {
      setNewHotel(prev => {
        const updated = { ...prev, [name]: parsedVal };
        if (name === 'name' && !prev.url_slug) {
          updated.url_slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
        return updated;
      });
    } else if (selectedHotel) {
      setSelectedHotel(prev => prev ? { ...prev, [name]: parsedVal } : null);
    }
  };

  const handleHotelToggle = (field: 'featured' | 'show_rooms' | 'show_offer_label' | 'show_price') => {
    if (isCreatingHotel) {
      setNewHotel(prev => ({ ...prev, [field]: !prev[field] }));
    } else if (selectedHotel) {
      setSelectedHotel(prev => prev ? { ...prev, [field]: !prev[field] } : null);
    }
  };

  const handleHotelRelatedToggle = (hotelId: string) => {
    if (isCreatingHotel) {
      const current = newHotel.related_hotels || [];
      const updated = current.includes(hotelId) 
        ? current.filter(id => id !== hotelId) 
        : [...current, hotelId];
      setNewHotel(prev => ({ ...prev, related_hotels: updated }));
    } else if (selectedHotel) {
      const current = selectedHotel.related_hotels || [];
      const updated = current.includes(hotelId) 
        ? current.filter(id => id !== hotelId) 
        : [...current, hotelId];
      setSelectedHotel(prev => prev ? { ...prev, related_hotels: updated } : null);
    }
  };

  // Tabular Gallery state handlers
  const handleHotelGalleryChange = (updated: GalleryImage[]) => {
    if (isCreatingHotel) {
      setNewHotel(prev => ({ ...prev, gallery: updated }));
    } else {
      setSelectedHotel(prev => prev ? { ...prev, gallery: updated } : null);
    }
  };

  const handleDestGalleryChange = (updated: GalleryImage[]) => {
    const bannerImg = updated.find(img => img.section === 'banner')?.url || '';
    if (isCreatingDest) {
      setNewDest(prev => ({
        ...prev,
        gallery: updated,
        banner_image: bannerImg || prev.banner_image || null
      }));
    } else {
      setSelectedDest(prev => prev ? {
        ...prev,
        gallery: updated,
        banner_image: bannerImg || prev.banner_image || null
      } : null);
    }
  };

  // Room Builder Modal handlers
  const openAddRoomModal = () => {
    setEditingRoomIndex(null);
    setRoomForm({
      type: '', size: '', view: '', bed_type: '', breakfast: 'Included',
      occupancy: '2 Guests', image: '', description: '', images: [], amenities: [], price: 100, remaining_rooms: 5, video_url: ''
    });
    setTempRoomImageUrl('');
    setIsRoomModalOpen(true);
  };

  const openEditRoomModal = (roomIdx: number) => {
    setEditingRoomIndex(roomIdx);
    const roomsList = isCreatingHotel ? (newHotel.rooms || []) : (selectedHotel?.rooms || []);
    const room = roomsList[roomIdx];
    setRoomForm({
      ...room,
      images: room.images || [],
      amenities: room.amenities || []
    });
    setTempRoomImageUrl('');
    setIsRoomModalOpen(true);
  };

  const saveRoomCategory = () => {
    if (!roomForm.type) {
      alert('Room Category Name is required!');
      return;
    }

    const currentRooms = isCreatingHotel 
      ? [...(newHotel.rooms || [])] 
      : [...(selectedHotel?.rooms || [])];

    // Fallback room thumbnail to first image in gallery
    const roomPayload: Room = {
      ...roomForm,
      type: roomForm.type,
      image: roomForm.images && roomForm.images.length > 0 ? roomForm.images[0] : roomForm.image
    } as Room;

    if (editingRoomIndex === null) {
      // Create new
      currentRooms.push(roomPayload);
    } else {
      // Edit
      currentRooms[editingRoomIndex] = roomPayload;
    }

    if (isCreatingHotel) {
      setNewHotel(prev => ({ ...prev, rooms: currentRooms }));
    } else {
      setSelectedHotel(prev => prev ? { ...prev, rooms: currentRooms } : null);
    }

    setIsRoomModalOpen(false);
  };

  const deleteRoomCategory = (idx: number) => {
    if (!confirm('Are you sure you want to delete this room category?')) return;
    const currentRooms = isCreatingHotel 
      ? [...(newHotel.rooms || [])] 
      : [...(selectedHotel?.rooms || [])];
    
    const updated = currentRooms.filter((_, i) => i !== idx);

    if (isCreatingHotel) {
      setNewHotel(prev => ({ ...prev, rooms: updated }));
    } else {
      setSelectedHotel(prev => prev ? { ...prev, rooms: updated } : null);
    }
  };

  const handleRoomLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64 = event.target.result as string;
        setRoomForm(prev => ({
          ...prev,
          images: [...(prev.images || []), base64]
        }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addRoomImageUrl = (url: string) => {
    if (!url) return;
    setRoomForm(prev => ({
      ...prev,
      images: [...(prev.images || []), url]
    }));
    setTempRoomImageUrl('');
  };

  const removeRoomGalleryImage = (idx: number) => {
    setRoomForm(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== idx)
    }));
  };

  const handleRoomAmenityToggle = (amenity: string) => {
    const current = roomForm.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(item => item !== amenity)
      : [...current, amenity];
    setRoomForm(prev => ({ ...prev, amenities: updated }));
  };

  const handleFacilitySave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facilityForm.name || !facilityForm.icon) {
      alert('Amenity Name and Icon are required!');
      return;
    }

    try {
      if (editingFacilityId === null) {
        const response = await api.createFacility(facilityForm);
        setFacilities(prev => [...prev, response.facility].sort((a, b) => a.name.localeCompare(b.name)));
        alert('Amenity created successfully!');
      } else {
        const response = await api.updateFacility(editingFacilityId, facilityForm);
        setFacilities(prev => prev.map(f => f.id === editingFacilityId ? response.facility : f).sort((a, b) => a.name.localeCompare(b.name)));
        alert('Amenity updated successfully!');
      }
      setIsCreatingFacility(false);
      setEditingFacilityId(null);
      setFacilityForm({ name: '', icon: 'wifi', description: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to save amenity details.');
    }
  };

  const handleFacilityEdit = (facility: Facility) => {
    setEditingFacilityId(facility.id);
    setFacilityForm({
      name: facility.name,
      icon: facility.icon,
      description: facility.description || ''
    });
    setIsCreatingFacility(true);
  };

  const handleFacilityDelete = async (id: number) => {
    const target = facilities.find(f => f.id === id);
    if (!target) return;
    if (!confirm(`Are you absolutely sure you want to delete the amenity "${target.name}"? This will remove it from all hotels.`)) return;

    try {
      await api.deleteFacility(id);
      setFacilities(prev => prev.filter(f => f.id !== id));
      alert('Facility deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to delete facility.');
    }
  };

  const saveHotelSettings = async () => {
    const dataToSave = isCreatingHotel ? newHotel : selectedHotel;
    if (!dataToSave || (!isCreatingHotel && !selectedHotelId)) return;

    setSaveStatus('Saving hotel details...');
    try {
      const currentFacilities = dataToSave.facilities || [];
      const facilityIds = currentFacilities.map(f => typeof f === 'object' && f !== null ? f.id : f) as number[];

      if (isCreatingHotel) {
        if (!dataToSave.id || !dataToSave.name || !dataToSave.destination_id) {
          alert('Hotel ID (Slug), Name, and Destination are required!');
          setSaveStatus(null);
          return;
        }
        const response = await api.createHotel({
          ...dataToSave,
          facilities: facilityIds as any
        });
        setSaveStatus('✓ Hotel created successfully!');
        setIsCreatingHotel(false);
        setSelectedHotelId(response.hotel.id);
        refreshData();
      } else {
        console.log("PAYLOAD TO SEND:", dataToSave.rooms); const response = await api.updateHotel(selectedHotelId, {
          name: dataToSave.name,
          destination_id: dataToSave.destination_id,
          short_description: dataToSave.short_description,
          about: dataToSave.about,
          location: dataToSave.location,
          distance_from_attractions: dataToSave.distance_from_attractions,
          category: dataToSave.category,
          featured: dataToSave.featured,
          show_rooms: dataToSave.show_rooms,
          show_offer_label: dataToSave.show_offer_label,
          show_price: dataToSave.show_price,
          price: dataToSave.price,
          offer_label: dataToSave.offer_label,
          gallery: dataToSave.gallery,
          facilities: facilityIds as any,
          order_no: dataToSave.order_no,
          status: dataToSave.status,
          meta_title: dataToSave.meta_title,
          meta_description: dataToSave.meta_description,
          url_slug: dataToSave.url_slug,
          canonical_url: dataToSave.canonical_url,
          og_title: dataToSave.og_title,
          og_description: dataToSave.og_description,
          country: dataToSave.country,
          state: dataToSave.state,
          city: dataToSave.city,
          inclusions: dataToSave.inclusions,
          exclusions: dataToSave.exclusions,
          terms_conditions: dataToSave.terms_conditions,
          related_hotels: dataToSave.related_hotels,
          rooms: dataToSave.rooms, // backend recreates rooms automatically
          video_url: dataToSave.video_url,
        });
        setSaveStatus('✓ Hotel updated successfully!');
        setHotels(prev => prev.map(h => h.id === selectedHotelId ? response.hotel : h));
      }
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('❌ Failed to save hotel details.');
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const deleteHotel = async () => {
    if (!selectedHotelId) return;
    if (!confirm(`Are you absolutely sure you want to delete the hotel "${selectedHotel?.name}"?`)) return;

    setSaveStatus('Deleting hotel...');
    try {
      await api.deleteHotel(selectedHotelId);
      setSaveStatus('✓ Hotel deleted successfully!');
      setSelectedHotelId('');
      setSelectedHotel(null);
      refreshData();
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('❌ Failed to delete hotel.');
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-secondary-navy)' }}>Loading Dashboard...</h2>
      </div>
    );
  }

  // Location helpers for dependent selectors
  const activeDestObj = isCreatingDest ? newDest : selectedDest;
  const activeHotelObj = isCreatingHotel ? newHotel : selectedHotel;

  // Retrieve current active country state data
  const destCountry = activeDestObj?.country || '';
  const hotelCountry = activeHotelObj?.country || '';

  const destStates = COUNTRIES_DATA[destCountry]?.states || [];
  const hotelStates = COUNTRIES_DATA[hotelCountry]?.states || [];

  const destState = activeDestObj?.state || '';
  const hotelState = activeHotelObj?.state || '';

  const destCities = COUNTRIES_DATA[destCountry]?.cities?.[destState] || [];
  const hotelCities = COUNTRIES_DATA[hotelCountry]?.cities?.[hotelState] || [];

  // Filter lists for checkboxes
  const filteredTours = toursData.filter(tour => 
    tour.title.toLowerCase().includes(tourSearchQuery.toLowerCase()) ||
    tour.destination.toLowerCase().includes(tourSearchQuery.toLowerCase())
  );

  const filteredHotels = hotels.filter(h => 
    h.id !== (isCreatingHotel ? '' : selectedHotelId) &&
    (h.name.toLowerCase().includes(hotelSearchQuery.toLowerCase()) ||
     h.location.toLowerCase().includes(hotelSearchQuery.toLowerCase()))
  );

  return (
    <div className={styles.adminLayout}>
      
      {/* Left Sidebar Menu (CMS Model) */}
      <div 
        className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.isOpen : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      />
      <aside className={`${styles.adminSidebar} ${isSidebarOpen ? styles.sidebarMobileOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarIcon}>🏢</span>
          <span>Dyna Tours</span>
        </div>
        
        <div className={styles.sidebarMenu}>
          <div className={styles.menuSectionHeader}>Main</div>
          
          <div 
            className={`${styles.menuItem} ${activeTab === 'dashboard' ? styles.menuItemActive : ''}`}
            onClick={() => { setActiveTab('dashboard'); setIsCreatingDest(false); setIsCreatingHotel(false); setSelectedDestId(''); setSelectedHotelId(''); }}
          >
            <div className={styles.menuItemLabel}>
              <span>📊</span>
              <span>Dashboard</span>
            </div>
          </div>

          <div className={styles.menuSectionHeader}>Hotels</div>
          
          <div 
            className={`${styles.menuItem}`}
            onClick={() => setIsHotelsMenuOpen(!isHotelsMenuOpen)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.menuItemLabel}>
              <span>🏨</span>
              <span>Hotels</span>
            </div>
            <span style={{ fontSize: '0.75rem' }}>{isHotelsMenuOpen ? '▼' : '▶'}</span>
          </div>

          {isHotelsMenuOpen && (
            <div className={styles.subMenuContainer}>
              <div 
                className={`${styles.subMenuItem} ${activeTab === 'hotels' && !isCreatingHotel && !selectedHotelId ? styles.subMenuItemActive : ''}`}
                onClick={() => { setActiveTab('hotels'); setIsCreatingHotel(false); setSelectedHotelId(''); setSelectedHotel(null); }}
              >
                All Hotels
              </div>
              <div 
                className={`${styles.subMenuItem} ${activeTab === 'hotels' && isCreatingHotel ? styles.subMenuItemActive : ''}`}
                onClick={() => {
                  setActiveTab('hotels');
                  setIsCreatingHotel(true);
                  setSelectedHotelId('');
                  setSelectedHotel(null);
                  setNewHotel({
                    id: '', name: '', destination_id: destinations[0]?.id || '', short_description: '', about: '',
                    location: '', distance_from_attractions: '', category: '5-Star', price: 100,
                    offer_label: '', featured: false, show_rooms: true, show_offer_label: true,
                    show_price: true, order_no: null, status: 'Active', country: 'India', state: 'Kerala',
                    city: 'Munnar', inclusions: '', exclusions: '', terms_conditions: '',
                    gallery: [], facilities: [], related_hotels: [], rooms: [], video_url: ''
                  });
                }}
              >
                Add New Hotel
              </div>
            </div>
          )}

          <div className={styles.menuSectionHeader}>Destinations</div>
          
          <div 
            className={`${styles.menuItem}`}
            onClick={() => setIsDestinationsMenuOpen(!isDestinationsMenuOpen)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.menuItemLabel}>
              <span>🗺️</span>
              <span>Destinations</span>
            </div>
            <span style={{ fontSize: '0.75rem' }}>{isDestinationsMenuOpen ? '▼' : '▶'}</span>
          </div>

          {isDestinationsMenuOpen && (
            <div className={styles.subMenuContainer}>
              <div 
                className={`${styles.subMenuItem} ${activeTab === 'destinations' && !isCreatingDest && !selectedDestId ? styles.subMenuItemActive : ''}`}
                onClick={() => { setActiveTab('destinations'); setIsCreatingDest(false); setSelectedDestId(''); setSelectedDest(null); }}
              >
                All Destinations
              </div>
              <div 
                className={`${styles.subMenuItem} ${activeTab === 'destinations' && isCreatingDest ? styles.subMenuItemActive : ''}`}
                onClick={() => {
                  setActiveTab('destinations');
                  setIsCreatingDest(true);
                  setSelectedDestId('');
                  setSelectedDest(null);
                  setNewDest({
                    id: '', name: '', type: 'domestic', parent_id: null, overview: '',
                    show_packages: true, show_hotels: true, country: 'India', state: 'Kerala', city: '',
                    meta_title: '', meta_description: '', url_slug: '', canonical_url: '',
                    gallery: [], top_attractions: [], related_tours: []
                  });
                }}
              >
                Add Destination
              </div>
            </div>
          )}

          <div className={styles.menuSectionHeader}>Holidays</div>
          
          <div 
            className={`${styles.menuItem}`}
            onClick={() => setIsPackagesMenuOpen(!isPackagesMenuOpen)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.menuItemLabel}>
              <span>🏖️</span>
              <span>Packages</span>
            </div>
            <span style={{ fontSize: '0.75rem' }}>{isPackagesMenuOpen ? '▼' : '▶'}</span>
          </div>

          {isPackagesMenuOpen && (
            <div className={styles.subMenuContainer}>
              <div 
                className={`${styles.subMenuItem} ${activeTab === 'packages' ? styles.subMenuItemActive : ''}`}
                onClick={() => { setActiveTab('packages'); window.dispatchEvent(new Event('admin:view-packages')); }}
              >
                All Packages
              </div>
              <div 
                className={`${styles.subMenuItem}`}
                onClick={() => { setActiveTab('packages'); setTimeout(() => window.dispatchEvent(new Event('admin:add-new-package')), 50); }}
              >
                Add New Package
              </div>
            </div>
          )}

          <div className={styles.menuSectionHeader}>Group Tours</div>
          
          <div 
            className={`${styles.menuItem}`}
            onClick={() => setIsGroupToursMenuOpen(!isGroupToursMenuOpen)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.menuItemLabel}>
              <span>🚌</span>
              <span>Group Tours</span>
            </div>
            <span style={{ fontSize: '0.75rem' }}>{isGroupToursMenuOpen ? '▼' : '▶'}</span>
          </div>

          {isGroupToursMenuOpen && (
            <div className={styles.subMenuContainer}>
              <div 
                className={`${styles.subMenuItem} ${activeTab === 'groupTours' ? styles.subMenuItemActive : ''}`}
                onClick={() => { setActiveTab('groupTours'); }}
              >
                Tour Packages
              </div>
              <div 
                className={`${styles.subMenuItem} ${activeTab === 'groupTourPage' ? styles.subMenuItemActive : ''}`}
                onClick={() => { setActiveTab('groupTourPage'); }}
              >
                Page Settings
              </div>
              <div 
                className={`${styles.subMenuItem} ${activeTab === 'groupTourEnquiries' ? styles.subMenuItemActive : ''}`}
                onClick={() => { setActiveTab('groupTourEnquiries'); }}
              >
                Enquiries
              </div>
            </div>
          )}

          <div className={styles.menuSectionHeader}>Enquiries</div>
          
          <div 
            className={`${styles.menuItem} ${activeTab === 'enquiries' ? styles.menuItemActive : ''}`}
            onClick={() => { setActiveTab('enquiries'); setIsCreatingDest(false); setIsCreatingHotel(false); setSelectedDestId(''); setSelectedHotelId(''); }}
          >
            <div className={styles.menuItemLabel}>
              <span>✉️</span>
              <span>Enquiries</span>
            </div>
            <span className={styles.menuBadge}>{enquiries.length}</span>
          </div>

          <div 
            className={`${styles.menuItem} ${activeTab === 'crm' ? styles.menuItemActive : ''}`}
            onClick={() => { setActiveTab('crm'); setIsCreatingDest(false); setIsCreatingHotel(false); setSelectedDestId(''); setSelectedHotelId(''); }}
          >
            <div className={styles.menuItemLabel}>
              <span>💬</span>
              <span>Chat CRM</span>
            </div>
          </div>

          <div className={styles.menuSectionHeader}>Operations</div>
          
          <div 
            className={`${styles.menuItem} ${activeTab === 'bookings' ? styles.menuItemActive : ''}`}
            onClick={() => { setActiveTab('bookings'); }}
          >
            <div className={styles.menuItemLabel}>
              <span>📅</span>
              <span>Bookings</span>
            </div>
          </div>

          <div 
            className={`${styles.menuItem} ${activeTab === 'offers' ? styles.menuItemActive : ''}`}
            onClick={() => { setActiveTab('offers'); }}
          >
            <div className={styles.menuItemLabel}>
              <span>🏷️</span>
              <span>Offers</span>
            </div>
          </div>

          <div 
            className={`${styles.menuItem} ${activeTab === 'facilities' ? styles.menuItemActive : ''}`}
            onClick={() => { setActiveTab('facilities'); }}
          >
            <div className={styles.menuItemLabel}>
              <span>🏨</span>
              <span>Amenities</span>
            </div>
            <span className={styles.menuBadge}>{facilities.length}</span>
          </div>

          <div 
            className={`${styles.menuItem} ${activeTab === 'visas' ? styles.menuItemActive : ''}`}
            onClick={() => { setActiveTab('visas'); }}
          >
            <div className={styles.menuItemLabel}>
              <span>🛂</span>
              <span>Visa</span>
            </div>
          </div>

          <div 
            className={`${styles.menuItem} ${activeTab === 'flights' ? styles.menuItemActive : ''}`}
            onClick={() => { setActiveTab('flights'); }}
          >
            <div className={styles.menuItemLabel}>
              <span>✈️</span>
              <span>Flights</span>
            </div>
          </div>

          <div className={styles.menuSectionHeader}>Settings</div>
          
          <div 
            className={`${styles.menuItem} ${activeTab === 'settings' ? styles.menuItemActive : ''}`}
            onClick={() => { setActiveTab('settings'); }}
          >
            <div className={styles.menuItemLabel}>
              <span>⚙️</span>
              <span>Settings</span>
            </div>
          </div>

          <div 
            className={styles.menuItem}
            onClick={handleLogout}
            style={{ marginTop: 'auto', color: 'var(--color-primary-red)' }}
          >
            <div className={styles.menuItemLabel}>
              <span>🚪</span>
              <span>Logout</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className={styles.adminMainContent}>
        
        {/* Top Header Bar */}
        <header className={styles.mainHeader}>
          <div className={styles.headerLeft}>
            <button className={styles.hamburgerBtn} onClick={() => setIsSidebarOpen(prev => !prev)}>☰</button>
            <span className={styles.headerTitle}>
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'packages' && 'Packages Management'}
              {activeTab === 'flights' && 'Flight Page Settings'}
              {activeTab === 'enquiries' && 'Enquiries Management'}
              {activeTab === 'crm' && 'Chat CRM'}
              {activeTab === 'groupTours' && 'Group Tours Management'}
              {activeTab === 'groupTourPage' && 'Group Tours Page Settings'}
              {activeTab === 'groupTourEnquiries' && 'Group Tour Enquiries'}
              {activeTab === 'hotels' && (
                isCreatingHotel 
                  ? 'Add New Hotel' 
                  : selectedHotelId 
                    ? `Edit Hotel: ${selectedHotel?.name || ''}` 
                    : 'Hotels Management'
              )}
              {activeTab === 'destinations' && (
                isCreatingDest 
                  ? 'Add New Destination' 
                  : selectedDestId 
                    ? `Edit Destination: ${selectedDest?.name || ''}` 
                    : 'Destinations Management'
              )}
              {activeTab === 'bookings' && 'Bookings Management'}
              {activeTab === 'offers' && 'Offers Management'}
              {activeTab === 'settings' && 'System Settings'}
              {activeTab === 'facilities' && 'Amenities'}
            </span>
          </div>
          
          <div className={styles.headerRight}>
            {saveStatus && (
              <div style={{ padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-secondary-navy)', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem' }}>
                {saveStatus}
              </div>
            )}
            
            <button className={styles.bellBtn} type="button">
              🔔
              <span className={styles.bellBadge}>5</span>
            </button>
            
            <div className={styles.userProfile}>
              <div className={styles.avatar}>A</div>
              <span>Admin ▼</span>
            </div>
          </div>
        </header>

        {/* Content Body Container */}
        <main className={styles.contentWrapper}>
          
          {/* ==========================================
             DASHBOARD TAB OVERVIEW
             ========================================== */}
          {activeTab === 'dashboard' && (
            <div>
              <div className={styles.formCard}>
                <h3 className={styles.formCardTitle}>Welcome to Dyna Tours Admin Panel</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                  Use the left sidebar navigation to manage enquiries, hotels, and destinations modules.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  <div style={{ background: 'var(--color-secondary-navy-light)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Enquiries</div>
                    <div style={{ fontSize: '2rem', fontWeight: 850, color: 'var(--color-secondary-navy)' }}>{enquiries.length}</div>
                  </div>
                  <div style={{ background: 'var(--color-secondary-navy-light)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Destinations</div>
                    <div style={{ fontSize: '2rem', fontWeight: 850, color: 'var(--color-secondary-navy)' }}>{destinations.length}</div>
                  </div>
                  <div style={{ background: 'var(--color-secondary-navy-light)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Hotels</div>
                    <div style={{ fontSize: '2rem', fontWeight: 850, color: 'var(--color-secondary-navy)' }}>{hotels.length}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
             ENQUIRIES TAB (TABLE VIEW)
             ========================================== */}
          {activeTab === 'enquiries' && (
            <div className={styles.panelCard}>
              <h2 className={styles.panelTitle}>Customer Enquiry Submissions</h2>
              
              {enquiries.length > 0 ? (
                <div className={styles.tableContainer}>
                  <table className={styles.adminTable}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Target ID</th>
                        <th>Contact Info</th>
                        <th>Details</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.map((enq) => (
                        <tr key={enq.id}>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            {enq.created_at ? new Date(enq.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td>
                            <span className={`${styles.badge} ${enq.type === 'hotel' ? styles.badgeHotel : styles.badgeDestination}`}>
                              {enq.type === 'package' ? 'PACKAGE' : enq.type.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{enq.target_id}</td>
                          <td>
                            <div style={{ fontWeight: 750 }}>{enq.name}</div>
                            <div>✉ {enq.email}</div>
                            <div>📞 {enq.phone}</div>
                          </td>
                          <td>
                            {enq.type === 'flight' ? (
                              <div>
                                <div>🛫 Route: {enq.from} &rarr; {enq.to}</div>
                                <div>✈️ Type: {enq.trip_type} | Class: {enq.cabin_class}</div>
                                <div>📅 Dep: {enq.departure_date} {enq.return_date ? `| Ret: ${enq.return_date}` : ''}</div>
                                <div>🧑 Adults: {enq.num_adults} | Child: {enq.num_children} | Infants: {enq.num_infants}</div>
                                {enq.preferred_airline && <div>Airline: {enq.preferred_airline}</div>}
                              </div>
                            ) : enq.type === 'destination' || enq.type === 'package' ? (
                              <div>
                                <div>🧑 Peoples: {enq.num_people || 'N/A'}</div>
                                {enq.num_children !== undefined && enq.num_children > 0 && (
                                  <div>👶 Child: {enq.num_children} {enq.children_ages ? `(Ages: ${enq.children_ages})` : ''}</div>
                                )}
                                <div>📅 Date: {enq.travel_date || 'N/A'}</div>
                              </div>
                            ) : (
                              <div>
                                <div>📅 In: {enq.check_in}</div>
                                <div>📅 Out: {enq.check_out}</div>
                                <div>🧑 Adults: {enq.num_adults} | Child: {enq.num_children}</div>
                              </div>
                            )}
                          </td>
                          <td style={{ maxWidth: '350px', whiteSpace: 'pre-wrap' }}>{enq.message || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-secondary)', padding: '2rem 0', textAlign: 'center' }}>
                  No enquiries have been submitted yet.
                </p>
              )}
            </div>
          )}

          {activeTab === 'crm' && (
            <CrmAdmin />
          )}

          {/* ==========================================
             HOTELS MODULE (LIST & FORM DETAILS)
             ========================================== */}
          {activeTab === 'hotels' && (
            <div>
              {/* LIST VIEW (Image 1 Model) */}
              {!isCreatingHotel && !selectedHotelId && (
                <div className={styles.panelCard}>
                  <div className={styles.tableHeaderToolbar}>
                    <h3 className={styles.panelTitle} style={{ margin: 0 }}>Hotels Management</h3>
                    
                    <div className={styles.toolbarFilters}>
                      <div className={styles.searchWrapper}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                          type="text"
                          placeholder="Search hotel..."
                          className={`${styles.toolbarSearchInput}`}
                          value={hotelSearch}
                          onChange={(e) => setHotelSearch(e.target.value)}
                        />
                      </div>
                      
                      <select 
                        className={`searchSelect ${styles.toolbarSelect}`}
                        value={hotelLocationFilter}
                        onChange={(e) => setHotelLocationFilter(e.target.value)}
                      >
                        <option value="">All Locations</option>
                        {destinations.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>

                      <select 
                        className={`searchSelect ${styles.toolbarSelect}`}
                        value={hotelCategoryFilter}
                        onChange={(e) => setHotelCategoryFilter(e.target.value)}
                      >
                        <option value="">All Categories</option>
                        <option value="5-Star">5-Star</option>
                        <option value="4-Star">4-Star</option>
                        <option value="Boutique">Boutique</option>
                        <option value="Resort">Resort</option>
                      </select>

                      <select 
                        className={`searchSelect ${styles.toolbarSelect}`}
                        value={hotelStatusFilter}
                        onChange={(e) => setHotelStatusFilter(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>

                      <button type="button" className={styles.filterBtn}>
                        <span>🎛️</span> Filter
                      </button>
                    </div>

                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setIsCreatingHotel(true);
                        setNewHotel({
                          id: '', name: '', destination_id: destinations[0]?.id || '', short_description: '', about: '',
                          location: '', distance_from_attractions: '', category: '5-Star', price: 100,
                          offer_label: '', featured: false, show_rooms: true, show_offer_label: true,
                          show_price: true, order_no: null, status: 'Active', country: 'India', state: 'Kerala',
                          city: 'Munnar', inclusions: '', exclusions: '', terms_conditions: '',
                          gallery: [], facilities: [], related_hotels: [], rooms: [], video_url: ''
                        });
                      }}
                    >
                      + Add New Hotel
                    </button>
                  </div>

                  <div className={styles.tableContainer}>
                    <table className={styles.adminTable}>
                      <thead>
                        <tr>
                          <th>Sl No</th>
                          <th>Hotel Name</th>
                          <th>Location</th>
                          <th>Category</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hotels
                          .filter(hotel => {
                            const matchSearch = hotel.name.toLowerCase().includes(hotelSearch.toLowerCase()) || 
                              (hotel.location && hotel.location.toLowerCase().includes(hotelSearch.toLowerCase()));
                            const matchLocation = !hotelLocationFilter || hotel.destination_id === hotelLocationFilter;
                            const matchCategory = !hotelCategoryFilter || hotel.category === hotelCategoryFilter;
                            const matchStatus = !hotelStatusFilter || hotel.status === hotelStatusFilter;
                            return matchSearch && matchLocation && matchCategory && matchStatus;
                          })
                          .sort((a, b) => {
                            const orderA = a.order_no ?? Infinity;
                            const orderB = b.order_no ?? Infinity;
                            return orderA - orderB;
                          })
                          .map((hotel, idx) => (
                            <tr key={hotel.id}>
                              <td>{idx + 1}</td>
                              <td style={{ fontWeight: 700, color: 'var(--color-secondary-navy)' }}>{hotel.name}</td>
                              <td>{hotel.location || hotel.destination_id}</td>
                              <td>{hotel.category}</td>
                              <td>
                                <span className={`${styles.statusPill} ${hotel.status === 'Active' ? styles.statusActive : styles.statusDraft}`}>
                                  {hotel.status === 'Active' ? 'Active' : 'Draft'}
                                </span>
                              </td>
                              <td>
                                <a 
                                  href={`/hotels/${hotel.url_slug || hotel.id}`} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className={`${styles.tableActionBtn} ${styles.actionView}`}
                                >
                                  View
                                </a>
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    setSelectedHotelId(hotel.id);
                                    setIsCreatingHotel(false);
                                  }} 
                                  className={`${styles.tableActionBtn} ${styles.actionEdit}`}
                                >
                                  Edit
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => handleDeleteHotelDirect(hotel.id, hotel.name)} 
                                  className={`${styles.tableActionBtn} ${styles.actionDelete}`}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  <div className={styles.tableFooterRow}>
                    <span>Showing 1 to {hotels.length} of {hotels.length} entries</span>
                    <div className={styles.paginationWrapper}>
                      <button className={styles.paginationBtn}>Previous</button>
                      <button className={`${styles.paginationBtn} ${styles.paginationBtnActive}`}>1</button>
                      <button className={styles.paginationBtn}>Next</button>
                    </div>
                  </div>
                </div>
              )}

              {/* TWO COLUMN FORM BUILDER (Image 2 Model) */}
              {(isCreatingHotel || selectedHotelId) && (
                <>
                  <div className={styles.editorGrid}>
                    
                    {/* LEFT COLUMN: Main Form Elements (65%) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Hotel Details Card */}
                    <div className={styles.formCard}>
                      <h4 className={styles.formCardTitle}>Hotel Details</h4>
                      
                      <div className={styles.formRow}>
                        <div className="formGroup">
                          <label htmlFor="hotel_name">Hotel Name *</label>
                          <input
                            type="text"
                            name="name"
                            id="hotel_name"
                            required
                            placeholder="Enter hotel name"
                            value={isCreatingHotel ? newHotel.name : selectedHotel?.name || ''}
                            onChange={handleHotelTextChange}
                          />
                        </div>

                        <div className="formGroup">
                          <label htmlFor="hotel_slug">Hotel Slug / ID (Unique)*</label>
                          <input
                            type="text"
                            name="id"
                            id="hotel_slug"
                            required
                            placeholder="e.g. blanket-hotel-spa-munnar"
                            disabled={!isCreatingHotel}
                            value={isCreatingHotel ? newHotel.id : selectedHotel?.id || ''}
                            onChange={handleHotelTextChange}
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="formGroup">
                          <label htmlFor="country">Country *</label>
                          <select
                            name="country"
                            id="country"
                            value={isCreatingHotel ? newHotel.country || '' : selectedHotel?.country || ''}
                            onChange={handleHotelTextChange}
                          >
                            <option value="">Select country</option>
                            {Object.keys(COUNTRIES_DATA).map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        <div className="formGroup">
                          <label htmlFor="state">State / Country Name *</label>
                          <select
                            name="state"
                            id="state"
                            value={isCreatingHotel ? newHotel.state || '' : selectedHotel?.state || ''}
                            onChange={handleHotelTextChange}
                          >
                            <option value="">Select state</option>
                            {hotelStates.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        <div className="formGroup">
                          <label htmlFor="city">City (Optional)</label>
                          <select
                            name="city"
                            id="city"
                            value={isCreatingHotel ? newHotel.city || '' : selectedHotel?.city || ''}
                            onChange={handleHotelTextChange}
                          >
                            <option value="">Select city</option>
                            {hotelCities.map(ct => (
                              <option key={ct} value={ct}>{ct}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="formGroup" style={{ gridColumn: 'span 2' }}>
                          <label htmlFor="location">Location Address *</label>
                          <input
                            type="text"
                            name="location"
                            id="location"
                            placeholder="Enter location"
                            value={isCreatingHotel ? newHotel.location || '' : selectedHotel?.location || ''}
                            onChange={handleHotelTextChange}
                          />
                        </div>

                        <div className="formGroup">
                          <label htmlFor="distance_from_attractions">Distance</label>
                          <input
                            type="text"
                            name="distance_from_attractions"
                            id="distance_from_attractions"
                            placeholder="e.g. 5 km from Munnar Town"
                            value={isCreatingHotel ? newHotel.distance_from_attractions || '' : selectedHotel?.distance_from_attractions || ''}
                            onChange={handleHotelTextChange}
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="formGroup" style={{ gridColumn: 'span 2' }}>
                          <label htmlFor="video_url">Video Tour URL (YouTube / Vimeo / etc.)</label>
                          <input
                            type="text"
                            name="video_url"
                            id="video_url"
                            placeholder="e.g. https://www.youtube.com/watch?v=..."
                            value={isCreatingHotel ? newHotel.video_url || '' : selectedHotel?.video_url || ''}
                            onChange={handleHotelTextChange}
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="formGroup">
                          <label htmlFor="category">Category *</label>
                          <select
                            name="category"
                            id="category"
                            value={isCreatingHotel ? newHotel.category || '' : selectedHotel?.category || ''}
                            onChange={handleHotelTextChange}
                          >
                            <option value="" disabled>Select category...</option>
                            <option value="5-Star">5-Star</option>
                            <option value="4-Star">4-Star</option>
                            <option value="3-Star">3-Star</option>
                            <option value="Resort">Resort</option>
                            <option value="Boutique">Boutique</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Budget">Budget</option>
                          </select>
                        </div>

                        <div className="formGroup">
                          <label htmlFor="order_no">Order No</label>
                          <input
                            type="number"
                            name="order_no"
                            id="order_no"
                            placeholder="Enter display order number (serial position)"
                            value={isCreatingHotel ? (newHotel.order_no ?? '') : (selectedHotel?.order_no ?? '')}
                            onChange={handleHotelTextChange}
                          />
                        </div>

                        <div className="formGroup">
                          <label htmlFor="belongs_dest">Belongs to Destination*</label>
                          <select
                            name="destination_id"
                            id="belongs_dest"
                            value={isCreatingHotel ? newHotel.destination_id || '' : selectedHotel?.destination_id || ''}
                            onChange={handleHotelTextChange}
                          >
                            {destinations.map(d => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="formGroup">
                          <label htmlFor="price">Price Starting From *</label>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ padding: '0.75rem', background: '#f1f5f9', border: '1px solid var(--color-border)', borderRight: 'none', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', fontWeight: 700 }}>₹</span>
                            <input
                              type="number"
                              name="price"
                              id="price"
                              placeholder="Enter price"
                              style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
                              value={isCreatingHotel ? newHotel.price || '' : selectedHotel?.price || ''}
                              onChange={handleHotelTextChange}
                            />
                          </div>
                        </div>

                        <div className="formGroup" style={{ gridColumn: 'span 2' }}>
                          <label htmlFor="offer_label">Offer Label</label>
                          <input
                            type="text"
                            name="offer_label"
                            id="offer_label"
                            placeholder="e.g. Special 15% Off"
                            value={isCreatingHotel ? newHotel.offer_label || '' : selectedHotel?.offer_label || ''}
                            onChange={handleHotelTextChange}
                          />
                        </div>
                      </div>

                      <div className="formGroup">
                        <label htmlFor="short_description">Short Description *</label>
                        <textarea
                          name="short_description"
                          id="short_description"
                          rows={3}
                          maxLength={250}
                          placeholder="Enter short description about hotel"
                          value={isCreatingHotel ? newHotel.short_description || '' : selectedHotel?.short_description || ''}
                          onChange={handleHotelTextChange}
                        />
                        <span className={styles.seoLengthIndicator}>
                          {isCreatingHotel ? (newHotel.short_description || '').length : (selectedHotel?.short_description || '').length}/250 Characters
                        </span>
                      </div>

                      {/* Visibilities / Toggles inside details card */}
                      <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-secondary-navy)', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>Display Configurations</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <label className={styles.checklistItem}>
                            <input
                              type="checkbox"
                              checked={isCreatingHotel ? newHotel.featured : selectedHotel?.featured || false}
                              onChange={() => handleHotelToggle('featured')}
                            />
                            <span>Featured Hotel Option</span>
                          </label>
                          <label className={styles.checklistItem}>
                            <input
                              type="checkbox"
                              checked={isCreatingHotel ? newHotel.show_rooms : selectedHotel?.show_rooms || false}
                              onChange={() => handleHotelToggle('show_rooms')}
                            />
                            <span>Show Room Categories</span>
                          </label>
                          <label className={styles.checklistItem}>
                            <input
                              type="checkbox"
                              checked={isCreatingHotel ? newHotel.show_price : selectedHotel?.show_price || false}
                              onChange={() => handleHotelToggle('show_price')}
                            />
                            <span>Show Price</span>
                          </label>
                          <label className={styles.checklistItem}>
                            <input
                              type="checkbox"
                              checked={isCreatingHotel ? newHotel.show_offer_label : selectedHotel?.show_offer_label || false}
                              onChange={() => handleHotelToggle('show_offer_label')}
                            />
                            <span>Show Offer Label</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* About Hotel / Description Card */}
                    <div className={styles.formCard}>
                      <h4 className={styles.formCardTitle}>About Hotel / Description *</h4>
                      <RichTextEditor
                        id="hotel_about"
                        label=""
                        value={isCreatingHotel ? newHotel.about || '' : selectedHotel?.about || ''}
                        placeholder="Write about the hotel, its highlights, experience, nearby places etc."
                        onChange={(val) => {
                          if (isCreatingHotel) {
                            setNewHotel(prev => ({ ...prev, about: val }));
                          } else {
                            setSelectedHotel(prev => prev ? { ...prev, about: val } : null);
                          }
                        }}
                      />
                    </div>

                  </div>

                  {/* RIGHT COLUMN: Media, SEO & Publish Blocks (35%) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Images Upload Card */}
                    <div className={styles.formCard}>
                      <h4 className={styles.formCardTitle}>Images</h4>
                      
                      {/* Featured Image Block */}
                      <div className={styles.imageUploadCard}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-secondary-navy)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Featured Image *</label>
                        <img 
                          src={getFeaturedImage(isCreatingHotel ? newHotel.gallery : selectedHotel?.gallery) || '/images/default_hotel.png'} 
                          alt="Featured Preview" 
                          className={styles.imageCardPreview}
                        />
                        <div className={styles.imageCardControls}>
                          <label className={styles.btnUploadFile}>
                            📤 Upload Featured Image
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: 'none' }}
                              onChange={(e) => handleLocalImageUploadForSection(e, 'featured')}
                            />
                          </label>
                          <input 
                            type="text" 
                            placeholder="Featured Image Alt Text"
                            defaultValue="Featured Hotel View"
                            className="formInput"
                            style={{ padding: '0.5rem', fontSize: '0.8rem', marginBottom: 0 }}
                          />
                        </div>
                      </div>

                      {/* Banner Image Block */}
                      <div className={styles.imageUploadCard}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-secondary-navy)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Banner Image *</label>
                        <img 
                          src={getBannerImage(isCreatingHotel ? newHotel.gallery : selectedHotel?.gallery) || '/images/default_hotel.png'} 
                          alt="Banner Preview" 
                          className={styles.imageCardPreview}
                          style={{ height: '80px' }}
                        />
                        <div className={styles.imageCardControls}>
                          <label className={styles.btnUploadFile}>
                            📤 Upload Banner Image
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: 'none' }}
                              onChange={(e) => handleLocalImageUploadForSection(e, 'banner')}
                            />
                          </label>
                          <input 
                            type="text" 
                            placeholder="Banner Image Alt Text"
                            defaultValue="Hotel Banner View"
                            className="formInput"
                            style={{ padding: '0.5rem', fontSize: '0.8rem', marginBottom: 0 }}
                          />
                        </div>
                      </div>

                      {/* Gallery Images Block */}
                      <div className={styles.imageUploadCard}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-secondary-navy)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Gallery Images</label>
                        <div className={styles.imageGridThumbnails}>
                          {getGalleryImagesOnly(isCreatingHotel ? newHotel.gallery : selectedHotel?.gallery).map((img, idx) => {
                            const url = typeof img === 'string' ? img : img.url;
                            return (
                              <div key={idx} className={styles.thumbWrapper}>
                                <img src={url} alt={`Gallery ${idx}`} className={styles.thumbImg} />
                                <button 
                                  type="button" 
                                  className={styles.thumbRemoveBtn}
                                  onClick={() => handleRemoveGalleryImage(url)}
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        <label className={styles.btnUploadFile} style={{ width: '100%' }}>
                          ➕ Add More Gallery Images
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }}
                            onChange={(e) => handleLocalImageUploadForSection(e, 'gallery')}
                          />
                        </label>
                      </div>

                    </div>

                    {/* SEO Settings Card */}
                    <div className={styles.formCard}>
                      <h4 className={styles.formCardTitle}>SEO Settings</h4>
                      
                      <div className="formGroup">
                        <label htmlFor="meta_title">Meta Title *</label>
                        <input
                          type="text"
                          name="meta_title"
                          id="meta_title"
                          placeholder="Enter meta title"
                          value={isCreatingHotel ? newHotel.meta_title || '' : selectedHotel?.meta_title || ''}
                          onChange={handleHotelTextChange}
                        />
                        <span className={styles.seoLengthIndicator}>
                          {isCreatingHotel ? (newHotel.meta_title || '').length : (selectedHotel?.meta_title || '').length}/60
                        </span>
                      </div>

                      <div className="formGroup">
                        <label htmlFor="meta_description">Meta Description *</label>
                        <textarea
                          name="meta_description"
                          id="meta_description"
                          rows={3}
                          placeholder="Enter meta description"
                          value={isCreatingHotel ? newHotel.meta_description || '' : selectedHotel?.meta_description || ''}
                          onChange={handleHotelTextChange}
                        />
                        <span className={styles.seoLengthIndicator}>
                          {isCreatingHotel ? (newHotel.meta_description || '').length : (selectedHotel?.meta_description || '').length}/160
                        </span>
                      </div>

                      <div className="formGroup">
                        <label htmlFor="url_slug">URL Slug *</label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ padding: '0.75rem', background: '#f1f5f9', border: '1px solid var(--color-border)', borderRight: 'none', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>/hotels/</span>
                          <input
                            type="text"
                            name="url_slug"
                            id="url_slug"
                            placeholder="enter-url-slug"
                            style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
                            value={isCreatingHotel ? newHotel.url_slug || '' : selectedHotel?.url_slug || ''}
                            onChange={handleHotelTextChange}
                          />
                        </div>
                      </div>

                      <div className="formGroup">
                        <label htmlFor="canonical_url">Canonical URL</label>
                        <input
                          type="text"
                          name="canonical_url"
                          id="canonical_url"
                          placeholder="https://www.example.com/hotels/slug"
                          value={isCreatingHotel ? newHotel.canonical_url || '' : selectedHotel?.canonical_url || ''}
                          onChange={handleHotelTextChange}
                        />
                      </div>
                    </div>



                  </div>

                </div>

                {/* Full Width Policy Editors */}
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Amenities Card */}
                  <div className={styles.formCard}>
                    <h4 className={styles.formCardTitle}>Amenities</h4>
                    
                    <div className={styles.formRow}>
                      <div className="formGroup">
                        <label>Section Headline</label>
                        <input 
                          type="text" 
                          placeholder="Hotel Provides Following Amenities" 
                          defaultValue="Hotel Provides Following Amenities"
                          disabled
                        />
                      </div>
                      <div className="formGroup" style={{ gridColumn: 'span 2' }}>
                        <label>Description</label>
                        <input 
                          type="text" 
                          placeholder="Guests can enjoy modern amenities and comfortable services during their stay." 
                          defaultValue="Guests can enjoy modern amenities and comfortable services during their stay."
                          disabled
                        />
                      </div>
                    </div>

                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-secondary-navy)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Select Amenities *</label>
                    <div className={styles.tagChecklist} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                      {facilities.map((facility) => {
                        const currentFacilities = isCreatingHotel ? newHotel.facilities || [] : selectedHotel?.facilities || [];
                        const currentIds = currentFacilities.map(f => typeof f === 'object' && f !== null ? f.id : f) as number[];
                        const isChecked = currentIds.includes(facility.id);
                        return (
                          <label key={facility.id} className={styles.checklistItem} style={{ padding: '4px 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                let updated: any[];
                                if (isChecked) {
                                  updated = currentFacilities.filter(f => (typeof f === 'object' && f !== null ? f.id : f) !== facility.id);
                                } else {
                                  updated = [...currentFacilities, facility];
                                }
                                if (isCreatingHotel) {
                                  setNewHotel(prev => ({ ...prev, facilities: updated }));
                                } else {
                                  setSelectedHotel(prev => prev ? { ...prev, facilities: updated } : null);
                                }
                              }}
                            />
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                              <AmenityIcon name={facility.icon} size={16} />
                              <span style={{ fontSize: '0.85rem' }}>{facility.name}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Room categories & Pricing card */}
                  <div className={styles.formCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-secondary-navy)', margin: 0 }}>Room Categories & Pricing Management</h4>
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm"
                        onClick={openAddRoomModal}
                      >
                        + Add Room Category
                      </button>
                    </div>
                    
                    <div className={styles.roomList}>
                      {(isCreatingHotel ? newHotel.rooms || [] : selectedHotel?.rooms || []).map((room, index) => (
                        <div key={index} className={styles.roomRowCard}>
                          <div className={styles.roomRowInfo}>
                            <img 
                              src={room.image || (room.images && room.images[0]) || '/images/default_hotel.png'} 
                              alt={room.type} 
                              className={styles.roomRowImg} 
                            />
                            <div className={styles.roomRowText}>
                              <span className={styles.roomRowName}>{room.type}</span>
                              <span className={styles.roomRowDetails}>
                                Occupancy: {room.occupancy} | Price: {room.price ? `₹${room.price}/night` : 'Contact for Rates'}
                              </span>
                            </div>
                          </div>
                          <div className={styles.roomRowActions}>
                            <button
                              type="button"
                              className="btn btn-outline btn-xs"
                              onClick={() => openEditRoomModal(index)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline btn-xs"
                              style={{ borderColor: 'var(--color-primary-red)', color: 'var(--color-primary-red)' }}
                              onClick={() => deleteRoomCategory(index)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                      {(isCreatingHotel ? !newHotel.rooms || newHotel.rooms.length === 0 : !selectedHotel?.rooms || selectedHotel.rooms.length === 0) && (
                        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '1rem 0', fontStyle: 'italic', fontSize: '0.9rem' }}>
                          No room categories defined. Click "+ Add Room Category" to build room types.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Related Hotels card */}
                  <div className={styles.formCard}>
                    <h4 className={styles.formCardTitle}>Related Hotels Mapping</h4>
                    <input
                      type="text"
                      placeholder="Search other hotels by name or address keyword..."
                      className={styles.searchBar}
                      value={hotelSearchQuery}
                      onChange={(e) => setHotelSearchQuery(e.target.value)}
                    />
                    <div className={styles.checklistGrid}>
                      {filteredHotels.map(h => {
                        const isChecked = isCreatingHotel
                          ? (newHotel.related_hotels || []).includes(h.id)
                          : (selectedHotel?.related_hotels || []).includes(h.id);
                        return (
                          <label key={h.id} className={styles.checklistItem}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleHotelRelatedToggle(h.id)}
                            />
                            <span>{h.name} ({h.location.split(',')[1]?.trim() || h.destination_id})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inclusion Card */}
                  <div className={styles.formCard}>
                    <h4 className={styles.formCardTitle}>Inclusion</h4>
                    <RichTextEditor
                      id="hotel_inclusions"
                      label=""
                      value={isCreatingHotel ? newHotel.inclusions || '' : selectedHotel?.inclusions || ''}
                      placeholder="Package Includes"
                      onChange={(val) => {
                        if (isCreatingHotel) {
                          setNewHotel(prev => ({ ...prev, inclusions: val }));
                        } else {
                          setSelectedHotel(prev => prev ? { ...prev, inclusions: val } : null);
                        }
                      }}
                    />
                  </div>

                  {/* Exclusion Card */}
                  <div className={styles.formCard}>
                    <h4 className={styles.formCardTitle}>Exclusion</h4>
                    <RichTextEditor
                      id="hotel_exclusions"
                      label=""
                      value={isCreatingHotel ? newHotel.exclusions || '' : selectedHotel?.exclusions || ''}
                      placeholder="Package Excludes"
                      onChange={(val) => {
                        if (isCreatingHotel) {
                          setNewHotel(prev => ({ ...prev, exclusions: val }));
                        } else {
                          setSelectedHotel(prev => prev ? { ...prev, exclusions: val } : null);
                        }
                      }}
                    />
                  </div>

                  {/* Terms & Conditions Card */}
                  <div className={styles.formCard}>
                    <h4 className={styles.formCardTitle}>Terms & Conditions</h4>
                    <RichTextEditor
                      id="hotel_terms"
                      label=""
                      value={isCreatingHotel ? newHotel.terms_conditions || '' : selectedHotel?.terms_conditions || ''}
                      placeholder="Terms & Conditions"
                      onChange={(val) => {
                        if (isCreatingHotel) {
                          setNewHotel(prev => ({ ...prev, terms_conditions: val }));
                        } else {
                          setSelectedHotel(prev => prev ? { ...prev, terms_conditions: val } : null);
                        }
                      }}
                    />
                  </div>
                </div>
                
                {/* Global Action Buttons */}
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button 
                    type="button" 
                    className="btn" 
                    style={{ background: '#64748b', color: '#ffffff', minWidth: '120px' }}
                    onClick={() => {
                      setIsCreatingHotel(false);
                      setSelectedHotelId('');
                      setSelectedHotel(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    style={{ minWidth: '150px' }}
                    onClick={saveHotelSettings}
                  >
                    {isCreatingHotel ? 'Submit' : 'Update'}
                  </button>
                </div>
                </>
              )}
            </div>
          )}

          {/* ==========================================
             DESTINATIONS MODULE (LIST & FORM DETAILS)
             ========================================== */}
          {activeTab === 'destinations' && (
            <div>
              {/* LIST VIEW (Image 1 Model for Destinations) */}
              {!isCreatingDest && !selectedDestId && (
                <div className={styles.panelCard}>
                  <div className={styles.tableHeaderToolbar}>
                    <h3 className={styles.panelTitle} style={{ margin: 0 }}>Destinations Management</h3>
                    
                    <div className={styles.toolbarFilters}>
                      <div className={styles.searchWrapper}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                          type="text"
                          placeholder="Search destination..."
                          className={styles.toolbarSearchInput}
                          value={destSearch}
                          onChange={(e) => setDestSearch(e.target.value)}
                        />
                      </div>
                      
                      <select 
                        className={`searchSelect ${styles.toolbarSelect}`}
                        value={destTypeFilter}
                        onChange={(e) => setDestTypeFilter(e.target.value)}
                      >
                        <option value="">All Types</option>
                        <option value="domestic">Domestic</option>
                        <option value="international">International</option>
                      </select>

                      <button type="button" className={styles.filterBtn}>
                        <span>🎛️</span> Filter
                      </button>
                    </div>

                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setIsCreatingDest(true);
                        setNewDest({
                          id: '', name: '', type: 'domestic', parent_id: null, overview: '',
                          show_packages: true, show_hotels: true, country: 'India', state: 'Kerala', city: '',
                          meta_title: '', meta_description: '', url_slug: '', canonical_url: '',
                          gallery: [], top_attractions: [], related_tours: []
                        });
                      }}
                    >
                      + Add Destination
                    </button>
                  </div>

                  <div className={styles.tableContainer}>
                    <table className={styles.adminTable}>
                      <thead>
                        <tr>
                          <th>Sl No</th>
                          <th>Destination Name</th>
                          <th>Type</th>
                          <th>Country</th>
                          <th>State</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {destinations
                          .filter(dest => {
                            const matchSearch = dest.name.toLowerCase().includes(destSearch.toLowerCase()) || 
                              (dest.country && dest.country.toLowerCase().includes(destSearch.toLowerCase()));
                            const matchType = !destTypeFilter || dest.type === destTypeFilter;
                            return matchSearch && matchType;
                          })
                          .map((dest, idx) => (
                            <tr key={dest.id}>
                              <td>{idx + 1}</td>
                              <td style={{ fontWeight: 700, color: 'var(--color-secondary-navy)' }}>{dest.name}</td>
                              <td>
                                <span className={`${styles.badge} ${dest.type === 'international' ? styles.badgeHotel : styles.badgeDestination}`}>
                                  {dest.type}
                                </span>
                              </td>
                              <td>{dest.country || 'India'}</td>
                              <td>{dest.state || '—'}</td>
                              <td>
                                <a 
                                  href={`/destinations/${dest.url_slug || dest.id}`} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className={`${styles.tableActionBtn} ${styles.actionView}`}
                                >
                                  View
                                </a>
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    setSelectedDestId(dest.id);
                                    setIsCreatingDest(false);
                                  }} 
                                  className={`${styles.tableActionBtn} ${styles.actionEdit}`}
                                >
                                  Edit
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => handleDeleteDestDirect(dest.id, dest.name)} 
                                  className={`${styles.tableActionBtn} ${styles.actionDelete}`}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  <div className={styles.tableFooterRow}>
                    <span>Showing 1 to {destinations.length} of {destinations.length} entries</span>
                    <div className={styles.paginationWrapper}>
                      <button className={styles.paginationBtn}>Previous</button>
                      <button className={`${styles.paginationBtn} ${styles.paginationBtnActive}`}>1</button>
                      <button className={styles.paginationBtn}>Next</button>
                    </div>
                  </div>
                </div>
              )}

              {/* FORM BUILDER (Two Column Model for Destinations) */}
              {(isCreatingDest || selectedDestId) && (
                <>
                <div className={styles.editorGrid}>
                  
                  {/* LEFT COLUMN: Main specifications (65%) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Destination Details Card */}
                    <div className={styles.formCard}>
                      <h4 className={styles.formCardTitle}>Destination Details</h4>
                      
                      <div className={styles.formRow}>
                        <div className="formGroup">
                          <label htmlFor="dest_name">Destination Name *</label>
                          <input
                            type="text"
                            name="name"
                            id="dest_name"
                            required
                            placeholder="e.g. Kerala, Thailand"
                            value={isCreatingDest ? newDest.name : selectedDest?.name || ''}
                            onChange={handleDestTextChange}
                          />
                        </div>

                        <div className="formGroup">
                          <label htmlFor="dest_slug">Destination ID / Slug (Unique)*</label>
                          <input
                            type="text"
                            name="id"
                            id="dest_slug"
                            required
                            placeholder="e.g. kerala, phuket"
                            disabled={!isCreatingDest}
                            value={isCreatingDest ? newDest.id : selectedDest?.id || ''}
                            onChange={handleDestTextChange}
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="formGroup">
                          <label htmlFor="type">Category Type *</label>
                          <select
                            name="type"
                            id="type"
                            value={isCreatingDest ? newDest.type : selectedDest?.type || 'domestic'}
                            onChange={handleDestTextChange}
                          >
                            <option value="domestic">Domestic</option>
                            <option value="international">International</option>
                          </select>
                        </div>

                        <div className="formGroup">
                          <label htmlFor="parent_id">Parent Destination (Optional)</label>
                          <select
                            name="parent_id"
                            id="parent_id"
                            value={isCreatingDest ? (newDest.parent_id || '') : (selectedDest?.parent_id || '')}
                            onChange={handleDestTextChange}
                          >
                            <option value="">-- None (Self-Referenced Parent) --</option>
                            {destinations
                              .filter(d => d.id !== (isCreatingDest ? '' : selectedDestId) && d.parent_id === null)
                              .map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                              ))}
                          </select>
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="formGroup">
                          <label htmlFor="order_no">Order No</label>
                          <input
                            type="number"
                            name="order_no"
                            id="order_no"
                            placeholder="e.g. 1"
                            value={isCreatingDest ? (newDest.order_no ?? '') : (selectedDest?.order_no ?? '')}
                            onChange={handleDestTextChange}
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <div className="formGroup">
                          <label htmlFor="country">Country</label>
                          <select
                            name="country"
                            id="country"
                            value={isCreatingDest ? newDest.country || '' : selectedDest?.country || ''}
                            onChange={handleDestTextChange}
                          >
                            <option value="">-- Select Country --</option>
                            {Object.keys(COUNTRIES_DATA).map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        <div className="formGroup">
                          <label htmlFor="state">State / Province</label>
                          <select
                            name="state"
                            id="state"
                            value={isCreatingDest ? newDest.state || '' : selectedDest?.state || ''}
                            onChange={handleDestTextChange}
                          >
                            <option value="">-- Select State --</option>
                            {destStates.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>

                        <div className="formGroup">
                          <label htmlFor="city">City (Optional)</label>
                          <select
                            name="city"
                            id="city"
                            value={isCreatingDest ? newDest.city || '' : selectedDest?.city || ''}
                            onChange={handleDestTextChange}
                          >
                            <option value="">-- Select City --</option>
                            {destCities.map(ct => (
                              <option key={ct} value={ct}>{ct}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Visibilities / Toggles inside card */}
                      <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <label className={styles.checklistItem}>
                            <input
                              type="checkbox"
                              checked={isCreatingDest ? newDest.show_packages : selectedDest?.show_packages || false}
                              onChange={() => handleDestToggle('show_packages')}
                            />
                            <span>Display Tour Packages</span>
                          </label>
                          <label className={styles.checklistItem}>
                            <input
                              type="checkbox"
                              checked={isCreatingDest ? newDest.show_hotels : selectedDest?.show_hotels || false}
                              onChange={() => handleDestToggle('show_hotels')}
                            />
                            <span>Display Hotels Near Destination</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* About Destination Overview Description Card */}
                    <div className={styles.formCard}>
                      <h4 className={styles.formCardTitle}>Destination Overview Description</h4>
                      <RichTextEditor
                        id="dest_overview"
                        label=""
                        value={isCreatingDest ? newDest.overview || '' : selectedDest?.overview || ''}
                        placeholder="Write detailed overview description for this destination..."
                        onChange={(val) => {
                          if (isCreatingDest) {
                            setNewDest(prev => ({ ...prev, overview: val }));
                          } else {
                            setSelectedDest(prev => prev ? { ...prev, overview: val } : null);
                          }
                        }}
                      />
                    </div>

                  </div>

                  {/* RIGHT COLUMN: Media & SEO (35%) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Images Card */}
                    <div className={styles.formCard}>
                      <h4 className={styles.formCardTitle}>Images</h4>
                      
                      {/* Banner Image Block */}
                      <div className={styles.imageUploadCard}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-secondary-navy)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Banner Image *</label>
                        <img 
                          src={isCreatingDest ? newDest.banner_image || '/images/default_hotel.png' : selectedDest?.banner_image || '/images/default_hotel.png'} 
                          alt="Banner Preview" 
                          className={styles.imageCardPreview}
                        />
                        <div className={styles.imageCardControls}>
                          <label className={styles.btnUploadFile}>
                            📤 Upload Banner Image
                            <input 
                              type="file" 
                              accept="image/*" 
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  if (event.target?.result) {
                                    const base64 = event.target.result as string;
                                    if (isCreatingDest) {
                                      setNewDest(prev => ({ ...prev, banner_image: base64 }));
                                    } else {
                                      setSelectedDest(prev => prev ? { ...prev, banner_image: base64 } : null);
                                    }
                                  }
                                };
                                reader.readAsDataURL(file);
                                e.target.value = '';
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Destination Image Gallery */}
                      <div className={styles.imageUploadCard}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-secondary-navy)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Gallery Images</label>
                        <ImageTabularManager
                          images={(isCreatingDest ? newDest.gallery || [] : selectedDest?.gallery || []) as any}
                          onChange={handleDestGalleryChange}
                        />
                      </div>
                    </div>



                  </div>

                </div>

                {/* FULL WIDTH SECTIONS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                    {/* How to Reach Details Card */}
                    <div className={styles.formCard}>
                      <h4 className={styles.formCardTitle}>How to Reach Details</h4>
                      <RichTextEditor
                        id="dest_how_to_reach"
                        label=""
                        value={isCreatingDest ? newDest.how_to_reach || '' : selectedDest?.how_to_reach || ''}
                        placeholder="Explain travel methods (air, rail, road)..."
                        onChange={(val) => {
                          if (isCreatingDest) {
                            setNewDest(prev => ({ ...prev, how_to_reach: val }));
                          } else {
                            setSelectedDest(prev => prev ? { ...prev, how_to_reach: val } : null);
                          }
                        }}
                      />
                    </div>

                    {/* Best Time to Visit Details Card */}
                    <div className={styles.formCard}>
                      <h4 className={styles.formCardTitle}>Best Time to Visit Details</h4>
                      <RichTextEditor
                        id="dest_best_time"
                        label=""
                        value={isCreatingDest ? newDest.best_time_to_visit || '' : selectedDest?.best_time_to_visit || ''}
                        placeholder="Explain seasons and weather patterns..."
                        onChange={(val) => {
                          if (isCreatingDest) {
                            setNewDest(prev => ({ ...prev, best_time_to_visit: val }));
                          } else {
                            setSelectedDest(prev => prev ? { ...prev, best_time_to_visit: val } : null);
                          }
                        }}
                      />
                    </div>

                    {/* Related Tour Packages mapping */}
                    <div className={styles.formCard}>
                      <h4 className={styles.formCardTitle}>Related Tour Packages Mapping</h4>
                      <input
                        type="text"
                        placeholder="Search tour packages by title or country..."
                        className={styles.searchBar}
                        value={tourSearchQuery}
                        onChange={(e) => setTourSearchQuery(e.target.value)}
                      />
                      <div className={styles.checklistGrid}>
                        {filteredTours.map(tour => {
                          const isChecked = isCreatingDest
                            ? (newDest.related_tours || []).includes(tour.id)
                            : (selectedDest?.related_tours || []).includes(tour.id);
                          return (
                            <label key={tour.id} className={styles.checklistItem}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleDestRelatedTourToggle(tour.id)}
                              />
                              <span>{tour.title}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* SEO Settings Card */}
                    <div className={styles.formCard}>
                      <h4 className={styles.formCardTitle}>SEO & URL Management</h4>
                      
                      <div className="formGroup">
                        <label htmlFor="meta_title">Meta Title *</label>
                        <input
                          type="text"
                          name="meta_title"
                          id="meta_title"
                          placeholder="Page title for search engines"
                          value={isCreatingDest ? newDest.meta_title || '' : selectedDest?.meta_title || ''}
                          onChange={handleDestTextChange}
                        />
                      </div>

                      <div className="formGroup">
                        <label htmlFor="meta_description">Meta Description *</label>
                        <textarea
                          name="meta_description"
                          id="meta_description"
                          rows={3}
                          placeholder="Short snippet for Google (under 160 characters)"
                          value={isCreatingDest ? newDest.meta_description || '' : selectedDest?.meta_description || ''}
                          onChange={handleDestTextChange}
                        />
                      </div>

                      <div className="formGroup">
                        <label htmlFor="url_slug">Custom URL Slug *</label>
                        <input
                          type="text"
                          name="url_slug"
                          id="url_slug"
                          placeholder="e.g. kerala"
                          value={isCreatingDest ? newDest.url_slug || '' : selectedDest?.url_slug || ''}
                          onChange={handleDestTextChange}
                        />
                      </div>

                      <div className="formGroup">
                        <label htmlFor="canonical_url">Canonical URL</label>
                        <input
                          type="text"
                          name="canonical_url"
                          id="canonical_url"
                          placeholder="e.g. https://dynatours.com/destinations/kerala"
                          value={isCreatingDest ? newDest.canonical_url || '' : selectedDest?.canonical_url || ''}
                          onChange={handleDestTextChange}
                        />
                      </div>
                    </div>
                </div>

                {/* Global Action Buttons */}
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button 
                    type="button" 
                    className="btn" 
                    style={{ background: '#64748b', color: '#ffffff', minWidth: '120px' }}
                    onClick={() => {
                      setIsCreatingDest(false);
                      setSelectedDestId('');
                      setSelectedDest(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    style={{ minWidth: '150px' }}
                    onClick={saveDestinationSettings}
                  >
                    {isCreatingDest ? 'Submit' : 'Update'}
                  </button>
                </div>
                </>
              )}
            </div>
          )}

          {/* ==========================================
             AMENITIES CRUD MANAGER
             ========================================== */}
          {activeTab === 'facilities' && (
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-premium)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ color: 'var(--color-secondary-navy)', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Amenities Manager</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>Manage stay amenities, matching icons, and hover descriptions.</p>
                </div>
                {!isCreatingFacility && (
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => {
                      setEditingFacilityId(null);
                      setFacilityForm({ name: '', icon: 'wifi', description: '' });
                      setIsCreatingFacility(true);
                    }}
                  >
                    + Add New Amenity
                  </button>
                )}
              </div>

              {isCreatingFacility ? (
                <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-secondary-navy)', marginBottom: '1.5rem' }}>
                    {editingFacilityId === null ? 'Add New Amenity' : 'Edit Amenity Details'}
                  </h4>
                  <form onSubmit={handleFacilitySave}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <div className="formGroup">
                        <label>Amenity Name*</label>
                        <input
                          type="text"
                          placeholder="e.g. EV Charger, Spa"
                          className="formInput"
                          required
                          value={facilityForm.name || ''}
                          onChange={(e) => setFacilityForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="formGroup">
                        <label>Select Icon*</label>
                        <select
                          className="searchSelect"
                          style={{ width: '100%', height: '44px' }}
                          value={facilityForm.icon || 'wifi'}
                          onChange={(e) => setFacilityForm(prev => ({ ...prev, icon: e.target.value }))}
                        >
                          <option value="wifi">Wifi</option>
                          <option value="breakfast">Breakfast</option>
                          <option value="pool">Pool / Swimming Pool</option>
                          <option value="gym">Gym / Fitness</option>
                          <option value="spa">Spa / Wellness</option>
                          <option value="restaurant">Restaurant / Dining</option>
                          <option value="bar">Bar / Lounge</option>
                          <option value="indoor games">Indoor Games</option>
                          <option value="activity">Activity / Compass</option>
                          <option value="airport transport">Airport Transport / Car</option>
                          <option value="sight seeing">Sightseeing / Camera</option>
                        </select>
                      </div>
                    </div>
                    <div className="formGroup" style={{ marginBottom: '1.5rem' }}>
                      <label>Description (Hover Tooltip text)</label>
                      <textarea
                        placeholder="Provide a brief description of what this amenity offers to guest stay..."
                        className="formInput"
                        rows={3}
                        value={facilityForm.description || ''}
                        onChange={(e) => setFacilityForm(prev => ({ ...prev, description: e.target.value }))}
                      ></textarea>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button type="submit" className="btn btn-primary">Save Amenity</button>
                      <button 
                        type="button" 
                        className="btn btn-outline"
                        onClick={() => {
                          setIsCreatingFacility(false);
                          setEditingFacilityId(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                {facilities.map((fac) => (
                  <div 
                    key={fac.id} 
                    style={{ 
                      border: '1px solid var(--color-border)', 
                      borderRadius: 'var(--radius-md)', 
                      padding: '1.25rem', 
                      background: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        background: 'var(--color-secondary-navy-light)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'var(--color-primary-red)'
                      }}>
                        <AmenityIcon name={fac.icon} size={18} />
                      </div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--color-secondary-navy)' }}>{fac.name}</strong>
                    </div>
                    {fac.description ? (
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 1.25rem 0', flexGrow: 1, lineHeight: '1.4' }}>
                        {fac.description}
                      </p>
                    ) : (
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic', margin: '0 0 1.25rem 0', flexGrow: 1 }}>
                        No description provided.
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm"
                        style={{ flexGrow: 1, padding: '4px 8px', fontSize: '0.75rem' }}
                        onClick={() => handleFacilityEdit(fac)}
                      >
                        Edit
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline btn-sm"
                        style={{ flexGrow: 1, padding: '4px 8px', fontSize: '0.75rem', color: 'var(--color-primary-red)', borderColor: 'var(--color-primary-red)' }}
                        onClick={() => handleFacilityDelete(fac.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==========================================
             PACKAGES MODULE (LIST & FORM DETAILS)
             ========================================== */}
          {activeTab === 'packages' && (
            <PackagesAdmin />
          )}

          {activeTab === 'visas' && (
            <VisasAdmin />
          )}

          {activeTab === 'flights' && (
            <FlightsAdmin />
          )}

          {/* ==========================================
             PLACEHOLDER MODULES (BOOKINGS, OFFERS, SETTINGS)
             ========================================== */}
          {(activeTab === 'bookings' || activeTab === 'offers' || activeTab === 'settings') && (
            <div className={styles.formCard} style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏗️</span>
              <h3 className={styles.formCardTitle} style={{ borderBottom: 'none', paddingBottom: 0, textTransform: 'capitalize' }}>
                {activeTab} Management Module
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px' }}>
                This section is currently under development. The sidebar layout, hotel and destination lists, and details forms have been successfully updated to the new mockup layout model.
              </p>
            </div>
          )}

          {activeTab === 'groupTours' && <GroupToursAdmin />}
          {activeTab === 'groupTourPage' && <GroupTourPageAdmin />}
          {activeTab === 'groupTourEnquiries' && <GroupTourEnquiriesAdmin />}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* ROOM CATEGORY BUILDER MODAL (Overlay) */}
      {/* ========================================================================= */}
      {isRoomModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingRoomIndex === null ? 'Add Room Category' : `Editing Room Type: ${roomForm.type}`}
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsRoomModalOpen(false)}>×</button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.formRow}>
                <div className="formGroup">
                  <label>Room Category Name*</label>
                  <input
                    type="text"
                    placeholder="e.g. Deluxe Suite, Premium Garden Room"
                    className="formInput"
                    value={roomForm.type || ''}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, type: e.target.value }))}
                  />
                </div>

                <div className="formGroup">
                  <label>Room Price ($ per night, optional)</label>
                  <input
                    type="number"
                    placeholder="e.g. 240"
                    className="formInput"
                    value={roomForm.price || ''}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, price: e.target.value ? Number(e.target.value) : undefined }))}
                  />
                </div>

                <div className="formGroup">
                  <label>Remaining Rooms</label>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    className="formInput"
                    value={roomForm.remaining_rooms || ''}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, remaining_rooms: e.target.value ? Number(e.target.value) : undefined }))}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className="formGroup">
                  <label>Max Occupancy*</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Adults"
                    className="formInput"
                    value={roomForm.occupancy || ''}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, occupancy: e.target.value }))}
                  />
                </div>

                <div className="formGroup">
                  <label>Dimensions / Size (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 380 sq.ft"
                    className="formInput"
                    value={roomForm.size || ''}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, size: e.target.value }))}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className="formGroup">
                  <label>View Description (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Valley View"
                    className="formInput"
                    value={roomForm.view || ''}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, view: e.target.value }))}
                  />
                </div>

                <div className="formGroup">
                  <label>Bed Configuration (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. King Size Double Bed"
                    className="formInput"
                    value={roomForm.bed_type || ''}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, bed_type: e.target.value }))}
                  />
                </div>
              </div>

              <div className="formGroup">
                <label>Breakfast Option</label>
                <select
                  className="searchSelect"
                  style={{ width: '100%' }}
                  value={roomForm.breakfast || 'Included'}
                  onChange={(e) => setRoomForm(prev => ({ ...prev, breakfast: e.target.value }))}
                >
                  <option value="Included">Breakfast Included</option>
                  <option value="Not Included">Room Only (Not Included)</option>
                  <option value="Complimentary High Tea">With High Tea Complimentary</option>
                </select>
              </div>

              <div className="formGroup">
                <label>Room Video Tour URL (YouTube / Vimeo / etc.)</label>
                <input
                  type="text"
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  className="formInput"
                  value={roomForm.video_url || ''}
                  onChange={(e) => setRoomForm(prev => ({ ...prev, video_url: e.target.value }))}
                />
              </div>

              {/* Room images picker */}
              <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1rem', background: '#f8fafc' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Room Images Upload</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Paste image web URL..."
                    className="formInput"
                    style={{ marginBottom: 0 }}
                    value={tempRoomImageUrl}
                    onChange={(e) => setTempRoomImageUrl(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => addRoomImageUrl(tempRoomImageUrl)}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  <span>or Upload file:</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleRoomLocalImageUpload}
                  />
                </div>
                
                {/* Images grid for rooms */}
                <div className={styles.imageGrid} style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: 0 }}>
                  {(roomForm.images || []).map((rmImg, rIdx) => (
                    <div key={rIdx} className={styles.imageCard}>
                      <img src={rmImg} alt="Room" className={styles.imagePreview} style={{ height: '70px' }} />
                      <div className={styles.imageCardControls} style={{ padding: '2px', justifyContent: 'center' }}>
                        <button
                          type="button"
                          className={styles.controlIconBtn}
                          onClick={() => removeRoomGalleryImage(rIdx)}
                          title="Remove Image"
                          style={{ color: 'var(--color-primary-red)', padding: 0 }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room description */}
              <div className="formGroup">
                <label>Room Description Overview</label>
                <textarea
                  placeholder="Enter detailed room category description..."
                  className="formInput"
                  rows={3}
                  value={roomForm.description || ''}
                  onChange={(e) => setRoomForm(prev => ({ ...prev, description: e.target.value }))}
                ></textarea>
              </div>

              {/* Room amenities checklist */}
              <div className={styles.tagInputWrapper}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Select Room Amenities</label>
                <div className={styles.tagChecklist}>
                  {ROOM_AMENITIES_LIST.map((amenity) => {
                    const isChecked = (roomForm.amenities || []).includes(amenity);
                    return (
                      <label key={amenity} className={styles.tagLabel}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleRoomAmenityToggle(amenity)}
                        />
                        <span>{amenity}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setIsRoomModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={saveRoomCategory}
              >
                Save Room Type
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
