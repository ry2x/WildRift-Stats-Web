import { render, screen } from '@testing-library/react';
import { ChampionCard } from '../ChampionCard';
import { Champion, RoleKey, LaneKey } from '@/types';

// Mock next/image as a simple img tag
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        {...props}
        fill={undefined}
        sizes={undefined}
        priority={undefined}
        loading={undefined}
        placeholder={undefined}
        blurDataURL={undefined}
        src={props.src || ''}
        alt={props.alt || ''}
      />
    );
  },
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe('ChampionCard', () => {
  const mockChampion: Champion = {
    id: 'Ahri',
    key: 103,
    name: 'アーリ',
    title: '九尾の狐',
    describe: 'キツネの姿をした魔女',
    roles: ['mage' as RoleKey, 'assassin' as RoleKey],
    type: 'AP',
    is_wr: true,
    lanes: ['mid' as LaneKey],
    is_free: false,
    difficult: 2,
    damage: 3,
    survive: 1,
    utility: 2,
    hero_id: 103,
  };

  it('displays basic champion information correctly', () => {
    render(<ChampionCard champion={mockChampion} />);

    // Check if champion name is displayed
    expect(screen.getByText('アーリ')).toBeInTheDocument();

    // Check if roles are displayed
    expect(screen.getByText('メイジ')).toBeInTheDocument();
    expect(screen.getByText('アサシン')).toBeInTheDocument();

    // Check if champion image is displayed with correct src
    const championImage = screen.getByAltText('アーリ') as HTMLImageElement;
    expect(championImage.src).toContain('Ahri.png');
  });

  it('has correct link to champion detail page', () => {
    render(<ChampionCard champion={mockChampion} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/champions/Ahri');
  });
});
