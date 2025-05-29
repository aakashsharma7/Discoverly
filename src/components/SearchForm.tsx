import { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { SearchFilters } from '@/types';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

export const SearchForm = ({ onSearch, isLoading = false }: SearchFormProps) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    budget: { min: 0, max: 4 },
    radius: 5000,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      ...filters,
      query: query.trim(),
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="How are you feeling today? What are you looking for?"
            className="w-full px-6 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              <AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-600" />
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="p-3 rounded-full bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              <MagnifyingGlassIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-4 shadow-lg space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Range
              </label>
              <div className="flex items-center space-x-4">
                <select
                  value={filters.budget?.min}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      budget: { ...filters.budget!, min: Number(e.target.value) },
                    })
                  }
                  className="input-field"
                >
                  <option value="0">$</option>
                  <option value="1">$$</option>
                  <option value="2">$$$</option>
                  <option value="3">$$$$</option>
                </select>
                <span>to</span>
                <select
                  value={filters.budget?.max}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      budget: { ...filters.budget!, max: Number(e.target.value) },
                    })
                  }
                  className="input-field"
                >
                  <option value="1">$$</option>
                  <option value="2">$$$</option>
                  <option value="3">$$$$</option>
                  <option value="4">$$$$$</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Radius
              </label>
              <select
                value={filters.radius}
                onChange={(e) =>
                  setFilters({ ...filters, radius: Number(e.target.value) })
                }
                className="input-field"
              >
                <option value="1000">1 km</option>
                <option value="5000">5 km</option>
                <option value="10000">10 km</option>
                <option value="20000">20 km</option>
              </select>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
}; 