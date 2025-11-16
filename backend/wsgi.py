"""
WSGI entry point for production deployment
"""
from app import create_app, init_db

app = create_app()

# Initialize database on startup
try:
    init_db(app)
except Exception as e:
    print(f"Note: Database initialization: {e}")
    print("Database will be initialized on first request if needed.")

if __name__ == "__main__":
    app.run()

