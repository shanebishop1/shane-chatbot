import { vi } from 'vitest';
import { screen } from '@testing-library/react';
import * as mocks from './__mocks__/mocks';
import App from '../App';
import { renderWithWrappers } from './setupVitest';

vi.mock('../api/auth', () => {
  return {
    login: () => {
      return Promise.resolve(mocks.authResponse);
    },
    refreshAccessToken: () => {
      return Promise.resolve(mocks.authResponse);
    },
  };
});

describe('App rendering', () => {
  it('should initially render the app on the authentication screen', () => {
    renderWithWrappers(<App />);
    expect(screen.getByTestId('authContainer')).toBeInTheDocument();
  });
});
