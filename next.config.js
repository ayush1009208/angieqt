/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'i.ibb.co'],
  },    
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
