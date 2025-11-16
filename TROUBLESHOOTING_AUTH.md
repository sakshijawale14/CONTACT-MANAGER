# Troubleshooting: Sign Up and Login Issues

## Quick Fix Checklist

### 1. **Is the Backend Running?** ⚠️ MOST COMMON ISSUE

The backend must be running for signup/login to work.

**Check:**
- Open: `http://localhost:5000/api/health` in your browser
- Should show: `{"status": "ok", "time": "..."}`
- If you see "This site can't be reached" → Backend is NOT running

**Start Backend:**
```bash
cd backend
# Activate virtual environment (if using one)
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Mac/Linux

# Run the backend
python app.py
```

**Look for:**
```
 * Running on http://0.0.0.0:5000
```

### 2. **Is the Database Initialized?**

**Check:**
- Look for `backend/instance/app.db` file
- If it doesn't exist, initialize it:

```bash
cd backend
python app.py --init-db
```

### 3. **Check Browser Console for Errors**

1. Open your app in browser
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Try to sign up/login
5. Look for error messages

**Common Errors:**
- `Cannot connect to server` → Backend not running
- `CORS error` → Backend CORS not configured
- `Network error` → Backend not accessible

### 4. **Check Network Tab**

1. Open DevTools (F12)
2. Go to **Network** tab
3. Try to sign up/login
4. Look for requests to `http://localhost:5000/api/auth/register` or `/api/auth/login`
5. Check the status:
   - **200/201** = Success ✅
   - **0** or **Failed** = Backend not running ❌
   - **401** = Wrong credentials
   - **409** = Email already exists

### 5. **Verify Backend Configuration**

**Check `backend/app.py` has CORS enabled:**
```python
CORS(app, resources={r"/*": {"origins": os.getenv("ALLOW_ORIGINS", "http://localhost:3000").split(",")}})
```

### 6. **Check Frontend API URL**

**In `src/utils/api.js`:**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"
```

This should point to your backend URL.

## Step-by-Step Debugging

### Step 1: Test Backend Directly

Open in browser:
- `http://localhost:5000/` → Should show API info
- `http://localhost:5000/api/health` → Should show `{"status": "ok"}`

If these don't work → **Backend is not running**

### Step 2: Test Frontend Connection

1. Start backend: `cd backend && python app.py`
2. Start frontend: `npm start`
3. Open browser: `http://localhost:3000`
4. Open DevTools (F12) → Network tab
5. Try to register
6. Check if request goes to `localhost:5000`

### Step 3: Check Error Messages

The improved error handling will now show:
- **"Cannot connect to server. Please make sure the backend is running on http://localhost:5000"** → Backend not running
- **"Incorrect email or password"** → Wrong credentials
- **"Email already registered"** → Account exists, try login instead

## Common Solutions

### Problem: "Cannot connect to server"
**Solution:** Start the backend server

### Problem: CORS Error
**Solution:** 
1. Check backend `.env` has: `ALLOW_ORIGINS=http://localhost:3000`
2. Restart backend

### Problem: Database Error
**Solution:**
```bash
cd backend
python app.py --init-db
```

### Problem: Port Already in Use
**Solution:**
- Change backend port in `.env`: `PORT=5001`
- Update frontend `.env`: `REACT_APP_API_URL=http://localhost:5001/api`

## Still Not Working?

1. **Check both terminals are running:**
   - Terminal 1: Backend (`python app.py`)
   - Terminal 2: Frontend (`npm start`)

2. **Verify ports:**
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

3. **Clear browser cache and localStorage:**
   - Open DevTools (F12)
   - Application tab → Local Storage → Clear
   - Refresh page

4. **Check firewall/antivirus:**
   - May be blocking localhost connections

## Need More Help?

Check the browser console (F12) for specific error messages and share them for further debugging.

