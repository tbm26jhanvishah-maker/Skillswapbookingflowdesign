import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getChats } from '../utils/api';
import { useCurrentUser } from '../utils/useCurrentUser';

export function ChatsPage() {
  const { user } = useCurrentUser();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getChats(user.id);
      setChats(data);
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="p-4 text-center py-12 text-gray-500">
        <p>Loading chats...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 pb-3">
        <h2 className="text-gray-900">Messages</h2>
      </div>

      <div className="divide-y divide-gray-100">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            to={`/chats/${chat.id}`}
            className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            {/* Avatar */}
            {chat.user?.photo ? (
              <img
                src={chat.user.photo}
                alt={chat.user.name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white flex-shrink-0">
                {chat.user?.name?.charAt(0) || '?'}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-gray-900 truncate">{chat.user?.name || 'Unknown'}</h3>
                {chat.lastMessage && (
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {formatTime(chat.lastMessage.timestamp)}
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm truncate">
                {chat.user?.campus || ''}
              </p>
              
              {chat.lastMessage && (
                <p className={`text-sm mt-1 truncate ${
                  chat.unreadCount > 0 ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  {chat.lastMessage.senderId === user?.id && 'You: '}
                  {chat.lastMessage.text}
                </p>
              )}
            </div>

            {/* Unread Badge */}
            {chat.unreadCount > 0 && (
              <div className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                {chat.unreadCount}
              </div>
            )}
          </Link>
        ))}
      </div>

      {chats.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No messages yet</p>
          <p className="text-sm mt-2">Start chatting with your matches!</p>
        </div>
      )}
    </div>
  );
}
