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
              dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/</g, '&lt;') // escape HTML
                  .replace(/>/g, '&gt;') // escape HTML
                  .replace(/\n/g, '<br/>') // line breaks
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold pattern
                  .replace(/__(.*?)__/g, '<em>$1</em>') // italic pattern
                  .replace(/`(.*?)`/g, '<code>$1</code>') // inline code pattern
                  .replace(/```(.*?)```/g, '<pre class="bg-gray-200 p-2 rounded">$1</pre>') // code block pattern 
                  .replace(/### (.*?)/g, '<h3 class="text-lg font-semibold">$1</h3>') // sub-subheading pattern
                  .replace(/## (.*?)/g, '<h2 class="text-xl font-bold">$1</h2>') // subheading pattern
                  .replace(/# (.*?)/g, '<h1 class="text-2xl font-extrabold">$1</h1>') // main heading pattern
                  .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg" />') // image pattern
                  .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-500 hover:underline">$1</a>'), // link pattern
              }}
            />
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
