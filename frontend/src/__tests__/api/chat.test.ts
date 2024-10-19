import {
  postChat,
  getChatThreadByContext,
  deleteChatThreadByContext,
} from '../../api/chat';
import { Message } from '../../types/types';
import * as mocks from '../__mocks__/mocks';
import paths from '../../api/paths.json';

const env = import.meta.env;

describe('Chat API tests', () => {
  it('should post a chat message successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mocks.message,
    });

    const response = await postChat(mocks.message, mocks.accessToken);

    expect(response).toEqual(mocks.message as Message);
    expect(fetch).toHaveBeenCalledWith(`${env.VITE_BACKEND_URL}${paths.CHAT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mocks.accessToken?.access_token}`,
      },
      body: JSON.stringify(mocks.message),
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should get chat thread by context successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mocks.thread,
    });

    const response = await getChatThreadByContext(
      'testContext',
      mocks.accessToken,
    );

    expect(response).toEqual(mocks.thread as Message[]);
    expect(fetch).toHaveBeenCalledWith(
      `${env.VITE_BACKEND_URL}${paths.CHAT_THREAD.replace(':context', 'testContext')}`,
      {
        headers: {
          Authorization: `Bearer ${mocks.accessToken?.access_token}`,
        },
      },
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should delete chat thread by context successfully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Chat thread deleted successfully' }),
    });

    const response = await deleteChatThreadByContext(
      'testContext',
      mocks.accessToken,
    );

    expect(response).toEqual({ message: 'Chat thread deleted successfully' });
    expect(fetch).toHaveBeenCalledWith(
      `${env.VITE_BACKEND_URL}${paths.CHAT_THREAD.replace(':context', 'testContext')}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${mocks.accessToken?.access_token}`,
        },
      },
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
