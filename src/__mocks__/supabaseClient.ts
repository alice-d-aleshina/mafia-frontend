import { jest } from '@jest/globals';

const signUpMock = jest.fn();
const signInWithPasswordMock = jest.fn();
const fromMock = jest.fn();
const selectMock = jest.fn();
const eqMock = jest.fn();
const singleMock = jest.fn();

fromMock.mockReturnThis();
selectMock.mockReturnThis();
eqMock.mockReturnThis();

export const supabase = {
  auth: {
    signUp: signUpMock,
    signInWithPassword: signInWithPasswordMock
  },
  from: fromMock,
  select: selectMock,
  eq: eqMock,
  single: singleMock
}; 