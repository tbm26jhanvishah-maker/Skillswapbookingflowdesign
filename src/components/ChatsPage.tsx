import { Link } from 'react-router';
import { mockChats } from '../utils/mockData';

export function ChatsPage() {
  const formatTime = (date: Date) => {
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

  return (
    <div>
      <div className="p-4 pb-3">
        <h2 className="text-gray-900">Messages</h2>
      </div>

      <div className="divide-y divide-gray-100">
        {mockChats.map((chat) => (
          <Link
            key={chat.id}
            to={`/chats/${chat.id}`}
            className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white flex-shrink-0">
              {chat.user.name.charAt(0)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-gray-900 truncate">{chat.user.name}</h3>
                {chat.lastMessage && (
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {formatTime(chat.lastMessage.timestamp)}
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm truncate">
                {chat.user.campus}
              </p>
              
              {chat.lastMessage && (
                <p className={`text-sm mt-1 truncate ${
                  chat.unreadCount > 0 ? 'text-gray-900' : 'text-gray-600'
                }`}>
                  {chat.lastMessage.senderId === 'current-user' && 'You: '}
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

      {mockChats.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No messages yet</p>
          <p className="text-sm mt-2">Start chatting with your matches!</p>
        </div>
      )}
    </div>
  );
}
