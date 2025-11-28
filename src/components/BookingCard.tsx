import { Calendar, Clock, MapPin, Video, Star } from 'lucide-react';
import { Button } from './ui/button';
import type { Booking } from '../utils/mockData';

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white">
            {booking.user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-gray-900">{booking.user.name}</h3>
            <p className="text-gray-600 text-sm">{booking.user.campus}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(booking.status)}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      {/* Skill Swap */}
      <div className="bg-purple-50 rounded-lg p-3 mb-3">
        <p className="text-sm text-gray-700">
          <span className="text-purple-600">{booking.teachSkill}</span>
          {' ↔ '}
          <span className="text-purple-600">{booking.learnSkill}</span>
        </p>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(booking.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{booking.time} • {booking.duration}/{booking.duration} min</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {booking.mode === 'online' ? (
            <Video className="w-4 h-4" />
          ) : (
            <MapPin className="w-4 h-4" />
          )}
          <span>{booking.mode === 'online' ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {booking.status === 'confirmed' && (
          <>
            <Button variant="outline" className="flex-1 text-sm">
              Reschedule
            </Button>
            <Button variant="outline" className="flex-1 text-sm text-red-600 hover:text-red-700">
              Cancel
            </Button>
          </>
        )}
        {booking.status === 'pending' && (
          <Button variant="outline" className="w-full text-sm" disabled>
            Awaiting Confirmation
          </Button>
        )}
        {booking.status === 'completed' && (
          <Button className="w-full text-sm bg-purple-600 hover:bg-purple-700 text-white">
            <Star className="w-4 h-4 mr-2" />
            Rate Session
          </Button>
        )}
      </div>
    </div>
  );
}
