import { Link } from 'react-router';
import { Button } from './ui/button';
import { ArrowRightLeft } from 'lucide-react';
import { motion } from 'motion/react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col items-center justify-between p-6 overflow-hidden relative">
      {/* Floating decorative blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Main content - centered */}
      <div className="flex-1 flex items-center justify-center w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center relative z-10"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-28 h-28 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl relative"
          >
            <ArrowRightLeft className="w-14 h-14 text-white" strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 animate-pulse opacity-50"></div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-900 mb-4"
          >
            Teach one. Learn many.
          </motion.h1>

          {/* Supporting text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 mb-2 max-w-sm mx-auto"
          >
            Swap real skills with real people — start with a conversation.
          </motion.p>

          {/* Floating emojis */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <span className="text-xl">✨</span>
            <span className="text-xl">🤝</span>
            <span className="text-xl">🎓</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="w-full max-w-md space-y-3 relative z-10"
      >
        <Link to="/login" className="block">
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            Log In
          </Button>
        </Link>
        
        <Link to="/signup" className="block">
          <Button
            variant="outline"
            className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 active:scale-95 transition-all"
          >
            Sign Up
          </Button>
        </Link>

        {/* Footer micro-copy */}
        <p className="text-xs text-center text-gray-500 mt-6 italic">
          Skills here don't cost money, they cost curiosity.
        </p>
      </motion.div>

      {/* CSS for blob animation */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
