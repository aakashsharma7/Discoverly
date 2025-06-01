import { useCallback } from 'react';
import { searchPlaces } from '@/services/api';
import { Place, SearchFilters } from '@/types';
import toast from 'react-hot-toast';
import { useSearch as useSearchContext } from '@/contexts/SearchContext';

export const useSearch = () => {
  const {
    results,
    setResults,
    isLoading,
    setIsLoading,
    error,
    setError,
    lastSearch,
    setLastSearch,
  } = useSearchContext();

  const search = useCallback(async (filters: SearchFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await searchPlaces(filters);
      
      if (response.success && response.data) {
        setResults(response.data);
        setLastSearch(filters);
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
  }, [setResults, setIsLoading, setError, setLastSearch]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setLastSearch(null);
  }, [setResults, setError, setLastSearch]);

  return {
    results,
    isLoading,
    error,
    search,
    clearResults,
    lastSearch,
  };
}; 