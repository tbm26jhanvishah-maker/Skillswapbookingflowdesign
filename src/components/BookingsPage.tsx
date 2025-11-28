import { useState } from 'react';
import { mockBookings } from '../utils/mockData';
import { BookingCard } from './BookingCard';
import type { Booking } from '../utils/mockData';

export function BookingsPage() {
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingBookings = mockBookings.filter(
    b => b.status === 'confirmed' || b.status === 'pending'
  );
  const pastBookings = mockBookings.filter(
    b => b.status === 'completed' || b.status === 'cancelled'
  );

  const bookingsToShow = view === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div>
      <div className="p-4 pb-3">
        <h2 className="text-gray-900 mb-4">Bookings</h2>

        {/* Toggle */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView('upcoming')}
            className={`flex-1 py-2 rounded-md text-sm transition-colors ${
              view === 'upcoming'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setView('past')}
            className={`flex-1 py-2 rounded-md text-sm transition-colors ${
              view === 'past'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Past ({pastBookings.length})
          </button>
        </div>
      </div>

      <div className="p-4 pt-0 space-y-3">
        {bookingsToShow.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}

        {bookingsToShow.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No {view} bookings</p>
            <p className="text-sm mt-2">
              {view === 'upcoming' 
                ? 'Match with someone and suggest a time!' 
                : 'Your completed sessions will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
