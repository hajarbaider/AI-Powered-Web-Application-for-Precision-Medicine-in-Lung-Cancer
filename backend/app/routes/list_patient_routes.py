# routes/list_patient_routes.py

from flask import Blueprint, jsonify, request
from app.models.user import User
from app.extensions import db
import os
from app.models.genetic_alterations import GeneticAlterations
from app.models.hypoxia_scores import HypoxiaScores
from app.models.ancestry_scores import AncestryScores
from app.models.survival_prediction import SurvivalPrediction
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.treatment_data import TreatmentData
from datetime import datetime
from app.models.resultat_prediction_lung_cancer import ResultatPredictionLungCancer



list_patient_bp = Blueprint('list_patient', __name__)
def str_to_bool(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value == '1' or value.lower() == 'true'
    return False
def safe_int(value):
    try:
        return int(value)
    except:
        return None
STAGE_7_DICT = {
    110: "Stage IA",
    120: "Stage IB",
    210: "Stage IIA",
    220: "Stage IIB",
    310: "Stage IIIA",
    320: "Stage IIIB",
    400: "Stage IV",
    -1: "Autre"
}

@list_patient_bp.route('/patients', methods=['GET'])
def get_patients():
    patients = User.query.filter_by(role='patient').all()
    result = []
    for patient in patients:
        print("🔍 Patient:", patient.firstName, patient.lastName)
        result.append({
            'id': patient.id,
            'firstName': patient.firstName,
            'lastName': patient.lastName,
            'email': patient.email,
            'phoneNumber': patient.phoneNumber,
            'city': patient.city,
            'profileImage': patient.profileImage,
            'doctor': f"{patient.clinical_data.doctor.firstName} {patient.clinical_data.doctor.lastName}" if patient.clinical_data and patient.clinical_data.doctor else "Non assigné"
        })
    return jsonify(result)

@list_patient_bp.route('/delete-patient/<int:user_id>', methods=['DELETE', 'OPTIONS'])
def delete_patient(user_id):
    if request.method == 'OPTIONS':
        return '', 200

    user = User.query.get(user_id)
    if not user or user.role != 'patient':
        return jsonify({'error': 'The patient does not exist'}), 404

    # Supprimer les données liées
    if user.clinical_data:
        db.session.delete(user.clinical_data)

    if user.imaging_data:
        db.session.delete(user.imaging_data)

    if user.treatment_data:
        for treatment in user.treatment_data:
            db.session.delete(treatment)

    if user.survival_predictions:
        for prediction in user.survival_predictions:
            db.session.delete(prediction)

    if user.lung_predictions:
        for prediction in user.lung_predictions:
            db.session.delete(prediction)

    if user.hypoxia_scores:
        db.session.delete(user.hypoxia_scores)

    if user.genetic_data:
        db.session.delete(user.genetic_data)

    if user.ancestry_scores:
        db.session.delete(user.ancestry_scores)
    if user.notifications:
        for notif in user.notifications:
            db.session.delete(notif)


    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': '✅ Patient deleted successfully'})



@list_patient_bp.route('/patient/<int:id>', methods=['GET'])
def get_patient(id):
    user = User.query.get(id)
    if not user or user.role != 'patient':
        return jsonify({'error': 'Patient introuvable'}), 404

    # construire les données à envoyer
    clinical = user.clinical_data
    imaging = user.imaging_data
    treatment = user.treatment_data

    doctor_first_name = ""
    doctor_last_name = ""

    if clinical and clinical.doctor_id:
        doctor = User.query.get(clinical.doctor_id)
        if doctor:
            doctor_first_name = doctor.firstName
            doctor_last_name = doctor.lastName
    genetic = GeneticAlterations.query.filter_by(user_id=id).first()
    hypoxia = HypoxiaScores.query.filter_by(user_id=id).first()
    ancestry = AncestryScores.query.filter_by(user_id=id).first()


    return jsonify({
        'id': user.id,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'email': user.email,
        'password': user.password,
        'phoneNumber': user.phoneNumber,
        'city': user.city,
        'address': user.address,
       
        'doctor_id': clinical.doctor_id if clinical else None,
        'doctor_name': f"{doctor_first_name} {doctor_last_name}" if doctor_first_name else 'Non attribué',

        'profileImage': f"/static/images/{user.profileImage}" if user.profileImage else '',
        'ct_scan_image': f"/static/images/{imaging.ct_scan_image}" if imaging and imaging.ct_scan_image else '',

        # données cliniques
        'diagnosed': str_to_bool(clinical.diagnosed) if clinical else '',
        'age': clinical.age if clinical else '',
        'gender': clinical.gender if clinical else '',
        'race': clinical.race if clinical else '',
        'height': clinical.height if clinical else '',
        'weight': clinical.weight if clinical else '',
        'lesionsize': clinical.lesionsize if clinical else '',
        #'de_stag': STAGE_7_DICT.get(safe_int(clinical.de_stag), '') if clinical else '',
        #'de_stag_7thed': STAGE_7_DICT.get(safe_int(clinical.de_stag_7thed), '') if clinical else '',
        'de_stag': clinical.de_stag if clinical else '',
        'de_stag_7thed': clinical.de_stag_7thed if clinical else '',
        #'histology_cat': str_to_bool(clinical.histology_cat) if clinical else '',
        'histology_cat': clinical.histology_cat if clinical else '',


        #'treatlc': str_to_bool(clinical.treatlc) if clinical else '',

        'treatlc': clinical.treatlc if clinical else '',
        "radiation_therapy": str_to_bool(clinical.radiation_therapy) if clinical else '',

        'lung_cancer': str_to_bool(clinical.lung_cancer) if clinical else '',
        'progressed_ever': clinical.progressed_ever if clinical else '',
        'prog_days_1st': clinical.prog_days_1st if clinical else '',
        'candx_days': clinical.candx_days if clinical else '',
        'canc_free_days': clinical.canc_free_days if clinical else '',

        # antécédents et tabagisme
        'cigsmok': str_to_bool(clinical.cigsmok) if clinical else '',
        'age_quit': clinical.age_quit if clinical else '',
        'pkyr': clinical.pkyr if clinical else '',
        'smokeyr': clinical.smokeyr if clinical else '',
        'smokeday': clinical.smokeday if clinical else '',
        'diagadas': clinical.diagadas if clinical else '',
        'diagasbe': str_to_bool(clinical.diagasbe) if clinical else '',
        'diagbron': str_to_bool(clinical.diagbron) if clinical else '',
        'diagchas': str_to_bool(clinical.diagchas) if clinical else '',
        'diagchro': str_to_bool(clinical.diagchro) if clinical else '',
        'diagcopd': str_to_bool(clinical.diagcopd) if clinical else '',
        'diagdiab': str_to_bool(clinical.diagdiab) if clinical else '',
        'diagemph': str_to_bool(clinical.diagemph) if clinical else '',
        'diagfibr': str_to_bool(clinical.diagfibr) if clinical else '',
        'diaghear': str_to_bool(clinical.diaghear) if clinical else '',
        'diaghype': str_to_bool(clinical.diaghype) if clinical else '',
        'diagpneu': str_to_bool(clinical.diagpneu) if clinical else '',
        'diagsarc': str_to_bool(clinical.diagsarc) if clinical else '',
        'diagsili': str_to_bool(clinical.diagsili) if clinical else '',
        'diagstro': str_to_bool(clinical.diagstro) if clinical else '',
        'diagtube': str_to_bool(clinical.diagtube) if clinical else '',
        'canclung': str_to_bool(clinical.canclung) if clinical else '',

        # données CT
        'scan_date': imaging.scan_date if imaging else '',
        'ct_scan_image': f"/static/images/{imaging.ct_scan_image}" if imaging and imaging.ct_scan_image else '',


        # données traitement
       


        # ✅ Données génétiques
        'genetic_alterations': {
            'EGFR_cna': genetic.EGFR_cna if genetic else None,
            'ALK_cna': genetic.ALK_cna if genetic else None,
            'ROS1_cna': genetic.ROS1_cna if genetic else None,
            'BRAF_cna': genetic.BRAF_cna if genetic else None,
            'MET_cna': genetic.MET_cna if genetic else None,
            'RET_cna': genetic.RET_cna if genetic else None,
            'ERBB2_cna': genetic.ERBB2_cna if genetic else None,
            'KRAS_cna': genetic.KRAS_cna if genetic else None,
            'TP53_cna': genetic.TP53_cna if genetic else None,
            'STK11_cna': genetic.STK11_cna if genetic else None,
            'KEAP1_cna': genetic.KEAP1_cna if genetic else None,
            'PIK3CA_cna': genetic.PIK3CA_cna if genetic else None,
            'NRAS_cna': genetic.NRAS_cna if genetic else None,
            'NTRK1_cna': genetic.NTRK1_cna if genetic else None,
            'NTRK2_cna': genetic.NTRK2_cna if genetic else None,
            'NTRK3_cna': genetic.NTRK3_cna if genetic else None,
            'CD274_cna': genetic.CD274_cna if genetic else None
        },

        # ✅ Scores hypoxie
        'hypoxia_scores': {
            'RAGNUM_HYPOXIA_SCORE': hypoxia.RAGNUM_HYPOXIA_SCORE if hypoxia else None,
            'BUFFA_HYPOXIA_SCORE': hypoxia.BUFFA_HYPOXIA_SCORE if hypoxia else None
        },

        # ✅ Ancestries
        'ancestry_scores': {
            'EUR': ancestry.EUR if ancestry else None,
            'AFR': ancestry.AFR if ancestry else None,
            'EAS': ancestry.EAS if ancestry else None,
            'AMR': ancestry.AMR if ancestry else None,
            'SAS': ancestry.SAS if ancestry else None
        }
    })



@list_patient_bp.route('/update-patient/<int:id>', methods=['PUT'])
def update_patient(id):
    print("✅ [UPDATE] request received for user ID:", id)
    user = User.query.get(id)
    if not user or user.role != 'patient':
        return jsonify({'error': 'Patient not found'}), 404

    data = request.form
    user.firstName = data.get('firstName')
    user.lastName = data.get('lastName')
    user.email = data.get('email')
    user.password = data.get('password')
    user.phoneNumber = data.get('phoneNumber')
    user.city = data.get('city')
    user.address = data.get('address')

    # upload profile image
    profile_img = request.files.get('profileImage')
    if profile_img and profile_img.filename:
        filename = f"{user.id}_profile_{profile_img.filename}"
        filepath = os.path.join('app/static/images', filename)
        profile_img.save(filepath)
        user.profileImage = filename

    # clinical data
    if not user.clinical_data:
        from app.models.clinical_data import ClinicalData
        user.clinical_data = ClinicalData(user_id=user.id)

    c = user.clinical_data
    c.doctor_id = data.get('doctor_id')
    c.diagnosed = str_to_bool(data.get('diagnosed'))
    c.age = data.get('age')
    c.gender = data.get('gender')
    c.race = data.get('race')
    c.height = data.get('height')
    c.weight = data.get('weight')
    c.lesionsize = data.get('lesionsize')
    #c.de_stag = safe_int(data.get('de_stag'))
    c.de_stag = data.get('de_stag')
    
    c.de_stag_7thed = data.get('de_stag_7thed')
    #c.de_stag_7thed = safe_int(data.get('de_stag_7thed'))

    c.radiation_therapy = str_to_bool(data.get('radiation_therapy'))


    c.histology_cat = data.get('histology_cat')
    c.treatlc = data.get('treatlc')
    c.lung_cancer = str_to_bool(data.get('lung_cancer'))
    c.progressed_ever = str_to_bool(data.get('progressed_ever'))
    c.prog_days_1st = data.get('prog_days_1st')
    c.candx_days = data.get('candx_days')
    c.canc_free_days = data.get('canc_free_days')
    c.cigsmok = str_to_bool(data.get('cigsmok'))
    c.age_quit = data.get('age_quit')
    c.pkyr = data.get('pkyr')
    c.smokeyr = data.get('smokeyr')
    c.smokeday = data.get('smokeday')
    c.diagadas = str_to_bool(data.get('diagadas'))
    c.diagasbe = str_to_bool(data.get('diagasbe'))
    c.diagbron = str_to_bool(data.get('diagbron'))
    c.diagchas = str_to_bool(data.get('diagchas'))
    c.diagchro = str_to_bool(data.get('diagchro'))
    c.diagcopd = str_to_bool(data.get('diagcopd'))
    c.diagdiab = str_to_bool(data.get('diagdiab'))
    c.diagemph = str_to_bool(data.get('diagemph'))
    c.diagfibr = str_to_bool(data.get('diagfibr'))
    c.diaghear = str_to_bool(data.get('diaghear'))
    c.diaghype = str_to_bool(data.get('diaghype'))
    c.diagpneu = str_to_bool(data.get('diagpneu'))
    c.diagsarc = str_to_bool(data.get('diagsarc'))
    c.diagsili = str_to_bool(data.get('diagsili'))
    c.diagstro = str_to_bool(data.get('diagstro'))
    c.diagtube = str_to_bool(data.get('diagtube'))
    c.canclung = str_to_bool(data.get('canclung'))

    # imaging data
    from app.models.imaging_data import ImagingData
    if not user.imaging_data:
        user.imaging_data = ImagingData(user_id=user.id)
    i = user.imaging_data
    i.scan_date = data.get('scan_date')

    ct_file = request.files.get('ct_scan_image')
    if ct_file and ct_file.filename:
        ct_filename = f"{user.id}_ct_{ct_file.filename}"
        ct_path = os.path.join('app/static/images', ct_filename)
        ct_file.save(ct_path)
        i.ct_scan_image = ct_filename

    # Update GeneticAlterations
    from app.models.genetic_alterations import GeneticAlterations
    g = GeneticAlterations.query.filter_by(user_id=user.id).first()
    if not g:
        g = GeneticAlterations(user_id=user.id)
        db.session.add(g)

    for field in [
        'EGFR_cna', 'ALK_cna', 'ROS1_cna', 'BRAF_cna', 'MET_cna', 'RET_cna',
        'ERBB2_cna', 'KRAS_cna', 'TP53_cna', 'STK11_cna', 'KEAP1_cna',
        'PIK3CA_cna', 'NRAS_cna', 'NTRK1_cna', 'NTRK2_cna', 'NTRK3_cna', 'CD274_cna'
    ]:
        setattr(g, field, data.get(field))

    # Update HypoxiaScores
    from app.models.hypoxia_scores import HypoxiaScores
    h = HypoxiaScores.query.filter_by(user_id=user.id).first()
    if not h:
        h = HypoxiaScores(user_id=user.id)
        db.session.add(h)

    h.RAGNUM_HYPOXIA_SCORE = data.get('RAGNUM_HYPOXIA_SCORE')
    h.BUFFA_HYPOXIA_SCORE = data.get('BUFFA_HYPOXIA_SCORE')

    # Update AncestryScores
    from app.models.ancestry_scores import AncestryScores
    a = AncestryScores.query.filter_by(user_id=user.id).first()
    if not a:
        a = AncestryScores(user_id=user.id)
        db.session.add(a)

    for field in ['EUR', 'AFR', 'EAS', 'AMR', 'SAS']:
        setattr(a, field, data.get(field))

    # Treatment data
    treatment = TreatmentData.query.filter_by(user_id=user.id).first()

    if treatment:  # إذا كاين سجل علاج موجود حدثه
        treatment.treatment_type = data.get('treatment_type', treatment.treatment_type)
        treatment.agent = data.get('agent', treatment.agent)
        treatment.altered_genes = data.get('altered_genes', treatment.altered_genes)
        treatment.affected_pathways = data.get('affected_pathways', treatment.affected_pathways)
        treatment.date = datetime.utcnow()
    else:
        # إذا ماكانش سجل سابق، أنشئ واحد جديد
        treatment = TreatmentData(
            user_id=user.id,
            treatment_type=data.get('treatment_type'),
            agent=data.get('agent'),
            altered_genes=data.get('altered_genes'),
            affected_pathways=data.get('affected_pathways'),
            date=datetime.utcnow()
        )
        db.session.add(treatment)  

    db.session.commit()


    return jsonify({'message': '✅ Patient modifié avec succès'})


@list_patient_bp.route('/patients/by-doctor/<int:doctor_id>', methods=['GET'])
def get_patients_by_doctor(doctor_id):
    patients = User.query.filter_by(role='patient').all()
    result = []
    for patient in patients:
        if patient.clinical_data and patient.clinical_data.doctor_id == doctor_id:
            doctor = patient.clinical_data.doctor
            doctor_name = f"{doctor.firstName} {doctor.lastName}" if doctor else "Non attribué"
            has_survival_prediction = len(patient.survival_predictions) > 0
            has_treatment_recommendation = len(patient.treatment_data) > 0
            has_lung_cancer_prediction = ResultatPredictionLungCancer.query.filter_by(user_id=patient.id).first() is not None
            result.append({
                'id': patient.id,
                'firstName': patient.firstName,
                'lastName': patient.lastName,
                'email': patient.email,
                'phoneNumber': patient.phoneNumber,
                'city': patient.city,
                'profileImage': patient.profileImage,
                'doctor': doctor_name,
                'has_survival_prediction': has_survival_prediction,
                'has_treatment_recommendation': has_treatment_recommendation,
                'has_lung_cancer_prediction': has_lung_cancer_prediction
                
            })

    return jsonify(result)


@list_patient_bp.route('/patient_dosier/<int:id>', methods=['GET'])
def get_patient_dossier_by_id(id):
    user = User.query.get(id)
    if not user or user.role != 'patient':
        return jsonify({'error': 'Access denied'}), 403


    
    clinical = user.clinical_data
    imaging = user.imaging_data
    treatment = user.treatment_data

    doctor_first_name = ""
    doctor_last_name = ""

    if clinical and clinical.doctor_id:
        doctor = User.query.get(clinical.doctor_id)
        if doctor:
            doctor_first_name = doctor.firstName
            doctor_last_name = doctor.lastName

    genetic = GeneticAlterations.query.filter_by(user_id=user.id).first()
    hypoxia = HypoxiaScores.query.filter_by(user_id=user.id).first()
    ancestry = AncestryScores.query.filter_by(user_id=user.id).first()

    return jsonify({
        'id': user.id,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'email': user.email,
        'password': user.password,
        'phoneNumber': user.phoneNumber,
        'city': user.city,
        'address': user.address,
        'doctor_id': clinical.doctor_id if clinical else None,
        'doctor_name': f"{doctor_first_name} {doctor_last_name}" if doctor_first_name else 'Non attribué',
        'profileImage': f"/static/images/{user.profileImage}" if user.profileImage else '',
        'ct_scan_image': f"/static/images/{imaging.ct_scan_image}" if imaging and imaging.ct_scan_image else '',
        'diagnosed': str_to_bool(clinical.diagnosed) if clinical else '',
        'age': clinical.age if clinical else '',
        'gender': clinical.gender if clinical else '',
        'race': clinical.race if clinical else '',
        'height': clinical.height if clinical else '',
        'weight': clinical.weight if clinical else '',
        'lesionsize': clinical.lesionsize if clinical else '',
        'de_stag': STAGE_7_DICT.get(safe_int(clinical.de_stag), '') if clinical else '',
        'de_stag_7thed': STAGE_7_DICT.get(safe_int(clinical.de_stag_7thed), '') if clinical else '',
        #'histology_cat': str_to_bool(clinical.histology_cat) if clinical else '',


        'histology_cat': clinical.histology_cat if clinical else '',

        'treatlc': str_to_bool(clinical.treatlc) if clinical else '',
        'lung_cancer': str_to_bool(clinical.lung_cancer) if clinical else '',
        'progressed_ever': clinical.progressed_ever if clinical else '',
        'prog_days_1st': clinical.prog_days_1st if clinical else '',
        'candx_days': clinical.candx_days if clinical else '',
        'canc_free_days': clinical.canc_free_days if clinical else '',
        'cigsmok': str_to_bool(clinical.cigsmok) if clinical else '',
        'age_quit': clinical.age_quit if clinical else '',
        'pkyr': clinical.pkyr if clinical else '',
        'smokeyr': clinical.smokeyr if clinical else '',
        'smokeday': clinical.smokeday if clinical else '',
        'diagadas': clinical.diagadas if clinical else '',
        'diagasbe': str_to_bool(clinical.diagasbe) if clinical else '',
        'diagbron': str_to_bool(clinical.diagbron) if clinical else '',
        'diagchas': str_to_bool(clinical.diagchas) if clinical else '',
        'diagchro': str_to_bool(clinical.diagchro) if clinical else '',
        'diagcopd': str_to_bool(clinical.diagcopd) if clinical else '',
        'diagdiab': str_to_bool(clinical.diagdiab) if clinical else '',
        'diagemph': str_to_bool(clinical.diagemph) if clinical else '',
        'diagfibr': str_to_bool(clinical.diagfibr) if clinical else '',
        'diaghear': str_to_bool(clinical.diaghear) if clinical else '',
        'diaghype': str_to_bool(clinical.diaghype) if clinical else '',
        'diagpneu': str_to_bool(clinical.diagpneu) if clinical else '',
        'diagsarc': str_to_bool(clinical.diagsarc) if clinical else '',
        'diagsili': str_to_bool(clinical.diagsili) if clinical else '',
        'diagstro': str_to_bool(clinical.diagstro) if clinical else '',
        'diagtube': str_to_bool(clinical.diagtube) if clinical else '',
        'canclung': str_to_bool(clinical.canclung) if clinical else '',
        'scan_date': imaging.scan_date if imaging else '',
        'ct_scan_image': f"/static/images/{imaging.ct_scan_image}" if imaging and imaging.ct_scan_image else '',

        'genetic_alterations': {
            'EGFR_cna': genetic.EGFR_cna if genetic else None,
            'ALK_cna': genetic.ALK_cna if genetic else None,
            'ROS1_cna': genetic.ROS1_cna if genetic else None,
            'BRAF_cna': genetic.BRAF_cna if genetic else None,
            'MET_cna': genetic.MET_cna if genetic else None,
            'RET_cna': genetic.RET_cna if genetic else None,
            'ERBB2_cna': genetic.ERBB2_cna if genetic else None,
            'KRAS_cna': genetic.KRAS_cna if genetic else None,
            'TP53_cna': genetic.TP53_cna if genetic else None,
            'STK11_cna': genetic.STK11_cna if genetic else None,
            'KEAP1_cna': genetic.KEAP1_cna if genetic else None,
            'PIK3CA_cna': genetic.PIK3CA_cna if genetic else None,
            'NRAS_cna': genetic.NRAS_cna if genetic else None,
            'NTRK1_cna': genetic.NTRK1_cna if genetic else None,
            'NTRK2_cna': genetic.NTRK2_cna if genetic else None,
            'NTRK3_cna': genetic.NTRK3_cna if genetic else None,
            'CD274_cna': genetic.CD274_cna if genetic else None
        },

        'hypoxia_scores': {
            'RAGNUM_HYPOXIA_SCORE': hypoxia.RAGNUM_HYPOXIA_SCORE if hypoxia else None,
            'BUFFA_HYPOXIA_SCORE': hypoxia.BUFFA_HYPOXIA_SCORE if hypoxia else None
        },

        'ancestry_scores': {
            'EUR': ancestry.EUR if ancestry else None,
            'AFR': ancestry.AFR if ancestry else None,
            'EAS': ancestry.EAS if ancestry else None,
            'AMR': ancestry.AMR if ancestry else None,
            'SAS': ancestry.SAS if ancestry else None
        }
    })



@list_patient_bp.route('/patients/eligible-survival/<int:doctor_id>', methods=['GET'])
def get_eligible_patients_for_survival_prediction(doctor_id):
    patients = User.query.filter_by(role='patient').all()
    result = []

    for patient in patients:
        clinical = patient.clinical_data
        if clinical and clinical.doctor_id == doctor_id:
            # Vérifier que les champs nécessaires sont bien remplis
            champs_obligatoires = [
                clinical.age, clinical.gender, clinical.race,
                clinical.height, clinical.weight, clinical.lung_cancer,
                clinical.pkyr, clinical.progressed_ever, clinical.prog_days_1st,
                clinical.canc_free_days, clinical.candx_days
            ]

            champs_valides = all(field is not None for field in champs_obligatoires)

            if champs_valides:
                result.append({
                    'id': patient.id,
                    'firstName': patient.firstName,
                    'lastName': patient.lastName
                })

    return jsonify(result)
