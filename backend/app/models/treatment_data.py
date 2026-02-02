# models/treatment_data.py
from app.extensions import db
from datetime import datetime

class TreatmentData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    treatment_type = db.Column(db.String(100))
    agent = db.Column(db.String(100))
    
    altered_genes = db.Column(db.Text)  # texte séparé par virgules
    affected_pathways = db.Column(db.Text)

    date = db.Column(db.DateTime, default=datetime.utcnow)

    #user = db.relationship("User", backref="treatments", overlaps="patient_data")




