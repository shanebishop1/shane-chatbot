import React from 'react';
import './App.css';
import ChatContainer from './components/ChatContainer/ChatContainer';
import { GoogleLogin } from '@react-oauth/google';
import { useUserInfo } from './context/userInfoContext';

const App: React.FC = () => {
  const { isLoadingLogin, setGoogleIdToken, isAccessTokenValid } =
    useUserInfo();

  // Show loading spinner if we're currently retrieving an access token
  if (isLoadingLogin) {
    return <div className="spinner" />;
  }

  /// Show login page if we do not have a valid, unexpired access token
  if (!isAccessTokenValid) {
    return (
      <div className="authContainer" data-testid="authContainer">
        <GoogleLogin
          onSuccess={(response) => {
            setGoogleIdToken(response.credential ?? '');
          }}
        />
      </div>
    );
  }

  // Render the chat window if we have a valid access token
  return (
    <div className="appContainer">
      <ChatContainer />
    </div>
  );
};

export default App;
