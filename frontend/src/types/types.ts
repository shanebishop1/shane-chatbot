export type Message = {
  id: number;
  sender: string;
  text: string;
  context: string;
  timestamp: string;
};

export type MessageContextType = {
  messages: Message[];
  pushMessage: (newMessage: Message) => void;
  clearMessages: () => void;
  setMessages: (messages: Message[]) => void;
};

export type UserInfoContextType = {
  email: string;
  accessToken: AccessToken;
  googleIdToken: string;
  isLoadingLogin: boolean;
  isAccessTokenValid: boolean;
  setGoogleIdToken: (googleIdToken: string) => void;
};

export type AuthResponse = {
  access_token: string;
  exp: number;
  email: string;
} | null;

export type AccessToken = {
  access_token: string;
  exp: number;
} | null;
