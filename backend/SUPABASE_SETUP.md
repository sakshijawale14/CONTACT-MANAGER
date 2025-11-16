# 🚀 Supabase Database Setup Guide

Migrate your Contact Manager from SQLite to Supabase (PostgreSQL) for cloud-hosted data storage.

## Current Setup
- ✅ **Images:** Stored in Cloudinary
- ⚠️ **Data:** Currently in SQLite (local file)
- 🎯 **Goal:** Move data to Supabase (cloud PostgreSQL)

## Step 1: Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub, Google, or email
4. Click **"New Project"**
5. Fill in:
   - **Name:** Contact Manager (or any name)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free (perfect for development)
6. Click **"Create new project"**
7. Wait 1-2 minutes for setup

## Step 2: Get Your Database Connection String

1. In your Supabase project dashboard, click **Settings** (gear icon)
2. Click **Database** in the left sidebar
3. Scroll down to **Connection string** section
4. Select the **URI** tab
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
   OR
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

**Important:** Replace `[YOUR-PASSWORD]` with the database password you created in Step 1.

## Step 3: Update Backend .env File

1. Navigate to your backend folder:
   ```bash
   cd backend
   ```

2. Create or edit `.env` file:
   ```bash
   # Windows
   notepad .env
   
   # Or use any text editor
   ```

3. Add your Supabase connection string:
   ```env
   # Supabase Database Connection
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   
   # Cloudinary (keep your existing values)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Security Keys (generate new ones or keep existing)
   SECRET_KEY=your-secret-key-here
   JWT_SECRET_KEY=your-jwt-secret-key-here
   
   # Server Settings
   PORT=5000
   ALLOW_ORIGINS=http://localhost:3000
   ```

**Replace:**
- `[YOUR-PASSWORD]` with your actual Supabase database password
- `xxxxx` with your actual project reference ID
- Keep your existing Cloudinary credentials

## Step 4: Verify PostgreSQL Driver

You already have `psycopg[binary]` in `requirements.txt`, so you're good! But if needed:

```bash
pip install psycopg2-binary
```

## Step 5: Initialize Database in Supabase

1. Make sure your `.env` file is updated with Supabase connection string
2. Run the initialization command:
   ```bash
   python app.py --init-db
   ```

You should see:
```
Database initialized successfully!
```

## Step 6: Test the Connection

1. Start your backend:
   ```bash
   python app.py
   ```

2. You should see no database errors
3. Try registering a new user or creating a contact
4. Check Supabase dashboard → **Table Editor** to see your data!

## Step 7: View Your Data in Supabase

1. Go to your Supabase project dashboard
2. Click **Table Editor** in the left sidebar
3. You'll see your tables:
   - `user` - All user accounts
   - `contact` - All contacts
   - `message` - All messages

You can view, edit, and manage data directly in Supabase!

## Migration from SQLite (Optional)

If you have existing data in SQLite and want to migrate:

1. **Export data from SQLite** (if needed):
   - Your SQLite database is at: `backend/instance/app.db`
   - You can use SQLite browser tools to export

2. **Import to Supabase**:
   - Use Supabase dashboard → SQL Editor
   - Or use pgAdmin/psql to import

3. **Or start fresh:**
   - Just use the new Supabase database
   - Users can register again

## Troubleshooting

### ❌ "Connection refused" or "Could not connect"
- **Check password:** Make sure you replaced `[YOUR-PASSWORD]` correctly
- **Check connection string:** Verify format matches Supabase dashboard
- **Check network:** Ensure you can access Supabase (no firewall blocking)

### ❌ "psycopg2 not found"
```bash
pip install psycopg2-binary
```

### ❌ "Tables already exist"
- This is fine! Supabase might have created some default tables
- Your tables will be created alongside them

### ❌ "Invalid connection string"
- Make sure the connection string starts with `postgresql://`
- Check for special characters in password (might need URL encoding)
- Try the **Connection pooling** string from Supabase (port 6543) instead

## Supabase Free Tier Limits

- ✅ **500MB** database storage
- ✅ **2GB** bandwidth per month
- ✅ **50,000** monthly active users
- ✅ **500MB** file storage

Perfect for development and small projects!

## Benefits

✅ **Cloud-hosted** - Access from anywhere  
✅ **Automatic backups** - Your data is safe  
✅ **Web dashboard** - Manage data visually  
✅ **Scalable** - Easy to upgrade later  
✅ **Free tier** - Great for development  
✅ **Real-time** - Can enable real-time features  

## Current Architecture

```
┌─────────────┐
│   React     │  Frontend (localhost:3000)
│   Frontend   │
└──────┬──────┘
       │
       │ HTTP/REST API
       │
┌──────▼──────┐
│   Flask     │  Backend (localhost:5000)
│   Backend   │
└──┬──────┬───┘
   │      │
   │      │
   ▼      ▼
┌─────┐ ┌──────────┐
│Cloud│ │ Supabase │
│inary│ │(Postgres)│
│     │ │          │
│Images│ │  Data   │
└─────┘ └──────────┘
```

## Next Steps

1. ✅ Set up Supabase account
2. ✅ Get connection string
3. ✅ Update `.env` file
4. ✅ Run `python app.py --init-db`
5. ✅ Test by creating a contact
6. ✅ Check Supabase dashboard to see your data!

Your app will now store:
- **Images** → Cloudinary ✅
- **All other data** → Supabase ✅

🎉 **You're all set!**
