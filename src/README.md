# SkillSwap - P2P Skill Exchange Platform 🤝

A mobile-first peer-to-peer platform where users exchange practical skills without monetary transactions. Built with React, TypeScript, Tailwind CSS, and Supabase.

---

## ✨ Features

- **Smart Matching Algorithm** - Prioritizes mutual skill swaps (both users teach what the other wants)
- **Real-time Chat** - Instant messaging with Supabase Realtime
- **Booking System** - Schedule and manage skill exchange sessions
- **Skill Discovery** - Search from 27+ pre-seeded skills across multiple categories
- **Complete Auth Flow** - Email/password authentication with Supabase Auth
- **Mobile-First Design** - Optimized for phones with responsive layouts
- **Row Level Security** - Secure data access with Supabase RLS policies

---

## 🚀 Two Versions Available

### 1️⃣ **Supabase Version** (Recommended - Production Ready)
- ✅ Real database (PostgreSQL)
- ✅ Real-time messaging
- ✅ Persistent data storage
- ✅ Secure authentication
- ✅ Multi-user support
- 📍 **Routes**: `/`, `/login`, `/signup`, `/chats/:matchId`, `/bookings`

### 2️⃣ **Demo/Mock Version** (For Testing Without Backend)
- ✅ Mock data in browser
- ✅ No setup required
- ✅ Single user simulation
- ✅ Perfect for UI testing
- 📍 **Routes**: `/demo`, `/demo/chats`, `/demo/bookings`

---

## 📋 Quick Start (5 Minutes)

### Prerequisites
- Node.js 16+
- Supabase account (free tier works!)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd skillswap

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### Supabase Setup

1. **Create Project**
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Click "New Project"
   - Save your project URL and anon key

2. **Configure Environment**
   - Edit `.env` file:
   ```env
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Run Database Schema**
   - In Supabase dashboard, go to SQL Editor
   - Copy contents of `/DATABASE_SCHEMA.sql`
   - Paste and click "Run"

4. **Enable Real-time**
   - Go to Database → Replication
   - Enable replication for `messages` table

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Visit App**
   - Open `http://localhost:5173`
   - Click "Sign up" to create your first account!

📖 **Full setup guide**: See [QUICKSTART.md](./QUICKSTART.md)

---

## 📁 Project Structure

```
skillswap/
├── components/
│   ├── LoginScreen.tsx              # Email/password login
│   ├── SignupScreen.tsx             # Account creation
│   ├── AddTeachSkillsScreen.tsx     # Teaching skills onboarding
│   ├── AddLearnSkillsScreen.tsx     # Learning goals onboarding
│   ├── HomeSupabase.tsx             # Match discovery (Supabase)
│   ├── ChatSupabase.tsx             # Real-time chat (Supabase)
│   ├── BookingsSupabase.tsx         # Booking management (Supabase)
│   ├── BookingModalSupabase.tsx     # Create booking modal
│   ├── HomePageNew.tsx              # Demo home screen
│   ├── ChatsPage.tsx                # Demo chats
│   ├── BookingsPage.tsx             # Demo bookings
│   ├── ProfilePage.tsx              # User profile
│   └── ui/                          # Shadcn components
├── utils/
│   ├── supabase/
│   │   └── supabaseClient.ts        # Supabase client config
│   ├── supabaseApi.ts               # All Supabase API functions
│   ├── api.ts                       # Mock API for demo version
│   ├── mockData.ts                  # Mock users and data
│   └── routes.tsx                   # React Router setup
├── DATABASE_SCHEMA.sql              # Complete Supabase schema
├── QUICKSTART.md                    # Detailed setup guide
├── SUPABASE_SETUP_GUIDE.md          # In-depth Supabase docs
├── .env.example                     # Environment template
└── README.md                        # This file
```

---

## 🗄️ Database Schema

### Tables
1. **profiles** - User accounts (linked to Supabase Auth)
2. **skills** - Available skills (27 pre-seeded)
3. **user_skills** - User's teaching/learning skills
4. **matches** - Generated skill matches
5. **messages** - Chat messages (real-time enabled)
6. **bookings** - Scheduled sessions

### Matching Algorithm
Powered by PostgreSQL function `find_skill_matches(user_id)`:
- **Mutual Matches** (Score: 100) - Both users can teach what the other wants
- **One-Sided Matches** (Score: 50) - They teach what you want to learn

---

## 🎯 User Journey

### 1. Sign Up & Onboarding
1. Create account with email/password
2. Add skills you can teach (e.g., Python, Guitar)
3. Add skills you want to learn (e.g., Excel, Photography)

### 2. Discover Matches
- Click "Find Matches" to run the matching algorithm
- See "Perfect Swaps" (mutual matches) first
- Browse other potential connections

### 3. Start Chatting
- Click "Start Chat" on any match
- Real-time messaging with pinned swap guidance
- Plan your skill exchange

### 4. Book Sessions
- Click "Book" button on match card
- Choose date, time, duration, and mode (online/in-person)
- Add optional notes
- Other user can accept/decline

### 5. Manage Bookings
- View upcoming sessions
- Accept/decline incoming requests
- Mark sessions as completed

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **React Router** - Navigation
- **Shadcn/ui** - Component library
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security
- **Supabase JS Client** - Database queries

