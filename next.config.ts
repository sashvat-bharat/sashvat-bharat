import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,

  allowedDevOrigins: ['192.168.1.4'],

  async headers() {
    return [
      {
        source: '/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/article',
        destination: '/articles',
        permanent: true,
      },
      {
        source: '/article/:slug',
        destination: '/articles/:slug',
        permanent: true,
      },
      {
        source: '/articles/demo-article',
        destination: '/articles/agent-accelerator',
        permanent: false,
      },
      {
        source: '/sitemap_index.xml',
        destination: '/sitemap.xml',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
