# Backend-Frontend Connection Guide

This document explains how the backend (Flask) and frontend (React) are connected and communicate with each other.

## Architecture Overview

```
┌─────────────────┐         HTTP/REST API         ┌─────────────────┐
│                 │◄─────────────────────────────►│                 │
│   React App     │         JSON Data             │   Flask API     │
│  (Frontend)     │         JWT Tokens             │   (Backend)     │
│                 │                               │                 │
│  Port: 3000     │                               │  Port: 5000     │
└─────────────────┘                               └─────────────────┘
```

## Connection Flow

### 1. **API Base URL Configuration**

**Frontend** (`src/utils/api.js`):
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"
```

**Backend** (`backend/app.py`):
- Runs on `http://localhost:5000` by default
- All API routes are prefixed with `/api`

### 2. **Authentication Flow**

1. **User Registration/Login**:
   ```
   Frontend → POST /api/auth/register or /api/auth/login
   Backend → Returns { user, token }
   Frontend → Stores token in localStorage
   ```

2. **Authenticated Requests**:
   ```
   Frontend → Adds "Authorization: Bearer <token>" header
   Backend → Validates token using JWT
   Backend → Returns data or 401 if invalid
   ```

### 3. **Data Flow Example: Loading Contacts**

```
┌──────────────┐
│   Dashboard  │
└──────┬───────┘
       │
       │ 1. User logs in
       ▼
┌─────────────────┐
│  ContactContext │
└──────┬──────────┘
       │
       │ 2. Calls contactsAPI.getAll()
       ▼
┌──────────────┐
│  api.js      │
└──────┬───────┘
       │
       │ 3. Makes HTTP request
       │    GET http://localhost:5000/api/contacts
       │    Headers: { Authorization: "Bearer <token>" }
       ▼
┌──────────────┐
│  Flask App   │
└──────┬───────┘
       │
       │ 4. Validates JWT token
       │ 5. Queries database
       │ 6. Returns JSON response
       ▼
┌──────────────┐
│  Database    │
└──────────────┘
```

## Key Components

### Frontend API Layer (`src/utils/api.js`)

**Purpose**: Centralized API communication layer

**Functions**:
- `apiRequest()`: Makes HTTP requests with authentication
- `getToken()` / `setToken()`: Manages JWT tokens
- `authAPI`: Authentication endpoints
- `contactsAPI`: Contact management
- `messagesAPI`: Messaging functionality
- `uploadAPI`: Image uploads

**Example**:
```javascript
// Frontend makes request
const data = await contactsAPI.getAll()

// Internally calls:
fetch("http://localhost:5000/api/contacts", {
  headers: {
    "Authorization": "Bearer <token>",
    "Content-Type": "application/json"
  }
})
```

### Backend API Routes (`backend/app.py`)

**Structure**:
```python
@app.get("/api/contacts")
@jwt_required()  # Requires authentication
def list_contacts():
    current_user_id = int(get_jwt_identity())  # Get user from token
    # Query database
    contacts = Contact.query.filter_by(user_id=current_user_id).all()
    return jsonify({"contacts": [c.to_dict() for c in contacts]})
```

## Communication Protocol

### Request Format

**Frontend → Backend**:
```javascript
// Headers
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}

// Body (for POST/PUT)
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Response Format

**Backend → Frontend**:
```json
{
  "contacts": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

**Error Response**:
```json
{
  "message": "Error description"
}
```

## CORS Configuration

**Backend** (`backend/app.py`):
```python
CORS(app, resources={r"/*": {
    "origins": ["http://localhost:3000"]
}}, supports_credentials=True)
```

This allows the React app (running on port 3000) to make requests to the Flask API (port 5000).

## Environment Variables

### Frontend (`.env` in project root)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
```
DATABASE_URL=sqlite:///app.db
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
ALLOW_ORIGINS=http://localhost:3000
```

## Data Storage

### Backend Database
- **SQLite** (development): `backend/app.db`
- **PostgreSQL** (production): Configured via `DATABASE_URL`
- Stores: Users, Contacts, Messages

### Frontend Storage
- **localStorage**: JWT tokens only
- **No data caching**: All data fetched from backend

## Real-time Updates

Currently, the app uses **polling**:
- Frontend refreshes data after mutations (create, update, delete)
- Messages refresh when conversation is opened
- Unread count refreshes every 30 seconds

## Security

1. **JWT Tokens**: Stored in localStorage, sent with every request
2. **Password Hashing**: bcrypt on backend
3. **CORS**: Restricted to frontend origin
4. **Input Validation**: Both frontend and backend

## Testing the Connection

1. **Start Backend**:
   ```bash
   cd backend
   python app.py
   ```
   Should see: "Running on http://0.0.0.0:5000"

2. **Start Frontend**:
   ```bash
   npm start
   ```
   Should open: http://localhost:3000

3. **Test Connection**:
   - Open browser DevTools → Network tab
   - Register/Login
   - See API calls to `http://localhost:5000/api/*`
   - Check responses in Network tab

## Troubleshooting

### Connection Issues

**Problem**: "Network Error" or CORS errors
**Solution**: 
- Check backend is running on port 5000
- Verify `ALLOW_ORIGINS` includes frontend URL
- Check browser console for errors

**Problem**: 401 Unauthorized
**Solution**:
- Token expired or invalid
- User needs to login again
- Check token in localStorage

**Problem**: 404 Not Found
**Solution**:
- Check API endpoint URL
- Verify backend route exists
- Check API_BASE_URL in frontend

### Data Not Syncing

**Problem**: Changes not appearing
**Solution**:
- Frontend calls `refreshContacts()` after mutations
- Check Network tab for API responses
- Verify database is being updated

## Summary

- **Frontend** (React) makes HTTP requests to **Backend** (Flask)
- **JWT tokens** authenticate requests
- **JSON** format for all data exchange
- **CORS** allows cross-origin requests
- **Database** stores all persistent data
- **localStorage** only stores authentication token

The connection is **stateless** - each request is independent and includes authentication.

