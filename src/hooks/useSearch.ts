import { useState, useCallback } from 'react';
import { searchPlaces } from '@/services/api';
import { Place, SearchFilters } from '@/types';
import toast from 'react-hot-toast';

export const useSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Place[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (filters: SearchFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await searchPlaces(filters);
      
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        setError(response.error || 'Failed to fetch results');
        toast.error(response.error || 'Failed to fetch results');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while searching';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    isLoading,
    results,
    error,
    search,
    clearResults,
  };
}; 