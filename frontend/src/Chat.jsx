import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `👋 Hello! I’m Alfred, your 24/7 hotel concierge demo AI.

This chatbot simulates exactly how a real hotel guest would interact with me during their stay.  
🌐 I can respond in any language – English, Korean, Japanese, Arabic, and more.

💡 You can try asking questions like:  
- As a guest: “Where are the towels?” “How do I watch Netflix?”  
- As a hotel operator: “How does this system work?” “Can we use this in our hotel?”

What would you like to explore first? 😊`
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('https://hotel-chatbot-9get.onrender.com/chat', { message: input });
      const reply = res.data.reply;
      setMessages([...newMessages, { role: 'bot', text: reply }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: 'bot', text: '⚠️ Sorry, something went wrong. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <div className="max-w-2xl mx-auto bg-neutral-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">🏨 Alfred Concierge Demo</h2>

        <div className="space-y-3 mb-4 max-h-[450px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-xl text-sm whitespace-pre-wrap
                ${msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-orange-100 text-black rounded-bl-none'}`}
              >
                {msg.text}
                {msg.role === 'bot' &&
                  msg.text.includes('Would you like me to alert the hotel staff?') && (
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          window.location.href =
                            'mailto:orbit@noeveorbit.com?subject=Guest%20Request&body=A%20guest%20needs%20staff%20assistance.'
                        }
                        className="text-sm mt-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        📩 Alert Hotel Staff
                      </button>
                    </div>
                  )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-sm text-gray-400 italic">Alfred is typing...</div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !isComposing) sendMessage();
            }}
            placeholder="Type your message here..."
            className="flex-1 px-4 py-2 rounded-md border border-gray-300 text-black"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
