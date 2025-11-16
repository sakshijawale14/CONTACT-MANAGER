# Troubleshooting Supabase Connection

## Error: "could not translate host name"

This means your computer can't find the Supabase database server. Here's how to fix it:

## Solution 1: Verify Connection String in Supabase

1. Go to your Supabase dashboard
2. Click **Settings** → **Database**
3. Scroll to **Connection string**
4. Make sure you're using the **URI** tab (not Session mode)
5. Copy the connection string again
6. Make sure it looks like:
   ```
   postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

## Solution 2: Try Connection Pooling URL

Supabase provides two connection strings:

1. **Direct connection** (port 5432) - What you're using
2. **Connection pooling** (port 6543) - More reliable

Try the **Connection pooling** URL instead:

1. In Supabase dashboard → Settings → Database
2. Look for **Connection pooling** section
3. Copy the **URI** connection string (port 6543)
4. Update your `.env` file with this URL

## Solution 3: Check Project Status

1. Go to Supabase dashboard
2. Make sure your project shows **"Active"** status
3. If it says "Paused" or "Inactive", activate it

## Solution 4: Verify Password

1. Make sure the password in your connection string matches your Supabase database password
2. Check for special characters that might need URL encoding
3. If password has special characters, you might need to URL-encode them

## Solution 5: Test Connection

Run the test script:

```bash
cd backend
python test-supabase-connection.py
```

This will tell you exactly what's wrong.

## Solution 6: Check Network/Firewall

- Make sure you have internet connection
- Check if firewall is blocking the connection
- Try from a different network

## Common Connection String Formats

**Direct (port 5432):**
```
postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

**Connection Pooling (port 6543):**
```
postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Try the connection pooling URL - it's often more reliable!

## Quick Fix

1. Go to Supabase → Settings → Database
2. Copy the **Connection pooling** URI (port 6543)
3. Update `backend/.env` with that URL
4. Run: `python app.py --init-db`

