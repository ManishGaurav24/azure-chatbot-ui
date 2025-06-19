import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Calendar } from 'lucide-react';

const API_BASE_URL = 'https://chatbot-poc-fkazdzdng0d0buc5.eastus2-01.azurewebsites.net';

const Sidebar = ({ userId, onSessionSelect, onNewChat }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChatHistory = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/session/history?user_id=${userId}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChatHistory(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchChatHistory();
    }
  }, [userId]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getPreviewText = (messages) => {
    if (!messages || messages.length === 0) return 'No messages';
    const firstUserMessage = messages.find((msg) => msg.role === 'user');
    if (firstUserMessage) {
      return firstUserMessage.content.length > 50
        ? firstUserMessage.content.substring(0, 50) + '...'
        : firstUserMessage.content;
    }
    return 'New conversation';
  };

  return (
    <div className="fixed top-0 left-0 h-full w-80 bg-gray-50 z-50 flex flex-col border-r">

      {/* New Chat Button */}
      <div className="p-2">
        <button
          onClick={onNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <MessageCircle size={18} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center space-x-2">
            <Calendar size={16} />
            <span>Recent Conversations</span>
          </h3>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              Error loading chat history: {error}
            </div>
          )}

          {!loading && !error && chatHistory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs text-gray-400 mt-1">Start a new chat to get going!</p>
            </div>
          )}

          {!loading && !error && chatHistory.length > 0 && (
            <div className="space-y-2">
              {chatHistory.map((session) => (
                <button
                  key={session.session_id}
                  onClick={() => onSessionSelect(session)}
                  className="w-full text-left p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-200 group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                      <MessageCircle size={14} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0 mx-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getPreviewText(session.messages)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {session.messages && session.messages.length > 0
                          ? formatTimestamp(session.messages[session.messages.length - 1].timestamp)
                          : 'No messages'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {session.messages ? session.messages.length : 0} messages
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 bg-gray-50">
        <button
          onClick={fetchChatHistory}
          className="border-2 rounded-lg w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
        >
          Refresh History
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
