# app/routes/survival_prediction_routes.py

from flask import Blueprint, jsonify, request
from app.models.user import User
from app.models.clinical_data import ClinicalData
from app.models.survival_prediction import SurvivalPrediction
from joblib import load
import numpy as np
from app.extensions import db
import os


import matplotlib
matplotlib.use('Agg')  
import matplotlib.pyplot as plt




survival_bp = Blueprint('survival_prediction', __name__)

import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
MODEL_DIR = os.path.join(BASE_DIR, '..', 'models')


rsf = load(os.path.join(MODEL_DIR, 'rsf_model.joblib'))
coxph = load(os.path.join(MODEL_DIR, 'coxph_model_survival.joblib'))
svm = load(os.path.join(MODEL_DIR, 'svm_model_survival.joblib'))
meta = load(os.path.join(MODEL_DIR, 'meta_rsf_survival.joblib'))
scaler = load(os.path.join(MODEL_DIR, 'scaler_model_survival.joblib'))
def convert_bool_or_str_to_int(val):
    if isinstance(val, str):
        if val.lower() == "true":
            return 1
        elif val.lower() == "false":
            return 0
        try:
            return float(val)
        except:
            return 0
    if isinstance(val, bool):
        return int(val)
    if val is None:
        return 0
    return val
@survival_bp.route('/predict-survival/<int:user_id>', methods=['POST'])

def predict_survival(user_id):
    
    clinical = ClinicalData.query.filter_by(user_id=user_id).first()
    print(f"Fetching clinical data for user_id={user_id}: {clinical}")

    
    if not clinical:
        return jsonify({"error": "No medical data available for this patient."}), 404

    
    raw_data = [
        clinical.age, clinical.gender, clinical.race, clinical.height, clinical.weight,
        clinical.de_stag, clinical.de_stag_7thed, clinical.histology_cat, clinical.lesionsize, clinical.treatlc, clinical.lung_cancer,
        clinical.diagadas, clinical.diagasbe, clinical.diagbron, clinical.diagchas, clinical.diagchro, clinical.diagcopd,
        clinical.diagdiab, clinical.diagemph, clinical.diagfibr, clinical.diaghear, clinical.diaghype, clinical.diagpneu,
        clinical.diagsarc, clinical.diagsili, clinical.diagstro, clinical.diagtube, clinical.canclung,
        clinical.cigsmok, clinical.age_quit, clinical.pkyr, clinical.smokeday, clinical.smokeyr,
        clinical.progressed_ever, clinical.prog_days_1st,
        clinical.canc_free_days, clinical.candx_days
    ]
    print(raw_data)

    
    raw_data_converted = [convert_bool_or_str_to_int(v) for v in raw_data]
    print("Converted clinical data:", raw_data_converted)
    X_raw = np.array(raw_data_converted).reshape(1, -1)
    print("Numpy input array shape:", X_raw.shape)
    print("Numpy input array values:", X_raw)


    
    indices_to_scale = [0, 3, 4, 8, 29, 30, 31, 32, 34, 35, 36]
    X_to_scale = X_raw[:, indices_to_scale]
    X_scaled_values = scaler.transform(X_to_scale)
    X_raw[:, indices_to_scale] = X_scaled_values

    
    pred_rsf = rsf.predict(X_raw)
    pred_coxph = coxph.predict(X_raw)
    pred_svm = svm.predict(X_raw)

    
    stacking_input = np.column_stack((pred_rsf, pred_coxph, pred_svm))
    final_pred = meta.predict(stacking_input)
    surv_funcs = meta.predict_survival_function(stacking_input)
    time_points = np.arange(1, 6 * 365, 365)
    prob_years = [float(fn(t)) for t in time_points for fn in surv_funcs]



    
    plt.figure(figsize=(8, 6))  
    for fn in surv_funcs:
        times = np.linspace(1, 5 * 365, 100)
        probs = fn(times)
        plt.plot(times / 365, probs, label='Survival Function')  

    plt.title(f"Patient Survival Curve {user_id}")
    plt.xlabel("Time (years)")
    plt.ylabel("Probability of survival")
    plt.grid(True)
    plt.ylim(0, 1)
    plt.xlim(0, 5)


    img_dir = os.path.join(BASE_DIR, '..', 'static', 'survival_curves')
    os.makedirs(img_dir, exist_ok=True)
    img_path = os.path.join(img_dir, f'survival_curve_user_{user_id}.png')
    plt.savefig(img_path, dpi=300)  
    plt.close()

    
    prediction = SurvivalPrediction.query.filter_by(user_id=user_id).first()

    if prediction:
    # Update prediction existant
        prediction.year_1_prob = prob_years[0]
        prediction.year_2_prob = prob_years[1]
        prediction.year_3_prob = prob_years[2]
        prediction.year_4_prob = prob_years[3]
        prediction.year_5_prob = prob_years[4]
        prediction.predicted_duration = float(final_pred[0])
    else:
    # Create nouveau prediction
        prediction = SurvivalPrediction(
            user_id=user_id,
            year_1_prob=prob_years[0],
            year_2_prob=prob_years[1],
            year_3_prob=prob_years[2],
            year_4_prob=prob_years[3],
            year_5_prob=prob_years[4],
            predicted_duration=float(final_pred[0])
        )
        db.session.add(prediction)

    db.session.commit()


    return jsonify({
        "message": "Prediction successfully recorded",
        "prediction_id": prediction.id,
        "year_probs": prob_years,
        "predicted_duration": float(final_pred[0]),
        "curve_image": f"/static/survival_curves/survival_curve_user_{user_id}.png"
        
    })


from app.models.notification import Notification
from datetime import datetime

@survival_bp.route('/send-survival-prediction-notification/<int:patient_id>', methods=['POST'])
def send_survival_prediction_notification(patient_id):
    data = request.get_json()
    message = data.get('message', '📈 Résultat de prédiction de survie disponible')
    link = data.get('link', f'/resultat-predection-survival/{patient_id}')

    # Vérifie si une notification de ce type existe déjà
    existing = Notification.query.filter_by(user_id=patient_id, type='survival_prediction').first()

    if existing:
        existing.message = message
        existing.link = link
        existing.is_read = False
        existing.created_at = datetime.utcnow()
    else:
        notification = Notification(
            user_id=patient_id,
            message=message,
            is_read=False,
            link=link,
            created_at=datetime.utcnow(),
            type='survival_prediction'
        )
        db.session.add(notification)

    db.session.commit()
    return jsonify({'message': '✅ Survival notification sent'}), 201

