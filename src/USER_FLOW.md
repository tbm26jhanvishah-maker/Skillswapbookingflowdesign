# SkillSwap User Flow Diagram 📊

Complete user journey from signup to completed skill swap session.

---

## 🎬 Full User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                      │
└─────────────────────────────────────────────────────────────┘

Start
  │
  ├─→ Visit App (/) ──→ Redirect to /login
  │
  ├─→ /login
  │     ├─ Email input
  │     ├─ Password input
  │     └─ Click "Sign In" ──→ Go to Home (/)
  │
  └─→ /signup
        ├─ Full Name input
        ├─ Email input
        ├─ Password input (min 6 chars)
        ├─ Click "Create Account"
        │
        ├─ Supabase creates:
        │   ├─ Auth user
        │   └─ Profile record
        │
        └─→ Redirect to /add-skills


┌─────────────────────────────────────────────────────────────┐
│                   ONBOARDING FLOW (2 STEPS)                 │
└─────────────────────────────────────────────────────────────┘

/add-skills (Step 1: Teaching Skills)
  │
  ├─ Search bar: "Type to search skills..."
  ├─ Search query triggers searchSkills(query)
  │   └─ Returns skills from database (case-insensitive)
  │
  ├─ Click skill chip ──→ Moves to "Selected" section
  ├─ Chips show: Python, Excel, Guitar, etc.
  ├─ Click X on selected chip ──→ Removes from selection
  │
  ├─ Bottom bar shows: "Continue (N)" where N = count
  │
  └─ Click "Continue" ──→ Calls addUserSkill() for each
                          └─ type='teach', level='intermediate'
                          └─ Redirect to /add-learn-skills


/add-learn-skills (Step 2: Learning Goals)
  │
  ├─ Same search UI as Step 1
  ├─ Different color scheme (blue vs purple)
  │
  ├─ Click skill chip ──→ Moves to "Selected" section
  │
  ├─ Bottom bar shows: "Finish (N)" or "Skip for Now"
  │
  └─ Click "Finish" ──→ Calls addUserSkill() for each
                        └─ type='learn', level='beginner'
                        └─ Redirect to Home (/)
                        └─ Toast: "Profile complete!"


┌─────────────────────────────────────────────────────────────┐
│                    HOME SCREEN - MATCH DISCOVERY            │
└─────────────────────────────────────────────────────────────┘

/ (Home)
  │
  ├─ On Load:
  │   ├─ getCurrentUser() ──→ Check auth
  │   ├─ getMyMatches() ──→ Load existing matches
  │   └─ Display matches in sections
  │
  ├─ Header:
  │   ├─ "SkillSwap" title + Beta badge
  │   ├─ "Find Matches" button
  │   └─ Stats bar (when matches exist):
  │       ├─ N Perfect Swaps
  │       └─ N Total Matches
  │
  ├─ Click "Find Matches":
  │   ├─ Calls findMatches() RPC function
  │   ├─ Runs SQL matching algorithm:
  │   │   ├─ Find mutual swaps (score: 100)
  │   │   └─ Find one-sided matches (score: 50)
  │   ├─ Calls getMyMatches() to refresh
  │   └─ Toast: "Matches updated!"
  │
  ├─ Match Cards (2 sections):
  │   │
  │   ├─ Section 1: "Your Skill Matches" (Mutual)
  │   │   ├─ Purple gradient cards
  │   │   ├─ "Perfect Match" green badge
  │   │   ├─ Shows: Photo, Name, Campus, Bio
  │   │   ├─ Skills row: "They Teach" ↔ "You Teach"
  │   │   └─ Buttons:
  │   │       ├─ "Start Chat" ──→ Go to /chats/:matchId
  │   │       └─ "Book" ──→ Open booking modal
  │   │
  │   └─ Section 2: "More Matches" (One-Sided)
  │       ├─ White cards with blue accents
  │       ├─ Shows: Photo, Name, Skill they teach
  │       └─ Button: "Chat" icon ──→ Go to /chats/:matchId
  │
  └─ No Matches State:
      ├─ Sparkles icon
      ├─ "No matches yet"
      ├─ "Click Find Matches to discover..."
      └─ "Find Matches Now" button


