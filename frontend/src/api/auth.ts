import { AuthResponse } from '../types/types';
import paths from './paths.json';

const env = import.meta.env;

export const login = async (googleIdToken: string): Promise<AuthResponse> => {
  return fetch(`${env.VITE_BACKEND_URL}${paths.LOGIN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: googleIdToken }),
  })
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error(`Error logging user in`);
      }
      return response.json();
    })
    .then((authResponse) => {
      return authResponse as AuthResponse;
    })
    .catch((error) => {
      console.error('Error logging user in:', error);
      return null;
    });
};

export const refreshAccessToken = async (): Promise<AuthResponse> => {
  return fetch(`${env.VITE_BACKEND_URL}${paths.REFRESH}`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error(`Error logging user in`);
      }
      return response.json();
    })
    .then((authResponse) => {
      return authResponse as AuthResponse;
    })
    .catch((error) => {
      console.error('Error refreshing access token:', error);
      return null;
    });
};
