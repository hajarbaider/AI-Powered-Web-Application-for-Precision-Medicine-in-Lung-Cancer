# routes/result_treatment_recommendation_routes.py
from flask import Blueprint, jsonify
from app.models.treatment_data import TreatmentData
from app.extensions import db


treatment_bp = Blueprint('treatment_bp', __name__)

@treatment_bp.route('/api/get_recommended_treatment/<int:user_id>', methods=['GET'])
def get_recommended_treatment(user_id):
    treatments = TreatmentData.query.filter_by(user_id=user_id).all()

    if not treatments:
        return jsonify({'message': 'No recommendation found'}), 404


    result = []
    for t in treatments:
        result.append({
            'id': t.id,
            'treatment_type': t.treatment_type,
            'agent': t.agent,
            'altered_genes': t.altered_genes.split(',') if t.altered_genes else [],
            'affected_pathways': t.affected_pathways.split(',') if t.affected_pathways else [],
            'date': t.date.strftime('%Y-%m-%d')
        })

    return jsonify(result)



# ✅ routes/result_treatment_recommendation_routes.py
from flask import request, jsonify
from datetime import datetime
from app.models.notification import Notification
from app.extensions import db

@treatment_bp.route('/api/send-treatment-recommendation-notification/<int:patient_id>', methods=['POST'])

def send_treatment_recommendation_notification(patient_id):
    data = request.get_json()
    message = data.get('message', '📋 New treatment recommendation')

    link = data.get('link', f'/resultat-recomandation-traitement/{patient_id}')

    existing = Notification.query.filter_by(user_id=patient_id, type='treatment_recommendation').first()

    if existing:
        existing.message = message
        existing.is_read = False
        existing.link = link
        existing.created_at = datetime.utcnow()
    else:
        notification = Notification(
            user_id=patient_id,
            message=message,
            is_read=False,
            link=link,
            created_at=datetime.utcnow(),
            type='treatment_recommendation'
        )
        db.session.add(notification)

    db.session.commit()
    return jsonify({'message': '✅ Recommendation notification sent'}), 201

