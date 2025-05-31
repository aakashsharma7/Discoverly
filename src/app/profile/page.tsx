'use client';

import { motion } from 'framer-motion';
import { FiUser, FiMail, FiSettings, FiHeart, FiClock } from 'react-icons/fi';

export default function Profile() {
  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/10 via-black to-black" />
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                <FiUser className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                User Profile
              </h2>
              <p className="mt-2 text-gray-400">Manage your account settings</p>
            </motion.div>

            {/* Profile Content */}
            <div className="space-y-6">
              {/* User Info Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/5 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FiMail className="w-5 h-5 text-primary-500" />
                    <span className="text-gray-300">user@example.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiClock className="w-5 h-5 text-primary-500" />
                    <span className="text-gray-300">Member since 2024</span>
                  </div>
                </div>
              </motion.div>

              {/* Preferences Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/5 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiHeart className="w-5 h-5 text-primary-500" />
                      <span className="text-gray-300">Favorite Restaurants</span>
                    </div>
                    <span className="text-primary-500">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiSettings className="w-5 h-5 text-primary-500" />
                      <span className="text-gray-300">Search Preferences</span>
                    </div>
                    <button className="text-primary-500 hover:text-primary-400 transition-colors duration-200">
                      Edit
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Actions Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex justify-center space-x-4"
              >
                <button className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200">
                  Edit Profile
                </button>
                <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-200">
                  View History
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 