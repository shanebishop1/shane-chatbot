import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import * as mocks from '../../__mocks__/mocks';
import ChatContainer from '../../../components/ChatContainer/ChatContainer';
import { renderWithWrappers } from '../../setupVitest';
import * as chat from '../../../api/chat';
const loginMock = vi.spyOn(chat, 'getChatThreadByContext');
loginMock.mockResolvedValue([]);

vi.mock('../../api/auth', () => {
  return {
    login: () => {
      return Promise.resolve(mocks.authResponse);
    },
    refreshAccessToken: () => {
      return Promise.resolve(mocks.authResponse);
    },
  };
});

describe('ChatContainer rendering', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = function () {};
  });
  it('should render the MessagesContainer and InputContainer components', () => {
    renderWithWrappers(<ChatContainer />);
    expect(screen.getByTestId('messagesContainer')).toBeInTheDocument();
    expect(screen.getByTestId('inputContainer')).toBeInTheDocument();
  });
});
