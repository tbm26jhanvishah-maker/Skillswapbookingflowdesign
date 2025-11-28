import { useState } from 'react';
import { useNavigate } from 'react-router';
import { X, ArrowRightLeft, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { BookingModal } from './BookingModal';
import type { Match } from '../utils/mockData';

interface MatchModalProps {
  match: Match;
  onClose: () => void;
}

export function MatchModal({ match, onClose }: MatchModalProps) {
  const [showBooking, setShowBooking] = useState(false);
  const navigate = useNavigate();

  const handleStartChat = () => {
    navigate(`/chats/c${match.user.id}`);
    onClose();
  };

  if (showBooking) {
    return <BookingModal match={match} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-white">It's a Swap!</h2>
          </div>
          <p className="text-purple-100">
            You matched with {match.user.name}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white">
              <span className="text-xl">{match.user.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-gray-900">{match.user.name}</h3>
              <p className="text-gray-600 text-sm">{match.user.campus}</p>
              {match.user.availability && (
                <p className="text-gray-500 text-xs mt-0.5">
                  Available: {match.user.availability.join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <p className="text-gray-700 text-sm">{match.user.bio}</p>
          </div>

          {/* Swap Details */}
          <div className="bg-purple-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">You teach</p>
                <p className="text-purple-600">{match.learnSkill}</p>
              </div>
              
              <div className="bg-white rounded-full p-2">
                <ArrowRightLeft className="w-5 h-5 text-purple-600" />
              </div>
              
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-1">You learn</p>
                <p className="text-purple-600">{match.teachSkill}</p>
              </div>
            </div>
          </div>

          {/* Match Type */}
          {match.mutualSwap && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
              <p className="text-green-800 text-sm">
                🎉 <span>Perfect mutual swap! You both teach what the other wants to learn.</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => setShowBooking(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Suggest a Time
            </Button>
            <Button
              onClick={handleStartChat}
              variant="outline"
              className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              Start Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
