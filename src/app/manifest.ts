import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sashvat Bharat',
    short_name: 'Sashvat',
    description:
      'Next-generation AI/ML systems, autonomous AI agents, and high-performance productivity applications. Built for breakthroughs.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#FF591D',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32 64x64',
        type: 'image/x-icon',
      },
      {
        src: '/logo/favicon-1.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/logo/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
