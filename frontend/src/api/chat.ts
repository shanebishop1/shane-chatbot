import { AccessToken, Message } from '../types/types';
import paths from './paths.json';

const env = import.meta.env;

export const postChat = async (
  message: Message,
  token: AccessToken,
): Promise<Message | null> => {
  return fetch(`${env.VITE_BACKEND_URL}${paths.CHAT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token?.access_token}`,
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
      console.error(error);
      return null;
    });
};

export const getChatThreadByContext = async (
  context: string,
  token: AccessToken,
): Promise<Message[]> => {
  return fetch(
    `${env.VITE_BACKEND_URL}${paths.CHAT_THREAD.replace(':context', context)}`,
    {
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
      },
    },
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
      console.error('Error fetching chat thread:', error);
      return [];
    });
};

export const deleteChatThreadByContext = async (
  context: string,
  token: AccessToken,
): Promise<{ [key: string]: string }> => {
  return fetch(
    `${env.VITE_BACKEND_URL}${paths.CHAT_THREAD.replace(':context', context)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token?.access_token}`,
      },
    },
  )
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error(`Error deleting ${context} chat thread`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};
