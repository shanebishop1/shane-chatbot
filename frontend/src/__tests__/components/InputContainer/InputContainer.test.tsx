import { screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { renderWithWrappers } from '../../setupVitest';
import InputContainer from '../../../components/InputContainer/InputContainer';
import { MessageProvider } from '../../../context/messageContext';
import * as chat from '../../../api/chat';
const loginMock = vi.spyOn(chat, 'getChatThreadByContext');
loginMock.mockResolvedValue([]);

describe('InputContainer rendering', () => {
  beforeEach(() => {
    renderWithWrappers(
      <MessageProvider>
        <InputContainer />
      </MessageProvider>,
    );
  });
  it('should render the input field', () => {
    const inputField = screen.getByPlaceholderText('Your question');
    expect(inputField).toBeInTheDocument();
  });

  it('should render the context select field', () => {
    const selectField = screen.getByText('Context');
    expect(selectField).toBeInTheDocument();
  });

  it('should update the input field when text is entered', () => {
    const inputField = screen.getByPlaceholderText(
      'Your question',
    ) as HTMLInputElement;
    fireEvent.change(inputField, { target: { value: 'Test question' } });
    expect(inputField.value).toBe('Test question');
  });

  it('should update the context select field when an option is selected', () => {
    const selectField = screen.getByRole('combobox');
    fireEvent.change(selectField, { target: { value: 'my_account' } });
    expect((selectField as HTMLSelectElement).value).toBe('my_account');
  });
});
