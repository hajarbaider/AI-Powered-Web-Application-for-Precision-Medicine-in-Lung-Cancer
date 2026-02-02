from flask import Blueprint, jsonify
from app.models.user import User
from app.models.imaging_data import ImagingData
from app.models.resultat_prediction_lung_cancer import ResultatPredictionLungCancer
from app.extensions import db
import torch
from torch import nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
import os


lung_pred_bp = Blueprint('lung_prediction', __name__)

#Define the VGG19 model architecture used during training
class Vgg16FineTuner(nn.Module):
    def __init__(self):
        super(Vgg16FineTuner, self).__init__()
        vgg16 = models.vgg16(weights=None)


        # Freeze convolutional layers
        for param in vgg16.features.parameters():
            param.requires_grad = False

        # Replace final classification layer
        vgg16.classifier[6] = nn.Linear(in_features=4096, out_features=2)

        self.vgg16 = vgg16
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        x = self.vgg16(x)
        x = self.softmax(x)
        return x

#  Build model and load weights
model = Vgg16FineTuner()
#model.load_state_dict(torch.load("app/models/model_VGG19_HB_data_kaggle2.pth", map_location=torch.device('cpu')))
model.load_state_dict(torch.load("app/models/model_VGG16_HB_data_kaggle3_removing_class begnin.pth", map_location=torch.device('cpu')))
model.eval()

#class names (adjust if needed)
class_names = ['malignant', 'benign']

@lung_pred_bp.route("/predict-lung-cancer/<int:user_id>", methods=["POST"])
def predict_lung_cancer(user_id):
    print(f"DEBUG: predict_lung_cancer called for user_id={user_id}")
    
    user = User.query.get(user_id)
    print("USER:", user)
    print("USER ImagingData:", user.imaging_data)
    if not user or not user.imaging_data:

        return jsonify({"error": "❌ Patient or image not found"}), 404


    img_path = os.path.join("app","static", "images", user.imaging_data.ct_scan_image)
    print("🖼️ Image path:", img_path)
    if not os.path.exists(img_path):
        return jsonify({"error": "❌ CT Scan image not found"}), 404


    # Load and preprocess image
    img = Image.open(img_path).convert("RGB")
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])
    img_tensor = transform(img).unsqueeze(0)

    # Device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    img_tensor = img_tensor.to(device)

    # Predict
    with torch.no_grad():
        outputs = model(img_tensor)
        probabilities = outputs.cpu().numpy()[0]
        predicted_class_index = np.argmax(probabilities)
        predicted_class = class_names[predicted_class_index]

    # Save result in DB
    existing_result = ResultatPredictionLungCancer.query.filter_by(user_id=user_id).first()
    if not existing_result:
        result = ResultatPredictionLungCancer(user_id=user_id)
        db.session.add(result)
    else:
        result = existing_result

    result.predicted_class = predicted_class
    result.probabilities = ','.join([f"{p:.4f}" for p in probabilities])
    
    # Important : sauvegarder le chemin relatif sans "app/" pour que le front puisse accéder à l'image
    relative_img_path = os.path.relpath(img_path, "app").replace(os.sep, "/")  # ex: static/images/39_ct_cancer.jpg
    result.image_path = relative_img_path
    db.session.commit()

    return jsonify({
        "message": "✅ Prédiction enregistrée",
        "predicted_class": predicted_class,
        "probabilities": probabilities.tolist(),
        "image": f"/{relative_img_path}" 
    })


from flask import request, jsonify
from app.models.notification import Notification
from app.extensions import db
from datetime import datetime

@lung_pred_bp.route('/send-notification/<int:patient_id>', methods=['POST'])
def send_notification(patient_id):
    data = request.get_json()
    message = data.get('message')
    link = data.get('link')

    if not message:
        return jsonify({'error': 'Message vide'}), 400

    # chercher si notification existe déjà pour ce patient
    existing = Notification.query.filter_by(user_id=patient_id, type='lung_cancer').first()

    if existing:
        # mettre à jour l'ancienne notification
        existing.message = message
        existing.is_read = False
        existing.link = link or existing.link
        existing.created_at = datetime.utcnow()  # mise à jour du timestamp
    else:
        # créer une nouvelle notification
        notification = Notification(
            user_id=patient_id,
            message=message,
            is_read=False,
            link=f'/resultat-prediction-lung-cancer/{patient_id}', 
            created_at=datetime.utcnow(),
            type='lung_cancer'
        )
        db.session.add(notification)

    db.session.commit()
    return jsonify({'message': '✅ Notification saved or updated'}), 201




@lung_pred_bp.route('/get-notifications/<int:user_id>', methods=['GET'])
def get_notifications(user_id):
    from app.models.notification import Notification
    notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    return jsonify([n.to_dict() for n in notifications])



@lung_pred_bp.route('/mark-notification-read/<int:notif_id>', methods=['PATCH'])
def mark_notification_read(notif_id):
    notif = Notification.query.get(notif_id)
    if not notif:
        return jsonify({'error': 'Notification not found'}), 404
    notif.is_read = True
    db.session.commit()   
    print(f'✅ Notification {notif_id} marked as read') 
    return jsonify({'message': 'marked as read'})



@lung_pred_bp.route('/get-lung-cancer-prediction/<int:user_id>', methods=['GET'])
def get_lung_cancer_prediction(user_id):
    result = ResultatPredictionLungCancer.query.filter_by(user_id=user_id).order_by(ResultatPredictionLungCancer.prediction_date.desc()).first()
    if not result:
        return jsonify({"error": "No prediction found for this user"}), 404

    
    probabilities = [float(p) for p in result.probabilities.split(',')]

    return jsonify({
        "predicted_class": result.predicted_class,
        "probabilities": probabilities,
        "prediction_date": result.prediction_date.isoformat(),
        "image": f"/{result.image_path}"
    })
