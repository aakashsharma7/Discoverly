import { useState, useEffect } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface UseLocationReturn {
  location: Location | null;
  error: string | null;
  isLoading: boolean;
  requestLocation: () => void;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Please allow location access to use this feature';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    // Try to get location from localStorage on mount
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch (e) {
        localStorage.removeItem('userLocation');
      }
    }
  }, []);

  useEffect(() => {
    // Save location to localStorage when it changes
    if (location) {
      localStorage.setItem('userLocation', JSON.stringify(location));
    }
  }, [location]);

  return {
    location,
    error,
    isLoading,
    requestLocation,
  };
}; 