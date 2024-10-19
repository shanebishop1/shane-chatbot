import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import * as mocks from '../../__mocks__/mocks';
import ProfilePicture from '../../../components/ProfilePicture/ProfilePicture';
import { UserInfoContext } from '../../../context/userInfoContext';
import { renderWithWrappers } from '../../setupVitest';
import { MessageContext } from '../../../context/messageContext';
import * as auth from '../../../api/auth';

const loginMock = vi.spyOn(auth, 'login');
const refreshAccessTokenMock = vi.spyOn(auth, 'refreshAccessToken');

describe('ProfilePicture tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const renderComponent = (imageType: string) => {
    renderWithWrappers(
      <UserInfoContext.Provider value={mocks.userInfoContext}>
        <MessageContext.Provider value={mocks.messageContext}>
          <ProfilePicture src="test.jpg" imageType={imageType} />
        </MessageContext.Provider>
      </UserInfoContext.Provider>,
    );
  };

  it('should render the profile picture container', () => {
    renderComponent('User');
    const profileImgContainer = screen.getByTestId('profileImgContainer');
    expect(profileImgContainer).toBeInTheDocument();
  });

  it('should render initial when imageType is User', () => {
    renderComponent('User');
    const initialProfileImg = screen.getByText('E');
    expect(initialProfileImg).toBeInTheDocument();
  });

  it('should render image when imageType is not User', () => {
    const imageType: string = 'LLM';
    renderComponent(imageType);
    const imgElement = screen.getByAltText(`${imageType} Profile Image`);
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'test.jpg');
  });
});
