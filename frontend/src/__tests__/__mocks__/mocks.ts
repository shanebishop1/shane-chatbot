import {
  AccessToken,
  AuthResponse,
  Message,
  MessageContextType,
  UserInfoContextType,
} from '../../types/types';
import { vi } from 'vitest';

export const googleIdToken: string = '123';

export const accessToken: AccessToken = {
  access_token: '123',
  exp: 10,
} as AccessToken;

export const authResponse: AuthResponse = {
  ...accessToken,
  email: 'email@email.com',
} as AuthResponse;

export const message: Message = {
  id: 0,
  sender: 'User',
  text: 'MessageText',
  context: 'Context1',
  timestamp: '2018-01-01T00:00:00.000Z',
} as Message;

export const message2: Message = {
  id: 1,
  sender: 'System',
  text: 'Response',
  context: 'Context1',
  timestamp: '2018-01-01T00:01:00.000Z',
} as Message;

export const thread: Message[] = [message, message2];

export const userInfoContext: UserInfoContextType = {
  email: 'email@email.com',
  accessToken: accessToken,
  googleIdToken: '',
  isLoadingLogin: false,
  isAccessTokenValid: true,
  setGoogleIdToken: () => {},
} as UserInfoContextType;

export const messageContext: MessageContextType = {
  messages: [],
  pushMessage: () => {},
  clearMessages: vi.fn(),
  setMessages: () => {},
} as MessageContextType;
