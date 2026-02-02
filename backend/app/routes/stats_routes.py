
from flask import Blueprint, send_file
from app.extensions import db
from app.models.user import User
from app.models.clinical_data import ClinicalData
import matplotlib.pyplot as plt
import io
from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
import matplotlib.cm as cm
import numpy as np
from app.models.notification import Notification
from flask import jsonify


stats_bp = Blueprint('stats_bp', __name__)



@stats_bp.route('/api/patients-per-doctor', methods=['GET'])
def patients_per_doctor_data():
    results = db.session.query(
        User.firstName,
        User.lastName,
        db.func.count(ClinicalData.id)
    ).join(ClinicalData, User.id == ClinicalData.doctor_id) \
     .filter(User.role == 'medecin') \
     .group_by(User.id).all()

    # Convert to JSON-friendly format
    data = []
    for first, last, count in results:
        data.append({
            'doctor': f"{first} {last}",
            'count': count
        })

    return jsonify(data)


@stats_bp.route('/api/gender-distribution')
def gender_distribution_data():
    result = (
        db.session.query(ClinicalData.gender, func.count(User.id))
        .join(User, User.id == ClinicalData.user_id)
        .filter(User.role == 'patient')
        .group_by(ClinicalData.gender)
        .all()
    )

    labels_map = {'1': 'Male', '2': 'Female'}
    labels = [labels_map.get(str(row[0]), 'Inconnu') for row in result]
    counts = [row[1] for row in result]
    colors_map = {'1': '#87CEEB', '2': '#FFC0CB'}
    colors = [colors_map.get(str(row[0]), '#808080') for row in result]

    return jsonify({
        'labels': labels,
        'data': counts,
        'colors': colors
    })



from app.models.notification import Notification
from app.models.clinical_data import ClinicalData
from app.models.user import User  # assuming you have User model
@stats_bp.route('/api/notifications-per-doctor', methods=['GET'])
def notifications_per_doctor():
    # Step 1: جيب جميع doctor_ids من clinical_data
    doctor_patient_pairs = db.session.query(ClinicalData.doctor_id, ClinicalData.user_id).all()

    # نبني dict: { doctor_id: [user_ids...] }
    doctor_to_patients = {}
    for doctor_id, user_id in doctor_patient_pairs:
        doctor_to_patients.setdefault(doctor_id, []).append(user_id)

    # Step 2: حساب عدد الإشعارات لكل طبيب
    result = []
    for doctor_id, patient_ids in doctor_to_patients.items():
        count = Notification.query.filter(Notification.user_id.in_(patient_ids)).count()

        # optional: جيب اسم الطبيب
        doctor = User.query.get(doctor_id)
        doctor_name = f"{doctor.firstName} {doctor.lastName}" if doctor else f"Doctor {doctor_id}"

        result.append({
            "doctor_id": doctor_id,
            "doctor": doctor_name,
            "notification_count": count
        })

    return jsonify(result), 200
