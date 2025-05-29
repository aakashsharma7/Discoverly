import { NextResponse } from 'next/server';
import { WeatherData } from '@/types';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!OPENWEATHER_API_KEY) {
  console.error('OpenWeather API key is not configured. Please add NEXT_PUBLIC_OPENWEATHER_API_KEY to your .env.local file');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json(
        { success: false, error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    if (!OPENWEATHER_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'OpenWeather API key is not configured' },
        { status: 500 }
      );
    }

    const url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const weatherData: WeatherData = {
      condition: data.weather[0].main,
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      icon: data.weather[0].icon,
    };

    return NextResponse.json({ success: true, data: weatherData });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
} 