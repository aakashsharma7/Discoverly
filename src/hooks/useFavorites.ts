import { useState, useEffect } from 'react';
import { toggleFavorite } from '@/services/api';
import toast from 'react-hot-toast';

interface UseFavoritesReturn {
  favorites: string[];
  isLoading: boolean;
  error: string | null;
  toggleFavoritePlace: (placeId: string) => Promise<void>;
  isFavorite: (placeId: string) => boolean;
}

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const loadFavorites = () => {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (e) {
          localStorage.removeItem('favorites');
        }
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavoritePlace = async (placeId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await toggleFavorite(placeId);
      
      if (response.success) {
        setFavorites((prev) => {
          if (prev.includes(placeId)) {
            return prev.filter((id) => id !== placeId);
          } else {
            return [...prev, placeId];
          }
        });
      } else {
        const errorMessage = response.error || 'Failed to update favorites';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating favorites';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = (placeId: string) => favorites.includes(placeId);

  return {
    favorites,
    isLoading,
    error,
    toggleFavoritePlace,
    isFavorite,
  };
}; 