import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4, Plus_Jakarta_Sans, Rethink_Sans, Space_Grotesk, Lexend, Manrope, Urbanist, Instrument_Serif } from "next/font/google";
import { cookies } from "next/headers";
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

export const metadata: Metadata = {
  title: "Sashvat Bharat",
  description: "Rule the Horizon. Beyond Limits",
  keywords: ["Sashvat Bharat", "Rule the Horizon", "Beyond Limits", "Sashvat", "Bharat", "JIT Tool Spawning Protocol"],
  authors: [{ name: "Sashvat Bharat" }],
  creator: "Sashvat Bharat",
  publisher: "Sashvat Bharat",
  icons: { icon: "/favicon-1.svg" },
  openGraph: {
    title: "Sashvat Bharat",
    description: "Rule the Horizon. Beyond Limits",
    url: "https://sashvat.com",
    siteName: "Sashvat Bharat",
    locale: "en_US",
    type: "website",
  },
};

async function getThemeFromCookie(): Promise<"light" | "dark"> {
  try {
    const cookieStore = await cookies();
    const themeCookie = cookieStore.get("theme");
    if (themeCookie?.value === "dark" || themeCookie?.value === "light") {
      return themeCookie.value;
    }
  } catch {}
  return "light";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeFromCookie();

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  var c = document.cookie.match('(^|;)\\s*theme\\s*=\\s*([^;]+)');
                  var cookieTheme = c ? c.pop() : null;
                  if (t === 'dark' || t === 'light') {
                    document.documentElement.setAttribute('data-theme', t);
                    document.cookie = 'theme=' + t + ';path=/;max-age=31536000';
                  } else if (cookieTheme === 'dark' || cookieTheme === 'light') {
                    document.documentElement.setAttribute('data-theme', cookieTheme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning={true} className={`${geistSans.variable} ${geistMono.variable} ${rethinkSans.variable} ${spaceGrotesk.variable} ${lexend.variable} ${manrope.variable} ${sourceSerif4.variable} ${urbanist.variable} ${plusJakartaSans.variable} ${instrumentSerif.variable}`} >
        {children}
      </body>
    </html>
  );
}