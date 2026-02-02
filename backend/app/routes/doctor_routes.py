# routes/doctor_routes.py
from flask import Blueprint, jsonify
from app.models.user import User  
from app.extensions import db
from flask import request
from datetime import datetime
import os
from app import db
from app.models.resultat_prediction_lung_cancer import ResultatPredictionLungCancer
import matplotlib.pyplot as plt

import io
from flask import send_file
from app.models.clinical_data import ClinicalData
from app.models.survival_prediction import SurvivalPrediction
from app.models.treatment_data import TreatmentData
from app.models.resultat_prediction_lung_cancer import ResultatPredictionLungCancer

import io
import matplotlib.pyplot as plt
from flask import send_file
from app.models.treatment_data import TreatmentData


doctor_bp = Blueprint('doctor_bp', __name__)

@doctor_bp.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = User.query.filter_by(role='medecin').all()
    result = [{
        'id': doctor.id,
        'firstName': doctor.firstName,
        'lastName': doctor.lastName,
        'email': doctor.email,
        'phoneNumber': doctor.phoneNumber,
        'city': doctor.city,
        'profileImage': doctor.profileImage,
        'address' : doctor.address,
    } for doctor in doctors]
    return jsonify(result), 200

@doctor_bp.route('/admin-add-doctor', methods=['POST'])
def add_doctor():
    data = request.form
    image = request.files.get('profileImage')

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email address already used'}), 400

    
    filename = None
    if image:
        
        upload_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'images'))
    
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        
        filename = f"doctor_{datetime.utcnow().timestamp()}_{image.filename}"

        image.save(os.path.join(upload_folder, filename))



    new_doctor = User(
        firstName=data.get('firstName'),
        lastName=data.get('lastName'),
        email=data.get('email'),
        password=data.get('password'),
        phoneNumber=data.get('phoneNumber'),
        city=data.get('city'),
        address=data.get('address'),
        
        role='medecin',
        profileImage=filename
    )
    db.session.add(new_doctor)
    db.session.commit()

    return jsonify({'message': '✅ Doctor added successfully '}), 201
@doctor_bp.route('/doctors/<int:id>', methods=['DELETE'])
def delete_doctor(id):
    doctor = User.query.filter_by(id=id, role='medecin').first()
    if not doctor:
        return jsonify({'error': '❌ Doctor not found'}), 404
    
    try:
        #  
        if doctor.profileImage:
            upload_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'images'))
            image_path = os.path.join(upload_folder, doctor.profileImage)
            if os.path.exists(image_path):
                os.remove(image_path)

        db.session.delete(doctor)
        db.session.commit()
        return jsonify({'message': '✅ Doctor deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': '❌ Error while deleting', 'details': str(e)}), 500
@doctor_bp.route('/admin-edit-doctor/<int:id>', methods=['PUT'])
def edit_doctor(id):
    doctor = User.query.filter_by(id=id, role='medecin').first()
    if not doctor:
        return jsonify({'error': 'Doctor not found'}), 404

    data = request.form
    image = request.files.get('profileImage')

    if image:
        # Supprimer l'ancienne image
        if doctor.profileImage:
            upload_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'images'))
            old_image_path = os.path.join(upload_folder, doctor.profileImage)
            if os.path.exists(old_image_path):
                os.remove(old_image_path)

        # Sauvegarder la nouvelle image
        filename = f"doctor_{datetime.utcnow().timestamp()}_{image.filename}"
        upload_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'images'))
        image.save(os.path.join(upload_folder, filename))
        doctor.profileImage = filename

    # Modifier les infos
    doctor.firstName = data.get('firstName')
    doctor.lastName = data.get('lastName')
    doctor.email = data.get('email')
    doctor.phoneNumber = data.get('phoneNumber')
    doctor.city = data.get('city')
    doctor.address = data.get('address')
    
    if data.get('password'):  # Only if new password provided
        doctor.password = data.get('password')

    db.session.commit()
    return jsonify({'message': 'Doctor updated successfully'}), 200


