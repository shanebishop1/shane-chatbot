import { render, screen, fireEvent } from '@testing-library/react';
import PrefsModal from '../../../components/PrefsModal/PrefsModal';
import { MessageContext } from '../../../context/messageContext';
import { UserInfoContext } from '../../../context/userInfoContext';
import { vi } from 'vitest';
import { renderWithWrappers } from '../../setupVitest';
import * as mocks from '../../__mocks__/mocks';
import * as chat from '../../../api/chat';

describe('PrefsModal tests', () => {
  const mockSetShowPrefs = vi.fn();
  const mockUserCurrentContext = 'mockContext';
  const mockOpenModalButtonRef = { current: document.createElement('button') };

  beforeEach(() => {
    renderWithWrappers(
      <UserInfoContext.Provider value={mocks.userInfoContext}>
        <MessageContext.Provider value={mocks.messageContext}>
          <PrefsModal
            setShowPrefs={mockSetShowPrefs}
            userCurrentContext={mockUserCurrentContext}
            openModalButtonRef={mockOpenModalButtonRef}
          />
        </MessageContext.Provider>
      </UserInfoContext.Provider>,
    );
    vi.clearAllMocks();
  });

  it('should render the modal', () => {
    const modal = screen.getByText('Clear Context');
    expect(modal).toBeInTheDocument();
  });

  it('should call clearMessages and deleteChatThreadByContext when the button is clicked', () => {
    const mockDeleteChatThreadByContext = vi.spyOn(
      chat,
      'deleteChatThreadByContext',
    );
    const button = screen.getByRole('button', { name: /clear context/i });
    fireEvent.click(button);

    expect(mockSetShowPrefs).toHaveBeenCalledWith(false);
    expect(mocks.messageContext.clearMessages).toHaveBeenCalled();
    expect(mockDeleteChatThreadByContext).toHaveBeenCalled();
  });

  it('should close the modal when clicking outside of it', () => {
    fireEvent.mouseDown(document);
    expect(mockSetShowPrefs).toHaveBeenCalledWith(false);
  });
});
