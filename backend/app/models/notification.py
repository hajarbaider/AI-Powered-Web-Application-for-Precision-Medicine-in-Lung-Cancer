from datetime import datetime
from app import db

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    is_read = db.Column(db.Boolean, default=False)  
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    link = db.Column(db.String(255), nullable=True) 
    type = db.Column(db.String(50), default="general")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'message': self.message,
            'is_read': self.is_read,  
            'timestamp': self.created_at.isoformat(),
            'link': self.link,
            'type': self.type,
        }
