import { Message } from '../types/types';

const env = import.meta.env;

export const fetchLLMResponse = async (): Promise<Message> => {
  return fetch(env.VITE_BACKEND_URL)
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error('Error fetching');
      }
      return response.json();
    })
    .then((data) => {
      return data as Message;
    })
    .catch((error) => {
      console.error('Error', error);
      throw error;
    });
};
