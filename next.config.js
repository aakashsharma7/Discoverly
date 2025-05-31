/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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