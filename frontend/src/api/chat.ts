import { Message } from '../types/types';
import paths from './paths.json';

const env = import.meta.env;

export const postChat = async (message: Message): Promise<Message> => {
  console.log('message', JSON.stringify(message));
  return fetch(`${env.VITE_BACKEND_URL}${paths.POST_CHAT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
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
      throw error;
    });
};
