import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// Prefix for all routes
const PREFIX = '/make-server-45e2f32b';

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
                user: otherUser,
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

// Seed sample data (manual endpoint)
app.post(`${PREFIX}/seed`, async (c) => {
  try {
    const users = [
      {
        id: 'user-1',
        name: 'Arjun Mehta',
        campus: 'IIT Delhi',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        bio: 'Music enthusiast and data nerd. Love teaching guitar and analyzing data patterns.',
        teachSkills: [
          { skill: 'Guitar', level: 'intermediate' },
          { skill: 'Excel', level: 'advanced' },
        ],
        learnSkills: [
          { skill: 'Python', level: 'beginner' },
          { skill: 'Video Editing', level: 'beginner' },
        ],
        availability: ['weekends', 'evenings'],
      },
      {
        id: 'user-2',
        name: 'Priya Sharma',
        campus: 'DU North Campus',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        bio: 'Creative soul learning to code. Tarot reader and aspiring developer.',
        teachSkills: [
          { skill: 'Tarot Reading', level: 'intermediate' },
          { skill: 'Guitar', level: 'beginner' },
        ],
        learnSkills: [
          { skill: 'Python', level: 'beginner' },
        ],
        availability: ['weekday mornings'],
      },
      {
        id: 'user-3',
        name: 'Rohan Kumar',
        campus: 'IIT Delhi',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        bio: 'Tech + design enthusiast. Building beautiful products and learning new skills.',
        teachSkills: [
          { skill: 'Figma', level: 'advanced' },
          { skill: 'UI/UX Design', level: 'advanced' },
        ],
        learnSkills: [
          { skill: 'Video Editing', level: 'intermediate' },
        ],
        availability: ['flexible'],
      },
      {
        id: 'user-4',
        name: 'Ananya Singh',
        campus: 'SRCC',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
        bio: 'Excel wizard and aspiring musician. Love crunching numbers and learning guitar.',
        teachSkills: [
          { skill: 'Excel', level: 'advanced' },
          { skill: 'Public Speaking', level: 'intermediate' },
        ],
        learnSkills: [
          { skill: 'Guitar', level: 'beginner' },
        ],
      },
      {
        id: 'user-5',
        name: 'Karan Verma',
        campus: 'IIT Bombay',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        bio: 'Full-stack developer passionate about teaching. Love to share Python knowledge.',
        teachSkills: [
          { skill: 'Python', level: 'advanced' },
          { skill: 'React', level: 'advanced' },
        ],
        learnSkills: [
          { skill: 'Guitar', level: 'beginner' },
          { skill: 'Excel', level: 'intermediate' },
        ],
        availability: ['evenings', 'weekends'],
      },
      {
        id: 'user-6',
        name: 'Sneha Patel',
        campus: 'BITS Pilani',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
        bio: 'Video editor and creative storyteller. Teaching editing for 3+ years.',
        teachSkills: [
          { skill: 'Video Editing', level: 'advanced' },
          { skill: 'Adobe Premiere', level: 'advanced' },
        ],
        learnSkills: [
          { skill: 'Python', level: 'beginner' },
          { skill: 'Figma', level: 'intermediate' },
        ],
        availability: ['flexible'],
      },
      {
        id: 'user-7',
        name: 'Aditya Kapoor',
        campus: 'IIM Bangalore',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
        bio: 'Finance and Excel pro. Love helping people understand data analytics.',
        teachSkills: [
          { skill: 'Excel', level: 'advanced' },
          { skill: 'Financial Modeling', level: 'intermediate' },
          { skill: 'Public Speaking', level: 'advanced' },
        ],
        learnSkills: [
          { skill: 'Python', level: 'beginner' },
          { skill: 'Guitar', level: 'beginner' },
        ],
        availability: ['evenings', 'weekends'],
      },
      {
        id: 'user-8',
        name: 'Meera Iyer',
        campus: 'St. Stephens College',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        bio: 'Yoga instructor and wellness coach. Teaching mindfulness and fitness.',
        teachSkills: [
          { skill: 'Yoga', level: 'advanced' },
          { skill: 'Meditation', level: 'intermediate' },
        ],
        learnSkills: [
          { skill: 'Photography', level: 'beginner' },
          { skill: 'Canva', level: 'beginner' },
        ],
        availability: ['mornings', 'weekends'],
      },
      {
        id: 'user-9',
        name: 'Vikram Reddy',
        campus: 'NIT Trichy',
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
        bio: 'Full-stack developer and open source contributor. Love teaching coding.',
        teachSkills: [
          { skill: 'Python', level: 'advanced' },
          { skill: 'React', level: 'advanced' },
          { skill: 'SQL', level: 'intermediate' },
        ],
        learnSkills: [
          { skill: 'UI/UX Design', level: 'beginner' },
          { skill: 'Video Editing', level: 'beginner' },
        ],
        availability: ['flexible'],
      },
      {
        id: 'user-10',
        name: 'Ishita Malhotra',
        campus: 'Lady Shri Ram College',
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
        bio: 'Photographer and visual storyteller. Captured 100+ events and portraits.',
        teachSkills: [
          { skill: 'Photography', level: 'advanced' },
          { skill: 'Lightroom', level: 'advanced' },
          { skill: 'Canva', level: 'intermediate' },
        ],
        learnSkills: [
          { skill: 'Video Editing', level: 'intermediate' },
          { skill: 'Excel', level: 'beginner' },
        ],
        availability: ['weekends'],
      },
      {
        id: 'user-11',
        name: 'Rahul Desai',
        campus: "Masters' Union",
        photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
        bio: 'Product designer at a startup. Teaching Figma and design thinking.',
        teachSkills: [
          { skill: 'Figma', level: 'advanced' },
          { skill: 'UI/UX Design', level: 'advanced' },
          { skill: 'Canva', level: 'intermediate' },
        ],
        learnSkills: [
          { skill: 'Python', level: 'beginner' },
          { skill: 'Excel', level: 'intermediate' },
        ],
        availability: ['evenings'],
      },
      {
        id: 'user-12',
        name: 'Neha Gupta',
        campus: 'Delhi University',
        photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop',
        bio: 'Content writer and copywriter. Love crafting stories and teaching writing.',
        teachSkills: [
          { skill: 'Copywriting', level: 'advanced' },
          { skill: 'Content Writing', level: 'advanced' },
          { skill: 'Public Speaking', level: 'intermediate' },
        ],
        learnSkills: [
          { skill: 'Canva', level: 'beginner' },
          { skill: 'Social Media Marketing', level: 'beginner' },
        ],
        availability: ['flexible'],
      },
      {
        id: 'user-13',
        name: 'Siddharth Jain',
        campus: 'IIT Bombay',
        photo: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop',
        bio: 'AI/ML engineer. Teaching Python, data science, and machine learning.',
        teachSkills: [
          { skill: 'Python', level: 'advanced' },
          { skill: 'Machine Learning', level: 'advanced' },
          { skill: 'Data Science', level: 'advanced' },
        ],
        learnSkills: [
          { skill: 'Guitar', level: 'beginner' },
          { skill: 'Photography', level: 'beginner' },
        ],
        availability: ['weekends'],
      },
      {
        id: 'user-14',
        name: 'Kavya Nair',
        campus: 'Manipal University',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
        bio: 'Aspiring musician teaching guitar and music theory for beginners.',
        teachSkills: [
          { skill: 'Guitar', level: 'advanced' },
          { skill: 'Music Theory', level: 'intermediate' },
        ],
        learnSkills: [
          { skill: 'Python', level: 'beginner' },
          { skill: 'Canva', level: 'beginner' },
        ],
        availability: ['evenings', 'weekends'],
      },
      {
        id: 'user-15',
        name: 'Aryan Bose',
        campus: 'Ashoka University',
        photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
        bio: 'Data analyst and Excel enthusiast. Love teaching spreadsheet automation.',
        teachSkills: [
          { skill: 'Excel', level: 'advanced' },
          { skill: 'SQL', level: 'intermediate' },
          { skill: 'Power BI', level: 'intermediate' },
        ],
        learnSkills: [
          { skill: 'Python', level: 'intermediate' },
          { skill: 'Figma', level: 'beginner' },
        ],
        availability: ['weekday evenings'],
      },
      {
        id: 'user-16',
        name: 'Tanvi Shah',
        campus: 'NMIMS Mumbai',
        photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
        bio: 'Marketing professional teaching social media and Canva design.',
        teachSkills: [
          { skill: 'Social Media Marketing', level: 'advanced' },
          { skill: 'Canva', level: 'advanced' },
          { skill: 'Copywriting', level: 'intermediate' },
        ],
        learnSkills: [
          { skill: 'Video Editing', level: 'beginner' },
          { skill: 'Photography', level: 'beginner' },
        ],
        availability: ['flexible'],
      },
    ];

    console.log('Seeding sample users...');
    for (const user of users) {
      await kv.set(`user:${user.id}`, user);
    }
    
    return c.json({ success: true, message: 'Sample users seeded successfully with 16 users!' });
  } catch (error) {
    console.log('Error seeding data:', error);
    return c.json({ error: 'Failed to seed data' }, 500);
  }
});

