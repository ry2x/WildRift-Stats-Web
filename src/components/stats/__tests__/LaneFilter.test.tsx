import { render, screen, fireEvent } from '@testing-library/react';
import { LaneFilter } from '../LaneFilter';
import { Lane } from '@/types';
import { laneDisplayNames } from '@/constants/game';

describe('LaneFilter Component', () => {
  const mockSelectedLane: Lane = '1';
  const mockAvailableLanes: Lane[] = ['1', '2', '3', '4', '5'];
  const mockOnLaneChange = jest.fn();
  const mockSetIsOpen = jest.fn();

  const defaultProps = {
    selectedLane: mockSelectedLane,
    isOpen: false,
    setIsOpen: mockSetIsOpen,
    onLaneChange: mockOnLaneChange,
    availableLanes: mockAvailableLanes,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders lane filter header with selected lane name', () => {
    render(<LaneFilter {...defaultProps} />);

    // Check if the button displays correct lane name in header
    expect(screen.getByText(`(${laneDisplayNames[mockSelectedLane]})`)).toBeInTheDocument();
  });

  it('handles accordion state correctly', () => {
    render(<LaneFilter {...defaultProps} />);
    
    const button = screen.getByText('レーンの選択');
    fireEvent.click(button);

    // Check if setIsOpen was called with the opposite of current state
    expect(mockSetIsOpen).toHaveBeenCalledWith(true);
  });

  it('shows all available lane options when expanded', () => {
    render(<LaneFilter {...defaultProps} isOpen={true} />);

    // Verify all lane options are visible
    mockAvailableLanes.forEach(lane => {
      expect(screen.getByText(laneDisplayNames[lane])).toBeInTheDocument();
    });
  });

  it('triggers lane selection callback on click', () => {
    render(<LaneFilter {...defaultProps} isOpen={true} />);

    // Select a different lane and verify callback
    const newLaneButton = screen.getByText(laneDisplayNames['2']);
    fireEvent.click(newLaneButton);

    expect(mockOnLaneChange).toHaveBeenCalledWith('2');
  });

  it('applies correct styles based on selection state', () => {
    render(<LaneFilter {...defaultProps} isOpen={true} />);

    // Verify selected lane has active styles
    const selectedButton = screen.getByText(laneDisplayNames[mockSelectedLane]);
    expect(selectedButton).toHaveClass('from-blue-500');
    
    // Verify non-selected lanes have default styles
    const unselectedButton = screen.getByText(laneDisplayNames['2']);
    expect(unselectedButton).toHaveClass('from-white/80');
  });
});
