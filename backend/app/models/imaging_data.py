# models/imaging_data.py
from app.extensions import db

class ImagingData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)

    ct_scan_image = db.Column(db.String(255)) 
    scan_date = db.Column(db.Date)