@doctor_bp.route('/medecin-dashboard-stats/<int:medecin_id>', methods=['GET'])
def medecin_dashboard_stats(medecin_id):
    from app.models.clinical_data import ClinicalData
    from app.models.treatment_data import TreatmentData
    from app.models.survival_prediction import SurvivalPrediction
    from app.models.resultat_prediction_lung_cancer import ResultatPredictionLungCancer

    try:
        
        patients = ClinicalData.query.filter_by(doctor_id=medecin_id).all()
        patient_user_ids = [p.user_id for p in patients]

        num_patients = len(patient_user_ids)

        
        num_treatments = TreatmentData.query.filter(TreatmentData.user_id.in_(patient_user_ids)).count()

        
        num_survivals = SurvivalPrediction.query.filter(SurvivalPrediction.user_id.in_(patient_user_ids)).count()

        num_lung_predictions = ResultatPredictionLungCancer.query.filter(
            ResultatPredictionLungCancer.user_id.in_(patient_user_ids)
        ).count()

        return jsonify({
            'numberOfPatients': num_patients,
            'numberOfTreatmentsMade': num_treatments,
            'numberOfSurvivalPredictions': num_survivals,
            'numberOfLungCancerPredictions': num_lung_predictions 
        }), 200

    except Exception as e:
        print("❌ Erreur:", str(e))
        return jsonify({'error': str(e)}), 500





@doctor_bp.route('/lung-cancer-prediction-stats-image', methods=['GET'])
def lung_cancer_prediction_stats_image():
    
    results = ResultatPredictionLungCancer.query.all()

    
    malignant_count = sum(1 for r in results if r.predicted_class == 'malignant')
    benign_count = sum(1 for r in results if r.predicted_class == 'benign')

    labels = ['Malignant', 'Benign']
    sizes = [malignant_count, benign_count]

    
    fig, ax = plt.subplots()
    ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=['#FFA490', '#3498db'])
    plt.title('Lung Cancer Prediction Distribution')
    ax.axis('equal')  
    
    plt.legend(labels, loc='upper right')
    
    img = io.BytesIO()
    plt.savefig(img, format='png')
    plt.close(fig)
    img.seek(0)

    
    return send_file(img, mimetype='image/png')













# routes/doctor_routes.py
from flask import Blueprint, jsonify
from app.models.user import User  # path kifach 3andk
from app.extensions import db
from flask import request
from datetime import datetime
import os
from app import db
from app.models.resultat_prediction_lung_cancer import ResultatPredictionLungCancer
import matplotlib.pyplot as plt

import io
from flask import send_file




doctor_bp = Blueprint('doctor_bp', __name__)

@doctor_bp.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = User.query.filter_by(role='medecin').all()
    result = [{
        'id': doctor.id,
        'firstName': doctor.firstName,
        'lastName': doctor.lastName,
        'email': doctor.email,
        'phoneNumber': doctor.phoneNumber,
        'city': doctor.city,
        'profileImage': doctor.profileImage,
        'address' : doctor.address,
    } for doctor in doctors]
    return jsonify(result), 200

@doctor_bp.route('/admin-add-doctor', methods=['POST'])
def add_doctor():
    data = request.form
    image = request.files.get('profileImage')

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already in use'}), 400

    
    filename = None
    if image:
        
        upload_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'images'))
        
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        
        filename = f"doctor_{datetime.utcnow().timestamp()}_{image.filename}"
        
        image.save(os.path.join(upload_folder, filename))



    new_doctor = User(
        firstName=data.get('firstName'),
        lastName=data.get('lastName'),
        email=data.get('email'),
        password=data.get('password'),
        phoneNumber=data.get('phoneNumber'),
        city=data.get('city'),
        address=data.get('address'),
        role='medecin',
        profileImage=filename
    )
    db.session.add(new_doctor)
    db.session.commit()

    return jsonify({'message': 'Doctor added successfully'}), 201
@doctor_bp.route('/doctors/<int:id>', methods=['DELETE'])
def delete_doctor(id):
    doctor = User.query.filter_by(id=id, role='medecin').first()
    if not doctor:
        return jsonify({'error': 'Doctor not found'}), 404
    
    try:
        
        if doctor.profileImage:
            upload_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'images'))
            image_path = os.path.join(upload_folder, doctor.profileImage)
            if os.path.exists(image_path):
                os.remove(image_path)

        db.session.delete(doctor)
        db.session.commit()
        return jsonify({'message': 'Doctor deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erreur lors de la suppression', 'details': str(e)}), 500