### Development
- **Vite** - Build tool
- **ESLint** - Code linting

---

## 🔧 API Functions

### Authentication
```typescript
signUp(email, password, fullName)
signIn(email, password)
signOut()
getCurrentUser()
```

### Skills
```typescript
searchSkills(query)                    // Search by name
addUserSkill(skillId, type, level)     // Add teach/learn skill
getMySkills()                          // Get my skills
removeUserSkill(skillId, type)         // Remove skill
```

### Matches
```typescript
getMyMatches()                         // All my matches
findMatches()                          // Generate new matches
```

### Messages
```typescript
getMessages(matchId)                   // Load chat history
sendMessage(matchId, content)          // Send message
subscribeToMessages(matchId, callback) // Real-time updates
```

### Bookings
```typescript
createBooking(matchId, scheduledAt, duration, mode, notes?)
getMyBookings()
updateBookingStatus(bookingId, status)
```

---

## 🎨 UI Components

### Screens
- Login/Signup screens
- 2-step onboarding (teach/learn skills)
- Home with match cards
- Real-time chat with pinned guidance
- Booking creation modal
- Booking management list

### Features
- Gradient headers
- Profile avatars
- Skill badges with levels
- Status indicators (pending/accepted/completed)
- Loading states
- Error handling
- Toast notifications

---

## 🔒 Security

### Row Level Security (RLS)
All tables have RLS policies:
- Users can only view/edit their own profiles
- Messages require match participation
- Bookings require match participation
- Skills are public for discovery

### Authentication
- Supabase Auth with email/password
- Secure session management
- Automatic token refresh

---

## 📱 Routes

### Authentication (No Layout)
- `/login` - Sign in
- `/signup` - Create account
- `/add-skills` - Teaching skills (onboarding step 1)
- `/add-learn-skills` - Learning goals (onboarding step 2)

### Main App (With Bottom Navigation)
- `/` - Home (Supabase version)
- `/chats/:matchId` - Chat screen
- `/bookings` - Bookings management
- `/profile` - User profile

### Demo Mode (Mock Data)
- `/demo` - Demo home
- `/demo/chats` - Demo chat list
- `/demo/chats/:chatId` - Demo chat detail
- `/demo/bookings` - Demo bookings

### Admin
- `/admin` - Admin panel (seed KV demo data)

---

## 🧪 Testing Guide

### Create Test Accounts

**User 1**
```
Email: test1@example.com
Password: password123
Teaches: Python, Guitar
Wants: Excel, Photography
```

**User 2**
```
Email: test2@example.com  
Password: password123
Teaches: Excel, Photography
Wants: Python, Guitar
```

### Test Workflow
1. Sign up as User 1
2. Add teaching/learning skills
3. Open incognito window
4. Sign up as User 2 with complementary skills
5. Click "Find Matches" on either account
6. You should see each other as "Perfect Match"!
7. Start chatting and book a session

---

## 📚 Pre-Seeded Skills (27)

**Programming**: Python, JavaScript, React, SQL, Machine Learning, Data Science

**Business**: Excel, Financial Modeling, Public Speaking, Copywriting, Content Writing

**Music**: Guitar, Piano, Music Theory

**Creative**: Photography, Video Editing, Lightroom, Adobe Premiere

**Design**: Figma, UI/UX Design, Canva

**Wellness**: Yoga, Meditation, Tarot Reading

**Marketing**: Social Media Marketing

**Analytics**: Power BI, Tableau

---

## 🐛 Troubleshooting

### "Not authenticated" errors
- Check if logged in
- Verify `.env` file has correct credentials
- Check browser console for auth errors

### Real-time chat not working
- Enable replication for `messages` table in Supabase
- Check browser console for subscription errors

### No matches appearing
- Create at least 2 users with complementary skills
- Click "Find Matches" button
- Check that `find_skill_matches` function exists in database

### Skills not showing
- Verify `DATABASE_SCHEMA.sql` was run completely
- Check `skills` table has 27 rows

---

## 🚀 Deployment

### Frontend
Deploy to Vercel, Netlify, or any static host:

```bash
npm run build
```

Add environment variables on your host:
```
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

### Database
Your Supabase database works from anywhere - no changes needed!

---

## 📖 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Detailed setup guide
- [SUPABASE_SETUP_GUIDE.md](./SUPABASE_SETUP_GUIDE.md) - In-depth Supabase documentation
- [DATABASE_SCHEMA.sql](./DATABASE_SCHEMA.sql) - Complete database schema

---

## 🎓 Learning Resources

- [Supabase Docs](https://supabase.com/docs)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Shadcn/ui Docs](https://ui.shadcn.com)

---

## 🌟 Features Roadmap

- [ ] Profile photo upload (Supabase Storage)
- [ ] Email notifications for bookings
- [ ] In-app notifications
- [ ] User ratings/reviews
- [ ] Campus-based filtering
- [ ] Skill level verification
- [ ] Video chat integration
- [ ] Social login (Google, GitHub)

---

## 📄 License

MIT License - Feel free to use for your projects!

---

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

**Built with ❤️ by the SkillSwap team**

Happy skill swapping! 🚀
