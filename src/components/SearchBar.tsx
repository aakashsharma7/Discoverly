'use client';

import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export default function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  return (
    <form onSubmit={onSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
        <div className="relative flex items-center bg-black/30 backdrop-blur-md rounded-full overflow-hidden">
          <div className="flex-1 flex items-center pl-6 pr-2 py-2">
            <MapPinIcon className="h-5 w-5 text-white" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Find restaurants near you..."
              className="w-full px-4 py-3 text-white text-lg focus:outline-none bg-transparent placeholder-white/70"
            />
          </div>
          <button
            type="submit"
            className="m-2 px-7 py-3 bg-primary-500 text-white font-medium rounded-full hover:bg-primary-600 transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span>Search</span>
            </div>
          </button>
        </div>
      </div>
    </form>
  );
} 