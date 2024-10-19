import { screen } from '@testing-library/react';
import { renderWithWrappers } from '../../setupVitest';
import LLMMessage from '../../../components/LLMMessage/LLMMessage';

describe('LLMMessage tests', () => {
  it('should render the message', () => {
    renderWithWrappers(<LLMMessage message="Test message" />);
    const messageElement = screen.getByText('Test message');
    expect(messageElement).toBeInTheDocument();
  });

  it('should render the profile picture', () => {
    renderWithWrappers(<LLMMessage message="Test message" />);
    const profilePictureElement = screen.getByRole('img');
    expect(profilePictureElement).toBeInTheDocument();
  });
});
