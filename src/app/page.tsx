'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, MapPinIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useSearch } from '@/hooks/useSearch'
import SearchResults from '@/components/SearchResults'
import { Weather } from '@/components/Weather'
import { useLocation } from '@/hooks/useLocation'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Place } from '@/types'
import Navigation from '@/components/Navigation'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const foodImages = [
  '/food/italian.jpg',
  '/food/sushi.jpg',
  '/food/bbq.jpg',
  '/food/vegan.jpg',
  '/food/fine-dining.jpg',
  '/food/fast-food.jpg',
]

const cuisineFilters = [
  { id: 'all', label: 'All' },
  { id: 'italian', label: 'Italian' },
  { id: 'japanese', label: 'Japanese' },
  { id: 'bbq', label: 'BBQ' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'fine-dining', label: 'Fine Dining' },
  { id: 'fast-food', label: 'Fast Food' },
]

const features = [
  {
    title: 'AI-Powered Recommendations',
    description: 'Get personalized suggestions based on your mood and preferences, powered by advanced AI technology',
    icon: '🤖',
  },
  {
    title: 'Smart Budget Filtering',
    description: 'Discover options that align with your budget, from affordable gems to premium experiences',
    icon: '💰',
  },
  {
    title: 'Real-time Location Search',
    description: 'Find the best restaurants near you with accurate location-based results',
    icon: '📍',
  },
]

export default function Home() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedCuisine, setSelectedCuisine] = useState('all')
  const { search, results, isLoading: isSearchLoading, error: searchError } = useSearch()
  const { location, requestLocation } = useLocation()
  const [favorites, setFavorites] = useState<Place[]>([])
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % foodImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Scroll to results when they are fetched
  useEffect(() => {
    if (results.length > 0 && !isSearchLoading) {
      resultsRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [results, isSearchLoading]);

  // Request location on component mount
  useEffect(() => {
    if (!location) {
      console.log('Requesting location...');
      requestLocation();
    } else {
      console.log('Location available:', location);
    }
  }, [location, requestLocation])

  const fetchFavorites = async () => {
    if (!user?.id) {
      toast.error('Please sign in to view favorites');
      return;
    }

    setIsFavoritesLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('place_data')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const favoritePlaces = data?.map(fav => fav.place_data) || [];
      setFavorites(favoritePlaces);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setIsFavoritesLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query', {
        position: 'bottom-center',
        duration: 3000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.75rem',
          padding: '1rem',
        },
      })
      return
    }

    try {
      if (!location) {
        requestLocation()
        toast.loading('Getting your location...', {
          position: 'bottom-center',
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.75rem',
            padding: '1rem',
          },
        })
        return
      }

      const filters = {
        query: searchQuery,
        location: location,
        radius: 5000,
        category: 'restaurant',
        cuisine: selectedCuisine !== 'all' ? selectedCuisine : undefined,
        budget: { min: 0, max: 4 }
      }

      await search(filters)
    } catch (error) {
      toast.error('An error occurred while searching', {
        position: 'bottom-center',
        duration: 3000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.75rem',
          padding: '1rem',
        },
      })
      console.error('Search error:', error)
    }
  }

  const handleToggleFavorite = async (place: Place) => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    try {
      const isFavorite = favorites.some(fav => fav.place_id === place.place_id || fav.id === place.id);
      
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('place_id', place.place_id || place.id);

        if (error) throw error;
        setFavorites(favorites.filter(fav => fav.place_id !== place.place_id && fav.id !== place.id));
        toast.success('Removed from favorites');
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert([
            {
              user_id: user.id,
              place_id: place.place_id || place.id,
              place_data: place
            }
          ]);

        if (error) throw error;
        setFavorites([...favorites, place]);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      
      {/* Weather Display - Fixed in Navbar */}
      <div className="fixed top-4 right-28 z-40 ml-2">
        <div className="px-4">
          <AnimatePresence>
            {location ? (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="py-2 flex items-center"
              >
                <Weather lat={location.lat} lng={location.lng} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="py-2 flex items-center"
              >
                <div className="text-sm text-gray-300">Loading location...</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Add padding to account for fixed navbar */}
      <div className="pt-16">
        {/* Hero Section with Dynamic Background */}
        <section className="relative min-h-[85vh] overflow-hidden bg-black">
          {/* Background Carousel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${foodImages[currentImageIndex]})`,
                  filter: 'brightness(0.7)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
            </motion.div>
          </AnimatePresence>
          
          <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-white">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="text-center max-w-4xl w-full"
            >
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-7xl font-bold mt-20 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200"
              >
                <div>Taste the City</div> 
                One Bite at a Time
              </motion.h1>
              <motion.p 
                variants={fadeInUp}
                className="text-lg sm:text-xl md:text-2xl text-gray-100 mb-8 sm:mb-12 max-w-2xl mx-auto px-4"
              >
                Find the best local spots based on your mood, budget, and preferences
              </motion.p>
              
              {/* Search Form */}
              <motion.form
                variants={fadeInUp}
                onSubmit={handleSearch}
                className="w-full max-w-2xl mx-auto px-4"
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                  <div className="relative flex flex-col sm:flex-row items-center bg-black/30 backdrop-blur-md rounded-full overflow-hidden">
                    <div className="flex-1 flex items-center pl-4 sm:pl-6 pr-2 py-2 w-full">
                      <MapPinIcon className="h-5 w-5 text-white flex-shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Find restaurants near you..."
                        className="w-full px-4 py-3 text-white text-base sm:text-lg focus:outline-none bg-transparent placeholder-white/70"
                        disabled={isSearchLoading}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSearchLoading}
                      className="w-full sm:w-auto m-2 px-6 sm:px-7 py-3 bg-primary-500 text-white font-medium rounded-full hover:bg-primary-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <MagnifyingGlassIcon className="h-5 w-5" />
                        <span>Search</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Cuisine Filter Chips */}
                <motion.div 
                  variants={fadeInUp}
                  className="flex flex-wrap justify-center gap-2 mt-4 sm:mt-6 px-2"
                >
                  {cuisineFilters.map((cuisine) => (
                    <button
                      key={cuisine.id}
                      onClick={() => setSelectedCuisine(cuisine.id)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                        selectedCuisine === cuisine.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-black/30 text-white hover:bg-black/40'
                      }`}
                    >
                      {cuisine.label}
                    </button>
                  ))}
                </motion.div>
              </motion.form>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </section>

        {/* Features Section */}
        <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-black">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_50%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-black/100 to-black/100" />
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 sm:mb-20"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Why Choose Us
              </h2>
              <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed px-4">
                Experience the perfect blend of technology and convenience
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute -inset-4 bg-gradient-to-br from-gray-900 to-black rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-lg" />
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative p-6 sm:p-8">
                    <div className="text-4xl mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Results Section */}
        {(results.length > 0 || searchError) && (
          <motion.section
            ref={resultsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative py-8 sm:py-12 md:py-16"
          >
            <div className="container mx-auto px-4">
              <div className="relative">
                {/* Background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 rounded-3xl border border-white/5" />
                
                {/* Content */}
                <div className="relative p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Search Results
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 text-xs sm:text-sm text-white bg-primary-500/20 rounded-full border border-primary-500/30">
                        AI-Powered
                      </span>
                    </div>
                  </div>
                  {searchError ? (
                    <div className="text-center py-8 sm:py-12">
                      <div className="text-white text-base sm:text-lg">{searchError}</div>
                    </div>
                  ) : (
                    <SearchResults
                      places={results}
                      loading={isSearchLoading}
                      error={searchError}
                      favorites={favorites}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}