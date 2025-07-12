import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Place } from '@/types';
import dynamic from 'next/dynamic';

interface MapProps {
  places: Place[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onPlaceClick?: (place: Place) => void;
  selectedPlaceId?: string;
}

export const Map = ({
  places,
  center = { lat: 0, lng: 0 },
  zoom = 12,
  onPlaceClick,
  selectedPlaceId,
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
        libraries: ['places'],
      });

      try {
        const google = await loader.load();
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          });
          setMap(mapInstance);
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // Add new markers
    places.forEach((place) => {
      const marker = new google.maps.Marker({
        position: place.location,
        map,
        title: place.name,
        animation: google.maps.Animation.DROP,
      });

      // Add click listener
      marker.addListener('click', () => {
        if (onPlaceClick) {
          onPlaceClick(place);
        }
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Fit bounds if there are places
    if (places.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        bounds.extend(place.location);
      });
      map.fitBounds(bounds);
    }
  }, [map, places, onPlaceClick]);

  // Update selected marker
  useEffect(() => {
    if (!map || !selectedPlaceId) return;

    markers.forEach((marker) => {
      const place = places.find((p) => p.id === selectedPlaceId);
      if (place && marker.getPosition()?.equals(new google.maps.LatLng(place.location.lat, place.location.lng))) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        map.panTo(place.location);
      } else {
        marker.setAnimation(null);
      }
    });
  }, [map, markers, places, selectedPlaceId]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[600px] rounded-xl shadow-lg"
      style={{ minHeight: '400px' }}
    />
  );
}; 