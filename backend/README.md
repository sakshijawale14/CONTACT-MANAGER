# Backend (Flask) for Contact Manager

## Setup

1. Create and activate a virtual environment:
   - Windows PowerShell:
     ```powershell
     cd C:\Users\HP\DEEE\contact\backend
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Create an `.env` file:
   ```
   FLASK_ENV=development
   SECRET_KEY=change-this-secret
   JWT_SECRET_KEY=change-this-jwt-secret
   DATABASE_URL=sqlite:///app.db
   PORT=5000
   ALLOW_ORIGINS=http://localhost:3000
   ```
4. Initialize the database and run:
   ```powershell
   python app.py --init-db
   python app.py
   ```

The API will run on `http://localhost:5000` by default.

## Endpoints

- Auth
  - POST `/api/auth/register` { name, email, password }
  - POST `/api/auth/login` { email, password }

- Contacts (JWT required via `Authorization: Bearer <token>`) 
  - GET `/api/contacts?search=&sort=name|favorites`
  - POST `/api/contacts` { name, email, phone?, company?, notes? }
  - PUT `/api/contacts/<id>`
  - DELETE `/api/contacts/<id>`
  - POST `/api/contacts/<id>/toggle-favorite`


