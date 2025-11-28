# SkillSwap Quick Start Guide 🚀

## Welcome! Your Supabase-powered skill swapping platform is ready.

---

## 📋 Prerequisites

1. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
2. **Node.js** - Version 16 or higher
3. **A code editor** - VS Code recommended

---

## 🎯 Step-by-Step Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - **Name**: SkillSwap (or any name)
   - **Database Password**: Save this somewhere safe!
   - **Region**: Choose closest to you
4. Click "Create new project" and wait ~2 minutes

### Step 2: Get Your Credentials

1. In your Supabase project dashboard, click **Settings** (gear icon)
2. Go to **API** section
3. Copy these two values:
   - **Project URL** (looks like: `https://abc123xyz.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 3: Configure Your App

**Option A: Using Environment Variables (Recommended)**

1. Create a `.env` file in your project root:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and paste your credentials:
   ```env
   VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

**Option B: Direct Configuration**

Edit `/utils/supabase/supabaseClient.ts`:
```typescript
const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### Step 4: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "+ New query"
3. Open `/DATABASE_SCHEMA.sql` in your code editor
4. Copy **ALL** the SQL code
5. Paste it into the Supabase SQL Editor
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. Wait for "Success. No rows returned" message

✅ This creates:
- 6 database tables (profiles, skills, user_skills, matches, messages, bookings)
- 27 pre-seeded skills
- Row Level Security policies
- Matching algorithm function
- Real-time subscriptions

### Step 5: Enable Real-time for Messages

1. In Supabase dashboard, go to **Database** → **Replication**
2. Find the `messages` table
3. Toggle it **ON** (should turn green)
4. This enables instant chat updates!

### Step 6: Start Your App

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 🎉 You're Done! Now Test It Out

### Create Your First Account

1. Click "Sign up"
2. Fill in:
   - Full Name: Your name
   - Email: test@example.com
   - Password: test1234
3. **Add Teaching Skills** (Step 1/2)
   - Search: "Python"
   - Click to select
   - Search: "Guitar"  
   - Click to select
   - Click "Continue (2)"
4. **Add Learning Skills** (Step 2/2)
   - Search: "Excel"
   - Click to select
   - Search: "Photography"
   - Click to select
   - Click "Finish (2)"

### Create a Second Account (to test matching)

1. Open an **Incognito/Private** window
2. Go to `http://localhost:5173`
3. Sign up with different email: test2@example.com
4. Add Teaching Skills: "Excel", "Photography"
5. Add Learning Skills: "Python", "Guitar"

### Find Your Perfect Match!

1. Go back to your first account
2. On the Home screen, click **"Find Matches"** button
3. You should see test2@example.com as a "Perfect Match"! 🎉

### Start Chatting

1. Click "Start Chat" on the match card
2. Send a message: "Hey! Excited to swap skills!"
3. Switch to your second account (incognito window)
4. Navigate to home and find matches
5. Click "Start Chat" on the same match
6. You'll see the message appear instantly! ⚡

### Book a Session

1. From either account, click "Book" button on a match card
2. Fill in:
   - Date: Tomorrow
   - Time: 2:00 PM
   - Duration: 1 hour
   - Mode: Online
   - Notes: "Looking forward to learning Python!"
3. Click "Create Booking"
4. Go to **Bookings** tab to see your session
5. Switch to the other account
6. They can now **Accept** or **Decline** the booking!

---

## 🗂️ App Structure

### Pages & Routes

**Public Routes**
- `/` - Root (redirects to landing or home based on auth)
- `/landing` - Landing page (shown when logged out)
- `/login` - Sign in screen with "Forgot Password?" link
- `/signup` - Create account
- `/forgot-password` - Password reset screen
- `/add-skills` - Select teaching skills (onboarding step 1)
- `/add-learn-skills` - Select learning goals (onboarding step 2)

**Main App (with bottom navigation, requires login)**
- `/home` - Home (match discovery)
- `/home/chats/:matchId` - Chat with a match
- `/home/bookings` - View and manage your bookings
- `/home/profile` - Your profile with logout button
- `/home/admin` - Admin panel (seed demo users)

**Demo Mode (optional - mock data)**
- `/demo` - Original demo home screen
- `/demo/chats` - Demo chat list
- `/demo/bookings` - Demo bookings

### Key Components

**Supabase-Integrated**
- `LandingPage.tsx` - Public landing with animations
- `LoginScreen.tsx` - Email/password auth with "Welcome Back!" copy
- `SignupScreen.tsx` - Account creation with welcome toast
- `ForgotPasswordScreen.tsx` - Password reset flow
- `AddTeachSkillsScreen.tsx` - Teaching skill selection
- `AddLearnSkillsScreen.tsx` - Learning goal selection
- `HomeSupabase.tsx` - Real match discovery
- `ChatSupabase.tsx` - Real-time messaging
- `BookingsSupabase.tsx` - Booking management
- `BookingModalSupabase.tsx` - Create booking modal
- `ProfilePageSupabase.tsx` - User profile with logout

**Utilities**
- `supabaseClient.ts` - Supabase configuration
- `supabaseApi.ts` - All API functions

### Database Tables

1. **profiles** - User accounts
2. **skills** - Available skills (27 pre-seeded)
3. **user_skills** - User's teaching/learning skills
4. **matches** - Generated skill matches
5. **messages** - Chat messages (real-time enabled)
6. **bookings** - Scheduled sessions

---

## 🎨 Features

### ✅ Authentication & Landing
- Beautiful landing page with animations
- Email/password signup and login
- Password reset flow with email
- Supabase Auth handles sessions
- Automatic profile creation
- Protected routes (redirect to landing if not logged in)
- Logout functionality with redirect

### ✅ Onboarding Flow
- 2-step skill selection
- Search from 27 pre-seeded skills
- Categorized by Tech, Business, Creative, etc.

### ✅ Smart Matching Algorithm
- **Perfect Swaps**: Mutual matches (both can teach what other wants)
- **One-sided Matches**: They teach what you want to learn
- Scored by match quality (100 for mutual, 50 for one-sided)
- SQL function: `find_skill_matches(user_id)`

### ✅ Real-time Chat
- Instant message delivery
- Supabase Realtime subscriptions
- Pinned swap guidance at top
- Different styles for sent vs received messages
- Auto-scroll to latest message

### ✅ Booking System
- Schedule sessions with matched users
- Choose date, time, duration, mode (online/in-person)
- Add optional notes
- Statuses: pending → accepted → completed
- Recipients can accept/decline requests

### ✅ Row Level Security
- Users can only see/edit their own data
- Secure message access (only participants)
- Automatic policy enforcement

---

## 🔧 API Functions Reference

### Authentication
```typescript
signUp(email, password, fullName)  // Creates auth user + profile
signIn(email, password)             // Returns session
signOut()                           // Clears session
getCurrentUser()                    // Gets logged-in user
```

### Profile
```typescript
getMyProfile()                      // Get my profile data
updateMyProfile({ full_name?, campus?, bio?, photo_url? })
```

### Skills
```typescript
searchSkills(query)                 // Search skills by name
addUserSkill(skillId, type, level)  // Add teach/learn skill
getMySkills()                       // Get my skills
removeUserSkill(skillId, type)      // Remove a skill
```

### Matches
```typescript
getMyMatches()                      // Get all my matches
findMatches()                       // Generate new matches (RPC call)
```

### Messages
```typescript
getMessages(matchId)                // Load chat history
sendMessage(matchId, content)       // Send a message
subscribeToMessages(matchId, callback) // Real-time updates
```

### Bookings
```typescript
createBooking(matchId, scheduledAt, duration, mode, notes?)
getMyBookings()                     // All my bookings
updateBookingStatus(bookingId, status) // Accept/decline/complete
```

---

## 🐛 Troubleshooting

### "Not authenticated" errors
- ✅ Make sure you're logged in
- ✅ Check browser console for auth errors
- ✅ Verify Supabase URL and keys in `.env` or `supabaseClient.ts`

### Skills not showing up in search
- ✅ Make sure you ran the full `DATABASE_SCHEMA.sql`
- ✅ Check Supabase dashboard → Table Editor → `skills` table
- ✅ Should have 27 skills pre-seeded

### Real-time chat not working
- ✅ Enable replication for `messages` table in Supabase
- ✅ Check browser console for subscription errors
- ✅ Make sure both users are in the same match

### No matches appearing
- ✅ Create at least 2 users with complementary skills
- ✅ Click "Find Matches" button
- ✅ Check browser console for errors
- ✅ Verify `find_skill_matches` function was created

### RLS policy errors
- ✅ Make sure all policies were created from schema
- ✅ Check user has authenticated role
- ✅ Try the query in Supabase SQL Editor

---

## 📚 Pre-Seeded Skills (27 total)

**Programming** (6)
- Python, JavaScript, React, SQL, Machine Learning, Data Science

**Business** (5)
- Excel, Financial Modeling, Public Speaking, Copywriting, Content Writing

**Music** (3)
- Guitar, Piano, Music Theory

**Creative** (4)
- Photography, Video Editing, Lightroom, Adobe Premiere

**Design** (3)
- Figma, UI/UX Design, Canva

**Wellness** (3)
- Yoga, Meditation, Tarot Reading

**Marketing** (1)
- Social Media Marketing

**Analytics** (2)
- Power BI, Tableau

---

## 🚀 Next Steps

### Customize Your Platform

1. **Add More Skills**
   - Go to Supabase → Table Editor → `skills`
   - Click "Insert row"
   - Add name and category

2. **Update Profile Fields**
   - Add campus/bio to your profile
   - Edit `ProfilePage.tsx` to show Supabase data

3. **Add Photo Upload**
   - Use Supabase Storage
   - Update `photo_url` in profiles table

4. **Email Notifications**
   - Use Supabase Edge Functions
   - Send emails for booking requests

5. **Deploy Your App**
   - Deploy to Vercel, Netlify, or any host
   - Add environment variables on your host
   - Your Supabase database works from anywhere!

---

## 📖 Need Help?

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **React Router Docs**: [reactrouter.com](https://reactrouter.com)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

---

## 🎓 How the Matching Algorithm Works

The `find_skill_matches(user_id)` PostgreSQL function:

1. **Finds Mutual Matches**
   - User A teaches what User B wants to learn
   - User B teaches what User A wants to learn
   - Score: 100 (highest priority)

2. **Finds One-Sided Matches**
   - Other user teaches what I want to learn
   - Score: 50 (lower priority)

3. **Returns Results**
   - Sorted by score (highest first)
   - Includes user IDs and skill IDs
   - Frontend displays with full user details

Example:
```sql
-- User 1 teaches: Python, Guitar
-- User 1 wants to learn: Excel, Photography

-- User 2 teaches: Excel, Photography  
-- User 2 wants to learn: Python, Guitar

-- Result: MUTUAL MATCH! 🎉
```

---

**Built with ❤️ using React, Supabase, Tailwind CSS, and TypeScript**

Enjoy building your skill-swapping community! 🚀
