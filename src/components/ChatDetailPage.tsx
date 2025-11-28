import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Send, Info } from 'lucide-react';
import { Button } from './ui/button';
import { getChat, sendMessage } from '../utils/api';
import { useCurrentUser } from '../utils/useCurrentUser';

export function ChatDetailPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [chat, setChat] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [showHelper, setShowHelper] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && chatId) {
      loadChat();
    }
  }, [user, chatId]);

  const loadChat = async () => {
    if (!user || !chatId) return;
    
    setLoading(true);
    try {
      const data = await getChat(user.id, chatId);
      setChat(data);
    } catch (error) {
      console.error('Error loading chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !user || !chatId) return;
    
    const success = await sendMessage(chatId, user.id, message.trim());
    if (success) {
      setMessage('');
      // Reload chat to get new message
      await loadChat();
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center py-12 text-gray-500">
        <p>Loading chat...</p>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Chat not found</p>
        <Button onClick={() => navigate('/chats')} className="mt-4">
          Back to Chats
        </Button>
      </div>
    );
  }

  const conversationStarter = `Hey! I'd love to swap — you teach ${chat.user?.teachSkills?.[0]?.skill || 'your skill'}, I'll teach ${chat.user?.learnSkills?.[0]?.skill || 'my skill'}. How did you start learning this? Let's plan our session :)`;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/chats')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white">
            {chat.user?.name?.charAt(0) || '?'}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 truncate">{chat.user?.name || 'Unknown'}</h3>
            <p className="text-gray-600 text-sm truncate">{chat.user?.campus || ''}</p>
          </div>
        </div>
      </div>

      {/* Helper (Pinned) */}
      {showHelper && (
        <div className="bg-purple-50 border-b border-purple-200 p-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-purple-900 text-sm mb-2">Guide to a great swap:</p>
              <ol className="text-purple-800 text-xs space-y-0.5 ml-4 list-decimal">
                <li>Share your learning story 😊</li>
                <li>Ask skill level 🧠</li>
                <li>Pick time & format 📅</li>
                <li>Make a mini plan ✍️</li>
              </ol>
            </div>
            <button
              onClick={() => setShowHelper(false)}
              className="text-purple-600 hover:text-purple-800 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {(chat.messages || []).map((msg: any) => {
          const isCurrentUser = msg.senderId === user?.id;
          const timestamp = new Date(msg.timestamp);
          return (
            <div
              key={msg.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  isCurrentUser
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${
                  isCurrentUser ? 'text-purple-200' : 'text-gray-500'
                }`}>
                  {timestamp.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          );
        })}

        {/* Conversation Starter Suggestion */}
        {(!chat.messages || chat.messages.length === 0) && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-2">Suggested starter:</p>
            <p className="text-sm text-gray-700 mb-3">"{conversationStarter}"</p>
            <Button
              onClick={() => setMessage(conversationStarter)}
              variant="outline"
              className="w-full text-xs"
            >
              Use this message
            </Button>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-purple-600"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
