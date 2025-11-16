#!/usr/bin/env python3
"""
Generate secure random keys for SECRET_KEY and JWT_SECRET_KEY
Run this script to generate new keys for your .env file
"""

import secrets

print("=" * 60)
print("Generating Secure Keys for .env file")
print("=" * 60)
print()
print("SECRET_KEY=" + secrets.token_hex(32))
print("JWT_SECRET_KEY=" + secrets.token_hex(32))
print()
print("=" * 60)
print("Copy these keys to your .env file")
print("=" * 60)

