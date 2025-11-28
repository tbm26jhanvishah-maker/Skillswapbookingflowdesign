import { projectId, publicAnonKey } from './supabase/info';
import type { User, Match, Chat, Booking, SessionMode, BookingStatus } from './mockData';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-45e2f32b`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
};

// ===== USER API =====

export async function getUser(userId: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}`, { headers });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function updateUser(userId: string, data: Partial<User>): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
}

// ===== MATCH API =====

export async function getMatches(userId: string): Promise<Match[]> {
  try {
    const response = await fetch(`${API_BASE}/matches/${userId}`, { headers });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}

export async function findMatches(
  userId: string,
  teachSkills: any[],
  learnSkills: any[]
): Promise<Match[]> {
  try {
    const response = await fetch(`${API_BASE}/matches/find`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, teachSkills, learnSkills }),
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error finding matches:', error);
    return [];
  }
}

// ===== CHAT API =====

export async function getChats(userId: string): Promise<Chat[]> {
  try {
    const response = await fetch(`${API_BASE}/chats/${userId}`, { headers });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching chats:', error);
    return [];
  }
}

export async function getChat(userId: string, chatId: string): Promise<Chat | null> {
  try {
    const response = await fetch(`${API_BASE}/chats/${userId}/${chatId}`, { headers });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching chat:', error);
    return null;
  }
}

export async function createChat(
  userId: string,
  otherUserId: string,
  otherUser: User
): Promise<Chat | null> {
  try {
    const response = await fetch(`${API_BASE}/chats`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId, otherUserId, otherUser }),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error creating chat:', error);
    return null;
  }
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  text: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/chats/${chatId}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ senderId, text }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
}

// ===== BOOKING API =====

export async function getBookings(userId: string): Promise<Booking[]> {
  try {
    const response = await fetch(`${API_BASE}/bookings/${userId}`, { headers });
    if (!response.ok) return [];
    const bookings = await response.json();
    
    // Parse date strings back to Date objects
    return bookings.map((b: any) => ({
      ...b,
      date: new Date(b.date),
      createdAt: new Date(b.createdAt),
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

export async function createBooking(booking: {
  userId: string;
  user: User;
  teachSkill: string;
  learnSkill: string;
  date: Date;
  time: string;
  mode: SessionMode;
  duration: number;
  status: BookingStatus;
}): Promise<Booking | null> {
  try {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...booking,
        date: booking.date.toISOString(),
      }),
    });
    if (!response.ok) return null;
    const created = await response.json();
    return {
      ...created,
      date: new Date(created.date),
      createdAt: new Date(created.createdAt),
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return null;
  }
}

export async function updateBooking(
  bookingId: string,
  updates: Partial<Booking>
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/bookings/${bookingId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating booking:', error);
    return false;
  }
}
