/** @format */

import { DM_Sans, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata = {
  title: "Timothy Okoduwa",
  description:
    "Software Engineer — Creator of Cloak, Freedom, Canvoo, and VaultEnv. Building developer tools, SaaS, and web applications.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23a855f7'/></svg>",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <body className="bg-[#0c0b09] text-[#f5f2eb] antialiased selection:bg-[#c4b59d59] selection:text-[#f5f2eb]">
        {children}
      </body>
    </html>
  );
}
