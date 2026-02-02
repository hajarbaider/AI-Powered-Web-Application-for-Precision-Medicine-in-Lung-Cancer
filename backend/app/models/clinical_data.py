# models/clinical_data.py
from app.extensions import db

class ClinicalData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    
    # Demographic
    age = db.Column(db.Integer) 
    gender = db.Column(db.String(10)) 
    race = db.Column(db.String(50))
    height = db.Column(db.Float)
    weight = db.Column(db.Float)
    
    diagnosed = db.Column(db.Boolean, default=False)
    # Cancer
    de_stag = db.Column(db.String(10))
    de_stag_7thed = db.Column(db.String(10)) 
    histology_cat = db.Column(db.String(50)) 
    lesionsize = db.Column(db.Float)
    treatlc = db.Column(db.String(50)) # wax dar le tretemnt 
    lung_cancer = db.Column(db.String(10))
    radiation_therapy = db.Column(db.Integer)

    # Medical history
    diagadas = db.Column(db.Boolean)
    diagasbe = db.Column(db.Boolean)
    diagbron = db.Column(db.Boolean)
    diagchas = db.Column(db.Boolean)
    diagchro = db.Column(db.Boolean)
    diagcopd = db.Column(db.Boolean)
    diagdiab = db.Column(db.Boolean)
    diagemph = db.Column(db.Boolean)
    diagfibr = db.Column(db.Boolean)
    diaghear = db.Column(db.Boolean)
    diaghype = db.Column(db.Boolean)
    diagpneu = db.Column(db.Boolean)
    diagsarc = db.Column(db.Boolean)
    diagsili = db.Column(db.Boolean)
    diagstro = db.Column(db.Boolean)
    diagtube = db.Column(db.Boolean)
    canclung = db.Column(db.Boolean)

    # Smoking
    cigsmok = db.Column(db.Boolean)
    age_quit = db.Column(db.Integer)
    pkyr = db.Column(db.Float)
    smokeday = db.Column(db.Float)
    smokeyr = db.Column(db.Integer)

    # Cancer progression
    progressed_ever = db.Column(db.Boolean)
    prog_days_1st = db.Column(db.Integer)

    # Survival
    canc_free_days = db.Column(db.Integer)
    candx_days = db.Column(db.Integer)

    # Screening
    scr_res0 = db.Column(db.String(20))
    scr_res1 = db.Column(db.String(20))
    scr_res2 = db.Column(db.String(20))

    # Biopsy
    biop0 = db.Column(db.Boolean)
    biop1 = db.Column(db.Boolean)
    biop2 = db.Column(db.Boolean)

    # Invasive
    invas0 = db.Column(db.Boolean)
    invas1 = db.Column(db.Boolean)
    invas2 = db.Column(db.Boolean)

    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    doctor = db.relationship('User', foreign_keys=[doctor_id], backref='patients_assigned')
