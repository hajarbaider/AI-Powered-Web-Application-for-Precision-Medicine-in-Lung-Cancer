from flask import Blueprint, jsonify
from app.models.user import User
from app.models.clinical_data import ClinicalData
from app.models.genetic_alterations import GeneticAlterations
from app.models.hypoxia_scores import HypoxiaScores
from app.models.ancestry_scores import AncestryScores
from app.models.treatment_data import TreatmentData
from joblib import load
import numpy as np
import os
from app.extensions import db
from datetime import datetime

recommend_bp = Blueprint('treatment_recommendation', __name__)
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

model_type = load(os.path.join(MODEL_DIR, 'LGBMClassifier_recomandation_type_tretment2.joblib'))
model_agent = load(os.path.join(MODEL_DIR, 'random_forest_recomandation_AGENT_tretment3.joblib'))


# ✅ Mapping des gènes vers les pathways
gene_to_pathways = {
    "EGFR": ["EGFR signaling", "PI3K-Akt"],
    "TP53": ["p53 signaling", "Apoptosis"],
    "KRAS": ["MAPK signaling", "RAS signaling"],
    "PIK3CA": ["PI3K-Akt signaling"],
    "ALK": ["ALK fusion signaling"],
    "BRAF": ["MAPK signaling"],
    "CD274": ["PD-1 checkpoint", "Immune system"],
    "ERBB2": ["ERBB2 signaling"],
    "RET": ["RET signaling"],
    "ROS1": ["ROS1 signaling"],
    "NTRK1": ["Neurotrophin signaling"],
    "NTRK2": ["Neurotrophin signaling"],
    "NTRK3": ["Neurotrophin signaling"],
    "KEAP1": ["Nrf2 pathway"],
    "MET": ["MET signaling"],
    "STK11": ["AMPK", "mTOR"],
    "NRAS": ["RAS signaling"]
}

def get_pathways(genes):
    pathways = []
    for gene in genes:
        if gene in gene_to_pathways:
            pathways += gene_to_pathways[gene]
    return list(set(pathways))  # supprimer les doublons


@recommend_bp.route('/recommend-treatment/<int:user_id>', methods=['POST'])
def recommend_treatment(user_id):
    user = User.query.get(user_id)
    clinical = user.clinical_data
    genetic = user.genetic_data
    hypoxia = user.hypoxia_scores
    ancestry = user.ancestry_scores

    if not (user and clinical and genetic and hypoxia and ancestry):
        return jsonify({"error": "❌ Données manquantes"}), 400

    # 1. Préparer les features pour model_type
    # 1. Préparer les features pour model_type avec cast to numeric
    features_type = [
        int(clinical.age), 
        int(clinical.gender), 
        int(clinical.de_stag_7thed), 
        int(clinical.radiation_therapy),
        float(hypoxia.RAGNUM_HYPOXIA_SCORE), 
        float(hypoxia.BUFFA_HYPOXIA_SCORE),

        int(genetic.EGFR_cna), int(genetic.ALK_cna), int(genetic.ROS1_cna), int(genetic.BRAF_cna),
    int(genetic.MET_cna), int(genetic.RET_cna), int(genetic.ERBB2_cna), int(genetic.KRAS_cna),
    int(genetic.TP53_cna), int(genetic.STK11_cna), int(genetic.KEAP1_cna), int(genetic.PIK3CA_cna),
    int(genetic.NRAS_cna), int(genetic.NTRK1_cna), int(genetic.NTRK2_cna), int(genetic.NTRK3_cna),
    int(genetic.CD274_cna),
    float(ancestry.EUR), float(ancestry.AFR), float(ancestry.EAS), float(ancestry.AMR), float(ancestry.SAS),
    int(clinical.histology_cat)
]

    X_type = np.array(features_type).reshape(1, -1)

    # 2. Prediction de traitement_type
    pred_type = model_type.predict(X_type)[0]

    # 3. Ajouter treatment_type au features pour model_agent
    features_agent = features_type.copy()
    features_agent.insert(6, pred_type)  # position TREATMENT_TYPE si nécessaire
    X_agent = np.array(features_agent).reshape(1, -1)

    # 4. Prediction de l'agent
    pred_agent = model_agent.predict(X_agent)[0]

    pred_type = int(pred_type)
    pred_agent = int(pred_agent)


     # 5. Extraire les gènes modifiés
    altered_gene_list = [
        gene.replace("_cna", "")
        for gene, val in vars(genetic).items()
        if gene.endswith("_cna") and val != 0
]
    altered_genes = altered_gene_list
    # 6. Pathways (just placeholder for now)
    affected_pathways = get_pathways(altered_gene_list) # Tu peux le générer dynamiquement plus tard

    # 7. Stocker dans `TreatmentData`
    tdata = TreatmentData.query.filter_by(user_id=user_id).first()
    if not tdata:
        tdata = TreatmentData(user_id=user_id)


    tdata.treatment_type = pred_type
    tdata.agent = pred_agent
    tdata.altered_genes = ','.join([str(g) for g in altered_genes])
    tdata.affected_pathways = ','.join([str(p) for p in affected_pathways])
    tdata.date = datetime.utcnow()
    
    print("Sauvegarde en base : altered_genes =", tdata.altered_genes)
    print("Sauvegarde en base : affected_pathways =", tdata.affected_pathways)
 


    db.session.add(tdata)
    db.session.commit()

    return jsonify({
    "message": "✅ Recommandation sauvegardée",
    "treatment_type": pred_type,
    "agent": pred_agent,
    "altered_genes": altered_genes if isinstance(altered_genes, list) else altered_genes.split(','),
    "affected_pathways": affected_pathways if isinstance(affected_pathways, list) else affected_pathways.split(',')
})

