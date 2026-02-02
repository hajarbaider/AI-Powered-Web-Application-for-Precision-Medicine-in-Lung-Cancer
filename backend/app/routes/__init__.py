def register_routes(app):
    from .auth import auth_bp
    from .doctor_routes import doctor_bp 
    from .patient_routes import patient_bp
    from .list_patient_routes import list_patient_bp
    from .survival_prediction_routes import survival_bp
    from .treatment_recommendation_routes import recommend_bp
    from .stats_routes import stats_bp
    from .result_treatment_recommendation_routes import treatment_bp
    from .lung_cancer_prediction import lung_pred_bp 
    from .articles import articles_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(doctor_bp, url_prefix="/api")
    app.register_blueprint(patient_bp, url_prefix='/api')
    app.register_blueprint(list_patient_bp, url_prefix='/api')
    app.register_blueprint(survival_bp, url_prefix="/api") 
    app.register_blueprint(recommend_bp, url_prefix='/api')
    app.register_blueprint(stats_bp)
    app.register_blueprint(treatment_bp)
    app.register_blueprint(lung_pred_bp, url_prefix='/api')
    app.register_blueprint(articles_bp)

