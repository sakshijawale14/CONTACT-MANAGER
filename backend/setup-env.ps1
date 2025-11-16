# PowerShell script to create .env file for Supabase
# Run this from the backend directory: .\setup-env.ps1

$envContent = @"
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
"@

$envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline

Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: Update the following in .env file:" -ForegroundColor Yellow
Write-Host "   - CLOUDINARY_CLOUD_NAME" -ForegroundColor Yellow
Write-Host "   - CLOUDINARY_API_KEY" -ForegroundColor Yellow
Write-Host "   - CLOUDINARY_API_SECRET" -ForegroundColor Yellow
Write-Host "   - SECRET_KEY" -ForegroundColor Yellow
Write-Host "   - JWT_SECRET_KEY" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env and add your Cloudinary credentials" -ForegroundColor Cyan
Write-Host "2. Run: python app.py --init-db" -ForegroundColor Cyan
Write-Host "3. Run: python app.py" -ForegroundColor Cyan

