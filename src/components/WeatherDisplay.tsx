import { motion } from 'framer-motion';
import { WeatherData } from '@/types';

interface WeatherDisplayProps {
  weather: WeatherData;
  className?: string;
}

const getWeatherIcon = (condition: string) => {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('rain')) return '🌧️';
  if (conditionLower.includes('cloud')) return '☁️';
  if (conditionLower.includes('sun') || conditionLower.includes('clear')) return '☀️';
  if (conditionLower.includes('snow')) return '❄️';
  if (conditionLower.includes('thunder')) return '⛈️';
  if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️';
  return '🌤️';
};

export const WeatherDisplay = ({ weather, className = '' }: WeatherDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl p-4 shadow-md ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-4xl">{getWeatherIcon(weather.condition)}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {weather.condition}
            </h3>
            <p className="text-3xl font-bold text-primary-600">
              {Math.round(weather.temperature)}°C
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Humidity: {weather.humidity}%
          </p>
          <p className="text-sm text-gray-600">
            Wind: {weather.windSpeed} km/h
          </p>
        </div>
      </div>
    </motion.div>
  );
}; 