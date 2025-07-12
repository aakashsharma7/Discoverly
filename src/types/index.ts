export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface UserPreferences {
  budget?: {
    min: number;
    max: number;
  };
  preferredCategories?: string[];
  dietaryRestrictions?: string[];
  accessibility?: string[];
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Weather {
  condition: string;
  temperature: number;
  humidity: number;
}

export interface Place {
  id: string;
  place_id?: string;
  name: string;
  description?: string;
  address: string;
  vicinity?: string;
  formatted_address?: string;
  location: Location;
  category: string;
  priceLevel?: number;
  rating?: number;
  photos: string[];
  menuUrl?: string;
  hasOnlineDelivery?: boolean;
  hasTableBooking?: boolean;
  weather?: WeatherData;
}

export interface SearchFilters {
  query?: string;
  location?: Location;
  radius?: number;
  category?: string;
  cuisine?: string;
  priceLevel?: number;
  rating?: number;
  mood?: string;
  budget?: {
    min: number;
    max: number;
  };
}

export interface WeatherData {
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  place_id: string;
  place_data: Place;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  place_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: User;
} 