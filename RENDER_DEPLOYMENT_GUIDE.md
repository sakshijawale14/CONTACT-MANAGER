# Render Deployment Guide

This guide will walk you through deploying both the backend and frontend of the Contact Manager application on Render.

## Prerequisites

1. A GitHub account
2. Your project pushed to a GitHub repository
3. A Render account (sign up at https://render.com)
4. (Optional) Cloudinary account for image uploads

## Step-by-Step Deployment Instructions

### Step 1: Push Your Code to GitHub

1. If you haven't already, initialize git and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### Step 2: Deploy Using Render Blueprint (Recommended)

The easiest way is to use the `render.yaml` file that's already configured:

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Sign in or create an account

2. **Create New Blueprint**
   - Click "New +" button
   - Select "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing this project
   - Render will automatically detect the `render.yaml` file

3. **Review Configuration**
   - Render will show you the services it will create:
     - `contact-manager-api` (Backend)
     - `contact-manager-frontend` (Frontend)
     - `contact-manager-db` (PostgreSQL Database)
   - Click "Apply" to create all services

4. **Set Environment Variables**
   After the services are created, you need to set the Cloudinary credentials (optional):
   - Go to the `contact-manager-api` service
   - Navigate to "Environment" tab
   - Add these environment variables:
     - `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
     - `CLOUDINARY_API_KEY` - Your Cloudinary API key
     - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
   - Click "Save Changes"

5. **Update URLs (After First Deploy)**
   Once your services are deployed, Render will assign URLs. You need to update:
   - Go to `contact-manager-api` → Environment tab
   - Update `ALLOW_ORIGINS` to match your frontend URL (e.g., `https://contact-manager-frontend.onrender.com`)
   - Go to `contact-manager-frontend` → Environment tab
   - Update `REACT_APP_API_URL` to match your backend URL (e.g., `https://contact-manager-api.onrender.com/api`)
   - Redeploy both services after updating

### Step 3: Manual Deployment (Alternative Method)

If you prefer to deploy services manually:

#### Deploy PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Name: `contact-manager-db`
3. Plan: Free
4. Click "Create Database"
5. Note the **Internal Database URL** and **External Database URL**

#### Deploy Backend Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `contact-manager-api`
   - **Environment**: `Python 3`
   - **Build Command**: `cd backend && pip install -r requirements.txt && python render_init_db.py`
   - **Start Command**: (Leave empty - will use Procfile)
   - **Plan**: Free

4. Add Environment Variables:
   - `DATABASE_URL` → Use the Internal Database URL from your PostgreSQL service
   - `SECRET_KEY` → Generate a random string (or use Render's "Generate" button)
   - `JWT_SECRET_KEY` → Generate a random string
   - `ALLOW_ORIGINS` → `https://contact-manager-frontend.onrender.com` (update after frontend is deployed)
   - `CLOUDINARY_CLOUD_NAME` → Your Cloudinary cloud name (optional)
   - `CLOUDINARY_API_KEY` → Your Cloudinary API key (optional)
   - `CLOUDINARY_API_SECRET` → Your Cloudinary API secret (optional)

5. Click "Create Web Service"

#### Deploy Frontend Service

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `contact-manager-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Plan**: Free

4. Add Environment Variable:
   - `REACT_APP_API_URL` → `https://contact-manager-api.onrender.com/api` (update with your actual backend URL)

5. Click "Create Static Site"

### Step 4: Initialize Database

The database should be initialized automatically during the build process. However, if you need to initialize it manually:

1. Go to your backend service
2. Open the "Shell" tab
3. Run:
   ```bash
   cd backend
   python render_init_db.py
   ```

### Step 5: Verify Deployment

1. **Check Backend Health**
   - Visit: `https://contact-manager-api.onrender.com/api/health`
   - Should return: `{"status": "ok", "time": "..."}`

2. **Check Frontend**
   - Visit: `https://contact-manager-frontend.onrender.com`
   - Should load the application

3. **Test Registration/Login**
   - Try creating a new account
   - Try logging in

## Important Notes

### Free Tier Limitations

- **Spinning Down**: Free tier services spin down after 15 minutes of inactivity. First request after spin-down may take 30-60 seconds.
- **Database**: Free PostgreSQL databases are deleted after 90 days of inactivity. Consider upgrading for production use.

### Environment Variables

After deployment, make sure to update:
- `ALLOW_ORIGINS` in backend with your actual frontend URL
- `REACT_APP_API_URL` in frontend with your actual backend URL

### CORS Configuration

The backend is configured to accept requests from the frontend URL. Make sure `ALLOW_ORIGINS` matches your frontend URL exactly (including `https://`).

### Database Connection

The `DATABASE_URL` is automatically set when using the Blueprint method. For manual deployment, use the **Internal Database URL** (not external) for better performance.

## Troubleshooting

### Backend Won't Start

1. Check the logs in Render dashboard
2. Verify all environment variables are set
3. Ensure `DATABASE_URL` is correct
4. Check that `gunicorn` is installed (should be in requirements.txt)

### Frontend Can't Connect to Backend

1. Verify `REACT_APP_API_URL` is set correctly in frontend environment variables
2. Check that the backend URL includes `/api` at the end
3. Verify CORS is configured correctly (`ALLOW_ORIGINS` in backend)

### Database Connection Errors

1. Ensure `DATABASE_URL` uses the Internal Database URL
2. Check that the database service is running
3. Verify the database was initialized (check logs)

### Build Failures

1. **Backend**: Check that all Python dependencies are in `requirements.txt`
2. **Frontend**: Ensure `package.json` has all dependencies
3. Check build logs for specific error messages

### Image Upload Not Working

1. Verify Cloudinary credentials are set in backend environment variables
2. Check that all three Cloudinary variables are set:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

## Updating Your Deployment

After making changes to your code:

1. Push changes to GitHub
2. Render will automatically detect changes and redeploy
3. Or manually trigger a redeploy from the Render dashboard

## Security Best Practices

1. **Never commit `.env` files** to GitHub
2. Use Render's environment variables for all secrets
3. Generate strong `SECRET_KEY` and `JWT_SECRET_KEY` values
4. Keep your Cloudinary API secret secure

## Support

If you encounter issues:
1. Check Render's service logs
2. Verify all environment variables are set correctly
3. Ensure your code is pushed to GitHub
4. Check Render's status page: https://status.render.com

---

**Your services will be available at:**
- Backend: `https://contact-manager-api.onrender.com`
- Frontend: `https://contact-manager-frontend.onrender.com`
- Database: Managed internally by Render

