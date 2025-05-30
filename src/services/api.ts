import axios from 'axios';
import { Place, SearchFilters, WeatherData, ApiResponse } from '@/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export const getWeatherData = async (lat: number, lng: number): Promise<ApiResponse<WeatherData>> => {
  try {
    const response = await api.get(`/weather?lat=${lat}&lng=${lng}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while fetching weather data',
    };
  }
};

export const getPlaceDetails = async (placeId: string): Promise<ApiResponse<Place>> => {
  try {
    const response = await api.get(`/places/${placeId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while fetching place details',
    };
  }
};

export const toggleFavorite = async (placeId: string): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post(`/favorites/${placeId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while toggling favorite',
    };
  }
};

export const updateUserPreferences = async (preferences: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.put('/user/preferences', preferences);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while updating preferences',
    };
  }
}; 