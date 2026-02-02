from datetime import datetime
from app.extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    
    firstName = db.Column(db.String(64), nullable=True)
    lastName = db.Column(db.String(64), nullable=True)
    
    role = db.Column(db.String(32), nullable=True)  # admin, patient, doctor
    city = db.Column(db.String(64), nullable=True)
    
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    lastLogin = db.Column(db.DateTime, nullable=True)
    
    address = db.Column(db.String(255), nullable=True)
    phoneNumber = db.Column(db.String(20), nullable=True)
    
    profileImage = db.Column(db.String(255), nullable=True)  # غادي نحطو فيه اسم أو رابط الصورة
    clinical_data = db.relationship('ClinicalData', backref='patient', uselist=False, foreign_keys='ClinicalData.user_id')

    imaging_data = db.relationship('ImagingData', backref='patient', uselist=False)
    #treatment_data = db.relationship('TreatmentData', backref='patient', uselist=False)
    #treatment_recommendations = db.relationship("TreatmentData", backref="patient", overlaps="user")
    #treatment_data = db.relationship('TreatmentData', backref='user', lazy=True)
    treatment_data = db.relationship('TreatmentData', backref='patient', lazy=True)

    
    notifications = db.relationship(
        'Notification',
        backref='user',
        cascade="all, delete-orphan",
        lazy=True
    )

    def __repr__(self):
        return f"<User {self.email}>"
