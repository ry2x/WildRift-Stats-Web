'use client';

import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
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
      className="base-card group p-8 rounded-2xl shadow-lg hover:shadow-xl duration-200 border hover:scale-105"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
        <span className="inline-block ml-2 align-middle text-blue-500 group-hover:translate-x-1 transition-transform hover:scale-105">
          <ArrowLongRightIcon className="size-7" />
        </span>
      </h2>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </Link>
  );
}
