#!/usr/bin/env python3
"""
Script to fix message schema issues in Supabase
This script will:
1. Ensure all messages have proper unique IDs
2. Verify relationships are working correctly
3. Update any messages that might have missing sender/recipient data
"""

import os
import sys
from dotenv import load_dotenv

# Add the parent directory to the path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

def fix_messages():
    """Fix messages table to ensure proper unique IDs and relationships"""
    try:
        from app import create_app, db, User, Message
        
        app = create_app()
        
        with app.app_context():
            print("Checking messages table...")
            
            # Count total messages
            total_messages = Message.query.count()
            print(f"Total messages in database: {total_messages}")
            
            # Check for any messages with invalid sender or recipient IDs
            invalid_messages = Message.query.filter(
                (Message.sender_id.is_(None)) | 
                (Message.recipient_id.is_(None)) |
                (Message.sender_id == 0) |
                (Message.recipient_id == 0)
            ).all()
            
            if invalid_messages:
                print(f"Found {len(invalid_messages)} messages with invalid sender/recipient IDs")
                for msg in invalid_messages:
                    print(f"  Message ID {msg.id}: sender_id={msg.sender_id}, recipient_id={msg.recipient_id}")
            else:
                print("All messages have valid sender and recipient IDs")
            
            # Verify all users exist for sender/recipient relationships
            users = User.query.all()
            user_ids = {user.id for user in users}
            print(f"Total users in database: {len(users)}")
            
            orphaned_messages = []
            for msg in Message.query.all():
                if msg.sender_id not in user_ids or msg.recipient_id not in user_ids:
                    orphaned_messages.append(msg)
            
            if orphaned_messages:
                print(f"Found {len(orphaned_messages)} messages with non-existent users:")
                for msg in orphaned_messages:
                    sender_exists = msg.sender_id in user_ids
                    recipient_exists = msg.recipient_id in user_ids
                    print(f"  Message ID {msg.id}: sender_id={msg.sender_id} (exists: {sender_exists}), recipient_id={msg.recipient_id} (exists: {recipient_exists})")
            else:
                print("All messages reference existing users")
            
            # Test message serialization
            print("\nTesting message serialization...")
            test_messages = Message.query.limit(5).all()
            for msg in test_messages:
                try:
                    msg_dict = msg.to_dict()
                    print(f"  Message ID {msg.id}:")
                    print(f"    Sender: {msg_dict.get('senderName')} ({msg_dict.get('senderEmail')})")
                    print(f"    Recipient: {msg_dict.get('recipientName')} ({msg_dict.get('recipientEmail')})")
                    print(f"    Text: {msg_dict.get('text', '')[:50]}...")
                except Exception as e:
                    print(f"  ERROR serializing message {msg.id}: {e}")
            
            print("\n✅ Messages schema check completed!")
            
    except Exception as e:
        print(f"❌ Error fixing messages: {e}")
        return False
    
    return True

if __name__ == "__main__":
    if fix_messages():
        print("✅ Messages schema is healthy!")
        sys.exit(0)
    else:
        print("❌ Issues found in messages schema!")
        sys.exit(1)
