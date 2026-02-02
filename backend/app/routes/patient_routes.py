import os
from flask import request, jsonify
from app.models.user import User
from app.models.clinical_data import ClinicalData
from app.models.imaging_data import ImagingData
from app.models.treatment_data import TreatmentData
from app.extensions import db
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import Blueprint, jsonify, request
from flask import current_app
from app.models.genetic_alterations import GeneticAlterations
from app.models.hypoxia_scores import HypoxiaScores
from app.models.ancestry_scores import AncestryScores
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.survival_prediction import SurvivalPrediction

patient_bp = Blueprint('patient', __name__)
def str_to_bool(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value == '1'
    return False
def safe_int(value):
    try:
        return int(value)
    except:
        return None

@patient_bp.route('/add-patient', methods=['POST'])
def add_patient():
    form = request.form
    files = request.files
    print("📥 Requête reçue")
    print("🔎 Contenu:", request.form)
    print("🖼 Files:", request.files)
     # Define images path early
    images_path = os.path.join(current_app.root_path, 'static', 'images')
    os.makedirs(images_path, exist_ok=True)
    # 1. Sauvegarder profile image fe app/static/images bax t9rali 
    profile_filename = None
    if 'profileImage' in files:
        profile_file = files['profileImage']
        if profile_file.filename != '':
            profile_filename = secure_filename(profile_file.filename)
            profile_file.save(os.path.join(images_path, profile_filename))
            

    # 2. User
    user = User(
        firstName=form.get('firstName'),
        lastName=form.get('lastName'),
        email=form.get('email'),
        password=form.get('password'),
        phoneNumber=form.get('phoneNumber'),
        city=form.get('city'),
        address=form.get('address'),
        role='patient',
        profileImage=profile_filename
    )
    db.session.add(user)
    db.session.flush()
    user_id = user.id
    

    # 3. Clinical Data
    clinical = ClinicalData(
        user_id=user_id,
        doctor_id=form.get('doctor_id'),
        age=form.get('age'),
        gender=form.get('gender'),
        race=form.get('race'),
        height=form.get('height'),
        weight=form.get('weight'),
        diagnosed=form.get('diagnosed') == '1',
        de_stag=form.get('de_stag'),
        de_stag_7thed=form.get('de_stag_7thed'),
        histology_cat=form.get('histology_cat'),
        lesionsize=form.get('lesionsize'),
        treatlc=form.get('treatlc'),
        lung_cancer=form.get('lung_cancer'),
        progressed_ever=str_to_bool(form.get('progressed_ever')),

        prog_days_1st=form.get('prog_days_1st'),
        canc_free_days=form.get('canc_free_days'),
        candx_days=form.get('candx_days'),
    
        age_quit=form.get('age_quit'),
        pkyr=form.get('pkyr'),
        smokeday=form.get('smokeday'),
        smokeyr=form.get('smokeyr'),
        radiation_therapy= str_to_bool(form.get('radiation_therapy')),
        diagadas=str_to_bool(form.get('diagadas')),
        diagasbe=str_to_bool(form.get('diagasbe')),
        diagbron=str_to_bool(form.get('diagbron')),
        diagchas=str_to_bool(form.get('diagchas')),
        diagchro=str_to_bool(form.get('diagchro')),
        diagcopd=str_to_bool(form.get('diagcopd')),
        diagdiab=str_to_bool(form.get('diagdiab')),
        diagemph=str_to_bool(form.get('diagemph')),
        diagfibr=str_to_bool(form.get('diagfibr')),
        diaghear=str_to_bool(form.get('diaghear')),
        diaghype=str_to_bool(form.get('diaghype')),
        diagpneu=str_to_bool(form.get('diagpneu')),
        diagsarc=str_to_bool(form.get('diagsarc')),
        diagsili=str_to_bool(form.get('diagsili')),
        diagstro=str_to_bool(form.get('diagstro')),
        diagtube=str_to_bool(form.get('diagtube')),
        canclung=str_to_bool(form.get('canclung')),
        cigsmok=str_to_bool(form.get('cigsmok')),
       

    )
    db.session.add(clinical)

# 4. Imaging
    ct_scan_filename = None
    if 'ct_scan_image' in files:
        ct_file = files['ct_scan_image']
        if ct_file.filename != '':
            ct_scan_filename = f"{user.id}_ct_{secure_filename(ct_file.filename)}"
            ct_path = os.path.join(images_path, ct_scan_filename)
            ct_file.save(ct_path)

    imaging = ImagingData(
        user_id=user_id,
        scan_date=datetime.strptime(form.get('scan_date'), '%Y-%m-%d') if form.get('scan_date') else None,
        ct_scan_image=ct_scan_filename
)

    db.session.add(imaging)

  

    genetic_data = GeneticAlterations(
    user_id=user_id,
    EGFR_cna=safe_int(form.get('EGFR_cna')),
    ALK_cna=safe_int(form.get('ALK_cna')),
    ROS1_cna=safe_int(form.get('ROS1_cna')),
    BRAF_cna=safe_int(form.get('BRAF_cna')),
    MET_cna=safe_int(form.get('MET_cna')),
    RET_cna=safe_int(form.get('RET_cna')),
    ERBB2_cna=safe_int(form.get('ERBB2_cna')),
    KRAS_cna=safe_int(form.get('KRAS_cna')),
    TP53_cna=safe_int(form.get('TP53_cna')),
    STK11_cna=safe_int(form.get('STK11_cna')),
    KEAP1_cna=safe_int(form.get('KEAP1_cna')),
    PIK3CA_cna=safe_int(form.get('PIK3CA_cna')),
    NRAS_cna=safe_int(form.get('NRAS_cna')),
    NTRK1_cna=safe_int(form.get('NTRK1_cna')),
    NTRK2_cna=safe_int(form.get('NTRK2_cna')),
    NTRK3_cna=safe_int(form.get('NTRK3_cna')),
    CD274_cna=safe_int(form.get('CD274_cna')),
    )
    db.session.add(genetic_data)

    hypoxia = HypoxiaScores(
    user_id=user_id,
    RAGNUM_HYPOXIA_SCORE=form.get('RAGNUM_HYPOXIA_SCORE'),
    BUFFA_HYPOXIA_SCORE=form.get('BUFFA_HYPOXIA_SCORE')
    )
    db.session.add(hypoxia)


    ancestry = AncestryScores(
    user_id=user_id,
    EUR=form.get('EUR'),
    AFR=form.get('AFR'),
    EAS=form.get('EAS'),
    AMR=form.get('AMR'),
    SAS=form.get('SAS')
    )
    db.session.add(ancestry)


    db.session.commit()
    return jsonify({"message": "✅ Patient registered successfully"}), 201




@patient_bp.route('/get_prediction_survival', methods=['GET'])
def get_prediction_survival():
    # Récupérer l'user_id d’une autre manière, par exemple un paramètre GET
    user_id = request.args.get('user_id', type=int)

    if not user_id:
        return jsonify({'message': 'user_id is required'}), 400

    prediction = SurvivalPrediction.query.filter_by(user_id=user_id).first()
    
    if not prediction:
        return jsonify({'message': 'Prediction not found'}), 404

    curve_filename = f"survival_curve_user_{user_id}.png"
    curve_path = f"/static/survival_curves/{curve_filename}"

    return jsonify({
        'year_probs': [
            prediction.year_1_prob,
            prediction.year_2_prob,
            prediction.year_3_prob,
            prediction.year_4_prob,
            prediction.year_5_prob,
        ],
        'predicted_duration': prediction.predicted_duration,
        'curve_image': curve_path
    })
 