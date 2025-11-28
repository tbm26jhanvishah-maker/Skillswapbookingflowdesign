import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getMatches, findMatches, createChat, getDatabaseStats } from '../utils/api';
import { useCurrentUser } from '../utils/useCurrentUser';
import { MatchCardPRD } from './MatchCardPRD';
import { BookingModal } from './BookingModal';
import { WelcomeScreen } from './WelcomeScreen';
import { Button } from './ui/button';
import { RefreshCw, Sparkles, TrendingUp, Users } from 'lucide-react';
import type { Match } from '../utils/mockData';

export function HomePageNew() {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [finding, setFinding] = useState(false);
  const [hasUsers, setHasUsers] = useState(true);

  useEffect(() => {
    checkDatabase();
  }, []);

  useEffect(() => {
    if (user && hasUsers) {
      loadMatches();
    }
  }, [user, hasUsers]);

  const checkDatabase = async () => {
    const stats = await getDatabaseStats();
    if (stats && stats.users > 0) {
      setHasUsers(true);
    } else {
      setHasUsers(false);
      setLoading(false);
    }
  };

  const loadMatches = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getMatches(user.id);
      setMatches(data);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFindMatches = async () => {
    if (!user) return;
    
    setFinding(true);
    try {
      const newMatches = await findMatches(
        user.id,
        user.teachSkills,
        user.learnSkills
      );
      setMatches(newMatches);
    } catch (error) {
      console.error('Error finding matches:', error);
    } finally {
      setFinding(false);
    }
  };

  const handleMessage = async (match: Match) => {
    if (!user || !match.user) return;
    
    const chat = await createChat(user.id, match.user.id, match.user);
    if (chat) {
      navigate(`/chats/${chat.id}`, { 
        state: { 
          suggestedMessage: `Hey! We matched for ${match.learnSkill} ↔ ${match.teachSkill}. How did you start learning ${match.teachSkill}? Let's plan a session.`
        }
      });
    }
  };

  const handleBookSession = (match: Match) => {
    setSelectedMatch(match);
  };

  // Categorize matches
  const mutualMatches = matches.filter(m => m.mutualSwap);
  const oneSidedTeach = matches.filter(m => !m.mutualSwap && m.teachSkill);
  const oneSidedLearn = matches.filter(m => !m.mutualSwap && m.learnSkill);

  if (!hasUsers) {
    return <WelcomeScreen />;
  }

  if (loading) {
    return (
      <div className="p-4 text-center py-12 text-gray-500">
        <p>Loading matches...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white p-6 sticky top-0 z-10 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-white">SkillSwap</h1>
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">Beta</span>
            </div>
            <p className="text-purple-100 text-sm">Teach one. Learn anything. 🤝</p>
          </div>
          <Button
            onClick={handleFindMatches}
            disabled={finding}
            className="bg-white text-purple-600 hover:bg-purple-50 flex items-center gap-2 shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${finding ? 'animate-spin' : ''}`} />
            {finding ? 'Finding...' : 'Find Matches'}
          </Button>
        </div>
        
        {/* Stats Bar */}
        {matches.length > 0 && (
          <div className="flex items-center gap-4 text-sm bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{mutualMatches.length} Perfect Swaps</span>
            </div>
            <div className="w-px h-4 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{matches.length} Total Matches</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-6 space-y-8">
        {/* BLOCK A: Your Skill Matches (Mutual Swaps) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-gray-900">Your Skill Matches</h2>
              <p className="text-gray-600 text-sm">
                {mutualMatches.length} perfect swaps available 🤝
              </p>
            </div>
          </div>

          {mutualMatches.length > 0 ? (
            <div className="space-y-3">
              {mutualMatches.map((match) => (
                <MatchCardPRD
                  key={match.id}
                  match={match}
                  onConnect={() => console.log('Connect', match)}
                  onMessage={() => handleMessage(match)}
                  onBookSession={() => handleBookSession(match)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                No mutual matches yet. Click "Find Matches" to discover swap opportunities!
              </p>
            </div>
          )}
        </section>

        {/* BLOCK B: People Who Can Teach What You Want */}
        {oneSidedLearn.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-gray-900">People Who Can Teach You</h2>
                <p className="text-gray-600 text-sm">
                  {oneSidedLearn.length} potential teachers
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {oneSidedLearn.map((match) => (
                <MatchCardPRD
                  key={match.id}
                  match={match}
                  onConnect={() => console.log('Connect', match)}
                  onMessage={() => handleMessage(match)}
                  onBookSession={() => handleBookSession(match)}
                />
              ))}
            </div>
          </section>
        )}

        {/* BLOCK C: Skills Others Want to Learn From You */}
        {oneSidedTeach.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-gray-900">People Who Want to Learn From You</h2>
                <p className="text-gray-600 text-sm">
                  {oneSidedTeach.length} learners interested
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {oneSidedTeach.map((match) => (
                <MatchCardPRD
                  key={match.id}
                  match={match}
                  onConnect={() => console.log('Connect', match)}
                  onMessage={() => handleMessage(match)}
                  onBookSession={() => handleBookSession(match)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State - Only show if NO matches at all */}
        {matches.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-gray-900 mb-2">Ready to Start Swapping?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Add your teach & learn skills, then discover people who want to swap with you!
            </p>
            <Button
              onClick={handleFindMatches}
              disabled={finding}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {finding ? 'Finding...' : 'Find Your First Match'}
            </Button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedMatch && (
        <BookingModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}
