import { Link } from 'react-router';
import { Database, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-gray-900 mb-3">Welcome to SkillSwap!</h2>
      <p className="text-gray-600 mb-8 max-w-sm">
        Your skill-swapping platform is ready. Let's add some sample users to get started.
      </p>

      <div className="bg-purple-50 rounded-xl p-6 mb-6 border-2 border-purple-100 max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-purple-600" />
          <h3 className="text-gray-900">Quick Setup</h3>
        </div>
        <p className="text-sm text-gray-700 mb-4">
          Click the <strong>Settings icon</strong> in the top-right corner to access the Admin Panel and seed the database with 16 sample users.
        </p>
      </div>

      <Link to="/admin">
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2 shadow-lg">
          Go to Admin Panel
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>

      <div className="mt-8 text-xs text-gray-500 max-w-sm">
        💡 Sample data includes diverse skills like Python, Guitar, Excel, Photography, and more!
      </div>
    </div>
  );
}
