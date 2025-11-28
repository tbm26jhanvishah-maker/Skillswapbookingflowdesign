import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { createBooking } from '../utils/api';
import { useCurrentUser } from '../utils/useCurrentUser';
import type { Match, SessionMode } from '../utils/mockData';

interface BookingModalProps {
  match: Match;
  onClose: () => void;
}

export function BookingModal({ match, onClose }: BookingModalProps) {
  const { user } = useCurrentUser();
  const [step, setStep] = useState<'select' | 'confirmed'>('select');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [mode, setMode] = useState<SessionMode>('online');
  const [duration] = useState(30);
  const [creating, setCreating] = useState(false);

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  const handleSendRequest = async () => {
    if (!user || !selectedDate || creating || !match.user) return;
    
    setCreating(true);
    try {
      const booking = await createBooking({
        userId: user.id,
        user: match.user,
        teachSkill: match.learnSkill,
        learnSkill: match.teachSkill,
        date: selectedDate,
        time: selectedTime,
        mode,
        duration,
        status: 'pending',
      });
      
      if (booking) {
        setStep('confirmed');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setCreating(false);
    }
  };

  if (step === 'confirmed') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-gray-900 mb-2">Session Confirmed!</h2>
          
          <p className="text-gray-600 mb-6">
            Session confirmed for {selectedDate?.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}, {selectedTime}, {mode}. Added to Bookings!
          </p>

          <div className="bg-purple-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm">
                {match.user?.name?.charAt(0) || '?'}
              </div>
              <div>
                <p className="text-gray-900">{match.user?.name || 'Unknown'}</p>
                <p className="text-gray-600 text-sm">{match.user?.campus || 'Unknown campus'}</p>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              <p className="mb-1">
                <span className="text-purple-600">{match.learnSkill}</span>
                {' ↔ '}
                <span className="text-purple-600">{match.teachSkill}</span>
              </p>
              <p className="text-gray-600">
                {selectedDate?.toLocaleDateString()} • {selectedTime} • {mode} • {duration}/{duration} min
              </p>
            </div>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            View Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-purple-600 text-white p-6 rounded-t-2xl relative sticky top-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-white mb-1">Suggest Appointment</h2>
          <p className="text-purple-100 text-sm">with {match.user?.name || 'Unknown'}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Calendar */}
          <div className="mb-6">
            <label className="text-gray-900 mb-2 block">Select Date</label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-lg border border-gray-200 mx-auto"
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </div>

          {/* Time Slots */}
          <div className="mb-6">
            <label className="text-gray-900 mb-2 block">Select Time</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                    selectedTime === time
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-600'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div className="mb-6">
            <label className="text-gray-900 mb-2 block">Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('online')}
                className={`px-4 py-3 rounded-lg border text-sm transition-colors ${
                  mode === 'online'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-600'
                }`}
              >
                💻 Online
              </button>
              <button
                onClick={() => setMode('offline')}
                className={`px-4 py-3 rounded-lg border text-sm transition-colors ${
                  mode === 'offline'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-600'
                }`}
              >
                📍 Offline
              </button>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="text-gray-900 mb-2 block">Duration</label>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
              {duration} minutes for each skill ({duration + duration} min total)
            </div>
          </div>

          {/* Actions */}
          <Button
            onClick={handleSendRequest}
            disabled={!selectedDate || creating}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Send Request'}
          </Button>
        </div>
      </div>
    </div>
  );
}
