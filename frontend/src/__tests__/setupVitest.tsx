import * as matchers from '@testing-library/jest-dom/matchers';
import * as mocks from './__mocks__/mocks';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserInfoProvider } from '../context/userInfoContext';
import { render } from '@testing-library/react';
import { expect } from 'vitest';
import { vi } from 'vitest';
import * as auth from '../api/auth';
import { ReactElement } from 'react';

expect.extend(matchers);

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.resetAllMocks();
});

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = function () {};
});

export const renderWithWrappers = (component: ReactElement) => {
  const loginMock = vi.spyOn(auth, 'login');
  const refreshAccessTokenMock = vi.spyOn(auth, 'refreshAccessToken');
  loginMock.mockResolvedValue(mocks.authResponse);
  refreshAccessTokenMock.mockResolvedValue(mocks.authResponse);
  render(
    <GoogleOAuthProvider clientId={mocks.googleIdToken}>
      <UserInfoProvider>{component}</UserInfoProvider>
    </GoogleOAuthProvider>,
  );
};
