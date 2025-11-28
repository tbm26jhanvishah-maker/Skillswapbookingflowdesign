import { supabase } from './supabase/supabaseClient';
import { projectId, publicAnonKey } from './supabase/info';

// ===== AUTH =====

export async function signUp(email: string, password: string, fullName: string) {
  // Call backend to create user with auto-confirmed email
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-45e2f32b/auth/signup`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ email, password, fullName }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to sign up');
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ===== PROFILE =====

export async function getMyProfile() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // Return user metadata from auth
  return {
    id: user.id,
    full_name: user.user_metadata?.full_name || '',
    email: user.email || '',
    campus: user.user_metadata?.campus || '',
    bio: user.user_metadata?.bio || '',
    photo_url: user.user_metadata?.photo_url || '',
  };
}

export async function updateMyProfile(updates: {
  full_name?: string;
  campus?: string;
  bio?: string;
  photo_url?: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      ...updates,
    }
  });

  if (error) throw error;
  
  return {
    id: data.user.id,
    full_name: data.user.user_metadata?.full_name || '',
    email: data.user.email || '',
    campus: data.user.user_metadata?.campus || '',
    bio: data.user.user_metadata?.bio || '',
    photo_url: data.user.user_metadata?.photo_url || '',
  };
}

// ===== SKILLS =====

// Predefined skills list (since we're not using SQL tables)
const PREDEFINED_SKILLS = [
  { id: 'skill-python', name: 'Python', category: 'Programming' },
  { id: 'skill-javascript', name: 'JavaScript', category: 'Programming' },
  { id: 'skill-react', name: 'React', category: 'Programming' },
  { id: 'skill-excel', name: 'Excel', category: 'Productivity' },
  { id: 'skill-guitar', name: 'Guitar', category: 'Music' },
  { id: 'skill-piano', name: 'Piano', category: 'Music' },
  { id: 'skill-singing', name: 'Singing', category: 'Music' },
  { id: 'skill-photography', name: 'Photography', category: 'Creative' },
  { id: 'skill-video-editing', name: 'Video Editing', category: 'Creative' },
  { id: 'skill-figma', name: 'Figma', category: 'Design' },
  { id: 'skill-ui-ux', name: 'UI/UX Design', category: 'Design' },
  { id: 'skill-canva', name: 'Canva', category: 'Design' },
  { id: 'skill-tarot', name: 'Tarot Reading', category: 'Wellness' },
  { id: 'skill-yoga', name: 'Yoga', category: 'Wellness' },
  { id: 'skill-meditation', name: 'Meditation', category: 'Wellness' },
  { id: 'skill-public-speaking', name: 'Public Speaking', category: 'Communication' },
  { id: 'skill-copywriting', name: 'Copywriting', category: 'Writing' },
  { id: 'skill-content-writing', name: 'Content Writing', category: 'Writing' },
  { id: 'skill-sql', name: 'SQL', category: 'Data' },
  { id: 'skill-data-science', name: 'Data Science', category: 'Data' },
  { id: 'skill-machine-learning', name: 'Machine Learning', category: 'Data' },
  { id: 'skill-social-media', name: 'Social Media Marketing', category: 'Marketing' },
  { id: 'skill-cooking', name: 'Cooking', category: 'Lifestyle' },
  { id: 'skill-drawing', name: 'Drawing', category: 'Creative' },
  { id: 'skill-painting', name: 'Painting', category: 'Creative' },
];

export async function searchSkills(query: string) {
  // Filter predefined skills by query
  const filtered = PREDEFINED_SKILLS.filter(skill =>
    skill.name.toLowerCase().includes(query.toLowerCase())
  );
  return filtered.slice(0, 20);
}

export async function addUserSkill(
  skillId: string,
  type: 'teach' | 'learn',
  level: 'beginner' | 'intermediate' | 'advanced'
) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const skill = PREDEFINED_SKILLS.find(s => s.id === skillId);
  if (!skill) throw new Error('Skill not found');

  const currentSkills = user.user_metadata?.skills || { teach: [], learn: [] };
  const skillsList = currentSkills[type] || [];
  
  // Check if skill already exists
  const exists = skillsList.find((s: any) => s.skill_id === skillId);
  if (!exists) {
    skillsList.push({ skill_id: skillId, skill_name: skill.name, level, type });
  }

  currentSkills[type] = skillsList;

  const { data, error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      skills: currentSkills,
    }
  });

  if (error) throw error;
  return { skill_id: skillId, skill_name: skill.name, level, type };
}

export async function getMySkills() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const skills = user.user_metadata?.skills || { teach: [], learn: [] };
  const teachSkills = (skills.teach || []).map((s: any) => ({
    ...s,
    skill: { id: s.skill_id, name: s.skill_name }
  }));
  const learnSkills = (skills.learn || []).map((s: any) => ({
    ...s,
    skill: { id: s.skill_id, name: s.skill_name }
  }));

  return [...teachSkills, ...learnSkills];
}

export async function removeUserSkill(skillId: string, type: 'teach' | 'learn') {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const currentSkills = user.user_metadata?.skills || { teach: [], learn: [] };
  currentSkills[type] = (currentSkills[type] || []).filter((s: any) => s.skill_id !== skillId);

  const { error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      skills: currentSkills,
    }
  });

  if (error) throw error;
}

// ===== MATCHES =====

export async function getMyMatches() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // Get matches from backend
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-45e2f32b/matches/${user.id}`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }

    const matches = await response.json();
    
    // Transform backend matches to frontend format
    return matches.map((match: any) => ({
      id: match.matchedUserId,
      user_a_id: user.id,
      user_b_id: match.matchedUserId,
      user_a: {
        id: user.id,
        full_name: user.user_metadata?.full_name || '',
        photo_url: user.user_metadata?.photo_url || '',
        campus: user.user_metadata?.campus || '',
        bio: user.user_metadata?.bio || '',
      },
      user_b: {
        id: match.user.id,
        full_name: match.user.name,
        photo_url: match.user.photo,
        campus: match.user.campus,
        bio: match.user.bio,
      },
      skill_a: {
        id: match.learnSkill,
        name: match.learnSkill,
      },
      skill_b: {
        id: match.teachSkill,
        name: match.teachSkill,
      },
      is_mutual: match.mutualSwap || false,
      created_at: match.timestamp,
    }));
  } catch (error) {
    console.error('Error fetching matches from backend:', error);
    return [];
  }
}

