import { Place } from '@/types';

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

if (!GOOGLE_PLACES_API_KEY) {
  console.error('Google Places API key is not configured. Please add NEXT_PUBLIC_GOOGLE_PLACES_API_KEY to your .env.local file');
}

interface GooglePlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  price_level?: number;
  rating?: number;
  types: string[];
  photos?: Array<{
    photo_reference: string;
  }>;
  opening_hours?: {
    open_now: boolean;
  };
  vicinity: string;
}

interface GooglePlaceDetails extends GooglePlace {
  website?: string;
  url?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
}

export const searchRestaurants = async (
  lat: number,
  lng: number,
  radius: number = 5000,
  cuisine?: string
): Promise<Place[]> => {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key is not configured');
  }

  try {
    // First, search for nearby restaurants
    const searchUrl = `${GOOGLE_PLACES_BASE_URL}/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant${cuisine ? `&keyword=${cuisine}` : ''}&key=${GOOGLE_PLACES_API_KEY}`;
    console.log('Making request to Google Places API:', searchUrl);

    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('Google Places API error response:', errorText);
      throw new Error(`Google Places API error: ${searchResponse.status} ${searchResponse.statusText}`);
    }

    const searchData = await searchResponse.json();
    console.log('Google Places API response:', searchData);
    
    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${searchData.status}`);
    }

    if (!searchData.results || !Array.isArray(searchData.results)) {
      console.error('Invalid response structure:', searchData);
      throw new Error('Invalid response structure from Google Places API');
    }

    // Get details for each place
    const places = await Promise.all(
      searchData.results.map(async (place: GooglePlace) => {
        const detailsUrl = `${GOOGLE_PLACES_BASE_URL}/details/json?place_id=${place.place_id}&fields=name,formatted_address,geometry,price_level,rating,types,photos,opening_hours,website,url,formatted_phone_number,international_phone_number,reviews&key=${GOOGLE_PLACES_API_KEY}`;
        
        const detailsResponse = await fetch(detailsUrl);
        if (!detailsResponse.ok) {
          console.error(`Failed to fetch details for place ${place.place_id}`);
          return null;
        }

        const detailsData = await detailsResponse.json();
        if (detailsData.status !== 'OK') {
          console.error(`Failed to fetch details for place ${place.place_id}: ${detailsData.status}`);
          return null;
        }

        const details = detailsData.result as GooglePlaceDetails;
        
        // Get photo URL if available
        let photoUrl = '';
        if (details.photos && details.photos.length > 0) {
          photoUrl = `${GOOGLE_PLACES_BASE_URL}/photo?maxwidth=400&photo_reference=${details.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`;
        }

        return {
          id: details.place_id,
          name: details.name,
          description: details.types.join(', '),
          address: details.formatted_address,
          location: {
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
          },
          category: 'restaurant',
          priceLevel: details.price_level || 0,
          rating: details.rating || 0,
          photos: photoUrl ? [photoUrl] : [],
          menuUrl: details.website,
          hasOnlineDelivery: false,
          hasTableBooking: !!details.url,
        };
      })
    );

    // Filter out any null results from failed detail fetches
    const validPlaces = places.filter((place): place is Place => place !== null);
    console.log('Transformed places:', validPlaces);

    return validPlaces;
  } catch (error) {
    console.error('Error fetching restaurants from Google Places:', error);
    if (error instanceof Error) {
      throw new Error(`Google Places API error: ${error.message}`);
    }
    throw error;
  }
};

export const getRestaurantDetails = async (placeId: string): Promise<Place> => {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error('Google Places API key is not configured');
  }

  try {
    const url = `${GOOGLE_PLACES_BASE_URL}/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,price_level,rating,types,photos,opening_hours,website,url,formatted_phone_number,international_phone_number,reviews&key=${GOOGLE_PLACES_API_KEY}`;
    console.log('Making request to Google Places API:', url);

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Places API error response:', errorText);
      throw new Error(`Google Places API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    const details = data.result as GooglePlaceDetails;

    // Get photo URL if available
    let photoUrl = '';
    if (details.photos && details.photos.length > 0) {
      photoUrl = `${GOOGLE_PLACES_BASE_URL}/photo?maxwidth=400&photo_reference=${details.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`;
    }

    return {
      id: details.place_id,
      name: details.name,
      description: details.types.join(', '),
      address: details.formatted_address,
      location: {
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng,
      },
      category: 'restaurant',
      priceLevel: details.price_level || 0,
      rating: details.rating || 0,
      photos: photoUrl ? [photoUrl] : [],
      menuUrl: details.website,
      hasOnlineDelivery: false,
      hasTableBooking: !!details.url,
    };
  } catch (error) {
    console.error('Error fetching restaurant details from Google Places:', error);
    if (error instanceof Error) {
      throw new Error(`Google Places API error: ${error.message}`);
    }
    throw error;
  }
}; 