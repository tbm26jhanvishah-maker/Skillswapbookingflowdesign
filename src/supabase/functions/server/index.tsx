import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';
import { seedData } from './seed.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// Prefix for all routes
const PREFIX = '/make-server-45e2f32b';

// Seed data on first run
let seeded = false;
async function ensureSeeded() {
  if (!seeded) {
    await seedData();
    seeded = true;
  }
}
ensureSeeded();

// ===== USER ROUTES =====

// Get current user profile
app.get(`${PREFIX}/users/:userId`, async (c) => {
  try {
    const userId = c.req.param('userId');
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    return c.json(user);
  } catch (error) {
    console.log('Error fetching user:', error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
});

// Update user profile
app.put(`${PREFIX}/users/:userId`, async (c) => {
  try {
    const userId = c.req.param('userId');
    const body = await c.req.json();
    
    await kv.set(`user:${userId}`, {
      ...body,
      id: userId,
      updatedAt: new Date().toISOString(),
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error updating user:', error);
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

// ===== MATCH ROUTES =====

// Get matches for a user
app.get(`${PREFIX}/matches/:userId`, async (c) => {
  try {
    const userId = c.req.param('userId');
    const matches = await kv.getByPrefix(`match:${userId}:`);
    
    return c.json(matches || []);
  } catch (error) {
    console.log('Error fetching matches:', error);
    return c.json({ error: 'Failed to fetch matches' }, 500);
  }
});

// Find matches for current user
app.post(`${PREFIX}/matches/find`, async (c) => {
  try {
    const { userId, teachSkills, learnSkills } = await c.req.json();
    
    // Get all users
    const allUsers = await kv.getByPrefix('user:');
    const matches = [];
    
    for (const otherUser of allUsers) {
      if (otherUser.id === userId) continue;
      
      // Check for mutual swaps and one-sided matches
      for (const teachSkill of teachSkills) {
        const otherWantsToLearn = otherUser.learnSkills?.some(
          (s: any) => s.skill.toLowerCase() === teachSkill.skill.toLowerCase()
        );
        
        if (otherWantsToLearn) {
          for (const learnSkill of learnSkills) {
            const otherCanTeach = otherUser.teachSkills?.some(
              (s: any) => s.skill.toLowerCase() === learnSkill.skill.toLowerCase()
            );
            
            if (otherCanTeach) {
              const matchId = `match:${userId}:${otherUser.id}:${Date.now()}`;
              const match = {
                id: matchId,
                userId: userId,
                matchedUserId: otherUser.id,
                matchedUser: otherUser,
                teachSkill: teachSkill.skill,
                learnSkill: learnSkill.skill,
                mutualSwap: true,
                priority: 'high',
                timestamp: new Date().toISOString(),
                isNew: true,
              };
              
              await kv.set(matchId, match);
              matches.push(match);
            }
          }
        }
      }
    }
    
    return c.json(matches);
  } catch (error) {
    console.log('Error finding matches:', error);
    return c.json({ error: 'Failed to find matches' }, 500);
  }
});

// ===== CHAT ROUTES =====

// Get all chats for a user
app.get(`${PREFIX}/chats/:userId`, async (c) => {
  try {
    const userId = c.req.param('userId');
    const chats = await kv.getByPrefix(`chat:${userId}:`);
    
    return c.json(chats || []);
  } catch (error) {
    console.log('Error fetching chats:', error);
    return c.json({ error: 'Failed to fetch chats' }, 500);
  }
});

// Get specific chat
app.get(`${PREFIX}/chats/:userId/:chatId`, async (c) => {
  try {
    const chatId = c.req.param('chatId');
    const chat = await kv.get(chatId);
    
    if (!chat) {
      return c.json({ error: 'Chat not found' }, 404);
    }
    
    return c.json(chat);
  } catch (error) {
    console.log('Error fetching chat:', error);
    return c.json({ error: 'Failed to fetch chat' }, 500);
  }
});

// Create or get chat between two users
app.post(`${PREFIX}/chats`, async (c) => {
  try {
    const { userId, otherUserId, otherUser } = await c.req.json();
    
    // Check if chat already exists
    const existingChats = await kv.getByPrefix(`chat:${userId}:`);
    const existingChat = existingChats.find((chat: any) => 
      chat.user?.id === otherUserId
    );
    
    if (existingChat) {
      return c.json(existingChat);
    }
    
    // Create new chat
    const chatId = `chat:${userId}:${otherUserId}`;
    const chat = {
      id: chatId,
      userId,
      user: otherUser,
      messages: [],
      unreadCount: 0,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(chatId, chat);
    return c.json(chat);
  } catch (error) {
    console.log('Error creating chat:', error);
    return c.json({ error: 'Failed to create chat' }, 500);
  }
});

// Send message
app.post(`${PREFIX}/chats/:chatId/messages`, async (c) => {
  try {
    const chatId = c.req.param('chatId');
    const { senderId, text } = await c.req.json();
    
    const chat = await kv.get(chatId);
    if (!chat) {
      return c.json({ error: 'Chat not found' }, 404);
    }
    
    const message = {
      id: `msg:${Date.now()}`,
      senderId,
      text,
      timestamp: new Date().toISOString(),
    };
    
    chat.messages = [...(chat.messages || []), message];
    chat.lastMessage = message;
    chat.updatedAt = new Date().toISOString();
    
    await kv.set(chatId, chat);
    return c.json(message);
  } catch (error) {
    console.log('Error sending message:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

// ===== BOOKING ROUTES =====

// Get bookings for a user
app.get(`${PREFIX}/bookings/:userId`, async (c) => {
  try {
    const userId = c.req.param('userId');
    const bookings = await kv.getByPrefix(`booking:${userId}:`);
    
    return c.json(bookings || []);
  } catch (error) {
    console.log('Error fetching bookings:', error);
    return c.json({ error: 'Failed to fetch bookings' }, 500);
  }
});

// Create booking
app.post(`${PREFIX}/bookings`, async (c) => {
  try {
    const booking = await c.req.json();
    const bookingId = `booking:${booking.userId}:${Date.now()}`;
    
    const newBooking = {
      ...booking,
      id: bookingId,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(bookingId, newBooking);
    return c.json(newBooking);
  } catch (error) {
    console.log('Error creating booking:', error);
    return c.json({ error: 'Failed to create booking' }, 500);
  }
});

// Update booking
app.put(`${PREFIX}/bookings/:bookingId`, async (c) => {
  try {
    const bookingId = c.req.param('bookingId');
    const updates = await c.req.json();
    
    const booking = await kv.get(bookingId);
    if (!booking) {
      return c.json({ error: 'Booking not found' }, 404);
    }
    
    const updatedBooking = {
      ...booking,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(bookingId, updatedBooking);
    return c.json(updatedBooking);
  } catch (error) {
    console.log('Error updating booking:', error);
    return c.json({ error: 'Failed to update booking' }, 500);
  }
});

// Health check
app.get(`${PREFIX}/health`, (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
