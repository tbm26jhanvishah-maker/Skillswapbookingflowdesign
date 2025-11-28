# SkillSwap Troubleshooting Guide 🔧

Common issues and their solutions for the SkillSwap platform.

---

## 🚨 Authentication Issues

### Error: "Not authenticated"

**Symptoms:**
- Can't access home page
- Redirects to login immediately
- Console shows "Not authenticated" error

**Solutions:**

1. **Check if you're logged in**
   ```javascript
   // Open browser console and run:
   const { data } = await supabase.auth.getSession();
   console.log(data);
   ```
   - If `data.session` is null, you need to log in again

2. **Verify Supabase credentials**
   - Check `.env` file exists
   - Verify URL format: `https://YOUR-PROJECT.supabase.co`
   - Verify anon key starts with `eyJ`
   - Restart dev server after changing `.env`

3. **Clear browser data**
   ```bash
   # Clear localStorage
   localStorage.clear();
   # Then reload page
   ```

4. **Check Supabase project status**
   - Go to Supabase dashboard
   - Check if project is active (not paused)

---

### Error: "Invalid login credentials"

**Symptoms:**
- Login fails with error message
- Correct email/password doesn't work

**Solutions:**

1. **Verify account exists**
   - Go to Supabase dashboard → Authentication → Users
   - Check if email is listed
   - Look for "Confirmed" status

2. **Check email confirmation**
   - By default, Supabase requires email confirmation
   - Check your email inbox for confirmation link
   - OR disable email confirmation in Supabase:
     - Dashboard → Authentication → Providers
     - Click on Email provider
     - Toggle off "Confirm email"

3. **Reset password**
   - Implement password reset flow
   - Or manually update in Supabase dashboard

---

### Error: "User already registered"

**Symptoms:**
- Signup fails with duplicate error
- Can't create new account

**Solutions:**

1. **Try logging in instead**
   - Account already exists, use login screen

2. **Use different email**
   - Check if you already signed up before

3. **Delete test user**
   - Go to Supabase dashboard → Authentication → Users
   - Find user and click "..." → Delete user

---

## 💾 Database Issues

### Error: "relation does not exist"

**Symptoms:**
- "relation 'profiles' does not exist"
- "relation 'skills' does not exist"
- App crashes on database query

**Solutions:**

1. **Run the database schema**
   ```sql
   -- Copy ENTIRE contents of DATABASE_SCHEMA.sql
   -- Paste into Supabase SQL Editor
   -- Click "Run"
   ```

2. **Verify tables exist**
   - Go to Supabase dashboard → Table Editor
   - Should see: profiles, skills, user_skills, matches, messages, bookings

3. **Check for SQL errors**
   - Look at SQL Editor output
   - Errors will show in red
   - Run failed statements individually

---

### Error: "Skills not appearing in search"

**Symptoms:**
- Search returns empty results
- Skills table seems empty

**Solutions:**

1. **Verify skills were seeded**
   ```sql
   -- Run in SQL Editor:
   SELECT COUNT(*) FROM skills;
   -- Should return 27
   ```

2. **Re-seed skills**
   ```sql
   -- Run the INSERT INTO skills section from DATABASE_SCHEMA.sql
   INSERT INTO skills (name, category) VALUES
     ('Python', 'Programming'),
     ('JavaScript', 'Programming'),
     -- ... (all 27 skills)
   ```

3. **Check search query length**
   - Search only triggers with 2+ characters
   - Type at least "Py" to search for Python

---

### Error: "No matches found"

**Symptoms:**
- "Find Matches" returns empty
- No matches appear after clicking button

**Solutions:**

1. **Create complementary users**
   ```
   User 1: Teaches Python, Wants to learn Excel
   User 2: Teaches Excel, Wants to learn Python
   ```

2. **Verify matching function exists**
   ```sql
   -- Run in SQL Editor:
   SELECT find_skill_matches('user-id-here');
   ```

3. **Check user has skills**
   ```sql
   SELECT * FROM user_skills WHERE user_id = 'your-user-id';
   ```

4. **Verify RPC function**
   - Ensure `find_skill_matches` function was created
   - Check Functions section in Supabase dashboard

---

## 💬 Real-time Chat Issues

### Error: "Messages not appearing instantly"

**Symptoms:**
- Need to refresh to see new messages
- Real-time not working
- Other user's messages don't show up

