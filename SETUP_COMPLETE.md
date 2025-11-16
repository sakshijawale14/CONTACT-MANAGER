# Complete Setup Guide - Contact Manager with Backend

This guide covers the complete setup for both frontend and backend.

## Quick Start

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Mac/Linux
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables:**
```bash
# Copy example file
cp .env.example .env

# Edit .env and add:
# - Cloudinary credentials (get from cloudinary.com)
# - Database URL (use sqlite:///app.db for development)
# - Secret keys (generate random strings)
```

5. **Initialize database:**
```bash
python app.py --init-db
```

6. **Start backend server:**
```bash
python app.py
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to project root:**
```bash
cd ..
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create frontend .env file:**
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Start frontend:**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Cloudinary Setup (Required for Image Uploads)

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard
4. Copy your credentials:
   - Cloud Name
   - API Key
   - API Secret
5. Add them to `backend/.env`:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Database Options

### Option 1: SQLite (Development - Easiest)
No setup needed! Just use:
```
DATABASE_URL=sqlite:///app.db
```
The database file will be created automatically.

### Option 2: PostgreSQL (Production)
1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE contact_manager;
```
3. Update `.env`:
```
DATABASE_URL=postgresql://username:password@localhost:5432/contact_manager
```

## Features Implemented

✅ **User Authentication**
- Registration with email/password
- Login with JWT tokens
- Secure password hashing

✅ **Contact Management**
- Create, read, update, delete contacts
- Photo uploads via Cloudinary
- Grouping and favorites
- Search and sorting

✅ **Messaging System**
- Cross-account messaging (User A → User B)
- Real-time conversation view
- Timestamps with minute precision
- Unread message tracking
- Message history

✅ **Image Storage**
- Cloudinary integration
- Automatic image optimization
- Secure uploads

## API Structure

All API calls are made through `src/utils/api.js`:
- `authAPI` - Authentication
- `contactsAPI` - Contact management
- `messagesAPI` - Messaging
- `uploadAPI` - Image uploads
- `usersAPI` - User search

## Testing Cross-Account Messaging

1. Register User A: `userA@example.com`
2. Register User B: `userB@example.com`
3. Login as User A
4. Add User B as a contact (using their email)
5. Send a message to User B
6. Logout and login as User B
7. View the message from User A

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (need 3.8+)
- Verify all dependencies installed: `pip list`
- Check `.env` file exists and has correct values

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Check CORS settings in backend `.env`

### Images not uploading
- Verify Cloudinary credentials in backend `.env`
- Check Cloudinary account is active
- Verify file size is under 16MB

### Messages not appearing
- Ensure both users are registered
- Check recipient email matches exactly
- Verify JWT token is valid

## Production Deployment

### Backend
1. Use PostgreSQL database
2. Set strong secret keys
3. Use environment variables (don't commit `.env`)
4. Deploy with Gunicorn or similar WSGI server
5. Set up SSL/HTTPS

### Frontend
1. Build for production: `npm run build`
2. Serve with nginx or similar
3. Update `REACT_APP_API_URL` to production backend URL

## Support

For issues or questions:
1. Check the backend logs
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure database is initialized: `python app.py --init-db`


