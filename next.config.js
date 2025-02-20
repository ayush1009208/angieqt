/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'upload.wikimedia.org',
      'i.imgur.com',
      'images.unsplash.com',
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'i.ibb.co'
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
