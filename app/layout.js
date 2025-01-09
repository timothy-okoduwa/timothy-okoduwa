/** @format */

import { Geist, Geist_Mono, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const plexMono = IBM_Plex_Mono({
  vairable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"], // Specify the weight(s) you need
});

export const metadata = {
  title: "Timothy Okoduwa",
  description: ".............",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plexMono.vairable}`}
      >
        {children}
      </body>
    </html>
  );
}
