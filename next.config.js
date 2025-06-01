/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  images: {
    domains: [
      'maps.googleapis.com',
      'lh3.googleusercontent.com',
      'via.placeholder.com',
      'images.unsplash.com'
    ],
  },
}

module.exports = nextConfig 