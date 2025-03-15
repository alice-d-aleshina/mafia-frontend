import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import DiscussionPhase from '@/pages/mafia-game-day-discussion-phase';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Discussion Phase', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    // Мокаем window.location.search
    Object.defineProperty(window, 'location', {
      value: {
        search: '?candidates=1,2,3&roomId=test-room'
      }
    });
  });

  it('renders discussion phase correctly', () => {
    const { getByText } = render(<DiscussionPhase />);
    
    expect(getByText('ДЕНЬ')).toBeInTheDocument();
    expect(getByText('Речь игрока 1')).toBeInTheDocument();
    expect(getByText('Порядок выступлений: 1, 2, 3')).toBeInTheDocument();
    expect(getByText('Конец Речи')).toBeInTheDocument();
  });

  it('handles next speaker transition', () => {
    const { getByText } = render(<DiscussionPhase />);
    
    const nextButton = getByText('Конец Речи');
    nextButton.click();
    
    expect(getByText('Речь игрока 2')).toBeInTheDocument();
  });
}); 