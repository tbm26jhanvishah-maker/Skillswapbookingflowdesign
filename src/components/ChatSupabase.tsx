import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getMessages, sendMessage as sendMessageAPI, subscribeToMessages, getCurrentUser } from '../utils/supabaseApi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Send, Pin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function ChatSupabase() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
    
    // Subscribe to real-time messages
    if (!chatId) return;
    
    const unsubscribe = subscribeToMessages(chatId, (newMsg) => {
      // Fetch the full message with sender info
      loadMessages();
    });

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    const user = await getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUserId(user.id);
    loadMessages();
  };

  const loadMessages = async () => {
    if (!chatId) return;
    
    setLoading(true);
    try {
      const data = await getMessages(chatId);
      setMessages(data);
    } catch (error: any) {
      console.error('Error loading messages:', error);
      toast.error(error.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const sentMessage = await sendMessageAPI(chatId, messageContent);
      // Optimistically add to messages
      setMessages([...messages, sentMessage]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
      setNewMessage(messageContent); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate('/home')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-gray-900">Chat</h2>
          <p className="text-xs text-gray-500">Match ID: {chatId?.slice(0, 8)}...</p>
        </div>
      </div>

      {/* Pinned Swap Guidance */}
      <div className="bg-purple-50 border-b-2 border-purple-100 p-4 sticky top-16 z-10">
        <div className="flex items-start gap-2">
          <Pin className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-purple-900 font-medium mb-1">
              💡 Planning your skill swap?
            </p>
            <p className="text-xs text-purple-700">
              Discuss: What you'll teach, what you'll learn, session length, meeting mode (online/in-person), and schedule
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No messages yet</p>
            <p className="text-xs mt-2">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.sender_id === currentUserId;
            
            return (
              <div
                key={message.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isMe
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  {!isMe && message.sender && (
                    <p className="text-xs text-gray-500 mb-1">
                      {message.sender.full_name}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isMe ? 'text-purple-200' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
