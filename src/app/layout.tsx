import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Source_Serif_4, Plus_Jakarta_Sans, Rethink_Sans, Space_Grotesk, Lexend, Manrope, Urbanist, Instrument_Serif } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/ui/ThemeToggle";
import "@/styles/global.css";

// Fonts Imports -------------------------

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], });
const sourceSerif4 = Source_Serif_4({ variable: "--font-source-serif-4", subsets: ["latin"], });
const plusJakartaSans = Plus_Jakarta_Sans({ variable: "--font-plus-jakarta-sans", subsets: ["latin"], });
const rethinkSans = Rethink_Sans({ variable: "--font-rethink-sans", subsets: ["latin"], });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], });
const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"], });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], });
const urbanist = Urbanist({ variable: "--font-urbanist", subsets: ["latin"], });
const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", subsets: ["latin"], weight: "400" });

// -------------------------------------------

export const viewport: Viewport = {
  themeColor: "#FF591D",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Sashvat Bharat | Rule the Horizon Beyond Limits!",
    template: "%s | Sashvat Bharat"
  },
  description: "Next-generation AI/ML systems, autonomous AI agents, and high-performance productivity applications for B2B and B2C markets. Rule the Horizon. Beyond Limits!",
  keywords: [
    "Sashvat Bharat",
    "AI Agents",
    "Machine Learning Systems",
    "Productivity Apps",
    "B2B AI Solutions",
    "Enterprise AI",
    "Autonomous Systems",
    "Model Accelerator",
    "Agent Accelerator",
    "JIT Tool Spawning Protocol",
    "rule the horizon beyond limits"
  ],
  authors: [{ name: "Akshat Dwivedi" }, { name: "Sashvat Bharat", url: "https://sashvat.com" }],
  creator: "Akshat Dwivedi",
  publisher: "Sashvat Bharat",

  metadataBase: new URL("https://sashvat.com"),
  alternates: {
    canonical: '/',
  },

  icons: {
    icon: "logo/favicon-1.svg",
    apple: "logo/apple-touch-icon.png",
  },

  openGraph: {
    title: "Sashvat Bharat | AI & Productivity Solutions",
    description: "Next-generation AI/ML systems, autonomous AI agents, and high-performance productivity applications for B2B and B2C markets. Rule the Horizon. Beyond Limits!",
    url: "https://sashvat.com",
    siteName: "Sashvat Bharat",
    images: [
      {
        url: "logo/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sashvat Bharat",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Sashvat Bharat | Rule the Horizon",
    description: "Next-generation AI/ML systems, autonomous AI agents, and high-performance productivity applications for B2B and B2C markets. Rule the Horizon. Beyond Limits!",
    images: ["logo/og-image.png"],
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

type Theme = "system" | "light" | "dark";

async function getInitialTheme(): Promise<Theme> {
  try {
    const cookieStore = await cookies();
    const themeCookie = cookieStore.get("theme");
    if (themeCookie?.value === "dark" || themeCookie?.value === "light" || themeCookie?.value === "system") {
      return themeCookie.value as Theme;
    }
  } catch { }
  return "light";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTheme = await getInitialTheme();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://sashvat.com/#organization",
        "name": "Sashvat Bharat",
        "url": "https://sashvat.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://sashvat.com/logo/favicon-1.svg"
        },
        "description": "Next-generation AI/ML systems, autonomous AI agents, and high-performance productivity applications for B2B and B2C markets. Rule the Horizon. Beyond Limits!",
        "founder": {
          "@type": "Person",
          "name": "Akshat Dwivedi",
          "jobTitle": "Founder & CEO",
          "url": "https://sashvat.com"
        },
        "sameAs": [
          "https://github.com/sashvat-bharat",
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://sashvat.com/#website",
        "url": "https://sashvat.com",
        "name": "Sashvat Bharat",
        "publisher": {
          "@id": "https://sashvat.com/#organization"
        }
      }
    ]
  };

  return (
    <html lang="en" data-theme={initialTheme === "system" ? "light" : initialTheme}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var c = document.cookie.match('(^|;)\\s*theme\\s*=\\s*([^;]+)');
                  var cookieTheme = c ? c.pop() : null;
                  if (cookieTheme === 'dark' || cookieTheme === 'light') {
                    document.documentElement.setAttribute('data-theme', cookieTheme);
                    localStorage.setItem('theme', cookieTheme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body suppressHydrationWarning={true} className={`${geistSans.variable} ${geistMono.variable} ${rethinkSans.variable} ${spaceGrotesk.variable} ${lexend.variable} ${manrope.variable} ${sourceSerif4.variable} ${urbanist.variable} ${plusJakartaSans.variable} ${instrumentSerif.variable}`} >
        <ThemeProvider initialTheme={initialTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}