import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import MessagesContainer from '../../../components/MessagesContainer/MessagesContainer';
import * as mocks from '../../__mocks__/mocks';
import { renderWithWrappers } from '../../setupVitest';
import { MessageContext } from '../../../context/messageContext';

describe('MessagesContainer tests', () => {
  beforeEach(() => {
    renderWithWrappers(
      <MessageContext.Provider
        value={{
          messages: [],
          pushMessage: vi.fn(),
          clearMessages: vi.fn(),
          setMessages: vi.fn(),
        }}
      >
        <MessagesContainer />
      </MessageContext.Provider>,
    );
  });
  it('should render the messages container', () => {
    const messagesContainer = screen.getByTestId('messagesContainer');
    expect(messagesContainer).toBeInTheDocument();
  });

  it('should render messages when context is updated', () => {
    expect(screen.queryByText(mocks.thread[0].text)).not.toBeInTheDocument();
    expect(screen.queryByText(mocks.thread[1].text)).not.toBeInTheDocument();
    renderWithWrappers(
      <MessageContext.Provider
        value={{
          messages: mocks.thread,
          pushMessage: vi.fn(),
          clearMessages: vi.fn(),
          setMessages: vi.fn(),
        }}
      >
        <MessagesContainer />
      </MessageContext.Provider>,
    );

    expect(screen.getByText(mocks.thread[0].text)).toBeInTheDocument();
    expect(screen.getByText(mocks.thread[1].text)).toBeInTheDocument();
  });
});
