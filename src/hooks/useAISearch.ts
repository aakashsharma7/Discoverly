import { useState } from 'react';
import { SearchFilters } from '@/types';
import toast from 'react-hot-toast';

interface UseAISearchReturn {
  isLoading: boolean;
  error: string | null;
  interpretQuery: (query: string) => Promise<SearchFilters>;
}

export const useAISearch = (): UseAISearchReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const interpretQuery = async (query: string): Promise<SearchFilters> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/interpret', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error('Failed to interpret query');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to interpret query');
      }

      return data.filters;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while interpreting your query';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Return default filters if AI interpretation fails
      return {
        query: query,
        radius: 5000,
        budget: { min: 0, max: 4 },
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    interpretQuery,
  };
}; 