// Clear all data
app.post(`${PREFIX}/clear`, async (c) => {
  try {
    console.log('Clearing all database data...');
    
    // Get all keys by prefix
    const userKeys = await kv.getByPrefix('user:');
    const matchKeys = await kv.getByPrefix('match:');
    const chatKeys = await kv.getByPrefix('chat:');
    const bookingKeys = await kv.getByPrefix('booking:');
    
    // Delete all records
    const allKeys = [
      ...userKeys.map(u => `user:${u.id}`),
      ...matchKeys.map(m => `match:${m.id}`),
      ...chatKeys.map(ch => `chat:${ch.id}`),
      ...bookingKeys.map(b => `booking:${b.id}`),
    ];
    
    if (allKeys.length > 0) {
      await kv.mdel(allKeys);
    }
    
    console.log(`Cleared ${allKeys.length} records from database`);
    return c.json({ 
      success: true, 
      message: `Successfully cleared ${allKeys.length} records`,
      counts: {
        users: userKeys.length,
        matches: matchKeys.length,
        chats: chatKeys.length,
        bookings: bookingKeys.length,
      }
    });
  } catch (error) {
    console.log('Error clearing data:', error);
    return c.json({ error: 'Failed to clear data' }, 500);
  }
});

// Get database statistics
app.get(`${PREFIX}/stats`, async (c) => {
  try {
    const userKeys = await kv.getByPrefix('user:');
    const matchKeys = await kv.getByPrefix('match:');
    const chatKeys = await kv.getByPrefix('chat:');
    const bookingKeys = await kv.getByPrefix('booking:');
    
    return c.json({
      users: userKeys.length,
      matches: matchKeys.length,
      chats: chatKeys.length,
      bookings: bookingKeys.length,
    });
  } catch (error) {
    console.log('Error fetching stats:', error);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

// Health check
app.get(`${PREFIX}/health`, (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
