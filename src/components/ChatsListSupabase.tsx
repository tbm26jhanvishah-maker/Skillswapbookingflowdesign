import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getCurrentUser } from '../utils/supabaseApi';
import { MessageCircle, Search, Clock, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Input } from './ui/input';
import { EmptyState } from './EmptyState';

export function ChatsListSupabase() {
  const navigate = useNavigate();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setCurrentUserId(user.id);

      // Get chats from user metadata
      const userChats = user.user_metadata?.chats || {};
      const matches = user.user_metadata?.matches || [];

      // Transform chats into list format
      const chatsList = matches
        .filter((match: any) => userChats[match.id] && userChats[match.id].length > 0)
        .map((match: any) => {
          const messages = userChats[match.id] || [];
          const lastMessage = messages[messages.length - 1];
          const otherUser = match.user_a_id === user.id ? match.user_b : match.user_a;

          return {
            id: match.id,
            match,
            otherUser,
            lastMessage,
            unreadCount: 0, // TODO: implement unread count tracking
            isMutual: match.is_mutual,
          };
        })
        .sort((a, b) => {
          // Sort by most recent message
          const timeA = a.lastMessage?.timestamp || 0;
          const timeB = b.lastMessage?.timestamp || 0;
          return timeB - timeA;
        });

      setChats(chatsList);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.otherUser.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="p-4 text-center py-12 text-gray-500">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p>Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white p-6 sticky top-0 z-10 shadow-lg">
        <h1 className="text-white mb-2">Messages</h1>
        <p className="text-purple-100 text-sm">Chat with your skill swap matches</p>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/90 border-0 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Chats List */}
      <div className="p-4">
        {filteredChats.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="No conversations yet"
            description="Start chatting with your matches to plan skill swaps!"
            actionLabel="Find Matches"
            onAction={() => navigate('/home')}
          />
        ) : (
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => navigate(`/home/chats/${chat.id}`)}
                className="bg-white rounded-xl border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer p-4"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  {chat.otherUser.photo_url ? (
                    <ImageWithFallback
                      src={chat.otherUser.photo_url}
                      alt={chat.otherUser.full_name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                      <span className="text-xl">{chat.otherUser.full_name.charAt(0)}</span>
                    </div>
                  )}

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-gray-900 truncate">{chat.otherUser.full_name}</h3>
                      {chat.isMutual && (
                        <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    {chat.lastMessage && (
                      <div className="flex items-center gap-2">
                        <p className="text-gray-600 text-sm truncate flex-1">
                          {chat.lastMessage.sender_id === currentUserId ? 'You: ' : ''}
                          {chat.lastMessage.content}
                        </p>
                        <div className="flex items-center gap-1 text-gray-400 text-xs flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimestamp(chat.lastMessage.timestamp)}</span>
                        </div>
                      </div>
                    )}

                    {/* Unread badge */}
                    {chat.unreadCount > 0 && (
                      <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
