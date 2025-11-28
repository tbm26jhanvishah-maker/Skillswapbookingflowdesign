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

// Mock users with photos
export const mockUsers: User[] = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
    id: '5',
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
    id: '6',
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
    id: '7',
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
    id: '8',
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
    id: '9',
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
    id: '10',
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
    id: '11',
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
    id: '12',
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
    id: '13',
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
    id: '14',
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
    id: '15',
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
    id: '16',
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
