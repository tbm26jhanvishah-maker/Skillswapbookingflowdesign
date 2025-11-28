import { useState } from 'react';
import { mockMatches } from '../utils/mockData';
import { MatchCard } from './MatchCard';
import { MatchModal } from './MatchModal';
import type { Match } from '../utils/mockData';

export function HomePage() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-1">Your Matches</h2>
        <p className="text-gray-600 text-sm">
          Found {mockMatches.length} skill swap opportunities
        </p>
      </div>

      <div className="space-y-3">
        {mockMatches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onClick={() => setSelectedMatch(match)}
          />
        ))}
      </div>

      {mockMatches.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No matches yet</p>
          <p className="text-sm mt-2">Check back soon for new opportunities!</p>
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
