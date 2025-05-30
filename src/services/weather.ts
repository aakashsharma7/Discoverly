interface WeatherData {
  condition: string;
  temperature: number;
  humidity: number;
  icon: string;
}

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!OPENWEATHER_API_KEY) {
  console.error('OpenWeather API key is not configured. Please add NEXT_PUBLIC_OPENWEATHER_API_KEY to your .env.local file');
}

export const getWeatherData = async (lat: number, lng: number): Promise<WeatherData> => {
  if (!OPENWEATHER_API_KEY) {
    throw new Error('OpenWeather API key is not configured');
  }

  try {
    const url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      condition: data.weather[0].main,
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}; 