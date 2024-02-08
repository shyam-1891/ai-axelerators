/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
    };

    return config;
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://slack.com/:path*',
      },
    ]
  }
};

export default nextConfig;
