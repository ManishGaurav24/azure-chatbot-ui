import React, { useEffect } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';

const ChatWindow = ({ messages, isLoading, messagesEndRef }) => {
  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">
          <MessageCircle className="w-6 h-6 mx-auto mb-2" />
          Start a conversation...
        </div>
      ) : (
        messages.map((msg, idx) => (
          <div key={idx} className={`my-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div
              className={`inline-block px-4 py-2 rounded-lg whitespace-pre-line ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-black'
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))
      )}

      {isLoading && (
        <div className="flex items-center space-x-2 text-sm text-gray-500 my-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Thinking...</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
