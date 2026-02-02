from app.extensions import db
from datetime import datetime

class ResultatPredictionLungCancer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    predicted_class = db.Column(db.String(100))
    probabilities = db.Column(db.Text)  # Ex: "0.1,0.3,0.6"
    prediction_date = db.Column(db.DateTime, default=datetime.utcnow)
    image_path = db.Column(db.String(255))  # pour afficher image si besoin

    user = db.relationship('User', backref=db.backref('lung_predictions', lazy=True))
