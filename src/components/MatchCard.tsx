import { ArrowRightLeft, MapPin, Clock, Sparkles } from 'lucide-react';
import type { Match } from '../utils/mockData';

interface MatchCardProps {
  match: Match;
  onClick: () => void;
}

export function MatchCard({ match, onClick }: MatchCardProps) {
  const timeAgo = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer relative"
    >
      {match.isNew && (
        <div className="absolute top-3 right-3 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          New
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white flex-shrink-0">
          {match.user.name.charAt(0)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-gray-900 truncate">{match.user.name}</h3>
            {match.mutualSwap && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                Mutual
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{match.user.campus}</span>
          </div>

          {/* Skill Swap */}
          <div className="bg-gray-50 rounded-lg p-3 mb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-0.5">You teach</p>
                <p className="text-purple-600 truncate">{match.learnSkill}</p>
              </div>
              
              <ArrowRightLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-0.5">You learn</p>
                <p className="text-purple-600 truncate">{match.teachSkill}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(match.timestamp)}
            </div>
            <div className={`px-2 py-0.5 rounded ${
              match.priority === 'high' 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {match.priority === 'high' ? 'High Match' : 'Good Match'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
