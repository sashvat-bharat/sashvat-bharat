import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4, Plus_Jakarta_Sans, Rethink_Sans, Space_Grotesk, Lexend, Manrope, Urbanist, Instrument_Serif } from "next/font/google";


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
  description: "Blasting of tech in your daily life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={`${geistSans.variable} ${geistMono.variable} ${rethinkSans.variable} ${spaceGrotesk.variable} ${lexend.variable} ${manrope.variable} ${sourceSerif4.variable} ${urbanist.variable} ${plusJakartaSans.variable} ${instrumentSerif.variable}`} >
        {children}
      </body>
    </html>
  );
}