import { NextResponse } from 'next/server';
import { WeatherData } from '@/types';
import { z } from 'zod';
import { apiError, logApiError } from '@/utils/apiHelpers';

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

    // Input validation using Zod
    const coordSchema = z.object({
      lat: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= -90 && Number(val) <= 90, {
        message: 'Latitude must be a number between -90 and 90'
      }),
      lng: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= -180 && Number(val) <= 180, {
        message: 'Longitude must be a number between -180 and 180'
      })
    });
    const parseResult = coordSchema.safeParse({ lat, lng });
    if (!parseResult.success) {
      return apiError({
        error: 'Invalid coordinates',
        details: parseResult.error.errors.map(e => e.message).join(', '),
        status: 400
      });
    }

    if (!OPENWEATHER_API_KEY) {
      logApiError('ConfigError', new Error('OpenWeather API key is not configured'));
      return apiError({ error: 'OpenWeather API key is not configured' });
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
    logApiError('WeatherAPI', error);
    return apiError({ error: 'Failed to fetch weather data' });
  }
} 