┌─────────────────────────────────────────────────────────────┐
│                    CHAT SCREEN - REAL-TIME                  │
└─────────────────────────────────────────────────────────────┘

/chats/:matchId
  │
  ├─ On Load:
  │   ├─ getCurrentUser()
  │   ├─ getMessages(matchId) ──→ Load history
  │   └─ subscribeToMessages(matchId, callback)
  │       └─ Supabase Realtime subscription
  │
  ├─ Header:
  │   ├─ Back arrow ──→ Navigate to /
  │   └─ "Chat" title + Match ID
  │
  ├─ Pinned Guidance (Sticky at top):
  │   ├─ Pin icon
  │   ├─ "💡 Planning your skill swap?"
  │   └─ Tips: "Discuss session length, mode, schedule..."
  │
  ├─ Messages Area:
  │   ├─ Scroll view (auto-scrolls to bottom)
  │   ├─ My messages: Purple gradient, right-aligned
  │   ├─ Their messages: White with border, left-aligned
  │   ├─ Shows: Sender name, content, timestamp
  │   └─ Empty state: "No messages yet"
  │
  ├─ Input Bar (Bottom):
  │   ├─ Text input: "Type a message..."
  │   ├─ Send button (purple gradient)
  │   └─ Disabled while sending
  │
  ├─ Send Message Flow:
  │   ├─ User types message
  │   ├─ Press enter or click Send
  │   ├─ Calls sendMessage(matchId, content)
  │   ├─ Optimistically adds to messages
  │   ├─ Clears input
  │   └─ Real-time: Other user sees instantly via subscription
  │
  └─ Real-time Updates:
      ├─ Subscription callback fires on new message
      ├─ Refreshes message list
      └─ Auto-scrolls to bottom


┌─────────────────────────────────────────────────────────────┐
│                    BOOKING CREATION MODAL                   │
└─────────────────────────────────────────────────────────────┘

BookingModalSupabase (Triggered from Home)
  │
  ├─ Opens as modal overlay (dark backdrop)
  │
  ├─ Header:
  │   ├─ Purple gradient
  │   ├─ "Plan & Book Swap"
  │   └─ X button to close
  │
  ├─ Form Fields:
  │   │
  │   ├─ Date:
  │   │   ├─ HTML date picker
  │   │   └─ Min: Today's date
  │   │
  │   ├─ Time:
  │   │   └─ HTML time picker
  │   │
  │   ├─ Duration:
  │   │   ├─ Dropdown select
  │   │   └─ Options: 30min, 1hr, 1.5hr, 2hr
  │   │
  │   ├─ Mode:
  │   │   ├─ 2 buttons: "💻 Online" | "🏫 In-Person"
  │   │   └─ Highlights selected (purple border)
  │   │
  │   └─ Notes (Optional):
  │       └─ Textarea: "Any special requests..."
  │
  ├─ Bottom Buttons:
  │   ├─ "Cancel" (outline) ──→ Close modal
  │   └─ "Create Booking" (gradient) ──→ Submit
  │
  └─ Submit Flow:
      ├─ Validate: date and time required
      ├─ Combine into ISO string: `${date}T${time}`
      ├─ Call createBooking(matchId, scheduledAt, duration, mode, notes)
      ├─ Supabase creates booking with status='pending'
      ├─ Toast: "Booking created successfully!"
      ├─ Close modal
      └─ Navigate to /bookings


┌─────────────────────────────────────────────────────────────┐
│                    BOOKINGS MANAGEMENT SCREEN               │
└─────────────────────────────────────────────────────────────┘

