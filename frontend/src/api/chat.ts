import { Message } from '../types/types';
import paths from './paths.json';

const env = import.meta.env;

export const postChat = async (message: Message): Promise<Message> => {
  return fetch(`${env.VITE_BACKEND_URL}${paths.CHAT}`, {
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
    `${env.VITE_BACKEND_URL}${paths.CHAT_THREAD.replace(':context', context)}`,
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

export const deleteChatThreadByContext = async (
  context: string,
): Promise<{ [key: string]: string }> => {
  return fetch(
    `${env.VITE_BACKEND_URL}${paths.CHAT_THREAD.replace(':context', context)}`,
    {
      method: 'DELETE',
    },
  )
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error(`Error deleting chat thread: ${context}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
};
