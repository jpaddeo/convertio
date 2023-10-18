import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Navbar from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JPAfio - Free File Converter',
  description:
    'Convert your files for free with JPAfio. Transform images, audio and video easy and fast. No restrictons, no limits.',
  creator: 'jpaddeo',
  keywords:
    'image converter, audio converter, video converter, free, fast, unlimited',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Navbar />
        <Toaster />
        <main className='pt-32 min-h-screen lg:pt-36 2xl:pt-44 container max-w-4xl lg:max-w-6xl 2xl:max-w-7xl'>
          {children}
        </main>
      </body>
      1
    </html>
  );
}