/bookings
  │
  ├─ On Load:
  │   ├─ getCurrentUser()
  │   └─ getMyBookings() ──→ Load all bookings
  │
  ├─ Header:
  │   ├─ "My Bookings" title
  │   └─ Refresh icon ──→ Reload bookings
  │
  ├─ Categorized by Time + Status:
  │   │
  │   ├─ Upcoming Bookings:
  │   │   ├─ Filter: scheduled_at > now
  │   │   ├─ Filter: status IN ('pending', 'accepted')
  │   │   │
  │   │   └─ Booking Card:
  │   │       ├─ Purple border
  │   │       ├─ User info: Photo, Name
  │   │       ├─ Skills: "Skill A ↔ Skill B"
  │   │       ├─ Status badge: Yellow (pending) or Green (accepted)
  │   │       ├─ Details:
  │   │       │   ├─ Date (full format)
  │   │       │   ├─ Time + Duration
  │   │       │   └─ Mode: Online or In-Person
  │   │       ├─ Notes (if any)
  │   │       │
  │   │       └─ Actions (conditional):
  │   │           │
  │   │           ├─ If I'm RECEIVER and status='pending':
  │   │           │   ├─ "Accept" button (green)
  │   │           │   │   └─ Calls updateBookingStatus(id, 'accepted')
  │   │           │   └─ "Decline" button (red outline)
  │   │           │       └─ Calls updateBookingStatus(id, 'declined')
  │   │           │
  │   │           └─ If status='accepted':
  │   │               └─ "Mark as Completed" button (purple outline)
  │   │                   └─ Calls updateBookingStatus(id, 'completed')
  │   │
  │   └─ Completed Bookings:
  │       ├─ Filter: status='completed'
  │       ├─ Grayed out cards
  │       ├─ Shows: User, Date
  │       └─ Green "Completed" badge
  │
  └─ Empty States:
      ├─ Upcoming: "No upcoming bookings"
      └─ Completed: Section hidden if empty


┌─────────────────────────────────────────────────────────────┐
│                    DATA FLOW DIAGRAM                        │
└─────────────────────────────────────────────────────────────┘

Frontend Components
       │
       ├─→ supabaseApi.ts (All API functions)
       │        │
       │        └─→ supabaseClient.ts (Configured client)
       │                 │
       │                 └─→ Supabase Backend
       │                          │
       │                          ├─→ PostgreSQL Database
       │                          │     ├─ profiles
       │                          │     ├─ skills
       │                          │     ├─ user_skills
       │                          │     ├─ matches
       │                          │     ├─ messages
       │                          │     └─ bookings
       │                          │
       │                          ├─→ Supabase Auth
       │                          │     ├─ User sessions
       │                          │     └─ JWT tokens
       │                          │
       │                          ├─→ Row Level Security
       │                          │     ├─ Automatic policy enforcement
       │                          │     └─ User-based access control
       │                          │
       │                          └─→ Realtime Subscriptions
       │                                └─ messages table changes


┌─────────────────────────────────────────────────────────────┐
│                    MATCHING ALGORITHM FLOW                  │
└─────────────────────────────────────────────────────────────┘

User clicks "Find Matches"
       │
       ├─→ Frontend: Call findMatches()
       │        │
       │        └─→ Supabase RPC: find_skill_matches(user_id)
       │                 │
       │                 ├─→ Query 1: Find Mutual Matches
       │                 │     │
       │                 │     ├─ Join my learn_skills with others' teach_skills
       │                 │     ├─ Where skill_ids match
       │                 │     ├─ AND they want to learn what I teach
       │                 │     └─ Score: 100
       │                 │
       │                 ├─→ Query 2: Find One-Sided Matches
       │                 │     │
       │                 │     ├─ Join my learn_skills with others' teach_skills
       │                 │     ├─ Where skill_ids match
       │                 │     └─ Score: 50
       │                 │
       │                 └─→ Return: Sorted by score DESC
       │                      ├─ match_id
       │                      ├─ other_user_id
       │                      ├─ skill_a_id
       │                      ├─ skill_b_id
       │                      ├─ is_mutual
       │                      └─ match_score
       │
       └─→ Frontend: Display matches in sections
            ├─ Perfect Swaps (is_mutual=true)
            └─ More Matches (is_mutual=false)


┌─────────────────────────────────────────────────────────────┐
│                    REAL-TIME MESSAGE FLOW                   │
└─────────────────────────────────────────────────────────────┘

