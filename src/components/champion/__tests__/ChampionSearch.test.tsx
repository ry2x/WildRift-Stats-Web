import { render, screen, fireEvent } from '@testing-library/react';
import { ChampionSearch } from '../ChampionSearch';
import { createContext } from 'react';
import type { ChampionContextType } from '@/contexts/ChampionContext';

// Create a mock context
const ChampionContext = createContext<ChampionContextType>({
  champions: [],
  loading: false,
  error: null,
  refreshChampions: async () => {},
  searchTerm: '',
  setSearchTerm: () => {},
  filteredChampions: [],
  retryFetch: async () => {},
});

// Mock the champion context
const mockSetSearchTerm = jest.fn();
const mockContextValue: ChampionContextType = {
  champions: [],
  loading: false,
  error: null,
  refreshChampions: jest.fn(),
  searchTerm: '',
  setSearchTerm: mockSetSearchTerm,
  filteredChampions: [],
  retryFetch: jest.fn(),
};

// Mock the useChampions hook
jest.mock('@/contexts/ChampionContext', () => ({
  useChampions: () => mockContextValue,
}));

describe('ChampionSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('The search input field should display correctly', () => {
    render(<ChampionSearch />);

    expect(screen.getByText('チャンピオン検索')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('チャンピオン名を入力...')
    ).toBeInTheDocument();
  });

  it('should call setSearchTerm when text is entered', () => {
    render(<ChampionSearch />);

    const searchInput = screen.getByPlaceholderText('チャンピオン名を入力...');
    fireEvent.change(searchInput, { target: { value: 'アーリ' } });

    setTimeout(() => {
      expect(mockSetSearchTerm).toHaveBeenCalledWith('アーリ');
    }, 300);
  });

  it('should call setSearchTerm when input value is empty', () => {
    render(<ChampionSearch />);

    const searchInput = screen.getByPlaceholderText('チャンピオン名を入力...');
    fireEvent.change(searchInput, { target: { value: '' } });

    setTimeout(() => {
      expect(mockSetSearchTerm).toHaveBeenCalledWith('');
    }, 300);
  });
});
