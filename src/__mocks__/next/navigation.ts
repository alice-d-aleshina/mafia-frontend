import { jest } from '@jest/globals';

const mockPush = jest.fn();
const mockRouter = jest.fn().mockReturnValue({
  push: mockPush,
});

const mockGet = jest.fn();
const mockSearchParams = jest.fn().mockReturnValue({
  get: mockGet,
});

export const useRouter = mockRouter;
export const useSearchParams = mockSearchParams; 