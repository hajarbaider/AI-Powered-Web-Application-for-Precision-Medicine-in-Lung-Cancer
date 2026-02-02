from app.extensions import db

class SurvivalPrediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    year_1_prob = db.Column(db.Float)
    year_2_prob = db.Column(db.Float)
    year_3_prob = db.Column(db.Float)
    year_4_prob = db.Column(db.Float)
    year_5_prob = db.Column(db.Float)
    predicted_duration = db.Column(db.Float)
    
    user = db.relationship('User', backref=db.backref('survival_predictions', lazy=True))
