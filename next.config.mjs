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
  },

  // env: {
  //   Slack_token: 'xoxb-6560144487207-6596052596289-EjasJgqvxRQvfgGkCmYBl3lV',
  // },
};

export default nextConfig;
