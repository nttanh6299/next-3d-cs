/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/static/images/**',
      },
    ],
    minimumCacheTTL: 604800,
  },
};

export default nextConfig;
