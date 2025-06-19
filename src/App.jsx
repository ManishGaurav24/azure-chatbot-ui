import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar';
import { Toaster, toast } from 'react-hot-toast';

const API_BASE_URL = 'https://chatbot-poc-fkazdzdng0d0buc5.eastus2-01.azurewebsites.net';

const App = () => {
  const [userData, setUserData] = useState({
    userId: '',
    userRoles: [],
    userDetails: '',
  });
  const [username, setUsername] = useState('user');
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchAzureUser = async () => {
    const res = await fetch("/.auth/me");
    const data = await res.json();
    if (data.clientPrincipal) {
      setUserData({
        userId: data.clientPrincipal.userId,
        userRoles: data.clientPrincipal.userRoles || [],
        userDetails: data.clientPrincipal.userDetails || '',
      });
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
    if (!isLoggedIn) {
      toast.error('Please log in to send messages.');
      return;
    }
    if (!inputMessage.trim()) return;

    const newMsg = { role: 'user', content: inputMessage.trim() };
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setIsLoading(true);

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: newMsg.content,
        session_id: sessionId,
        user_id: userData.userId,
        user_roles: userData.userRoles,
      }),
    });

    const data = await response.json();
    setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setMessages([]);
    setSessionId('');
    localStorage.clear();
    sessionStorage.clear();
    toast.success('Logged out successfully! Redirecting...');
    setTimeout(() => {
      window.location.href = '/.auth/logout?post_logout_redirect_uri=/';
    }, 1500);
  };

  const handleSessionSelect = (session) => {
    setSessionId(session.session_id);
    setMessages(session.messages || []);
    setIsSidebarOpen(false);
  };

  const handleNewChat = async () => {
    const newSessionId = await createSession();
    setSessionId(newSessionId);
    setMessages([]);
    setIsSidebarOpen(false);
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
    <div className="h-screen flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />

      <Navbar 
        username={username} 
        userId={userData.userId} 
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        userId={userData.userId}
        onSessionSelect={handleSessionSelect}
        onNewChat={handleNewChat}
      />

      {/* Chat window takes remaining vertical space and is scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {/* Chat input always at the bottom */}
      <div className="px-4 py-2 bg-white">
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
    </div>
  );
};

export default App;