**Solutions:**

1. **Enable replication for messages table**
   - Dashboard → Database → Replication
   - Find `messages` table
   - Toggle ON (should be green)
   - Wait 1 minute for replication to activate

2. **Check subscription in console**
   ```javascript
   // Should see in browser console:
   "Realtime: Subscribed to channel messages:match-id"
   ```

3. **Verify realtime publication**
   ```sql
   -- Run in SQL Editor:
   ALTER PUBLICATION supabase_realtime ADD TABLE messages;
   ```

4. **Check WebSocket connection**
   - Open browser DevTools → Network
   - Filter by "WS" (WebSockets)
   - Should see active connection to Supabase

---

### Error: "Can't send messages"

**Symptoms:**
- Send button disabled
- Message doesn't save
- Error in console

**Solutions:**

1. **Check match participation**
   - You can only message in matches you're part of
   - Verify you're either user_a or user_b in the match

2. **Verify RLS policies**
   ```sql
   -- Run in SQL Editor to check policies:
   SELECT * FROM pg_policies WHERE tablename = 'messages';
   ```

3. **Check authentication**
   - Make sure you're logged in
   - Session token might have expired

---

## 📅 Booking Issues

### Error: "Failed to create booking"

**Symptoms:**
- Booking modal submit fails
- No booking appears in bookings page

**Solutions:**

1. **Check date/time values**
   - Date must be today or future
   - Time must be valid (HH:MM format)

2. **Verify match exists**
   ```sql
   SELECT * FROM matches WHERE id = 'match-id';
   ```

3. **Check RLS policies**
   - Can only create bookings in your matches
   - Verify you're part of the match

---

### Error: "Bookings not loading"

**Symptoms:**
- Bookings page stuck loading
- Empty state even with bookings

**Solutions:**

1. **Check bookings table**
   ```sql
   SELECT * FROM bookings WHERE requester_id = 'your-user-id';
   ```

2. **Verify foreign key relationships**
   - Bookings reference matches
   - Matches reference users
   - Check all IDs are valid

---

## 🔒 Row Level Security Errors

### Error: "new row violates row-level security policy"

**Symptoms:**
- Can't insert/update records
- RLS policy blocking action

**Solutions:**

1. **Verify you're authenticated**
   ```javascript
   const { data: { user } } = await supabase.auth.getUser();
   console.log(user); // Should not be null
   ```

2. **Check policy conditions**
   ```sql
   -- View policies for a table:
   SELECT * FROM pg_policies WHERE tablename = 'your_table_name';
   ```

3. **Ensure policies exist**
   - Re-run relevant sections from DATABASE_SCHEMA.sql
   - Look for CREATE POLICY statements

4. **Check user_id matches**
   - Your user_id must match the record's user_id
   - Check with:
   ```sql
   SELECT auth.uid(); -- Your current user ID
   ```

---

## 🌐 Network & Connection Issues

### Error: "Failed to fetch"

**Symptoms:**
- All API calls failing
- Can't connect to Supabase

**Solutions:**

1. **Check internet connection**
   - Verify you're online
   - Try accessing supabase.com

2. **Verify Supabase project is active**
   - Dashboard should load
   - Project not paused

3. **Check CORS settings**
   - Supabase automatically handles CORS
   - But verify your URL is correct

4. **Check firewall/VPN**
   - Some networks block WebSocket connections
   - Try disabling VPN temporarily

---

## 🎨 UI & Display Issues

### Issue: "Styles not loading correctly"

**Symptoms:**
- Broken layout
- Missing colors/spacing
- Plain HTML appearance

**Solutions:**

1. **Restart dev server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Clear Tailwind cache**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

3. **Check Tailwind config**
   - Ensure `tailwind.config.js` exists
   - Verify `@tailwind` directives in CSS

---

### Issue: "Images not loading"

**Symptoms:**
- Broken image icons
- Profile photos not showing

**Solutions:**

1. **Check photo_url validity**
   - Must be valid URL
   - Use Unsplash or direct URLs

2. **Use ImageWithFallback component**
   ```tsx
   <ImageWithFallback src={url} alt="Name" />
   ```

3. **Verify CORS for image URLs**
   - Some hosts block cross-origin images
   - Use Unsplash or public CDNs

---

## 🔧 Development Environment Issues

### Error: "Module not found"

