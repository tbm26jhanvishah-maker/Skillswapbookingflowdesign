import { useState, useEffect } from 'react';
import { getMatches, findMatches } from '../utils/api';
import { useCurrentUser } from '../utils/useCurrentUser';
import { MatchCard } from './MatchCard';
import { MatchModal } from './MatchModal';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';
import type { Match } from '../utils/mockData';

export function HomePage() {
  const { user } = useCurrentUser();
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [finding, setFinding] = useState(false);

  useEffect(() => {
    if (user) {
      loadMatches();
    }
  }, [user]);

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

  if (loading) {
    return (
      <div className="p-4 text-center py-12 text-gray-500">
        <p>Loading matches...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-gray-900 mb-1">Your Matches</h2>
            <p className="text-gray-600 text-sm">
              Found {matches.length} skill swap opportunities
            </p>
          </div>
          <Button
            onClick={handleFindMatches}
            disabled={finding}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${finding ? 'animate-spin' : ''}`} />
            {finding ? 'Finding...' : 'Find'}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onClick={() => setSelectedMatch(match)}
          />
        ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No matches yet</p>
          <p className="text-sm mt-2 mb-4">Click "Find" to discover skill swap opportunities!</p>
        </div>
      )}

      {selectedMatch && (
        <MatchModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}
