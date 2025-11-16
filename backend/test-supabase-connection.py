#!/usr/bin/env python3
"""
Test Supabase database connection
Run this to verify your connection string is correct
"""

import os
from dotenv import load_dotenv
import psycopg2
from psycopg2 import sql

load_dotenv()

database_url = os.getenv("DATABASE_URL")

if not database_url:
    print("❌ ERROR: DATABASE_URL not found in .env file")
    print("Make sure you have created backend/.env file with DATABASE_URL")
    exit(1)

print("=" * 60)
print("Testing Supabase Connection")
print("=" * 60)
print(f"Connection string: {database_url.split('@')[0]}@[HIDDEN]")
print()

try:
    # Parse connection string
    # Format: postgresql://postgres:password@host:port/database
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    # Test query
    cursor.execute("SELECT version();")
    version = cursor.fetchone()
    
    print("✅ Connection successful!")
    print(f"PostgreSQL version: {version[0]}")
    print()
    
    # List existing tables
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    tables = cursor.fetchall()
    
    if tables:
        print("Existing tables:")
        for table in tables:
            print(f"  - {table[0]}")
    else:
        print("No tables found (database is empty)")
    
    cursor.close()
    conn.close()
    
    print()
    print("=" * 60)
    print("✅ Connection test passed!")
    print("You can now run: python app.py --init-db")
    print("=" * 60)
    
except psycopg2.OperationalError as e:
    print("❌ Connection failed!")
    print(f"Error: {e}")
    print()
    print("Troubleshooting:")
    print("1. Check your .env file has the correct DATABASE_URL")
    print("2. Verify your Supabase project is active")
    print("3. Check your internet connection")
    print("4. Try using the 'Connection pooling' URL from Supabase (port 6543)")
    print("5. Make sure the password in connection string is correct")
    exit(1)
except Exception as e:
    print(f"❌ Unexpected error: {e}")
    exit(1)

