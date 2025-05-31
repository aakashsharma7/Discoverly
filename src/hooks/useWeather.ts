import { useState, useEffect } from 'react';
import { getWeatherData } from '@/services/api';
import { WeatherData } from '@/types';
import toast from 'react-hot-toast';

interface UseWeatherReturn {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  fetchWeather: (lat: number, lng: number) => Promise<void>;
}

export const useWeather = (): UseWeatherReturn => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getWeatherData(lat, lng);
      
      if (response.success && response.data) {
        setWeather(response.data);
      } else {
        const errorMessage = response.error || 'Failed to fetch weather data';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching weather data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Cache weather data in localStorage
  useEffect(() => {
    if (weather) {
      // Replace 'city' with the actual property from WeatherData that identifies the location, e.g., 'city' or 'id'
      const cacheKey = `weather_${(weather as any).city || 'default'}`;
      const cacheData = {
        data: weather,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    }
  }, [weather]);

  // Try to load cached weather data on mount
  useEffect(() => {
    const loadCachedWeather = () => {
      const cachedData = localStorage.getItem('lastWeather');
      if (cachedData) {
        try {
          const { data, timestamp } = JSON.parse(cachedData);
          // Only use cache if it's less than 30 minutes old
          if (Date.now() - timestamp < 30 * 60 * 1000) {
            setWeather(data);
          }
        } catch (e) {
          localStorage.removeItem('lastWeather');
        }
      }
    };

    loadCachedWeather();
  }, []);

  return {
    weather,
    isLoading,
    error,
    fetchWeather,
  };
}; 