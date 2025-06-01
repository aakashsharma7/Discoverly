'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Place, SearchFilters } from '@/types';

interface SearchContextType {
  results: Place[];
  setResults: (results: Place[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  lastSearch: SearchFilters | null;
  setLastSearch: (filters: SearchFilters | null) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearch, setLastSearch] = useState<SearchFilters | null>(null);

  return (
    <SearchContext.Provider
      value={{
        results,
        setResults,
        isLoading,
        setIsLoading,
        error,
        setError,
        lastSearch,
        setLastSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 