@doctor_bp.route('/admin-edit-doctor/<int:id>', methods=['PUT'])
def edit_doctor(id):
    doctor = User.query.filter_by(id=id, role='medecin').first()
    if not doctor:
        return jsonify({'error': 'Doctor not found'}), 404

    data = request.form
    image = request.files.get('profileImage')

    if image:
        # Supprimer l'ancienne image
        if doctor.profileImage:
            upload_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'images'))
            old_image_path = os.path.join(upload_folder, doctor.profileImage)
            if os.path.exists(old_image_path):
                os.remove(old_image_path)

        # Sauvegarder la nouvelle image
        filename = f"doctor_{datetime.utcnow().timestamp()}_{image.filename}"
        upload_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'images'))
        image.save(os.path.join(upload_folder, filename))
        doctor.profileImage = filename

    # Modifier les infos
    doctor.firstName = data.get('firstName')
    doctor.lastName = data.get('lastName')
    doctor.email = data.get('email')
    doctor.phoneNumber = data.get('phoneNumber')
    doctor.city = data.get('city')
    doctor.address = data.get('address')
    
    if data.get('password'):  # Only if new password provided
        doctor.password = data.get('password')

    db.session.commit()
    return jsonify({'message': 'Doctor updated successfully'}), 200


@doctor_bp.route('/medecin-dashboard-stats/<int:medecin_id>', methods=['GET'])
def medecin_dashboard_stats(medecin_id):
    from app.models.clinical_data import ClinicalData
    from app.models.treatment_data import TreatmentData
    from app.models.survival_prediction import SurvivalPrediction
    from app.models.resultat_prediction_lung_cancer import ResultatPredictionLungCancer

    try:
        
        patients = ClinicalData.query.filter_by(doctor_id=medecin_id).all()
        patient_user_ids = [p.user_id for p in patients]

        num_patients = len(patient_user_ids)

        
        num_treatments = TreatmentData.query.filter(TreatmentData.user_id.in_(patient_user_ids)).count()

        
        num_survivals = SurvivalPrediction.query.filter(SurvivalPrediction.user_id.in_(patient_user_ids)).count()

        
        num_lung_predictions = ResultatPredictionLungCancer.query.filter(
            ResultatPredictionLungCancer.user_id.in_(patient_user_ids)
        ).count()

        return jsonify({
            'numberOfPatients': num_patients,
            'numberOfTreatmentsMade': num_treatments,
            'numberOfSurvivalPredictions': num_survivals,
            'numberOfLungCancerPredictions': num_lung_predictions 
        }), 200

    except Exception as e:
        print("❌ Erreur:", str(e))
        return jsonify({'error': str(e)}), 500





@doctor_bp.route('/lung-cancer-prediction-stats-image', methods=['GET'])
def lung_cancer_prediction_stats_image():
    
    results = ResultatPredictionLungCancer.query.all()

    
    malignant_count = sum(1 for r in results if r.predicted_class == 'malignant')
    benign_count = sum(1 for r in results if r.predicted_class == 'benign')

    labels = ['Malignant', 'Benign']
    sizes = [malignant_count, benign_count]

    fig, ax = plt.subplots()
    ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=['#FFA490', '#3498db'])
    plt.title('Lung Cancer Prediction Distribution')
    ax.axis('equal')  
    
    plt.legend(labels, loc='upper right')
    
    img = io.BytesIO()
    plt.savefig(img, format='png')
    plt.close(fig)
    img.seek(0)


    return send_file(img, mimetype='image/png')

