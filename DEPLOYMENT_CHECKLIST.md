# Quick Deployment Checklist

## Before Deploying

- [ ] Code is pushed to GitHub repository
- [ ] All local changes are committed
- [ ] You have a Render account (sign up at https://render.com)
- [ ] (Optional) You have Cloudinary credentials for image uploads

## Deployment Steps

### Option 1: Using Blueprint (Easiest)

1. [ ] Go to https://dashboard.render.com
2. [ ] Click "New +" → "Blueprint"
3. [ ] Connect your GitHub repository
4. [ ] Review the services (backend, frontend, database)
5. [ ] Click "Apply" to deploy
6. [ ] Wait for all services to deploy (5-10 minutes)
7. [ ] Note the URLs assigned to each service

### Option 2: Manual Deployment

1. [ ] Deploy PostgreSQL database first
2. [ ] Deploy backend service
3. [ ] Deploy frontend service
4. [ ] Set all environment variables

## After Deployment

### Required Updates

1. [ ] **Backend Environment Variables:**
   - [ ] Update `ALLOW_ORIGINS` with your frontend URL
   - [ ] (Optional) Add Cloudinary credentials

2. [ ] **Frontend Environment Variables:**
   - [ ] Update `REACT_APP_API_URL` with your backend URL + `/api`

3. [ ] **Redeploy Services:**
   - [ ] Redeploy backend after updating `ALLOW_ORIGINS`
   - [ ] Redeploy frontend after updating `REACT_APP_API_URL`

### Verification

- [ ] Backend health check: `https://your-backend-url.onrender.com/api/health`
- [ ] Frontend loads: `https://your-frontend-url.onrender.com`
- [ ] Can register a new account
- [ ] Can login with registered account
- [ ] Can create contacts
- [ ] (Optional) Image upload works (if Cloudinary is configured)

## Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| Backend won't start | Check logs, verify DATABASE_URL is set |
| Frontend can't connect | Verify REACT_APP_API_URL includes `/api` |
| CORS errors | Update ALLOW_ORIGINS in backend with exact frontend URL |
| Database errors | Ensure database is running and DATABASE_URL is correct |
| Build fails | Check build logs for missing dependencies |

## Your Service URLs

After deployment, your services will be at:
- **Backend**: `https://contact-manager-api.onrender.com`
- **Frontend**: `https://contact-manager-frontend.onrender.com`

**Note**: Update the URLs in this checklist with your actual Render-assigned URLs.

---

For detailed instructions, see [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)

