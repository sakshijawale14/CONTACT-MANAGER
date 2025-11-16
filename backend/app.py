import os
import argparse
from datetime import timedelta, datetime, timezone
import cloudinary
import cloudinary.uploader
import cloudinary.api

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_, and_
from passlib.hash import bcrypt
from dotenv import load_dotenv

load_dotenv()

# Initialize Cloudinary (only if credentials are provided)
cloudinary_configured = False
cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
api_key = os.getenv("CLOUDINARY_API_KEY")
api_secret = os.getenv("CLOUDINARY_API_SECRET")

if cloud_name and api_key and api_secret:
    try:
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret,
        )
        cloudinary_configured = True
        print("Cloudinary configured successfully")
    except Exception as e:
        print(f"Warning: Cloudinary configuration failed: {e}")
else:
    print("Warning: Cloudinary credentials not found. Image uploads will not work.")

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    photo_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    contacts = db.relationship("Contact", backref="user", lazy=True, cascade="all, delete-orphan")
    sent_messages = db.relationship("Message", foreign_keys="Message.sender_id", backref="sender", lazy=True)
    received_messages = db.relationship("Message", foreign_keys="Message.recipient_id", backref="recipient", lazy=True)

    def to_dict_basic(self):
        return {"id": self.id, "name": self.name, "email": self.email, "photo": self.photo_url}


class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False, index=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(64))
    company = db.Column(db.String(255))
    notes = db.Column(db.Text)
    photo_url = db.Column(db.String(500))
    group = db.Column(db.String(100))
    is_favorite = db.Column(db.Boolean, default=False, nullable=False)
    access_count = db.Column(db.Integer, default=0, nullable=False)
    last_accessed = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "company": self.company,
            "notes": self.notes,
            "photo": self.photo_url,
            "group": self.group,
            "isFavorite": self.is_favorite,
            "accessCount": self.access_count or 0,
            "lastAccessed": self.last_accessed.isoformat() if self.last_accessed else None,
            "createdAt": self.created_at.isoformat(),
        }


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False, index=True)
    recipient_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False, index=True)
    text = db.Column(db.Text, nullable=False)
    read = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)

    __table_args__ = (
        db.Index("idx_sender_recipient", "sender_id", "recipient_id"),
        db.Index("idx_recipient_created", "recipient_id", "created_at"),
    )

    def to_dict(self):
        # Ensure UTC timezone is included in ISO format
        timestamp = self.created_at
        if timestamp.tzinfo is None:
            # If no timezone info, assume UTC and add it
            from datetime import timezone
            timestamp = timestamp.replace(tzinfo=timezone.utc)
        
        # Load relationships if not already loaded
        sender_name = None
        sender_email = None
        recipient_name = None
        recipient_email = None
        
        if self.sender_id:
            if hasattr(self, 'sender') and self.sender:
                sender_name = self.sender.name
                sender_email = self.sender.email
            else:
                # Fallback: load from database if relationship not loaded
                from sqlalchemy.orm import selectinload
                sender = db.session.query(User).filter(User.id == self.sender_id).first()
                if sender:
                    sender_name = sender.name
                    sender_email = sender.email
        
        if self.recipient_id:
            if hasattr(self, 'recipient') and self.recipient:
                recipient_name = self.recipient.name
                recipient_email = self.recipient.email
            else:
                # Fallback: load from database if relationship not loaded
                recipient = db.session.query(User).filter(User.id == self.recipient_id).first()
                if recipient:
                    recipient_name = recipient.name
                    recipient_email = recipient.email
        
        return {
            "id": self.id,
            "senderId": self.sender_id,
            "senderName": sender_name,
            "senderEmail": sender_email,
            "recipientId": self.recipient_id,
            "recipientName": recipient_name,
            "recipientEmail": recipient_email,
            "text": self.text,
            "read": self.read,
            "timestamp": timestamp.isoformat(),
        }


