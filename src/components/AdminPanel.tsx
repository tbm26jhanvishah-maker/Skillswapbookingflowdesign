import { useState, useEffect } from 'react';
import { Database, RefreshCw, Trash2, BarChart3, Users, MessageSquare, Calendar, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { seedDatabase, clearDatabase, getDatabaseStats } from '../utils/api';

export function AdminPanel() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadStats = async () => {
    const data = await getDatabaseStats();
    setStats(data);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSeed = async () => {
    setLoading(true);
    setMessage('Seeding database with 16 users...');
    const success = await seedDatabase();
    if (success) {
      setMessage('✅ Successfully seeded 16 users to Supabase! Go back to Home to see matches.');
      await loadStats();
      // Clear the v2 flag to allow re-seeding from UI
      localStorage.removeItem('skillswap_seeded_v2');
      
      // Reload the page after 2 seconds to refresh the app
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      setMessage('❌ Failed to seed database');
    }
    setLoading(false);
  };

  const handleClear = async () => {
    if (!confirm('Are you sure? This will delete ALL data including users, matches, chats, and bookings.')) {
      return;
    }
    
    setLoading(true);
    setMessage('Clearing all data...');
    const success = await clearDatabase();
    if (success) {
      setMessage('✅ Successfully cleared all data from Supabase!');
      await loadStats();
      localStorage.removeItem('skillswap_seeded_v2');
    } else {
      setMessage('❌ Failed to clear database');
    }
    setLoading(false);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await loadStats();
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-8 h-8" />
          <h1 className="text-white">Database Admin Panel</h1>
        </div>
        <p className="text-purple-100 text-sm">Manage your Supabase data and view statistics</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border-2 border-purple-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-gray-600">Users</p>
            </div>
            <p className="text-gray-900">{stats.users}</p>
          </div>

          <div className="bg-white rounded-xl border-2 border-pink-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-pink-600" />
              <p className="text-sm text-gray-600">Matches</p>
            </div>
            <p className="text-gray-900">{stats.matches}</p>
          </div>

          <div className="bg-white rounded-xl border-2 border-blue-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600">Chats</p>
            </div>
            <p className="text-gray-900">{stats.chats}</p>
          </div>

          <div className="bg-white rounded-xl border-2 border-green-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-600">Bookings</p>
            </div>
            <p className="text-gray-900">{stats.bookings}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6 shadow-sm">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Database Actions
        </h3>

        <div className="space-y-3">
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            className="w-full justify-start gap-2 border-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Stats
          </Button>

          <Button
            onClick={handleSeed}
            disabled={loading}
            className="w-full justify-start gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
          >
            <Database className="w-4 h-4" />
            Seed 16 Sample Users
          </Button>

          <Button
            onClick={handleClear}
            disabled={loading}
            variant="outline"
            className="w-full justify-start gap-2 border-2 border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </Button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`rounded-xl p-4 border-2 ${
          message.includes('✅') 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : message.includes('❌')
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-100 mt-6">
        <h4 className="font-medium text-purple-900 mb-2">💡 About This Panel</h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• <strong>Seed:</strong> Adds 16 diverse users with skills to Supabase</li>
          <li>• <strong>Clear:</strong> Removes all data (users, matches, chats, bookings)</li>
          <li>• <strong>Stats:</strong> Shows current database record counts</li>
          <li>• Data persists across page reloads in Supabase KV store</li>
        </ul>
      </div>
    </div>
  );
}
