'use client';

import { motion } from 'framer-motion';
import { FiGithub } from 'react-icons/fi';

export default function About() {
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                About Discoverly
              </h2>
              <p className="mt-2 text-gray-400">Your AI-Powered Restaurant Discovery Platform</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed">
                  Discoverly is designed to revolutionize how people find and experience restaurants. 
                  Using advanced AI technology, we provide personalized recommendations based on your 
                  preferences, mood, and location.
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center space-x-2">
                    <span className="text-primary-500">•</span>
                    <span>AI-Powered Restaurant Recommendations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-primary-500">•</span>
                    <span>Real-time Location-Based Search</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-primary-500">•</span>
                    <span>Personalized User Profiles</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-primary-500">•</span>
                    <span>Smart Budget Filtering</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Developer</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                    <span className="text-2xl">👨‍💻</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Developed by</h4>
                    <div className="flex items-center space-x-2">
                      <p className="text-primary-500">Aakash Sharma</p>
                      <a
                        href="https://github.com/aakashsharma7/Discoverly"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                      >
                        <FiGithub className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Software Engineer</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 