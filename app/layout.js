/** @format */

import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Timothy Okoduwa",
  description:
    "Frontend engineer building products that feel inevitable. Next.js, TypeScript, React, Firebase.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { margin: 0 !important; background: transparent; }
          html { scroll-behavior: smooth; }
        `}</style>
      </head>
      <body className={plexMono.variable}>{children}</body>
    </html>
  );
}
