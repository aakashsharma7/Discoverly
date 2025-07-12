export const config = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '',
  googlePlacesApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '',
  openWeatherApiKey: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  mongoUri: process.env.MONGODB_URI || '',
  nextAuthSecret: process.env.NEXTAUTH_SECRET || '',
  nextAuthUrl: process.env.NEXTAUTH_URL || '',
  googleAiApiKey: process.env.GOOGLE_AI_API_KEY || '',
};

export function requireConfig(key: keyof typeof config) {
  if (!config[key]) {
    throw new Error(`Missing required config: ${key}`);
  }
  return config[key];
} 