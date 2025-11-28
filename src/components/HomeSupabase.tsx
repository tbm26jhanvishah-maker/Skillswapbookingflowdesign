import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getMyMatches, findMatches as findMatchesAPI, getCurrentUser } from '../utils/supabaseApi';
import { Button } from './ui/button';
import { RefreshCw, Sparkles, TrendingUp, Users, MessageCircle, Calendar, HelpCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { BookingModalSupabase } from './BookingModalSupabase';
import { toast } from 'sonner@2.0.3';
import { FirstTimeUserGuide } from './FirstTimeUserGuide';
import { EmptyState } from './EmptyState';

export function HomeSupabase() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [finding, setFinding] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedMatchForBooking, setSelectedMatchForBooking] = useState<any | null>(null);
  const [showFirstTimeGuide, setShowFirstTimeGuide] = useState(false);

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    // Check if user is first-time (show guide only once)
    const hasSeenGuide = localStorage.getItem('hasSeenHomeGuide');
    if (!hasSeenGuide && matches.length === 0 && !loading) {
      // Show guide after a short delay to let them see the empty state first
      const timer = setTimeout(() => {
        setShowFirstTimeGuide(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [matches, loading]);

  const initializeUser = async () => {
    const user = await getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUserId(user.id);
    loadMatches();
  };

  const handleDismissGuide = () => {
    localStorage.setItem('hasSeenHomeGuide', 'true');
    setShowFirstTimeGuide(false);
  };

  const handleShowGuide = () => {
    setShowFirstTimeGuide(true);
  };

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await getMyMatches();
      setMatches(data);
    } catch (error: any) {
      console.error('Error loading matches:', error);
      toast.error(error.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleFindMatches = async () => {
    setFinding(true);
    try {
      const newMatches = await findMatchesAPI();
      console.log('Found matches:', newMatches);
      await loadMatches();
      
      if (newMatches.length === 0) {
        toast.info('No new matches found. Try adding more skills or check back later!');
      } else {
        toast.success(`Found ${newMatches.length} new ${newMatches.length === 1 ? 'match' : 'matches'}!`);
      }
    } catch (error: any) {
      console.error('Error finding matches:', error);
      toast.error(error.message || 'Failed to find matches');
    } finally {
      setFinding(false);
    }
  };

  const handleStartConversation = (match: any) => {
    navigate(`/home/chats/${match.id}`);
  };

  const getOtherUser = (match: any) => {
    if (!currentUserId) return null;
    return match.user_a_id === currentUserId ? match.user_b : match.user_a;
  };

  const mutualMatches = matches.filter(m => m.is_mutual);
  const oneSidedMatches = matches.filter(m => !m.is_mutual);

  if (loading) {
    return (
      <div className="p-4 text-center py-12 text-gray-500">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
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
          <div className="flex items-center gap-2">
            <Button
              onClick={handleShowGuide}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              title="Show quick tips"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleFindMatches}
              disabled={finding}
              className="bg-white text-purple-600 hover:bg-purple-50 flex items-center gap-2 shadow-md"
            >
              <RefreshCw className={`w-4 h-4 ${finding ? 'animate-spin' : ''}`} />
              {finding ? 'Finding...' : 'Find Matches'}
            </Button>
          </div>
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
        {/* Perfect Matches Section */}
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
              {mutualMatches.map((match) => {
                const otherUser = getOtherUser(match);
                if (!otherUser) return null;
                
                return (
                  <div
                    key={match.id}
                    className="bg-white rounded-2xl border-2 border-purple-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 p-5"
                  >
                    {/* Perfect Match Badge */}
                    <div className="absolute top-4 left-4 bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full flex items-center gap-1 border border-green-200">
                      <Sparkles className="w-3 h-3 fill-green-700" />
                      Perfect Match
                    </div>

                    {/* User Info */}
                    <div className="flex items-start gap-4 mb-4 mt-8">
                      {otherUser.photo_url ? (
                        <ImageWithFallback
                          src={otherUser.photo_url}
                          alt={otherUser.full_name}
                          className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md ring-2 ring-purple-100"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md ring-2 ring-purple-100">
                          <span className="text-2xl">{otherUser.full_name.charAt(0)}</span>
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="text-gray-900">{otherUser.full_name}</h3>
                        {otherUser.campus && (
                          <p className="text-sm text-gray-600">{otherUser.campus}</p>
                        )}
                        {otherUser.bio && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{otherUser.bio}</p>
                        )}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-xl p-4 mb-4 border border-purple-100">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1.5">They Teach</p>
                          <span className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm px-3 py-1.5 rounded-lg">
                            {match.skill_a?.name}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1.5">You Teach</p>
                          <span className="inline-block bg-gradient-to-r from-pink-600 to-pink-700 text-white text-sm px-3 py-1.5 rounded-lg">
                            {match.skill_b?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleStartConversation(match)}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Start Chat
                      </Button>
                      <Button
                        onClick={() => setSelectedMatchForBooking(match)}
                        variant="outline"
                        className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Book
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                No mutual matches yet. Click "Find Matches" to discover swap opportunities!
              </p>
            </div>
          )}
        </section>

        {/* Other Matches */}
        {oneSidedMatches.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-gray-900">More Matches</h2>
                <p className="text-gray-600 text-sm">
                  {oneSidedMatches.length} potential connections
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {oneSidedMatches.map((match) => {
                const otherUser = getOtherUser(match);
                if (!otherUser) return null;

                return (
                  <div
                    key={match.id}
                    className="bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {otherUser.photo_url ? (
                        <ImageWithFallback
                          src={otherUser.photo_url}
                          alt={otherUser.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                          <span className="text-lg">{otherUser.full_name.charAt(0)}</span>
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="text-gray-900 text-sm">{otherUser.full_name}</h3>
                        <p className="text-xs text-gray-600">Teaches {match.skill_a?.name}</p>
                      </div>

                      <Button
                        onClick={() => handleStartConversation(match)}
                        size="sm"
                        variant="outline"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {matches.length === 0 && (
          <EmptyState
            icon={Sparkles}
            title="No matches yet"
            description="Ready to start swapping skills? Click 'Find Matches' to discover people who share your interests and want to learn what you teach!"
            actionLabel="Find Matches Now"
            onAction={handleFindMatches}
            secondaryActionLabel="Edit My Skills"
            onSecondaryAction={() => navigate('/home/profile')}
          >
            <div className="space-y-3">
              <div className="bg-purple-50 rounded-xl p-4 max-w-sm mx-auto border-2 border-purple-100">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>💡 Pro Tip:</strong> Make sure you've added both teaching AND learning skills for the best matches!
                </p>
                <p className="text-xs text-gray-600">
                  Our algorithm prioritizes "perfect swaps" where both of you can teach what the other wants to learn.
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 max-w-sm mx-auto border-2 border-blue-100">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>🚀 New to SkillSwap?</strong> Need people to match with?
                </p>
                <Button
                  onClick={() => navigate('/home/admin')}
                  variant="outline"
                  size="sm"
                  className="w-full border-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Visit Admin Panel to Seed Sample Users
                </Button>
              </div>
            </div>
          </EmptyState>
        )}
      </div>

      {/* Booking Modal */}
      {selectedMatchForBooking && (
        <BookingModalSupabase
          matchId={selectedMatchForBooking.id}
          onClose={() => setSelectedMatchForBooking(null)}
          onSuccess={() => {
            setSelectedMatchForBooking(null);
            navigate('/home/bookings');
          }}
        />
      )}

      {/* First-Time User Guide */}
      {showFirstTimeGuide && (
        <FirstTimeUserGuide onDismiss={handleDismissGuide} />
      )}
    </div>
  );
}
