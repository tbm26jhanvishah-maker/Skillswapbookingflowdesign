export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type MatchPriority = 'high' | 'medium';
export type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';
export type SessionMode = 'online' | 'offline';

export interface User {
  id: string;
  name: string;
  campus: string;
  photo?: string;
  bio: string;
  teachSkills: { skill: string; level: SkillLevel }[];
  learnSkills: { skill: string; level: SkillLevel }[];
  availability?: string[];
}

export interface Match {
  id: string;
  user: User;
  priority: MatchPriority;
  teachSkill: string;
  learnSkill: string;
  mutualSwap: boolean;
  timestamp: Date;
  isNew: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  user: User;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface Booking {
  id: string;
  user: User;
  teachSkill: string;
  learnSkill: string;
  date: Date;
  time: string;
  mode: SessionMode;
  duration: number; // minutes per skill
  status: BookingStatus;
  createdAt: Date;
}

// Current user (you)
export const currentUser: User = {
  id: 'current-user',
  name: 'You',
  campus: 'IIT Delhi',
  bio: 'Love learning and teaching!',
  teachSkills: [
    { skill: 'Python', level: 'advanced' },
    { skill: 'Video Editing', level: 'intermediate' },
  ],
  learnSkills: [
    { skill: 'Guitar', level: 'beginner' },
    { skill: 'Excel', level: 'intermediate' },
  ],
};

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Arjun Mehta',
    campus: 'IIT Delhi',
    bio: 'Music enthusiast and data nerd',
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
    id: '2',
    name: 'Priya Sharma',
    campus: 'DU North Campus',
    bio: 'Creative soul learning to code',
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
    id: '3',
    name: 'Rohan Kumar',
    campus: 'IIT Delhi',
    bio: 'Tech + design',
    teachSkills: [
      { skill: 'Figma', level: 'advanced' },
    ],
    learnSkills: [
      { skill: 'Video Editing', level: 'intermediate' },
    ],
    availability: ['flexible'],
  },
  {
    id: '4',
    name: 'Ananya Singh',
    campus: 'SRCC',
    bio: 'Excel wizard, guitar learner',
    teachSkills: [
      { skill: 'Excel', level: 'advanced' },
      { skill: 'Public Speaking', level: 'intermediate' },
    ],
    learnSkills: [
      { skill: 'Guitar', level: 'beginner' },
    ],
  },
];

// Generate matches based on current user's skills
export const mockMatches: Match[] = [
  {
    id: 'm1',
    user: mockUsers[0], // Arjun - mutual swap
    priority: 'high',
    teachSkill: 'Guitar',
    learnSkill: 'Python',
    mutualSwap: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    isNew: true,
  },
  {
    id: 'm2',
    user: mockUsers[1], // Priya - one sided
    priority: 'medium',
    teachSkill: 'Guitar',
    learnSkill: 'Python',
    mutualSwap: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isNew: true,
  },
  {
    id: 'm3',
    user: mockUsers[2], // Rohan - one sided
    priority: 'medium',
    teachSkill: 'Figma',
    learnSkill: 'Video Editing',
    mutualSwap: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isNew: false,
  },
];

// Mock chats
export const mockChats: Chat[] = [
  {
    id: 'c1',
    user: mockUsers[0],
    messages: [
      {
        id: 'msg1',
        senderId: 'current-user',
        text: "Hey! I'd love to swap — you teach Guitar, I'll teach Python. How did you start learning this? Let's plan our session :)",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        id: 'msg2',
        senderId: '1',
        text: "Hey! I started guitar during COVID on YouTube. Love the idea of swapping!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
      },
      {
        id: 'msg3',
        senderId: 'current-user',
        text: "That's awesome! What's your level now?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
      },
      {
        id: 'msg4',
        senderId: '1',
        text: "I can play beginner chords and a few songs. What about Python?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22),
      },
    ],
    unreadCount: 0,
  },
  {
    id: 'c2',
    user: mockUsers[1],
    messages: [
      {
        id: 'msg5',
        senderId: 'current-user',
        text: "Hi Priya! Saw we matched on Python ↔ Tarot Reading. Interested in swapping?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      },
      {
        id: 'msg6',
        senderId: '2',
        text: "Yes! I'd love to. When works for you?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
      },
    ],
    unreadCount: 1,
  },
];

// Add last message to chats
mockChats.forEach(chat => {
  if (chat.messages.length > 0) {
    chat.lastMessage = chat.messages[chat.messages.length - 1];
  }
});

// Mock bookings
export const mockBookings: Booking[] = [
  {
    id: 'b1',
    user: mockUsers[0],
    teachSkill: 'Python',
    learnSkill: 'Guitar',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
    time: '11:00 AM',
    mode: 'online',
    duration: 30,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: 'b2',
    user: mockUsers[2],
    teachSkill: 'Video Editing',
    learnSkill: 'Figma',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
    time: '3:00 PM',
    mode: 'offline',
    duration: 30,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    id: 'b3',
    user: mockUsers[1],
    teachSkill: 'Python',
    learnSkill: 'Tarot Reading',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    time: '10:00 AM',
    mode: 'online',
    duration: 30,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
];
