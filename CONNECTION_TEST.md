# Testing Frontend-Backend Connection

## Quick Connection Test

### Step 1: Start Backend
```bash
cd backend
python app.py
```

**Expected Output:**
```
 * Running on http://0.0.0.0:5000
```

### Step 2: Start Frontend
```bash
# In project root
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view contact in the browser.
  Local:            http://localhost:3000
```

### Step 3: Test Connection

1. **Open Browser DevTools** (F12)
2. **Go to Network Tab**
3. **Try to Register/Login**
4. **Check Network Requests**

You should see requests to:
- `http://localhost:5000/api/auth/register` or
- `http://localhost:5000/api/auth/login`

## Verification Checklist

✅ **Backend Running**
- Check: `http://localhost:5000/api/health`
- Should return: `{"status": "ok", "time": "..."}`

✅ **Frontend Running**
- Check: `http://localhost:3000`
- Should show the landing page

✅ **API Connection**
- Open browser console (F12)
- Try to register/login
- Check for errors in console
- Check Network tab for API calls

## Common Issues

### Issue: "Network Error" or "Failed to fetch"
**Solution:**
- Make sure backend is running on port 5000
- Check `REACT_APP_API_URL` in `.env` file
- Verify no firewall blocking localhost:5000

### Issue: "CORS Error"
**Solution:**
- Check backend `.env` has: `ALLOW_ORIGINS=http://localhost:3000`
- Restart backend after changing `.env`

### Issue: "401 Unauthorized"
**Solution:**
- This is normal for protected routes
- Make sure you're logged in first
- Check token in localStorage: `localStorage.getItem("contactManager_token")`

## Current Configuration

**Frontend API URL:** `http://localhost:5000/api` (from `.env` or default)
**Backend URL:** `http://localhost:5000`
**Frontend URL:** `http://localhost:3000`

## Testing API Directly

You can test the backend API directly using:

**Browser:**
```
http://localhost:5000/
http://localhost:5000/api/health
```

**curl (Command Line):**
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{"status": "ok", "time": "2024-..."}
```

## Connection Status

The connection is **AUTOMATIC** - no manual configuration needed if:
- Backend runs on `localhost:5000`
- Frontend runs on `localhost:3000`
- `.env` file exists with `REACT_APP_API_URL=http://localhost:5000/api`

If you need to change the backend URL, just update the `.env` file and restart the frontend.

