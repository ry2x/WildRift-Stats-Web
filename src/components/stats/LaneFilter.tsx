import { ChevronUpIcon, MapIcon } from '@heroicons/react/24/outline';
import { FC } from 'react';

import { laneDisplayNames } from '@/constants/game';
import { Lane } from '@/types/stats';

interface LaneFilterProps {
  selectedLane: Lane;
  onChange: (lane: Lane) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  lanes: Lane[];
}

/**
 * LaneFilter component for selecting game lanes.
 * Props:
 * - selectedLane: currently selected lane
 * - onChange: callback when lane changes
 * - isOpen: whether the filter is expanded
 * - setIsOpen: function to toggle open state
 * - lanes: available lanes for selection
 */
export const LaneFilter: FC<LaneFilterProps> = ({
  selectedLane,
  onChange,
  isOpen,
  setIsOpen,
  lanes,
}) => {
  return (
    <div className="pt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left px-4"
      >
        <div className="flex items-center gap-2">
          <MapIcon className="w-6 h-6 text-blue-500 dark:text-blue-300" />
          <h3 className="text-lg font-semibold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
            レーンの選択
            <span className="ml-2 text-sm text-blue-400 dark:text-blue-300">
              ({laneDisplayNames[selectedLane]})
            </span>
          </h3>
        </div>
        <ChevronUpIcon
          className={`w-5 h-5 text-blue-400 dark:text-blue-300 transition-transform duration-200
            ${isOpen ? '' : 'rotate-180'}`}
        />
      </button>

      <div
        className={`mt-4 transition-all duration-200 overflow-hidden
        ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="flex flex-wrap gap-2 px-4">
          {lanes.map(lane => (
            <button
              key={lane}
              onClick={() => onChange(lane)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                selectedLane === lane ? 'base-btn-on' : 'base-btn-off'
              } backdrop-blur-sm border border-blue-200/20 dark:border-blue-400/20`}
            >
              {laneDisplayNames[lane]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
