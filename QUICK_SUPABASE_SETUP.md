# ⚡ Quick Supabase Setup (5 Minutes)

## Step 1: Create Supabase Project (2 min)

1. Go to [supabase.com](https://supabase.com) → Sign up
2. Click **"New Project"**
3. Enter project name: `Contact Manager`
4. Set a **database password** (save it!)
5. Choose region
6. Click **"Create new project"**
7. Wait 1-2 minutes

## Step 2: Get Connection String (1 min)

1. In Supabase dashboard → **Settings** → **Database**
2. Scroll to **Connection string**
3. Click **URI** tab
4. Copy the connection string

It looks like:
```
postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## Step 3: Update .env File (1 min)

1. Go to `backend` folder
2. Create/edit `.env` file:
   ```env
   DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   
   CLOUDINARY_CLOUD_NAME=your-existing-cloud-name
   CLOUDINARY_API_KEY=your-existing-api-key
   CLOUDINARY_API_SECRET=your-existing-api-secret
   
   SECRET_KEY=your-secret-key
   JWT_SECRET_KEY=your-jwt-secret-key
   PORT=5000
   ALLOW_ORIGINS=http://localhost:3000
   ```

**Replace:**
- `[YOUR-PASSWORD]` with your Supabase database password
- `xxxxx` with your project ID from Supabase

## Step 4: Initialize Database (1 min)

```bash
cd backend
python app.py --init-db
```

You should see: `Database initialized successfully!`

## Step 5: Test It! (1 min)

```bash
python app.py
```

Then:
1. Register a new user in your app
2. Create a contact
3. Go to Supabase dashboard → **Table Editor**
4. See your data! 🎉

## Done! ✅

Your data is now stored in Supabase cloud database!

**Current Setup:**
- ✅ Images → Cloudinary
- ✅ Data → Supabase

See `backend/SUPABASE_SETUP.md` for detailed guide.

