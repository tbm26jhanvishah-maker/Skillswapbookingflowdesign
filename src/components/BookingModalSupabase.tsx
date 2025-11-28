import { useState } from 'react';
import { createBooking } from '../utils/supabaseApi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Calendar, Clock, MapPin, FileText } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BookingModalSupabaseProps {
  matchId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingModalSupabase({ matchId, onClose, onSuccess }: BookingModalSupabaseProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [mode, setMode] = useState<'online' | 'in-person'>('online');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      toast.error('Please select date and time');
      return;
    }

    setLoading(true);
    try {
      // Combine date and time into ISO string
      const scheduledAt = new Date(`${date}T${time}`).toISOString();
      
      await createBooking(matchId, scheduledAt, duration, mode, notes);
      
      toast.success('Booking created successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-white">Plan & Book Swap</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-purple-100 text-sm mt-1">
            Schedule your skill exchange session
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Date */}
          <div>
            <Label htmlFor="date" className="flex items-center gap-2 text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Time */}
          <div>
            <Label htmlFor="time" className="flex items-center gap-2 text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration" className="flex items-center gap-2 text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              Duration (minutes)
            </Label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          {/* Mode */}
          <div>
            <Label className="flex items-center gap-2 text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Meeting Mode
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('online')}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  mode === 'online'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-700 hover:border-purple-200'
                }`}
              >
                💻 Online
              </button>
              <button
                type="button"
                onClick={() => setMode('in-person')}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  mode === 'in-person'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-700 hover:border-purple-200'
                }`}
              >
                🏫 In-Person
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="flex items-center gap-2 text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Notes (Optional)
            </Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or topics to cover..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Booking'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
