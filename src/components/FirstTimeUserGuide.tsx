import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, MessageCircle, Calendar, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface FirstTimeUserGuideProps {
  onDismiss: () => void;
}

export function FirstTimeUserGuide({ onDismiss }: FirstTimeUserGuideProps) {
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    {
      icon: RefreshCw,
      title: 'Find Your Matches',
      description: 'Click the "Find Matches" button to discover people who share your interests. Our algorithm prioritizes perfect swaps!',
      color: 'purple',
    },
    {
      icon: Sparkles,
      title: 'Perfect Swaps First',
      description: 'Look for cards with the "Perfect Match" badge — these are people who can teach what you want AND want to learn what you teach!',
      color: 'green',
    },
    {
      icon: MessageCircle,
      title: 'Start Chatting',
      description: 'Use "Start Chat" to connect with your matches. Plan your swap, share your availability, and get to know each other!',
      color: 'blue',
    },
    {
      icon: Calendar,
      title: 'Book Sessions',
      description: 'Ready to swap? Click "Book" to schedule your skill exchange session. Choose date, time, and whether it\'s online or in-person.',
      color: 'pink',
    },
  ];

  const currentTipData = tips[currentTip];
  const Icon = currentTipData.icon;

  const handleNext = () => {
    if (currentTip < tips.length - 1) {
      setCurrentTip(currentTip + 1);
    } else {
      onDismiss();
    }
  };

  const handleSkip = () => {
    onDismiss();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleSkip}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
        >
          {/* Close Button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Tip Counter */}
          <div className="flex items-center gap-2 mb-4">
            {tips.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full flex-1 transition-colors ${
                  index === currentTip
                    ? 'bg-purple-600'
                    : index < currentTip
                    ? 'bg-purple-300'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <motion.div
            key={currentTip}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              currentTipData.color === 'purple'
                ? 'bg-purple-100'
                : currentTipData.color === 'green'
                ? 'bg-green-100'
                : currentTipData.color === 'blue'
                ? 'bg-blue-100'
                : 'bg-pink-100'
            }`}
          >
            <Icon
              className={`w-8 h-8 ${
                currentTipData.color === 'purple'
                  ? 'text-purple-600'
                  : currentTipData.color === 'green'
                  ? 'text-green-600'
                  : currentTipData.color === 'blue'
                  ? 'text-blue-600'
                  : 'text-pink-600'
              }`}
            />
          </motion.div>

          {/* Content */}
          <motion.div
            key={`content-${currentTip}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-6"
          >
            <h3 className="text-gray-900 mb-2">{currentTipData.title}</h3>
            <p className="text-gray-600 text-sm">{currentTipData.description}</p>
          </motion.div>

          {/* Actions */}
          <div className="flex gap-3">
            {currentTip < tips.length - 1 ? (
              <>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1"
                >
                  Skip Tour
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Next Tip
                </Button>
              </>
            ) : (
              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Got It! Let's Start
              </Button>
            )}
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Tip {currentTip + 1} of {tips.length}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
