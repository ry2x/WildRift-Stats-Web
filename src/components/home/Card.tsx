'use client';

import Link from 'next/link';

interface CardProps {
  title: string;
  description: string;
  href: string;
}

export default function Card({ title, description, href }: CardProps) {
  return (
    <Link
      href={href}
      className="group p-8 bg-linear-to-br from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-blue-900/80 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm border border-white/20 dark:border-blue-900/20"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
        <span className="inline-block ml-2 text-blue-500 group-hover:translate-x-1 transition-transform">
          →
        </span>
      </h2>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </Link>
  );
}
