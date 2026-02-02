from app.extensions import db

class HypoxiaScores(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)

    RAGNUM_HYPOXIA_SCORE = db.Column(db.Float)
    BUFFA_HYPOXIA_SCORE = db.Column(db.Float)

    user = db.relationship('User', backref=db.backref('hypoxia_scores', uselist=False))
