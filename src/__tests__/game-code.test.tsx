import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/contexts/RoomContext';
import GameCode from '@/pages/game-code';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/RoomContext', () => ({
  useRoom: jest.fn(),
}));

// Мок для navigator.clipboard
const mockClipboard = {
  writeText: jest.fn(),
};
Object.assign(navigator, { clipboard: mockClipboard });

describe('Game Code', () => {
  const mockPush = jest.fn();
  const mockSetRoomId = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useRoom as jest.Mock).mockReturnValue({
      setRoomId: mockSetRoomId,
    });
  });

  it('renders game code screen correctly', () => {
    const { getByText } = render(<GameCode />);
    
    expect(getByText('Mafia')).toBeInTheDocument();
    expect(getByText('Код вашей игры')).toBeInTheDocument();
    expect(getByText('Готово')).toBeInTheDocument();
  });

  it('generates game code', () => {
    const { container } = render(<GameCode />);
    
    const codeElement = container.querySelector('.text-lg.font-medium');
    expect(codeElement?.textContent).toMatch(/^\d{4}$/);
  });

  it('handles code copy', () => {
    const { container } = render(<GameCode />);
    
    const copyButton = container.querySelector('button');
    copyButton?.click();
    
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it('handles continue to game', () => {
    const { getByText } = render(<GameCode />);
    
    const continueButton = getByText('Готово');
    continueButton.click();
    
    expect(mockPush).toHaveBeenCalledWith('/mafia-create-game');
  });
}); 