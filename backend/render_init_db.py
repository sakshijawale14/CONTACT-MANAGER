#!/usr/bin/env python3
"""
Render database initialization script
"""
import os
import sys
from app import create_app, init_db

def main():
    app = create_app()
    with app.app_context():
        try:
            init_db(app)
            print("✅ Database initialized successfully!")
        except Exception as e:
            print(f"❌ Database initialization failed: {e}")
            sys.exit(1)

if __name__ == "__main__":
    main()
