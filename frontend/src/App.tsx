import { useState } from 'react';
import './App.css';
import ChatContainer from './components/ChatContainer/ChatContainer';
const s = 'a';

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="appContainer">
      <ChatContainer />
    </div>
  );
}

export default App;
