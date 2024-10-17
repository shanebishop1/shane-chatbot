import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';
import { UserInfoProvider } from './context/userInfoContext.tsx';

const env = import.meta.env;

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={env.VITE_GOOGLE_CLIENT_ID}>
    <UserInfoProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </UserInfoProvider>
  </GoogleOAuthProvider>,
);
