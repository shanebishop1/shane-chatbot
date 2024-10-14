import { Message } from '../types/types';
import paths from './paths.json';

const env = import.meta.env;

export const postChat = async (message: Message): Promise<Message> => {
  return fetch(`${env.VITE_BACKEND_URL}${paths.POST_CHAT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error(`Error submitting message: ${message}`);
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

export const getChatThreadByContext = async (
  context: string,
): Promise<Message[]> => {
  return fetch(
    `${env.VITE_BACKEND_URL}${paths.GET_CHAT_THREAD.replace(':context', context)}`,
  )
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error(`Error fetching chat thread: ${context}`);
      }
      return response.json();
    })
    .then((data) => {
      return data as Message[];
    })
    .catch((error) => {
      throw error;
    });
};
