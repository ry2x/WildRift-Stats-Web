import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { MainLayout } from '@/components/layout';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ChampionProvider } from '@/contexts/ChampionContext';
import { FilterProvider } from '@/contexts/FilterContext';
import { SortProvider } from '@/contexts/SortContext';
import { StatsProvider } from '@/contexts/StatsContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Wild Rift Stats',
  description: 'Wild Riftのチャンピオン統計情報サイト',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="WRStats" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <FilterProvider>
            <SortProvider>
              <ChampionProvider>
                <StatsProvider>
                  <MainLayout>{children}</MainLayout>
                </StatsProvider>
              </ChampionProvider>
            </SortProvider>
          </FilterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
