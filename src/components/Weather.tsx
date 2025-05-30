import { useEffect, useState } from 'react';
import { getWeatherData } from '@/services/weather';
import { motion } from 'framer-motion';
import { CloudIcon, SunIcon } from '@heroicons/react/24/outline';

interface WeatherProps {
  lat: number;
  lng: number;
}

interface WeatherData {
  condition: string;
  temperature: number;
  humidity: number;
  icon: string;
}

export function Weather({ lat, lng }: WeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeatherData(lat, lng);
        setWeather(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error('Weather error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng]);

  if (loading) {
    return (
      <div className="flex items-center justify-end gap-2 text-gray-300">
        <div className="animate-pulse">Loading weather...</div>
      </div>
    );
  }

  if (error || !weather) {
    return null;
  }

  const isCloudy = weather.condition.toLowerCase().includes('cloud');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-end gap-3 text-white"
    >
      <div className="flex items-center gap-2">
        {isCloudy ? (
          <CloudIcon className="h-5 w-5 text-gray-300" />
        ) : (
          <SunIcon className="h-5 w-5 text-yellow-400" />
        )}
        <span className="text-sm font-medium">
          {weather.temperature}°C
        </span>
      </div>
      <span className="text-sm text-gray-300">
        {weather.condition}
      </span>
    </motion.div>
  );
} 