**Symptoms:**
- Import errors in console
- Component not rendering

**Solutions:**

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Check import paths**
   ```tsx
   // Correct:
   import { Button } from './components/ui/button';
   
   // Wrong:
   import { Button } from 'components/ui/button'; // Missing ./
   ```

3. **Restart TypeScript server**
   - In VS Code: Cmd/Ctrl + Shift + P
   - Type "TypeScript: Restart TS Server"

---

### Error: "Vite environment variables not working"

**Symptoms:**
- `import.meta.env.VITE_SUPABASE_URL` is undefined
- Environment variables not loading

**Solutions:**

1. **Check .env file location**
   - Must be in project root
   - Same level as package.json

2. **Verify variable names**
   - Must start with `VITE_`
   - Example: `VITE_SUPABASE_URL` ✅
   - Example: `SUPABASE_URL` ❌

3. **Restart dev server**
   - Environment variables load at startup
   - Changes require restart

---

## 🔍 Debugging Tips

### Enable Verbose Logging

```typescript
// In supabaseClient.ts
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    debug: true // Logs auth events
  }
});
```

### Check Network Requests

1. Open DevTools → Network tab
2. Look for requests to `supabase.co`
3. Check status codes (200 = success)
4. Inspect request/response payloads

### Inspect Database Directly

```sql
-- Check user count
SELECT COUNT(*) FROM profiles;

-- Check my skills
SELECT s.name, us.type, us.level 
FROM user_skills us
JOIN skills s ON us.skill_id = s.id
WHERE us.user_id = 'your-user-id';

-- Check matches
SELECT * FROM matches 
WHERE user_a_id = 'your-id' OR user_b_id = 'your-id';

-- Check messages
SELECT * FROM messages WHERE match_id = 'match-id';
```

### Console Debugging

```javascript
// Check auth status
const { data: { session } } = await supabase.auth.getSession();
console.log('Logged in:', !!session);
console.log('User:', session?.user);

// Check API response
const { data, error } = await supabase.from('skills').select('*');
console.log('Skills:', data);
console.log('Error:', error);
```

---

## 📊 Performance Issues

### Issue: "App is slow"

**Solutions:**

1. **Check database indexes**
   - Indexes should exist from schema
   - Verify with:
   ```sql
   SELECT * FROM pg_indexes WHERE schemaname = 'public';
   ```

2. **Limit query results**
   ```typescript
   // Add .limit() to queries
   const { data } = await supabase
     .from('skills')
     .select('*')
     .limit(20); // Only return 20 results
   ```

3. **Use select() wisely**
   ```typescript
   // Bad: Returns everything
   .select('*')
   
   // Good: Only return what you need
   .select('id, name, category')
   ```

---

## 🆘 Still Stuck?

### Checklist Before Asking for Help

- [ ] Checked browser console for errors
- [ ] Verified Supabase credentials are correct
- [ ] Confirmed database schema was run completely
- [ ] Tested with a fresh incognito window
- [ ] Restarted dev server
- [ ] Checked Supabase dashboard for issues

### Gather This Information

1. **Error message** (exact text)
2. **Browser console logs** (screenshot)
3. **Network tab** (failed requests)
4. **Steps to reproduce** the issue
5. **Your setup**:
   - Node version: `node --version`
   - npm version: `npm --version`
   - Supabase project region
   - Browser & version

### Resources

- [Supabase Discord](https://discord.supabase.com)
- [Supabase Docs](https://supabase.com/docs)
- [React Router Docs](https://reactrouter.com)
- Browser DevTools documentation

---

## 🎓 Common Patterns & Best Practices

### Always Check Authentication

```typescript
const user = await getCurrentUser();
if (!user) {
  navigate('/login');
  return;
}
```

### Handle Errors Gracefully

```typescript
try {
  const data = await someApiCall();
  // Success
} catch (error: any) {
  console.error('Detailed error:', error);
  toast.error(error.message || 'Something went wrong');
}
```

### Use Loading States

```typescript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await someApiCall();
  } finally {
    setLoading(false); // Always reset loading
  }
};
```

### Validate User Input

```typescript
if (!email || !password) {
  toast.error('Please fill all fields');
  return;
}

if (password.length < 6) {
  toast.error('Password must be at least 6 characters');
  return;
}
```

---

**Happy debugging! 🐛 → 🎉**
