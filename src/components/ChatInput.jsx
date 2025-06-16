import React from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ inputMessage, setInputMessage, handleSend, handleKeyDown, isLoading }) => (
  <div className="border-t p-4 bg-white">
    <div className="flex">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-1 border px-3 py-2 rounded-l"
        disabled={isLoading}
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 disabled:opacity-50"
        disabled={isLoading || !inputMessage.trim()}
      >
        <Send size={16} />
      </button>
    </div>
  </div>
);

export default ChatInput;
