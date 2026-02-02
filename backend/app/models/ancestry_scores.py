from app.extensions import db

class AncestryScores(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)

    EUR = db.Column(db.Float)  # European ancestry proportion
    AFR = db.Column(db.Float)  # African
    EAS = db.Column(db.Float)  # East Asian
    AMR = db.Column(db.Float)  # American (Native)
    SAS = db.Column(db.Float)  # South Asian

    user = db.relationship('User', backref=db.backref('ancestry_scores', uselist=False))
