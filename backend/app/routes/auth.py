# app/routes/auth.py
from flask import Blueprint, request, jsonify
from app.models.user import User
from app.extensions import db
from werkzeug.security import check_password_hash
from flask import current_app
from werkzeug.security import generate_password_hash
from flask_cors import cross_origin
from app.models.treatment_data import TreatmentData
from app.models.survival_prediction import SurvivalPrediction
from app.models.resultat_prediction_lung_cancer import ResultatPredictionLungCancer



auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    user = User.query.filter_by(email=email, role=role).first()

    if not user or user.password != password:
        return jsonify({'error': 'Invalid email or password '}), 401


    profile_image_url = f"http://127.0.0.1:5000/static/images/{user.profileImage}"  # ✅ ضروري


    return jsonify({
        'message': 'Connexion réussie',
        'role': user.role,
        'user': {
            'id': user.id,
            'email': user.email,
            'firstName': user.firstName,
            'lastName': user.lastName,
            'profileImage': profile_image_url,
            'phoneNumber': user.phoneNumber,
        'city': user.city,
        'address': user.address,
        }
    })


@auth_bp.route('/admin/edit-profile', methods=['PUT', 'OPTIONS'])
@cross_origin(origins='http://localhost:4200', methods=['PUT', 'OPTIONS'], headers=['Content-Type'])
def edit_profile():
    if request.method == 'OPTIONS':
        return '', 200

    if request.content_type != 'application/json':
        return jsonify({"error": "Content-Type must be application/json"}), 415

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON data"}), 400

    current_email = data.get('currentEmail')
    if not current_email:
        return jsonify({"error": "currentEmail is required"}), 400

    user = User.query.filter_by(email=current_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.email = data.get('email', user.email)
    user.firstName = data.get('firstName', user.firstName)
    user.lastName = data.get('lastName', user.lastName)
    user.phoneNumber = data.get('phoneNumber', user.phoneNumber)
    user.city = data.get('city', user.city)
    user.address = data.get('address', user.address)

    new_password = data.get('password')
    if new_password:
        user.password = new_password  

    db.session.commit()

    profile_image_url = f"http://127.0.0.1:5000/static/images/{user.profileImage}" if user.profileImage else None

    user_data = {
        'email': user.email,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'phoneNumber': user.phoneNumber,
        'city': user.city,
        'address': user.address,
        'profileImage': profile_image_url
    }

    return jsonify({"message": "Profil mis à jour avec succès", "user": user_data}), 200 

@auth_bp.route('/dashboard-counts', methods=['GET'])
@cross_origin(origins='http://localhost:4200')  
def get_dashboard_counts():
    num_patients = User.query.filter_by(role='patient').count()
    num_medecins = User.query.filter_by(role='medecin').count()
    num_treatments = TreatmentData.query.count()
    num_survivals = SurvivalPrediction.query.count()
    num_predections = ResultatPredictionLungCancer.query.count()

    return jsonify({
        'patients': num_patients,
        'medecins': num_medecins,
        'recommendations': num_treatments,
        'survivals': num_survivals,
        'predection_lung_cancer' : num_predections
    }), 200
