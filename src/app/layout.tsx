import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Libre_Baskerville, Manrope, Rethink_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { cookies } from 'next/headers';
import Footer from '@/components/layout/Footer';
import TopBar from '@/components/layout/TopBar';
import { ThemeProvider } from '@/components/ui/ThemeToggle';
import '@/styles/global.css';
import 'katex/dist/katex.min.css';

// Fonts Imports -------------------------

const libreBaskerville = Libre_Baskerville({
  variable: '--font-libre-baskerville',
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
});
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const rethinkSans = Rethink_Sans({ variable: '--font-rethink-sans', subsets: ['latin'] });
const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'] });
const departureMono = localFont({
  src: '../../public/fonts/DepartureMono-1.500/DepartureMono-Regular.woff2',
  variable: '--font-departure-mono',
  display: 'swap',
});

// -------------------------------------------

export const viewport: Viewport = {
  themeColor: '#FF591D',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Sashvat Bharat | Built for breakthroughs.',
    template: '%s | Sashvat Bharat',
  },
  description:
    'Next-generation AI/ML systems, autonomous AI agents, and high-performance productivity applications for B2B and B2C markets. Built for breakthroughs.',
  keywords: [
    'Sashvat Bharat',
    'AI Agents',
    'Harness Engineering',
    'Machine Learning Systems',
    'Productivity Apps',
    'B2B AI Solutions',
    'Enterprise AI',
    'Autonomous Systems',
    'Model Accelerator',
    'Agent Accelerator',
    'JIT Tool Spawning Protocol',
    'built for breakthroughs.',
  ],
  authors: [{ name: 'Akshat Dwivedi' }, { name: 'Sashvat Bharat', url: 'https://sashvat.com' }],
  creator: 'Akshat Dwivedi',
  publisher: 'Sashvat Bharat',

  metadataBase: new URL('https://sashvat.com'),

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo/favicon-1.svg', type: 'image/svg+xml' },
    ],
    apple: '/logo/apple-touch-icon.png',
  },

  openGraph: {
    title: 'Sashvat Bharat | AI & Productivity Solutions',
    description:
      'Next-generation AI/ML systems, autonomous AI agents, and high-performance productivity applications for B2B and B2C markets. Built for breakthroughs.',
    url: 'https://sashvat.com',
    siteName: 'Sashvat Bharat',
    images: [
      {
        url: '/logo/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sashvat Bharat',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Sashvat Bharat | Built for breakthroughs.',
    description:
      'Next-generation AI/ML systems, autonomous AI agents, and high-performance productivity applications for B2B and B2C markets. Built for breakthroughs.',
    images: ['/logo/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// ---------------------------------------------

type Theme = 'system' | 'light' | 'dark';

async function getInitialTheme(): Promise<Theme> {
  try {
    const cookieStore = await cookies();
    const themeCookie = cookieStore.get('theme');
    if (
      themeCookie?.value === 'dark' ||
      themeCookie?.value === 'light' ||
      themeCookie?.value === 'system'
    ) {
      return themeCookie.value as Theme;
    }
  } catch {}
  return 'light';
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTheme = await getInitialTheme();

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://sashvat.com/#organization',
        name: 'Sashvat Bharat',
        url: 'https://sashvat.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://sashvat.com/logo/favicon-1.svg',
        },
        description:
          'Next-generation AI/ML systems, autonomous AI agents, and high-performance productivity applications for B2B and B2C markets. Built for breakthroughs.',
        founder: {
          '@type': 'Person',
          name: 'Akshat Dwivedi',
          jobTitle: 'Founder & CEO',
          url: 'https://sashvat.com',
        },
        sameAs: ['https://github.com/sashvat-bharat'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://sashvat.com/#website',
        url: 'https://sashvat.com',
        name: 'Sashvat Bharat',
        publisher: {
          '@id': 'https://sashvat.com/#organization',
        },
      },
    ],
  };

  return (
    <html lang='en' data-theme={initialTheme === 'system' ? 'light' : initialTheme}>
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static inline FOUC-prevention theme script, no user input
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var c = document.cookie.match('(^|;)\\s*theme\\s*=\\s*([^;]+)');
                  var cookieTheme = c ? c.pop() : null;
                  if (cookieTheme === 'dark' || cookieTheme === 'light') {
                    document.documentElement.setAttribute('data-theme', cookieTheme);
                    localStorage.setItem('theme', cookieTheme);
                  } else {
                    var localTheme = localStorage.getItem('theme');
                    if (localTheme === 'dark' || localTheme === 'light') {
                      document.documentElement.setAttribute('data-theme', localTheme);
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type='application/ld+json'
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD schema is JSON.stringify of static data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} ${rethinkSans.variable} ${manrope.variable} ${libreBaskerville.variable} ${departureMono.variable}`}
      >
        <ThemeProvider initialTheme={initialTheme}>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div className='home-container' style={{ width: '100%' }}>
              <TopBar />
            </div>
            <div style={{ flex: 1 }}>{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
