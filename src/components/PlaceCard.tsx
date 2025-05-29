import React from 'react';
import Image from 'next/image';
import { Place } from '@/types';
import { PlaceholderImage } from './PlaceholderImage';
import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface PlaceCardProps {
  place: Place;
  isFavorite?: boolean;
  onFavoriteToggle?: (placeId: string) => void;
}

export function PlaceCard({ place, isFavorite = false, onFavoriteToggle }: PlaceCardProps) {
  const getPopularItems = (category: string) => {
    switch (category) {
      case 'restaurant':
        return [
          { name: 'Signature Pasta', price: '$18' },
          { name: 'Grilled Salmon', price: '$24' },
        ];
      case 'cafe':
        return [
          { name: 'Specialty Latte', price: '$5' },
          { name: 'Avocado Toast', price: '$8' },
        ];
      case 'bar':
        return [
          { name: 'Craft Old Fashioned', price: '$14' },
          { name: 'Local IPA', price: '$8' },
        ];
      default:
        return [];
    }
  };

  const popularItems = getPopularItems(place.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-black rounded-2xl overflow-hidden border border-white/10"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        {place.photos?.[0] ? (
          <Image
            src={place.photos[0]}
            alt={place.name}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <span className="text-gray-600">No image available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
              {place.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
              <MapPinIcon className="h-4 w-4 text-primary-400" />
              <p className="line-clamp-2">
                {place.vicinity || place.formatted_address}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
              {place.rating && (
                <span className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  {place.rating}
                </span>
              )}
              {place.user_ratings_total && (
                <span>({place.user_ratings_total})</span>
              )}
              {place.price_level && (
                <span className="text-gray-300">
                  {'•'.repeat(place.price_level)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-300 mb-4 line-clamp-2">
              {place.description || `Discover amazing ${place.category} experience with our carefully curated selection of dishes and drinks.`}
            </p>
          </div>

          {/* Favorite Button */}
          {onFavoriteToggle && (
            <button
              onClick={() => onFavoriteToggle(place.place_id || place.id)}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-200"
            >
              {isFavorite ? (
                <HeartIconSolid className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-white" />
              )}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => window.open(place.url, '_blank')}
            className="flex-1 px-4 py-2 text-sm text-center text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors duration-200"
          >
            Book Now
          </button>
          {place.website && (
            <Link
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2 text-sm text-center text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 border border-white/10"
            >
              Visit Website
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
} 