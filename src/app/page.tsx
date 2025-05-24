'use client';

import Title from '@/components/home/Title';
import Selection from '@/components/home/Selection';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950">
      <Title />
      <Selection />
    </div>
  );
}
