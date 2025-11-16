# Quick Start - Verify Connection

## ✅ Good News!

Your frontend and backend **ARE CONNECTED** by default! Here's why:

### Default Configuration

In `src/utils/api.js`, the API URL is set with a **fallback**:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"
```

This means:
- ✅ If `.env` file exists → Uses `REACT_APP_API_URL` from it
- ✅ If `.env` file doesn't exist → Uses default `http://localhost:5000/api`

**So you don't need to configure anything if:**
- Backend runs on `localhost:5000`
- Frontend runs on `localhost:3000`

## How to Verify Connection

### Step 1: Start Backend
```bash
cd backend
python app.py
```

**Look for:**
```
 * Running on http://0.0.0.0:5000
```

### Step 2: Start Frontend (in new terminal)
```bash
npm start
```

**Look for:**
```
Compiled successfully!
Local: http://localhost:3000
```

### Step 3: Test in Browser

1. Open `http://localhost:3000`
2. Open **Browser DevTools** (Press F12)
3. Go to **Network** tab
4. Try to **Register** a new account
5. **Check Network tab** - you should see:
   - Request to: `http://localhost:5000/api/auth/register`
   - Status: `200` or `201` (success)

## Quick Connection Test

### Test 1: Backend Health Check
Open in browser: `http://localhost:5000/api/health`

**Expected:** `{"status": "ok", "time": "..."}`

### Test 2: Backend Root
Open in browser: `http://localhost:5000/`

**Expected:** API information JSON

### Test 3: Frontend API Call
1. Open browser console (F12)
2. Go to Network tab
3. Register/Login
4. Check if requests go to `localhost:5000`

## Troubleshooting

### ❌ "Network Error" or "Failed to fetch"

**Problem:** Backend not running or wrong port

**Solution:**
1. Check backend is running: `http://localhost:5000/api/health`
2. Verify backend port is 5000
3. Check firewall isn't blocking localhost

### ❌ "CORS Error"

**Problem:** Backend CORS not configured

**Solution:**
1. Check `backend/.env` has: `ALLOW_ORIGINS=http://localhost:3000`
2. Restart backend

### ❌ "401 Unauthorized"

**Problem:** Not logged in (this is normal for protected routes)

**Solution:**
1. Register/Login first
2. Check token in localStorage

## Current Setup

**Frontend API URL:** `http://localhost:5000/api` (default)
**Backend URL:** `http://localhost:5000`
**Connection:** ✅ **AUTOMATIC** (no configuration needed)

## Optional: Create .env File

If you want to explicitly set the URL, create `.env` in project root:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Then restart frontend: `npm start`

## Summary

✅ **Connection is AUTOMATIC**
✅ **No URL configuration needed** (uses default)
✅ **Works out of the box** if both servers run on default ports

Just make sure:
1. Backend runs on port 5000
2. Frontend runs on port 3000
3. Both are running at the same time

That's it! 🎉

