/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
        port: '',
        pathname: '/demos/**',
      },
      {
        protocol: 'https',
        hostname: 'natours-yslc.onrender.com',
        port: '',
        pathname: '/img/**',
      },
      {
        protocol: 'https',
        hostname: 'natours-yslc.onrender.com',
        port: '',
        pathname: '/api/v1/img/**',
      },
    ],
    unoptimized: true, // Add this to make external images work properly
  },
};

export default nextConfig;