@doctor_bp.route('/lung-cancer-prediction-stats-json/<int:medecin_id>', methods=['GET'])
def lung_cancer_prediction_stats_json(medecin_id):
    
    patients = ClinicalData.query.filter_by(doctor_id=medecin_id).all()
    patient_user_ids = [p.user_id for p in patients]

    if not patient_user_ids:
        return jsonify({'Malignant': 0, 'Benign': 0})

    
    results = ResultatPredictionLungCancer.query.filter(
        ResultatPredictionLungCancer.user_id.in_(patient_user_ids)
    ).all()

    malignant_count = sum(1 for r in results if r.predicted_class == 'malignant')
    benign_count = sum(1 for r in results if r.predicted_class == 'benign')

    return jsonify({
        'Malignant': malignant_count,
        'Benign': benign_count
    })










@doctor_bp.route('/doctor/predicted-patients', methods=['GET'])
def get_predicted_patients_for_doctor():
    # بدل current_user_id بقيمة ثابتة ديال الطبيب (مثلا id=48)
    current_user_id = 48  # هنا كتب id ديال الطبيب اللي بغيت تختبر به

    clinical_data_list = ClinicalData.query.filter_by(doctor_id=current_user_id).all()
    response = []

    for clinical in clinical_data_list:
        patient = User.query.get(clinical.user_id)

        lung_pred = ResultatPredictionLungCancer.query.filter_by(user_id=patient.id)\
            .order_by(ResultatPredictionLungCancer.prediction_date.desc()).first()
        lung_result = lung_pred.predicted_class if lung_pred else "_"

        survival_pred = SurvivalPrediction.query.filter_by(user_id=patient.id)\
            .order_by(SurvivalPrediction.id.desc()).first()
        survie = f"{round(survival_pred.predicted_duration / 365, 1)} ans" if survival_pred else "_"


        traitement = TreatmentData.query.filter_by(user_id=patient.id)\
            .order_by(TreatmentData.date.desc()).first()
        traitement_type = f"{traitement.treatment_type}" if traitement else "_"
        traitement_agent = f"{traitement.agent}" if traitement else "_"


        response.append({
            "id": patient.id,
            "nom": f"{patient.firstName} {patient.lastName}",
            "resultat_cancer": lung_result,
            "survie": survie,
            "traitement": traitement_type,
            "agent" : traitement_agent

        })

    return jsonify(response)







@doctor_bp.route('/treatment-stats-image', methods=['GET'])
def treatment_stats_image():
    
    treatments = TreatmentData.query.all()

    
    treatment_types_counts = {}
    agent_counts = {}

    for t in treatments:
        
        if t.treatment_type:
            treatment_types_counts[t.treatment_type] = treatment_types_counts.get(t.treatment_type, 0) + 1
        
        
        if t.agent:
            agent_counts[t.agent] = agent_counts.get(t.agent, 0) + 1

    
    labels = list(treatment_types_counts.keys())
    sizes = list(treatment_types_counts.values())

    fig, ax = plt.subplots(figsize=(6,6))
    ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90)
    ax.axis('equal')  

    plt.title('Treatment Types Distribution')

    
    img = io.BytesIO()
    plt.savefig(img, format='png')
    plt.close(fig)
    img.seek(0)

    return send_file(img, mimetype='image/png')

@doctor_bp.route('/treatment-stats-json/<int:medecin_id>', methods=['GET'])
def treatment_stats_json_by_medecin(medecin_id):
    
    patients = ClinicalData.query.filter_by(doctor_id=medecin_id).all()
    patient_user_ids = [p.user_id for p in patients]

    if not patient_user_ids:
        return jsonify({})

    treatments = TreatmentData.query.filter(TreatmentData.user_id.in_(patient_user_ids)).all()

    treatment_types_counts = {}
    for t in treatments:
        if t.treatment_type:
            treatment_types_counts[t.treatment_type] = treatment_types_counts.get(t.treatment_type, 0) + 1

    return jsonify(treatment_types_counts)







@doctor_bp.route('/agent-stats-image', methods=['GET'])
def agent_stats_image():
    treatments = TreatmentData.query.all()

    agent_counts = {}
    for t in treatments:
        if t.agent:
            agent_counts[t.agent] = agent_counts.get(t.agent, 0) + 1

    labels = list(agent_counts.keys())
    counts = list(agent_counts.values())

    fig, ax = plt.subplots(figsize=(8,5))
    ax.bar(labels, counts, color='skyblue')
    plt.xticks(rotation=45, ha='right')
    plt.title('Agent Usage Distribution')
    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format='png')
    plt.close(fig)
    img.seek(0)

    return send_file(img, mimetype='image/png')


