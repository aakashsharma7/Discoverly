'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, HeartIcon } from '@heroicons/react/24/outline';
import { Weather } from './Weather';
import Link from 'next/link';
import { FiUser } from 'react-icons/fi';

const colorSchemes = [
  'from-blue-500 to-purple-600',
  'from-pink-500 to-orange-400',
  'from-green-400 to-blue-500',
  'from-purple-500 to-pink-500',
  'from-yellow-400 to-red-500',
];

export default function Navigation() {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  const handleLogoClick = () => {
    setColorIndex((prev) => (prev + 1) % colorSchemes.length);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <motion.div 
            className="flex items-center cursor-pointer ml-2 sm:-ml-16"
            onClick={handleLogoClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${colorSchemes[colorIndex]} bg-clip-text text-transparent`}
              animate={{ 
                backgroundPosition: ['-200%', '200%'],
                backgroundSize: ['400%', '400%']
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              Discoverly
            </motion.span>
          </motion.div>

          <div className="flex items-center gap-2 sm:gap-4 -mr-4 sm:-mr-16">
            <div className="block">
              <Weather lat={51.5074} lng={-0.1278} />
            </div>
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-40 sm:w-48 rounded-lg bg-white/10 backdrop-blur-md shadow-lg overflow-hidden"
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          router.push('/profile');
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-white hover:bg-white/10 transition-colors"
                      >
                        <UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          router.push('/favorites');
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-white hover:bg-white/10 transition-colors"
                      >
                        <HeartIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        Favorites
                      </button>
                      <button
                        onClick={() => {
                          router.push('/about');
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-white hover:bg-white/10 transition-colors"
                      >
                        About
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 