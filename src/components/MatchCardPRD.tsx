import { MessageCircle, Calendar, UserPlus, ArrowRightLeft, MapPin, Sparkles, Star } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Match } from '../utils/mockData';

interface MatchCardPRDProps {
  match: Match;
  onConnect: () => void;
  onMessage: () => void;
  onBookSession: () => void;
}

export function MatchCardPRD({ match, onConnect, onMessage, onBookSession }: MatchCardPRDProps) {
  if (!match.user) {
    return null;
  }

  // Get skill levels
  const teachSkillLevel = match.user.teachSkills?.find(s => s.skill === match.teachSkill)?.level;
  const learnSkillLevel = match.user.learnSkills?.find(s => s.skill === match.learnSkill)?.level;

  // Format skill level for display
  const formatLevel = (level?: string) => {
    if (!level) return '';
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 p-5 relative group">
      {/* New Badge */}
      {match.isNew && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
          <Sparkles className="w-3 h-3" />
          New Match
        </div>
      )}

      {/* Match Priority Badge */}
      {match.mutualSwap && (
        <div className="absolute top-4 left-4 bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1 border border-green-200">
          <Star className="w-3 h-3 fill-green-700" />
          Perfect Match
        </div>
      )}

      {/* Profile Section */}
      <div className="flex items-start gap-4 mb-4 mt-8">
        {/* Circular Photo with Border */}
        {match.user.photo ? (
          <div className="relative">
            <ImageWithFallback
              src={match.user.photo}
              alt={match.user.name}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-3 border-white shadow-md ring-2 ring-purple-100"
            />
            {match.user.availability && match.user.availability.length > 0 && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white flex-shrink-0 shadow-md ring-2 ring-purple-100">
            <span className="text-2xl">{match.user.name.charAt(0)}</span>
          </div>
        )}

        {/* Name & Campus */}
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 truncate mb-1">{match.user.name}</h3>
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
            <span className="truncate">{match.user.campus}</span>
          </div>
          {match.user.bio && (
            <p className="text-xs text-gray-500 line-clamp-2">{match.user.bio}</p>
          )}
        </div>
      </div>

      {/* Skill Match Row - Enhanced Design */}
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-xl p-4 mb-4 border border-purple-100 shadow-sm">
        <div className="flex items-center gap-3 justify-between">
          {/* They Teach */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 mb-1.5 font-medium">
              {match.mutualSwap ? 'They Teach' : 'You Want to Learn'}
            </p>
            <div className="flex flex-col gap-1">
              <span className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm px-3 py-1.5 rounded-lg shadow-sm">
                {match.teachSkill}
              </span>
              {teachSkillLevel && (
                <span className="text-xs text-purple-700 font-medium">
                  {formatLevel(teachSkillLevel)} Level
                </span>
              )}
            </div>
          </div>
          
          {/* Swap Icon */}
          <div className="flex-shrink-0">
            <div className="bg-white rounded-full p-2.5 shadow-md border border-purple-200">
              <ArrowRightLeft className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          
          {/* You Teach */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 mb-1.5 font-medium">
              {match.mutualSwap ? 'You Teach' : 'They Want to Learn'}
            </p>
            <div className="flex flex-col gap-1">
              <span className="inline-block bg-gradient-to-r from-pink-600 to-pink-700 text-white text-sm px-3 py-1.5 rounded-lg shadow-sm">
                {match.learnSkill}
              </span>
              {learnSkillLevel && (
                <span className="text-xs text-pink-700 font-medium">
                  {formatLevel(learnSkillLevel)} Level
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Availability Tag */}
      {match.user.availability && match.user.availability.length > 0 && (
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium">Available:</span>
          </div>
          <span className="text-gray-500">
            {match.user.availability.slice(0, 2).join(', ')}
          </span>
        </div>
      )}

      {/* Prompt Line - Enhanced */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 mb-4 border border-purple-200">
        <p className="text-xs text-purple-900 italic font-medium">
          💡 "Start with a story. Ask how they learned it and plan your swap!"
        </p>
      </div>

      {/* CTA Buttons - Enhanced */}
      <div className="grid grid-cols-3 gap-2.5">
        <Button
          onClick={onConnect}
          variant="outline"
          className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 text-sm flex items-center justify-center gap-1.5 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Connect</span>
        </Button>
        
        <Button
          onClick={onMessage}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm flex items-center justify-center gap-1.5 shadow-md transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          Message
        </Button>
        
        <Button
          onClick={onBookSession}
          variant="outline"
          className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 hover:border-purple-700 text-sm flex items-center justify-center gap-1.5 transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Book</span>
        </Button>
      </div>
    </div>
  );
}