@doctor_bp.route('/agent-stats-json/<int:medecin_id>', methods=['GET'])
def agent_stats_json_by_medecin(medecin_id):

    patients = ClinicalData.query.filter_by(doctor_id=medecin_id).all()
    patient_user_ids = [p.user_id for p in patients]

    if not patient_user_ids:
        return jsonify({})

    
    treatments = TreatmentData.query.filter(TreatmentData.user_id.in_(patient_user_ids)).all()

    agent_counts = {}
    for t in treatments:
        if t.agent:
            agent_counts[t.agent] = agent_counts.get(t.agent, 0) + 1

    return jsonify(agent_counts)















import matplotlib.pyplot as plt
import io
from flask import send_file
from app.models.survival_prediction import SurvivalPrediction


@doctor_bp.route('/survival-stats', methods=['GET'])
def survival_stats_image():
    survivals = SurvivalPrediction.query.all()

    if not survivals:
        return "No survival data found", 404

    
    durations = [s.predicted_duration for s in survivals if s.predicted_duration is not None]

    
    year_probs = {
        "Year 1": [s.year_1_prob for s in survivals if s.year_1_prob is not None],
        "Year 2": [s.year_2_prob for s in survivals if s.year_2_prob is not None],
        "Year 3": [s.year_3_prob for s in survivals if s.year_3_prob is not None],
        "Year 4": [s.year_4_prob for s in survivals if s.year_4_prob is not None],
        "Year 5": [s.year_5_prob for s in survivals if s.year_5_prob is not None],
    }

    
    avg_years = [sum(v)/len(v) if len(v) > 0 else 0 for v in year_probs.values()]
    year_labels = list(year_probs.keys())

    
    fig, axs = plt.subplots(2, 1, figsize=(8, 8))

    # 1. Histogram for predicted duration
    axs[0].hist(durations, bins=10, color='#2ecc71', edgecolor='black')
    axs[0].set_title('Distribution of Predicted Survival Duration (Years)')
    axs[0].set_xlabel('Years')
    axs[0].set_ylabel('Number of Patients')

    # 2. Line chart for average year probabilities
    axs[1].plot(year_labels, avg_years, marker='o', linestyle='-', color='#3498db')
    axs[1].set_title('Average Yearly Survival Probabilities')
    axs[1].set_ylabel('Probability')
    axs[1].set_ylim(0, 1)

    plt.tight_layout()

    # convert l'image
    img = io.BytesIO()
    plt.savefig(img, format='png')
    plt.close(fig)
    img.seek(0)

    return send_file(img, mimetype='image/png')     
    
from flask import jsonify

@doctor_bp.route('/survival-stats-json/<int:medecin_id>', methods=['GET'])
def survival_stats_json_by_medecin(medecin_id):
    
    patients = ClinicalData.query.filter_by(doctor_id=medecin_id).all()
    patient_user_ids = [p.user_id for p in patients]

    if not patient_user_ids:
        return jsonify({'error': 'No patients found for this doctor'}), 404

    
    survivals = SurvivalPrediction.query.filter(SurvivalPrediction.user_id.in_(patient_user_ids)).all()

    if not survivals:
        return jsonify({'error': 'No survival data found for this doctor'}), 404

    
    durations = [s.predicted_duration for s in survivals if s.predicted_duration is not None]

    year_probs = {
        "Year 1": [s.year_1_prob for s in survivals if s.year_1_prob is not None],
        "Year 2": [s.year_2_prob for s in survivals if s.year_2_prob is not None],
        "Year 3": [s.year_3_prob for s in survivals if s.year_3_prob is not None],
        "Year 4": [s.year_4_prob for s in survivals if s.year_4_prob is not None],
        "Year 5": [s.year_5_prob for s in survivals if s.year_5_prob is not None],
    }

    avg_years = {k: (sum(v) / len(v) if len(v) > 0 else 0) for k, v in year_probs.items()}

    return jsonify({
        'durations': durations,
        'avg_year_probs': avg_years
    })
