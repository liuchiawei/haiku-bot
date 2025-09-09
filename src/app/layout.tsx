import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Haiku Bot",
  description: "Haiku Bot is a bot that can help you create haiku poems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerifJP.variable} antialiased`}
      >
        <h1 className='hidden md:block absolute top-1/2 left-2 -translate-y-1/2 h-full text-2xl font-bold font-serif text-center text-xl [writing-mode:vertical-rl] tracking-[0.5em]'>
          俳句の森
        </h1>
        {children}
      </body>
    </html>
  );
}