User A: Opens chat
       │
       ├─→ subscribeToMessages(matchId, callback)
       │        │
       │        └─→ Supabase creates WebSocket connection
       │             └─ Listens to: INSERT on messages table
       │                           WHERE match_id = matchId

User B: Opens same chat
       │
       └─→ subscribeToMessages(matchId, callback)
                │
                └─→ Separate WebSocket connection

User A: Sends message
       │
       ├─→ sendMessage(matchId, "Hello!")
       │        │
       │        └─→ INSERT INTO messages
       │             (match_id, sender_id, content)
       │
       └─→ Supabase Database
                │
                ├─→ Message saved
                │
                └─→ Realtime broadcasts INSERT event
                     │
                     ├─→ User A's subscription callback
                     │   └─ Refreshes message list
                     │
                     └─→ User B's subscription callback
                         └─ Message appears instantly! ⚡


┌─────────────────────────────────────────────────────────────┐
│                    BOOKING STATUS LIFECYCLE                 │
└─────────────────────────────────────────────────────────────┘

1. CREATION (Requester)
   │
   ├─ User clicks "Book" on match card
   ├─ Fills booking modal
   ├─ Clicks "Create Booking"
   │
   └─→ createBooking() ──→ INSERT with status='pending'

2. PENDING (Receiver sees)
   │
   ├─ Receiver views /bookings
   ├─ Sees booking with yellow "pending" badge
   ├─ Two options:
   │
   ├─→ Click "Accept"
   │   └─→ updateBookingStatus(id, 'accepted')
   │       └─ Status changes to 'accepted', green badge
   │
   └─→ Click "Decline"
       └─→ updateBookingStatus(id, 'declined')
           └─ Booking removed from upcoming list

3. ACCEPTED (Both users see)
   │
   ├─ Green badge: "accepted"
   ├─ Button: "Mark as Completed"
   │
   └─→ Either user clicks "Mark as Completed"
       └─→ updateBookingStatus(id, 'completed')
           └─ Moves to "Completed" section

4. COMPLETED
   │
   ├─ Appears in "Completed Bookings" section
   ├─ Grayed out
   └─ No actions available


┌─────────────────────────────────────────────────────────────┐
│                    SECURITY & ACCESS CONTROL                │
└─────────────────────────────────────────────────────────────┘

Row Level Security (RLS) Policies

profiles:
  ├─ SELECT: Everyone can view
  ├─ UPDATE: Users can only update their own
  └─ INSERT: Users can only insert their own

skills:
  ├─ SELECT: Everyone can view
  └─ INSERT: Authenticated users can create

user_skills:
  ├─ SELECT: Everyone can view (for matching)
  └─ ALL: Users manage only their own

matches:
  ├─ SELECT: Users can only view their matches
  │   └─ WHERE user_a_id = auth.uid() OR user_b_id = auth.uid()
  └─ INSERT: Authenticated users can create

messages:
  ├─ SELECT: Users can only view messages in their matches
  │   └─ WHERE match participants include auth.uid()
  └─ INSERT: Users can only send in their matches
      └─ WHERE sender_id = auth.uid() AND match exists

bookings:
  ├─ SELECT: Users can only view bookings they're part of
  │   └─ WHERE requester OR match participant
  ├─ INSERT: Users can create in their matches
  └─ UPDATE: Users can update bookings they're part of


┌─────────────────────────────────────────────────────────────┐
│                    KEY PERFORMANCE NOTES                    │
└─────────────────────────────────────────────────────────────┘

✅ Indexed Columns (for fast queries):
   ├─ user_skills: user_id, skill_id, type
   ├─ matches: user_a_id, user_b_id
   ├─ messages: match_id, created_at
   └─ bookings: match_id, scheduled_at

✅ Real-time Enabled:
   └─ messages table (instant chat)

✅ Efficient Matching:
   └─ PostgreSQL function with JOINs
   └─ Runs on database server (fast!)

✅ Caching:
   └─ Matches loaded once, refreshed on demand
   └─ Skills searched with debounce

---

**Built with ❤️ - Complete P2P Skill Exchange Platform**
