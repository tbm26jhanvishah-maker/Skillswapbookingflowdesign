import { Outlet, Link, useLocation } from 'react-router';
import { Home, MessageCircle, Calendar, User, Settings } from 'lucide-react';

export function Layout() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1"></div>
          <div className="flex-1 text-center">
            <h1 className="text-purple-600">SkillSwap</h1>
            <p className="text-gray-500 text-sm">Teach one. Learn many.</p>
          </div>
          <div className="flex-1 flex justify-end">
            <Link
              to="/admin"
              className={`p-2 rounded-lg transition-colors ${
                isActive('/admin')
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-400 hover:text-purple-600 hover:bg-gray-50'
              }`}
              title="Admin Panel"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-4 py-2 sticky bottom-0">
        <div className="flex justify-around items-center">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              isActive('/') && !isActive('/chats') && !isActive('/bookings') && !isActive('/profile')
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          
          <Link
            to="/chats"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              isActive('/chats')
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Chats</span>
          </Link>
          
          <Link
            to="/bookings"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              isActive('/bookings')
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs">Bookings</span>
          </Link>
          
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              isActive('/profile')
                ? 'text-purple-600 bg-purple-50'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
