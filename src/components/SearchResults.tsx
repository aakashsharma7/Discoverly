import { Place } from '@/types';
import { PlaceCard } from './PlaceCard';
import { motion } from 'framer-motion';

interface SearchResultsProps {
  places: Place[];
  loading: boolean;
  error: string | null;
  favorites: Place[];
  onToggleFavorite: (place: Place) => void;
}

export default function SearchResults({
  places,
  loading,
  error,
  favorites,
  onToggleFavorite,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="mt-8 text-center text-white">
        <p>Searching for the perfect restaurants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!places.length) {
    return (
      <div className="mt-8 text-center text-white">
        <p>No restaurants found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {places.map((place, index) => (
        <PlaceCard
          key={place.place_id || place.id || `place-${index}`}
          place={place}
          isFavorite={favorites.some(fav => fav.id === place.id)}
          onFavoriteToggle={() => onToggleFavorite(place)}
        />
      ))}
    </motion.div>
  );
} 