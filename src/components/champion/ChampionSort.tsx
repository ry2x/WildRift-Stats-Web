'use client';

import { useSort, SortKey, SortOrder } from '@/contexts/SortContext';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'name', label: '名前' },
  { value: 'difficult', label: '難易度' },
  { value: 'damage', label: 'ダメージ' },
  { value: 'survive', label: '生存性' },
  { value: 'utility', label: 'ユーティリティ' },
];

interface ChampionSortProps {
  sortBy: SortKey;
  onSortChange: (key: SortKey) => void;
  sortOrder: SortOrder;
  onOrderChange: (order: SortOrder) => void;
}

export function ChampionSort({
  sortBy,
  onSortChange,
  sortOrder,
  onOrderChange,
}: ChampionSortProps) {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleOrder = () => {
    onOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          並び替え
          <span className="ml-2 text-sm text-blue-500">
            ({sortOptions.find(opt => opt.value === sortBy)?.label})
          </span>
        </h3>
        <ChevronUpIcon
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200
            ${isOpen ? '' : 'rotate-180'}`}
        />
      </button>

      <div
        className={`mt-4 transition-all duration-200 overflow-hidden
        ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="flex flex-wrap gap-2">
          {sortOptions.map(option => (
            <button
              key={option.value}
              onClick={() => {
                if (sortBy === option.value) {
                  toggleOrder();
                } else {
                  onSortChange(option.value);
                  onOrderChange('asc');
                }
              }}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md 
                transition-all duration-200 
                ${
                  sortBy === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              <span>{option.label}</span>
              {sortBy === option.value && (
                <ArrowUpIcon
                  className={`
                    w-4 h-4 transition-transform duration-200
                    ${sortOrder === 'desc' ? 'rotate-180' : ''}
                  `}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
