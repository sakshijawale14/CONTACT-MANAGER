# Backend Setup Guide

This guide will help you set up the Flask backend with database and Cloudinary integration.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- PostgreSQL (for production) or SQLite (for development)
- Cloudinary account (for image storage)

## Step 1: Install Dependencies

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install required packages:
```bash
pip install -r requirements.txt
```

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and fill in your configuration:

### Required Configuration:

**Cloudinary Setup:**
1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free account
2. Go to your Dashboard
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret
4. Add them to your `.env` file:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Database Setup:**

For **Development** (SQLite - no setup needed):
```
DATABASE_URL=sqlite:///app.db
```

For **Production** (PostgreSQL):
1. Install PostgreSQL
2. Create a database:
```sql
CREATE DATABASE contact_manager;
```
3. Update `.env`:
```
DATABASE_URL=postgresql://username:password@localhost:5432/contact_manager
```

**Security Keys:**
Generate strong random strings for:
- `SECRET_KEY` - Used for Flask sessions
- `JWT_SECRET_KEY` - Used for JWT token signing

You can generate them using:
```python
import secrets
print(secrets.token_hex(32))
```

## Step 3: Initialize Database

Run the following command to create the database tables:
```bash
python app.py --init-db
```

This will create all necessary tables:
- `user` - User accounts
- `contact` - Contact information
- `message` - Messages between users

## Step 4: Start the Server

```bash
python app.py
```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Contacts
- `GET /api/contacts` - Get all contacts (requires auth)
- `POST /api/contacts` - Create a contact (requires auth)
- `PUT /api/contacts/<id>` - Update a contact (requires auth)
- `DELETE /api/contacts/<id>` - Delete a contact (requires auth)
- `POST /api/contacts/<id>/toggle-favorite` - Toggle favorite (requires auth)
- `POST /api/contacts/<id>/increment-access` - Increment access count (requires auth)

### Messages
- `POST /api/messages` - Send a message (requires auth)
- `GET /api/messages/conversation?recipientEmail=<email>` - Get conversation (requires auth)
- `GET /api/messages/conversations` - Get all conversations (requires auth)
- `GET /api/messages/unread-count` - Get unread count (requires auth)
- `POST /api/messages/<id>/read` - Mark message as read (requires auth)

### Upload
- `POST /api/upload` - Upload image to Cloudinary (requires auth)

### Users
- `GET /api/users/search?email=<email>` - Search users by email (requires auth)

## Frontend Configuration

Make sure your frontend `.env` file includes:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Database Issues
- Make sure PostgreSQL is running (if using PostgreSQL)
- Check database credentials in `.env`
- Try running `--init-db` again

### Cloudinary Issues
- Verify your Cloudinary credentials in `.env`
- Check that your Cloudinary account is active
- Ensure images are under 16MB

### CORS Issues
- Make sure `ALLOW_ORIGINS` in `.env` includes your frontend URL
- Default is `http://localhost:3000`

### Port Already in Use
- Change `PORT` in `.env` to a different port
- Or kill the process using port 5000

## Production Deployment

1. Use PostgreSQL instead of SQLite
2. Set strong `SECRET_KEY` and `JWT_SECRET_KEY`
3. Use environment variables (don't commit `.env`)
4. Set up proper CORS origins
5. Use a production WSGI server (e.g., Gunicorn)
6. Set up SSL/HTTPS

## Testing

Test the API using:
```bash
curl http://localhost:5000/api/health
```

You should get:
```json
{"status": "ok", "time": "2024-..."}
```


