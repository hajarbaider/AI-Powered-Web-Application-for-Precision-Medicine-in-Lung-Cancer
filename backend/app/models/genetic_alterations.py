from app.extensions import db

class GeneticAlterations(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)

    # Altérations CNA (Copy Number Alterations)
    EGFR_cna = db.Column(db.Integer)
    ALK_cna = db.Column(db.Integer)
    ROS1_cna = db.Column(db.Integer)
    BRAF_cna = db.Column(db.Integer)
    MET_cna = db.Column(db.Integer)
    RET_cna = db.Column(db.Integer)
    ERBB2_cna = db.Column(db.Integer)
    KRAS_cna = db.Column(db.Integer)
    TP53_cna = db.Column(db.Integer)
    STK11_cna = db.Column(db.Integer)
    KEAP1_cna = db.Column(db.Integer)
    PIK3CA_cna = db.Column(db.Integer)
    NRAS_cna = db.Column(db.Integer)
    NTRK1_cna = db.Column(db.Integer)
    NTRK2_cna = db.Column(db.Integer)
    NTRK3_cna = db.Column(db.Integer)
    CD274_cna = db.Column(db.Integer)

    user = db.relationship('User', backref=db.backref('genetic_data', uselist=False))
