import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { signUp, signIn } from '../utils/supabaseApi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UserPlus, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { OnboardingWelcome } from './OnboardingWelcome';

export function SignupScreen() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create the account
      await signUp(email, password, fullName);
      
      // Immediately sign in the user
      await signIn(email, password);
      
      // Show welcome toast with celebration
      toast.success('Account created successfully! 🎉', {
        description: `Welcome to SkillSwap, ${fullName.split(' ')[0]}!`,
        duration: 3000,
      });
      
      // Show welcome modal
      setShowWelcome(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create account';
      setError(errorMessage);
      
      // If email already exists, show a toast suggesting to sign in
      if (errorMessage.includes('already exists')) {
        toast.error('Email already registered', {
          description: 'Please sign in instead.',
          action: {
            label: 'Go to Sign In',
            onClick: () => navigate('/login'),
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    // After seeing welcome modal, go to skill setup
    navigate('/add-skills');
  };

  return (
    <>
      {/* Welcome Modal */}
      {showWelcome && (
        <OnboardingWelcome
          userName={fullName}
          onGetStarted={handleGetStarted}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl relative">
            <Sparkles className="w-10 h-10 text-white" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 animate-pulse opacity-50"></div>
          </div>
          <h1 className="text-gray-900 mb-2">Join the Skill Movement</h1>
          <p className="text-gray-600">Share what you know, learn what you love.</p>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-8"
        >
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                className="mt-1.5 focus:ring-2 focus:ring-purple-400 transition-all"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1.5 focus:ring-2 focus:ring-purple-400 transition-all"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700">Set Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="mt-1.5 focus:ring-2 focus:ring-purple-400 transition-all"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 underline">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-500">
            By signing up, you agree to our Terms and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
    </>
  );
}
