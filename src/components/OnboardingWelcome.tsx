import { Button } from './ui/button';
import { Sparkles, ArrowRight, GraduationCap, Target, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingWelcomeProps {
  userName: string;
  onGetStarted: () => void;
}

export function OnboardingWelcome({ userName, onGetStarted }: OnboardingWelcomeProps) {
  const firstName = userName.split(' ')[0];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full"
      >
        {/* Celebration Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <Sparkles className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
          {/* Floating emojis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute -top-4 -right-4 text-4xl"
          >
            🎉
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-4 -left-4 text-4xl"
          >
            ✨
          </motion.div>
        </motion.div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100 p-8 text-center"
        >
          <h1 className="text-gray-900 mb-3">
            Welcome, {firstName}! 🎊
          </h1>
          
          <p className="text-gray-600 mb-6">
            You're about to join a community where everyone teaches and everyone learns.
          </p>

          {/* What's Next */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="text-gray-900 mb-4 text-center">Here's what happens next:</h3>
            
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-900 text-sm">Add your teaching skills</p>
                  <p className="text-gray-600 text-xs">What can you share with others?</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-900 text-sm">Pick learning goals</p>
                  <p className="text-gray-600 text-xs">What do you want to learn?</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-900 text-sm">Get matched instantly</p>
                  <p className="text-gray-600 text-xs">We'll find your perfect skill swap partners</p>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={onGetStarted}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
              size="lg"
            >
              Let's Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>

          <p className="text-xs text-gray-500 mt-4 italic">
            Takes less than 2 minutes ⏱️
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
