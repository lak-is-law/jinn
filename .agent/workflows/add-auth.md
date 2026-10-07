# /add-auth
Replace the local profile login in `src/app.js` (`PR`, `loginView`, `setProf`) with Supabase Auth (Google + Apple).
1. Add the supabase-js CDN script and read URL/anon key from `window.JINN_CONFIG`.
2. Table `stats(user_id uuid primary key, g int, w int, s int, h jsonb)` with RLS: users read/write own row.
3. Sync `ST` on login and after each game. Keep guest mode working offline.