def create_app():
    app = Flask(__name__)

    # Config
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///app.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max file size

    # Extensions
    CORS(app, resources={r"/*": {"origins": os.getenv("ALLOW_ORIGINS", "http://localhost:3000").split(",")}}, supports_credentials=True)
    JWTManager(app)
    db.init_app(app)

    # Root route
    @app.route("/")
    def root():
        return jsonify({
            "message": "Contact Manager API",
            "version": "1.0.0",
            "status": "running",
            "endpoints": {
                "health": "/api/health",
                "register": "/api/auth/register",
                "login": "/api/auth/login",
            }
        })

    # Routes
    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "time": datetime.now(timezone.utc).isoformat()})

    # Auth
    @app.post("/api/auth/register")
    def register():
        try:
            data = request.get_json() or {}
            name = (data.get("name") or "").strip()
            email = (data.get("email") or "").strip().lower()
            password = (data.get("password") or "").strip()
            if not name or not email or not password:
                return jsonify({"message": "name, email and password are required"}), 400
            if User.query.filter_by(email=email).first():
                return jsonify({"message": "Email already registered"}), 409
            user = User(name=name, email=email, password_hash=bcrypt.hash(password))
            db.session.add(user)
            db.session.commit()
            token = create_access_token(identity=str(user.id))
            return jsonify({"user": user.to_dict_basic(), "token": token})
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Registration failed: {str(e)}"}), 500

    @app.post("/api/auth/login")
    def login():
        try:
            data = request.get_json() or {}
            email = (data.get("email") or "").strip().lower()
            password = (data.get("password") or "").strip()
            user = User.query.filter_by(email=email).first()
            if not user or not bcrypt.verify(password, user.password_hash):
                return jsonify({"message": "Incorrect email or password"}), 401
            token = create_access_token(identity=str(user.id))
            return jsonify({"user": user.to_dict_basic(), "token": token})
        except Exception as e:
            return jsonify({"message": f"Login failed: {str(e)}"}), 500

    @app.get("/api/auth/me")
    @jwt_required()
    def get_current_user():
        try:
            current_user_id = int(get_jwt_identity())
            user = User.query.get(current_user_id)
            if not user:
                return jsonify({"message": "User not found"}), 404
            return jsonify({"user": user.to_dict_basic()})
        except Exception as e:
            return jsonify({"message": f"Error: {str(e)}"}), 500

    # Image Upload
    @app.post("/api/upload")
    @jwt_required()
    def upload_image():
        if not cloudinary_configured:
            return jsonify({"message": "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env file"}), 503
        
        if "file" not in request.files:
            return jsonify({"message": "No file provided"}), 400
        
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"message": "No file selected"}), 400

        try:
            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                file,
                folder="contact_manager",
                resource_type="image",
                transformation=[{"width": 500, "height": 500, "crop": "limit"}],
            )
            return jsonify({"url": upload_result["secure_url"]}), 200
        except Exception as e:
            return jsonify({"message": f"Upload failed: {str(e)}"}), 500

    # User lookup by email (for messaging)
    @app.get("/api/users/search")
    @jwt_required()
    def search_users():
        try:
            email = request.args.get("email", "").strip().lower()
            if not email:
                return jsonify({"users": []})
            
            users = User.query.filter(User.email.ilike(f"%{email}%")).limit(10).all()
            return jsonify({"users": [u.to_dict_basic() for u in users]})
        except Exception as e:
            return jsonify({"message": f"Search failed: {str(e)}"}), 500

    # Contacts
    @app.get("/api/contacts")
    @jwt_required()
    def list_contacts():
        current_user_id = int(get_jwt_identity())
        search = (request.args.get("search") or "").strip().lower()
        sort = request.args.get("sort") or "name"
        group = request.args.get("group")

        query = Contact.query.filter_by(user_id=current_user_id)
        
        if search:
            like = f"%{search}%"
            query = query.filter(
                or_(
                    Contact.name.ilike(like),
                    Contact.email.ilike(like),
                    Contact.phone.ilike(like),
                )
            )

        if group and group != "all":
            query = query.filter_by(group=group)

        if sort == "favorites":
            query = query.order_by(Contact.is_favorite.desc(), Contact.name.asc())
        elif sort == "frequent":
            query = query.order_by(Contact.access_count.desc(), Contact.name.asc())
        else:
            query = query.order_by(Contact.name.asc())

        try:
            contacts = [c.to_dict() for c in query.all()]
            return jsonify({"contacts": contacts})
        except Exception as e:
            return jsonify({"message": f"Error loading contacts: {str(e)}"}), 500

    @app.post("/api/contacts")
    @jwt_required()
    def create_contact():
        try:
            current_user_id = int(get_jwt_identity())
            data = request.get_json() or {}
            name = (data.get("name") or "").strip()
            email = (data.get("email") or "").strip().lower()
            phone = (data.get("phone") or "").strip()
            company = (data.get("company") or "").strip()
            notes = (data.get("notes") or "").strip()
            photo_url = (data.get("photo") or "").strip()
            group = (data.get("group") or "").strip() or None
            
            if not name or not email:
                return jsonify({"message": "name and email are required"}), 400
            
            contact = Contact(
                user_id=current_user_id,
                name=name,
                email=email,
                phone=phone,
                company=company,
                notes=notes,
                photo_url=photo_url if photo_url else None,
                group=group,
            )
            db.session.add(contact)
            db.session.commit()
            return jsonify(contact.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Error creating contact: {str(e)}"}), 500

    @app.put("/api/contacts/<int:contact_id>")
    @jwt_required()
    def update_contact(contact_id: int):
        try:
            current_user_id = int(get_jwt_identity())
            contact = Contact.query.filter_by(id=contact_id, user_id=current_user_id).first()
            if not contact:
                return jsonify({"message": "Contact not found"}), 404
            
            data = request.get_json() or {}
            for field in ["name", "email", "phone", "company", "notes", "group"]:
                if field in data:
                    if field == "photo":
                        setattr(contact, "photo_url", data[field] if data[field] else None)
                    elif isinstance(data[field], str):
                        setattr(contact, field, data[field].strip() if data[field] else None)
                    else:
                        setattr(contact, field, data[field])
            
            db.session.commit()
            return jsonify(contact.to_dict())
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Error updating contact: {str(e)}"}), 500

    @app.delete("/api/contacts/<int:contact_id>")
    @jwt_required()
    def delete_contact(contact_id: int):
        try:
            current_user_id = int(get_jwt_identity())
            contact = Contact.query.filter_by(id=contact_id, user_id=current_user_id).first()
            if not contact:
                return jsonify({"message": "Contact not found"}), 404
            db.session.delete(contact)
            db.session.commit()
            return jsonify({"success": True})
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Error deleting contact: {str(e)}"}), 500

    @app.post("/api/contacts/<int:contact_id>/toggle-favorite")
    @jwt_required()
    def toggle_favorite(contact_id: int):
        try:
            current_user_id = int(get_jwt_identity())
            contact = Contact.query.filter_by(id=contact_id, user_id=current_user_id).first()
            if not contact:
                return jsonify({"message": "Contact not found"}), 404
            contact.is_favorite = not contact.is_favorite
            db.session.commit()
            return jsonify(contact.to_dict())
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Error toggling favorite: {str(e)}"}), 500

    @app.post("/api/contacts/<int:contact_id>/increment-access")
    @jwt_required()
    def increment_access(contact_id: int):
        try:
            current_user_id = int(get_jwt_identity())
            contact = Contact.query.filter_by(id=contact_id, user_id=current_user_id).first()
            if not contact:
                return jsonify({"message": "Contact not found"}), 404
            contact.access_count = (contact.access_count or 0) + 1
            contact.last_accessed = datetime.utcnow()
            db.session.commit()
            return jsonify(contact.to_dict())
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Error incrementing access: {str(e)}"}), 500

    # Messages
    @app.post("/api/messages")
    @jwt_required()
    def send_message():
        try:
            current_user_id = int(get_jwt_identity())
            data = request.get_json() or {}
            recipient_email = (data.get("recipientEmail") or "").strip().lower()
            text = (data.get("text") or "").strip()

            if not recipient_email or not text:
                return jsonify({"message": "recipientEmail and text are required"}), 400

            # Find recipient by email
            recipient = User.query.filter_by(email=recipient_email).first()
            if not recipient:
                return jsonify({"message": "Recipient not found"}), 404

            if recipient.id == current_user_id:
                return jsonify({"message": "Cannot send message to yourself"}), 400

            message = Message(
                sender_id=current_user_id,
                recipient_id=recipient.id,
                text=text,
                read=False,
            )
            db.session.add(message)
            db.session.commit()
            
            # Load relationships before returning
            db.session.refresh(message)
            message.sender = User.query.get(current_user_id)
            message.recipient = recipient
            
            return jsonify(message.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Error sending message: {str(e)}"}), 500

    @app.get("/api/messages/conversation")
    @jwt_required()
    def get_conversation():
        try:
            current_user_id = int(get_jwt_identity())
            recipient_email = request.args.get("recipientEmail", "").strip().lower()

            if not recipient_email:
                return jsonify({"message": "recipientEmail is required"}), 400

            recipient = User.query.filter_by(email=recipient_email).first()
            if not recipient:
                return jsonify({"messages": []})

            # Get messages between current user and recipient
            messages = Message.query.options(
                db.joinedload(Message.sender),
                db.joinedload(Message.recipient)
            ).filter(
                or_(
                    and_(Message.sender_id == current_user_id, Message.recipient_id == recipient.id),
                    and_(Message.sender_id == recipient.id, Message.recipient_id == current_user_id),
                )
            ).order_by(Message.created_at.asc()).all()

            # Mark messages as read
            Message.query.filter_by(sender_id=recipient.id, recipient_id=current_user_id, read=False).update({"read": True})
            db.session.commit()

            return jsonify({"messages": [m.to_dict() for m in messages]})
        except Exception as e:
            return jsonify({"message": f"Error getting conversation: {str(e)}"}), 500

    @app.get("/api/messages/conversations")
    @jwt_required()
    def get_conversations():
        try:
            current_user_id = int(get_jwt_identity())

            # Get all unique conversations
            sent_conversations = db.session.query(
                Message.recipient_id,
                db.func.max(Message.created_at).label("last_message_time")
            ).filter_by(sender_id=current_user_id).group_by(Message.recipient_id).all()

            received_conversations = db.session.query(
                Message.sender_id,
                db.func.max(Message.created_at).label("last_message_time")
            ).filter_by(recipient_id=current_user_id).group_by(Message.sender_id).all()

            # Combine and get latest message for each conversation
            conversations = []
            conversation_map = {}

            for recipient_id, last_time in sent_conversations:
                conversation_map[recipient_id] = last_time

            for sender_id, last_time in received_conversations:
                if sender_id in conversation_map:
                    if last_time > conversation_map[sender_id]:
                        conversation_map[sender_id] = last_time
                else:
                    conversation_map[sender_id] = last_time

            # Get last message and unread count for each conversation
            for user_id, last_time in conversation_map.items():
                other_user = User.query.get(user_id)
                if not other_user:
                    continue

                # Get last message for each conversation
                last_message = Message.query.options(
                    db.joinedload(Message.sender),
                    db.joinedload(Message.recipient)
                ).filter(
                    or_(
                        and_(Message.sender_id == current_user_id, Message.recipient_id == user_id),
                        and_(Message.sender_id == user_id, Message.recipient_id == current_user_id),
                    )
                ).order_by(Message.created_at.desc()).first()

                unread_count = Message.query.filter_by(
                    sender_id=user_id,
                    recipient_id=current_user_id,
                    read=False
                ).count()

                conversations.append({
                    "contactId": user_id,
                    "contactName": other_user.name,
                    "contactEmail": other_user.email,
                    "contactPhoto": other_user.photo_url,
                    "lastMessage": last_message.to_dict() if last_message else None,
                    "unreadCount": unread_count,
                })

            # Sort by last message time
            conversations.sort(key=lambda x: x["lastMessage"]["timestamp"] if x["lastMessage"] else "", reverse=True)

            return jsonify({"conversations": conversations})
        except Exception as e:
            return jsonify({"message": f"Error getting conversations: {str(e)}"}), 500

    @app.get("/api/messages/unread-count")
    @jwt_required()
    def get_unread_count():
        try:
            current_user_id = int(get_jwt_identity())
            count = Message.query.filter_by(recipient_id=current_user_id, read=False).count()
            return jsonify({"count": count})
        except Exception as e:
            return jsonify({"message": f"Error getting unread count: {str(e)}"}), 500

    @app.post("/api/messages/<int:message_id>/read")
    @jwt_required()
    def mark_message_read(message_id: int):
        try:
            current_user_id = int(get_jwt_identity())
            message = Message.query.filter_by(id=message_id, recipient_id=current_user_id).first()
            if not message:
                return jsonify({"message": "Message not found"}), 404
            message.read = True
            db.session.commit()
            return jsonify({"success": True})
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Error marking message as read: {str(e)}"}), 500

    @app.delete("/api/messages/<int:message_id>")
    @jwt_required()
    def delete_message(message_id: int):
        try:
            current_user_id = int(get_jwt_identity())
            message = Message.query.filter(
                or_(
                    and_(Message.id == message_id, Message.sender_id == current_user_id),
                    and_(Message.id == message_id, Message.recipient_id == current_user_id),
                )
            ).first()
            if not message:
                return jsonify({"message": "Message not found"}), 404
            db.session.delete(message)
            db.session.commit()
            return jsonify({"success": True})
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Error deleting message: {str(e)}"}), 500

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"message": "Endpoint not found", "error": str(error)}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({"message": "Internal server error", "error": str(error)}), 500

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"message": "Bad request", "error": str(error)}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({"message": "Unauthorized. Please login."}), 401

    return app


def init_db(app: Flask):
    with app.app_context():
        db.create_all()
        print("Database initialized successfully!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--init-db", action="store_true", help="Initialize the database")
    args = parser.parse_args()

    app = create_app()
    if args.init_db:
        init_db(app)
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
