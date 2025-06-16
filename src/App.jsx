import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

const API_BASE_URL = 'https://chatbot-poc-fkazdzdng0d0buc5.eastus2-01.azurewebsites.net';

const ChatbotApp = () => {
  const [username, setUsername] = useState('user');
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchAzureUser = async () => {
    const res = await fetch("/.auth/me");
    const data = await res.json();
    if (data.clientPrincipal) {
      setUsername(data.clientPrincipal.userDetails);
      setIsLoggedIn(true);
    }
  };

  const createSession = async () => {
    const res = await fetch(`${API_BASE_URL}/session/new`);
    const data = await res.json();
    return data.session_id;
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    const newMsg = { role: 'user', content: inputMessage.trim() };
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setIsLoading(true);

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMsg.content, session_id: sessionId }),
    });

    const data = await response.json();
    setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    setIsLoading(false);
  };

  // const startNewChat = async () => {
  //   const newSessionId = await createSession();
  //   setSessionId(newSessionId);
  //   setMessages([]);
  // };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setMessages([]);
    setSessionId('');
    // remove cookies or session storage if needed
    window.location.href = '/.auth/logout'; // Redirect to logout endpoint
    window.location.href = '/'; // Redirect to home page after logout
  };

  useEffect(() => {
    fetchAzureUser();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isLoggedIn) {
      createSession().then(setSessionId);
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar username={username} onLogout={handleLogout} />
      <ChatWindow messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
      <ChatInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSend={handleSend}
        handleKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatbotApp;
