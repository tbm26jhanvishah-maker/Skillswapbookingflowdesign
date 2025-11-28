import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getMyBookings, updateBookingStatus, getCurrentUser } from '../utils/supabaseApi';
import { Button } from './ui/button';
import { Calendar, Clock, MapPin, Check, X, RefreshCw } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { EmptyState } from './EmptyState';

export function BookingsSupabase() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    initializeBookings();
  }, []);

  const initializeBookings = async () => {
    const user = await getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUserId(user.id);
    loadBookings();
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (error: any) {
      console.error('Error loading bookings:', error);
      toast.error(error.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    bookingId: string,
    status: 'accepted' | 'declined' | 'completed' | 'cancelled'
  ) => {
    try {
      await updateBookingStatus(bookingId, status);
      toast.success(`Booking ${status}!`);
      loadBookings();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update booking');
    }
  };

  const getOtherUser = (booking: any) => {
    if (!currentUserId || !booking.match) return null;
    const isUserA = booking.match.user_a_id === currentUserId;
    return isUserA ? booking.match.user_b : booking.match.user_a;
  };

  const now = new Date();
  const upcoming = bookings.filter(
    b => new Date(b.scheduled_at) > now && ['pending', 'accepted'].includes(b.status)
  );
  const completed = bookings.filter(b => b.status === 'completed');

  if (loading) {
    return (
      <div className="p-4 text-center py-12">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-full pb-20">
      <div className="p-4 pb-3 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-gray-900">My Bookings</h2>
          <button
            onClick={loadBookings}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Upcoming Bookings */}
        <section>
          <h3 className="text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Upcoming ({upcoming.length})
          </h3>

          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.map((booking) => {
                const otherUser = getOtherUser(booking);
                if (!otherUser) return null;

                const isRequester = booking.requester_id === currentUserId;

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-xl border-2 border-purple-100 p-4"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-3">
                      {otherUser.photo_url ? (
                        <ImageWithFallback
                          src={otherUser.photo_url}
                          alt={otherUser.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                          <span className="text-lg">{otherUser.full_name.charAt(0)}</span>
                        </div>
                      )}

                      <div className="flex-1">
                        <h4 className="text-gray-900">{otherUser.full_name}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>{booking.match.skill_a?.name}</span>
                          <span>↔</span>
                          <span>{booking.match.skill_b?.name}</span>
                        </div>
                      </div>

                      <div
                        className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'accepted'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {booking.status}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.scheduled_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        {new Date(booking.scheduled_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        • {booking.duration_mins} mins
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {booking.mode === 'online' ? '💻 Online' : '🏫 In-Person'}
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-600 mb-1">Notes:</p>
                        <p className="text-sm text-gray-900">{booking.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    {!isRequester && booking.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUpdateStatus(booking.id, 'accepted')}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleUpdateStatus(booking.id, 'declined')}
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                      </div>
                    )}

                    {booking.status === 'accepted' && (
                      <Button
                        onClick={() => handleUpdateStatus(booking.id, 'completed')}
                        variant="outline"
                        className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No upcoming bookings"
              description="You haven't scheduled any skill swap sessions yet. Find a match and book your first session to start learning!"
              actionLabel="Find Matches"
              onAction={() => navigate('/home')}
            >
              <div className="bg-blue-50 rounded-lg p-3 max-w-sm mx-auto border border-blue-100">
                <p className="text-xs text-gray-700">
                  <strong>💡 Tip:</strong> Chat with your matches first to plan the perfect swap before booking!
                </p>
              </div>
            </EmptyState>
          )}
        </section>

        {/* Completed Bookings */}
        {completed.length > 0 && (
          <section>
            <h3 className="text-gray-900 mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Completed ({completed.length})
            </h3>

            <div className="space-y-3">
              {completed.map((booking) => {
                const otherUser = getOtherUser(booking);
                if (!otherUser) return null;

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 opacity-75"
                  >
                    <div className="flex items-center gap-3">
                      {otherUser.photo_url ? (
                        <ImageWithFallback
                          src={otherUser.photo_url}
                          alt={otherUser.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                          <span>{otherUser.full_name.charAt(0)}</span>
                        </div>
                      )}

                      <div className="flex-1">
                        <h4 className="text-gray-900 text-sm">{otherUser.full_name}</h4>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.scheduled_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        Completed
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
