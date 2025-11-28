# SkillSwap Supabase Setup Guide

## 🎯 Complete Supabase Integration

Your SkillSwap app is now fully integrated with Supabase for authentication, real-time chat, skill matching, and booking management.

---

## 📋 Setup Steps

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your **Project URL** and **Anon Key**

### Step 2: Update Configuration

Edit `/utils/supabase/supabaseClient.ts`:

```typescript
const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### Step 3: Run Database Schema

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `/DATABASE_SCHEMA.sql`
4. Click "Run" to execute

This will create:
- ✅ `profiles` table
- ✅ `skills` table (with 27 pre-seeded skills)
- ✅ `user_skills` table
- ✅ `matches` table
- ✅ `messages` table (with real-time enabled)
- ✅ `bookings` table
- ✅ Row Level Security policies
- ✅ `find_skill_matches()` function
- ✅ Indexes for performance

### Step 4: Enable Real-time

1. In Supabase Dashboard, go to **Database** → **Replication**
2. Enable replication for the `messages` table
3. This allows instant message delivery in chats

---

## 🔐 Authentication Flow

### Sign Up
1. User fills: Email, Password, Full Name
2. Supabase creates auth user
3. Profile record created in `profiles` table
4. Redirects to "Add Skills" flow

### Add Skills (2-step onboarding)
1. **Step 1**: Select skills they can teach
   - Search from 27 pre-seeded skills
   - Skills saved with `type='teach'` and `level='intermediate'`
2. **Step 2**: Select skills they want to learn
   - Skills saved with `type='learn'` and `level='beginner'`
3. Redirects to Home page

### Sign In
1. User enters email and password
2. Supabase validates credentials
3. Returns session token
4. Redirects to Home page

---

## 🏠 Home Screen - Match Discovery

### Features
- **Find Matches Button**: Calls `find_skill_matches()` RPC function
- **Perfect Swaps Section**: Shows mutual matches (both can teach what other wants)
- **More Matches Section**: Shows one-sided matches
- **Real-time Stats**: Shows count of perfect swaps and total matches

### Match Algorithm
The `find_skill_matches(target_user_id)` function returns:

**Mutual Matches (Score: 100)**
- User A teaches what User B wants to learn
- User B teaches what User A wants to learn
- Displayed with "Perfect Match" badge

**One-Sided Matches (Score: 50)**
- Other user teaches what I want to learn
- Lower priority but still useful

### Match Card Features
- Profile photo or gradient avatar
- Name and campus
- Skills involved in the swap
- "Start Chat" button (navigates to chat with `matchId`)
- "Book" button (opens booking modal)

---

## 💬 Chat Screen - Real-time Messaging

### Features
- **Real-time Updates**: Uses Supabase real-time subscriptions
- **Message History**: Loads all previous messages
- **Pinned Guidance**: Sticky helper showing swap planning tips
- **Auto-scroll**: Automatically scrolls to newest message
- **Message Bubbles**: Different styles for sent vs received

### Flow
1. User clicks "Start Chat" on a match card
2. Navigates to `/chats/:matchId`
3. Loads messages with `getMessages(matchId)`
4. Subscribes to new messages with `subscribeToMessages()`
5. User types and sends message with `sendMessage()`
6. New message appears instantly for both users

### Real-time Subscription
```typescript
subscribeToMessages(matchId, (newMessage) => {
  // Callback fired when new message arrives
  // Automatically refreshes message list
});
```

---

## 📅 Booking System

### Create Booking Flow
1. User clicks "Book" on match card
2. Modal opens with form:
   - **Date**: Calendar picker (minimum: today)
   - **Time**: Time picker
   - **Duration**: 30min, 1hr, 1.5hr, 2hr
   - **Mode**: Online or In-Person
   - **Notes**: Optional text
3. On submit: `createBooking(matchId, scheduledAt, duration, mode, notes)`
4. Booking created with `status='pending'`
5. Success toast + redirects to Bookings page

### Bookings Page

**Upcoming Section**
- Shows bookings with `scheduled_at` in future
- Status: `pending` or `accepted`

**If you're the receiver (not requester):**
- See "Accept" and "Decline" buttons
- Click Accept → status becomes `accepted`
- Click Decline → status becomes `declined`

**If booking is accepted:**
- See "Mark as Completed" button
- Updates status to `completed`

**Completed Section**
- Shows all bookings with `status='completed'`
- Grayed out with completion badge

---

## 🔍 Skill Search

### How It Works
- User types in search bar (min 2 characters)
- Calls `searchSkills(query)` with debounce
- Returns skills matching name (case-insensitive)
- Limited to 20 results

### Pre-seeded Skills (27 total)

**Programming**: Python, JavaScript, React, SQL, Machine Learning, Data Science

**Business**: Excel, Financial Modeling, Public Speaking, Copywriting, Content Writing

**Music**: Guitar, Piano, Music Theory

**Creative**: Photography, Video Editing, Lightroom, Adobe Premiere

**Design**: Figma, UI/UX Design, Canva

**Wellness**: Yoga, Meditation, Tarot Reading

**Marketing**: Social Media Marketing

**Analytics**: Power BI, Tableau

### Adding Skills
- User selects from search results
- Chip appears in "Selected" section
- Click X to remove
- On continue: Calls `addUserSkill(skillId, type, level)` for each
- Uses `upsert` to prevent duplicates

---

## 📊 Database Tables

### profiles
```sql
id (UUID) - references auth.users
full_name (TEXT)
email (TEXT UNIQUE)
campus (TEXT)
bio (TEXT)
photo_url (TEXT)
created_at, updated_at
```

### skills
```sql
id (UUID)
name (TEXT UNIQUE)
category (TEXT)
created_at
```

### user_skills
```sql
id (UUID)
user_id (UUID) - references profiles
skill_id (UUID) - references skills
type (TEXT) - 'teach' or 'learn'
level (TEXT) - 'beginner', 'intermediate', 'advanced'
UNIQUE(user_id, skill_id, type)
```

### matches
```sql
id (UUID)
user_a_id (UUID) - references profiles
user_b_id (UUID) - references profiles
skill_a_id (UUID) - user_a teaches
skill_b_id (UUID) - user_b teaches
is_mutual (BOOLEAN)
match_score (INTEGER)
created_at
```

### messages
```sql
id (UUID)
match_id (UUID) - references matches
sender_id (UUID) - references profiles
content (TEXT)
created_at
```

### bookings
```sql
id (UUID)
match_id (UUID) - references matches
requester_id (UUID) - references profiles
scheduled_at (TIMESTAMPTZ)
duration_mins (INTEGER)
mode (TEXT) - 'online' or 'in-person'
notes (TEXT)
status (TEXT) - 'pending', 'accepted', 'declined', 'completed', 'cancelled'
created_at, updated_at
```

---

## 🔒 Row Level Security (RLS)

### profiles
- Anyone can view all profiles
- Users can only update their own profile

### skills
- Anyone can view skills
- Authenticated users can create new skills

### user_skills
- Anyone can view user skills (for matching)
- Users can only modify their own skills

### matches
- Users can only view matches they're part of
- Authenticated users can create matches

### messages
- Users can only view messages in their matches
- Users can only send messages in their matches
- Must be either user_a or user_b in the match

### bookings
- Users can view bookings in their matches
- Users can create bookings in their matches
- Users can update bookings they're part of

---

## 🚀 New Component Files

### Authentication
- `/components/LoginScreen.tsx` - Email/password login
- `/components/SignupScreen.tsx` - Account creation
- `/components/AddTeachSkillsScreen.tsx` - Teaching skills selection
- `/components/AddLearnSkillsScreen.tsx` - Learning goals selection

### Main App (Supabase versions)
- `/components/HomeSupabase.tsx` - Match discovery with real data
- `/components/ChatSupabase.tsx` - Real-time messaging
- `/components/BookingModalSupabase.tsx` - Booking creation modal
- `/components/BookingsSupabase.tsx` - Booking management

### API & Configuration
- `/utils/supabase/supabaseClient.ts` - Supabase client setup
- `/utils/supabaseApi.ts` - All API functions
- `/DATABASE_SCHEMA.sql` - Complete database schema

---

## 🔄 Routing Updates

New routes in `/utils/routes.tsx`:
- `/login` - Login screen
- `/signup` - Signup screen
- `/add-skills` - Teaching skills (onboarding step 1)
- `/add-learn-skills` - Learning goals (onboarding step 2)

Protected routes (require auth):
- `/` - Home (matches)
- `/chats/:chatId` - Chat screen
- `/bookings` - Bookings management
- `/profile` - User profile

---

## 🎨 UI Features

### Loading States
- Spinner animations while fetching data
- Disabled buttons during API calls
- Skeleton screens for better UX

### Error Handling
- Toast notifications for errors (using Sonner)
- Inline error messages under inputs
- Graceful fallbacks for missing data

### Real-time Updates
- Messages appear instantly
- No manual refresh needed
- Automatic scroll to new messages

### Responsive Design
- Mobile-first approach
- Touch-friendly buttons
- Optimized for phones and tablets

---

## 🧪 Testing Your Setup

### 1. Create First User
1. Go to `/signup`
2. Fill form and submit
3. Add teaching skills (e.g., Python, Guitar)
4. Add learning skills (e.g., Excel, Photography)

### 2. Create Second User
1. Sign out (add sign out button to ProfilePage)
2. Create another account
3. Add complementary skills:
   - Teach: Excel, Photography
   - Learn: Python, Guitar

### 3. Find Matches
1. Sign in as first user
2. Click "Find Matches"
3. Should see second user as "Perfect Match"

### 4. Start Chat
1. Click "Start Chat" on match card
2. Send a message
3. Sign in as second user
4. See message appear in real-time

### 5. Create Booking
1. Click "Book" on match card
2. Fill booking details
3. Submit
4. Check Bookings page
5. Sign in as other user
6. Accept booking

---

## 🔧 API Functions Reference

### Auth
```typescript
signUp(email, password, fullName)
signIn(email, password)
signOut()
getCurrentUser()
```

### Profile
```typescript
getMyProfile()
updateMyProfile({ full_name?, campus?, bio?, photo_url? })
```

### Skills
```typescript
searchSkills(query)
addUserSkill(skillId, type, level)
getMySkills()
removeUserSkill(skillId, type)
```

### Matches
```typescript
getMyMatches()
findMatches() // Calls RPC function
```

### Messages
```typescript
getMessages(matchId)
sendMessage(matchId, content)
subscribeToMessages(matchId, callback)
```

### Bookings
```typescript
createBooking(matchId, scheduledAt, duration, mode, notes?)
getMyBookings()
updateBookingStatus(bookingId, status)
```

---

## 🎯 Next Steps

1. **Update Supabase credentials** in `supabaseClient.ts`
2. **Run database schema** in Supabase SQL Editor
3. **Enable real-time** for messages table
4. **Test authentication** flow
5. **Create test users** and matches
6. **Test real-time chat**
7. **Test booking flow**

### Optional Enhancements
- Add profile photo upload (Supabase Storage)
- Add email notifications for bookings
- Add in-app notifications
- Add user ratings/reviews
- Add skill level filters in matching
- Add campus-based filtering
- Add video chat integration for online sessions

---

## 🐛 Common Issues

### "Not authenticated" errors
- Check if user is logged in
- Verify Supabase URL and keys
- Check browser console for auth errors

### RLS policy errors
- Verify all policies are created
- Check user has proper role
- Test with Supabase dashboard SQL editor

### Real-time not working
- Verify messages table has replication enabled
- Check browser console for subscription errors
- Ensure using correct match_id

### Skills not appearing
- Run the seeding part of schema
- Verify skills table has records
- Check search query length (min 2 chars)

---

**Built with ❤️ using React, Supabase, Tailwind CSS**

Now you have a fully functional P2P skill-swapping platform! 🚀
