import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { MainLayout } from '@/components/layout/MainLayout';
import { ChampionProvider } from '@/contexts/ChampionContext';
import { StatsProvider } from '@/contexts/StatsContext';
import { FilterProvider } from '@/contexts/FilterContext';
import { SortProvider } from '@/contexts/SortContext';
import './globals.css';

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
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FilterProvider>
          <SortProvider>
            <ChampionProvider>
              <StatsProvider>
                <MainLayout>{children}</MainLayout>
              </StatsProvider>
            </ChampionProvider>
          </SortProvider>
        </FilterProvider>
      </body>
    </html>
  );
}
