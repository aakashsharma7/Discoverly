import axios from 'axios';
import type { Place, SearchFilters, WeatherData, ApiResponse, Favorite, Review } from '@/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export async function apiFetch<T>(url: string, options?: RequestInit, retries = 2): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (err) {
    if (retries > 0) {
      return apiFetch(url, options, retries - 1);
    }
    throw err;
  }
}

export const searchPlaces = async (filters: SearchFilters): Promise<ApiResponse<Place[]>> => {
  try {
    const response = await api.post('/search', filters);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while searching places',
    };
  }
};

export const getPlaceDetails = async (placeId: string): Promise<ApiResponse<Place>> => {
  try {
    const response = await api.get(`/restaurants/${placeId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch place details',
    };
  }
};

export const getWeather = async (lat: number, lng: number): Promise<ApiResponse<WeatherData>> => {
  try {
    const response = await api.get(`/weather?lat=${lat}&lng=${lng}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch weather data',
    };
  }
};

export const addFavorite = async (place: Place): Promise<ApiResponse<Favorite>> => {
  try {
    const response = await api.post('/favorites', { place });
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add favorite',
    };
  }
};

export const removeFavorite = async (placeId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await api.delete(`/favorites/${placeId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove favorite',
    };
  }
};

export const getFavorites = async (): Promise<ApiResponse<Favorite[]>> => {
  try {
    const response = await api.get('/favorites');
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch favorites',
    };
  }
};

export const addReview = async (placeId: string, review: Omit<Review, 'id' | 'created_at'>): Promise<ApiResponse<Review>> => {
  try {
    const response = await api.post(`/reviews/${placeId}`, review);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add review',
    };
  }
};

export const toggleFavorite = async (placeId: string): Promise<ApiResponse<any>> => {
  // Get current favorites
  const favoritesResponse = await getFavorites();
  if (!favoritesResponse.success || !favoritesResponse.data) {
    return { success: false, error: 'Failed to fetch favorites' };
  }
  const isFavorite = favoritesResponse.data.some(fav => fav.place_id === placeId);
  if (isFavorite) {
    return await removeFavorite(placeId);
  } else {
    // For addFavorite, we need the full Place object. In this context, we can't get it, so just return an error.
    return { success: false, error: 'Place data required to add favorite' };
  }
}; 