export async function findMatches() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const mySkills = user.user_metadata?.skills || { teach: [], learn: [] };
  const teachSkills = (mySkills.teach || []).map((s: any) => ({
    skill: s.skill_name,
    level: s.level,
  }));
  const learnSkills = (mySkills.learn || []).map((s: any) => ({
    skill: s.skill_name,
    level: s.level,
  }));

  if (teachSkills.length === 0 && learnSkills.length === 0) {
    throw new Error('Please add some teaching or learning skills first!');
  }

  // Call backend to find matches
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-45e2f32b/matches/find`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          userId: user.id,
          teachSkills,
          learnSkills,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to find matches');
    }

    const matches = await response.json();
    return matches;
  } catch (error: any) {
    console.error('Error finding matches:', error);
    throw error;
  }
}

// Helper function to seed sample users (for demo purposes)
export async function seedSampleUsers() {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-45e2f32b/seed`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to seed sample users');
    }

    return await response.json();
  } catch (error) {
    console.error('Error seeding sample users:', error);
    throw error;
  }
}

// ===== MESSAGES =====

export async function getMessages(matchId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const chats = user.user_metadata?.chats || {};
  const messages = chats[matchId] || [];
  return messages;
}

export async function sendMessage(matchId: string, content: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const chats = user.user_metadata?.chats || {};
  const messages = chats[matchId] || [];
  
  const newMessage = {
    id: `msg-${Date.now()}`,
    match_id: matchId,
    sender_id: user.id,
    content,
    created_at: new Date().toISOString(),
    sender: {
      id: user.id,
      full_name: user.user_metadata?.full_name || '',
      photo_url: user.user_metadata?.photo_url || '',
    }
  };

  messages.push(newMessage);
  chats[matchId] = messages;

  await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      chats,
    }
  });

  return newMessage;
}

export function subscribeToMessages(matchId: string, callback: (message: any) => void) {
  // No-op for now - real-time would require a different approach
  return () => {};
}

// ===== BOOKINGS =====

export async function createBooking(
  matchId: string,
  scheduledAt: string, // ISO string
  duration: number, // minutes
  mode: 'online' | 'in-person',
  notes?: string
) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const bookings = user.user_metadata?.bookings || [];
  
  const newBooking = {
    id: `booking-${Date.now()}`,
    match_id: matchId,
    requester_id: user.id,
    scheduled_at: scheduledAt,
    duration_mins: duration,
    mode,
    notes,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  bookings.push(newBooking);

  await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      bookings,
    }
  });

  return newBooking;
}

export async function getMyBookings() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const bookings = user.user_metadata?.bookings || [];
  return bookings;
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'accepted' | 'declined' | 'completed' | 'cancelled'
) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const bookings = user.user_metadata?.bookings || [];
  const bookingIndex = bookings.findIndex((b: any) => b.id === bookingId);
  
  if (bookingIndex === -1) {
    throw new Error('Booking not found');
  }

  bookings[bookingIndex].status = status;
  bookings[bookingIndex].updated_at = new Date().toISOString();

  await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      bookings,
    }
  });

  return bookings[bookingIndex];
}
