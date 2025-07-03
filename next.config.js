/** @type {import('next').NextConfig} */
const { withExpo } = require('@expo/next-adapter');

const nextConfig = withExpo({
  // transpilePackages: [
  //   'react-native',
  //   'expo',
  //   // Add more React Native / Expo packages here...
  // ],
  experimental: {
    forceSwcTransforms: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [],
  },
  // Ensure API routes work properly
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/app/:path*+api',
      },
    ];
  },
});

module.exports = nextConfig;
