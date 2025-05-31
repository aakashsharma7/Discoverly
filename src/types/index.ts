export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  preferences?: UserPreferences;
  favorites?: string[];
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
  name: string;
  description: string;
  address: string;
  location: Location;
  category: string;
  priceLevel: number;
  rating: number;
  photos: string[];
  weather?: Weather;
  menuUrl?: string;
  hasOnlineDelivery?: boolean;
  hasTableBooking?: boolean;
  vicinity?: string;
  formatted_address?: string;
  user_ratings_total?: number;
  price_level?: number;
  place_id?: string;
  website?: string;
  url?: string;
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
} 