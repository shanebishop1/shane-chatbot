import { login, refreshAccessToken } from '../../api/auth';
import * as mocks from '../__mocks__/mocks';
import paths from '../../api/paths.json';
const env = import.meta.env;

describe('Auth tests', () => {
  it('should return a valid AuthResponse if login fetch was successful', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mocks.authResponse,
    });

    const response = await login(mocks.googleIdToken);

    expect(response).toEqual(mocks.authResponse);
    expect(fetch).toHaveBeenCalledWith(
      `${env.VITE_BACKEND_URL}${paths.LOGIN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: mocks.googleIdToken }),
      },
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should return a refreshed AuthResponse if refresh fetch was successful', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mocks.authResponse,
    });

    const response = await refreshAccessToken();

    expect(response).toEqual(mocks.authResponse);
    expect(fetch).toHaveBeenCalledWith(
      `${env.VITE_BACKEND_URL}${paths.REFRESH}`,
      {
        method: 'POST',
        credentials: 'include',
      },
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
