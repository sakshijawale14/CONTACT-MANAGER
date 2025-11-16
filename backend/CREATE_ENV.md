# Create .env File for Supabase

## Quick Method (PowerShell)

Run this command in the `backend` folder:

```powershell
.\setup-env.ps1
```

## Manual Method

1. Open a text editor (Notepad, VS Code, etc.)

2. Create a new file named `.env` in the `backend` folder

3. Copy and paste this content:

```env
# Supabase Database Connection
DATABASE_URL=postgresql://postgres:qualityassuranc@db.blrjipxvhklwllssbgxz.supabase.co:5432/postgres

# Cloudinary Configuration (add your existing values)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Security Keys (generate new ones or use existing)
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# Server Configuration
PORT=5000
ALLOW_ORIGINS=http://localhost:3000
```

4. **IMPORTANT:** Replace these values with your actual credentials:
   - `your-cloud-name` → Your Cloudinary cloud name
   - `your-api-key` → Your Cloudinary API key
   - `your-api-secret` → Your Cloudinary API secret
   - `your-secret-key-here` → Generate with: `python -c "import secrets; print(secrets.token_hex(32))"`
   - `your-jwt-secret-key-here` → Generate with: `python -c "import secrets; print(secrets.token_hex(32))"`

5. Save the file as `.env` (no extension)

## After Creating .env

1. **Initialize database:**
   ```bash
   python app.py --init-db
   ```

2. **Start backend:**
   ```bash
   python app.py
   ```

3. **Test:** Create a contact and check Supabase dashboard!

