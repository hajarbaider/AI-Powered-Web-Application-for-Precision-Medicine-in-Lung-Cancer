from flask import Flask
from .config import Config
from .extensions import db, migrate, cors, jwt
from .models.user import User
from .models.clinical_data import ClinicalData
from .models.imaging_data import ImagingData
from .models.treatment_data import TreatmentData
from .models.survival_prediction import SurvivalPrediction
from .models.genetic_alterations import GeneticAlterations
from .models.hypoxia_scores import HypoxiaScores
from .models.ancestry_scores import AncestryScores
#from .models.treatment_recommendation import TreatmentRecommendation




from .routes import register_routes





def create_app():
    app = Flask(__name__, static_url_path='/static', static_folder='static')
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/*": {"origins": "http://localhost:4200"}},
              methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
              allow_headers=["Content-Type", "Authorization"])

    jwt.init_app(app)

    from .routes import register_routes
    register_routes(app)

    return app
