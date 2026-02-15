# 🫁 AI-Powered Web Application for Precision Medicine in Lung Cancer

An intelligent web platform that leverages Artificial Intelligence to support diagnosis, survival prediction, personalized treatment recommendation, and biomedical knowledge discovery for lung cancer patients.

---

## 📌 Project Overview

This project aims to assist healthcare professionals in lung cancer management by integrating multiple AI models into a unified web application.

The system provides:

- Automated diagnosis from CT scan images
- Survival prediction based on clinical data
- Personalized treatment recommendation
- Biomedical literature analysis using NLP

It supports precision medicine and clinical decision-making.

---

## 🎯 Objectives

- Improve early detection of lung cancer
- Predict patient survival accurately
- Optimize personalized treatment strategies
- Support doctors with up-to-date medical knowledge
- Provide a secure and user-friendly medical platform

---

## 🏗️ System Architecture

The application follows a multi-layer architecture:
Frontend (Angular)
↓
REST API (Flask)
↓
AI Models (PyTorch / Scikit-learn / Transformers)
↓
Database (MySQL)
---

### Components:

- Presentation Layer: Angular Web Interface
- Backend Layer: Flask RESTful API
- AI Layer: Deep Learning & Machine Learning Models
- Data Layer: MySQL Database

---

## 🤖 AI Models Used

### 1️⃣ Lung Cancer Detection (CT Scans)
This module focuses on the automatic detection of lung cancer from CT scan images using deep learning techniques. The objective is to identify the most reliable model capable of accurately distinguishing between normal and malignant lung tissues.

#### 📊 Dataset

We used the **IQ-OTH/NCCD** dataset, collected from specialized oncology centers in Iraq.

- Total Images: 1,190 CT scans
- Patients: 110
- Classes:
  - Malignant: 40 cases
  - Benign: 15 cases (excluded)
  - Normal: 55 cases
- Format: DICOM
- Image Slices per Patient: 80–200
- Annotation: Radiologists and oncologists

After preprocessing, only **Normal** and **Malignant** classes were retained for binary classification.

#### ⚙️ Data Preprocessing

The following preprocessing steps were applied:

- Dataset split: Training / Validation / Test
- Image resizing: 224 × 224
- Pixel normalization: [0, 1]
- Data augmentation:
  - Rotation
  - Horizontal flipping
- Class filtering: Benign class removed

These steps improved model stability and reduced overfitting.

---

#### 🤖 Deep Learning Models Evaluated

We evaluated several pre-trained CNN architectures using transfer learning:

- VGG16
- VGG19
- ResNet50
- ResNet152
- DenseNet169
- EfficientNetB7
- GoogLeNet
- InceptionV3
- Xception

All models were fine-tuned on our dataset under the same training conditions.
---

#### 🧪 Training Configuration

| Parameter   | Value |
|-------------|--------|
| Epochs      | 25     |
| Batch Size  | 32     |
| Image Size  | 224×224|
| Classes     | 2      |
| Device      | CUDA   |

---

#### 📈 Evaluation Metrics

Model performance was evaluated using:

- Accuracy
- Precision
- Recall (Sensitivity)
- F1-Score
- Test Loss

These metrics were computed using TP, TN, FP, and FN values.

---

#### 🏆 Selected Model: VGG16

Based on experimental results, **VGG16** was selected as the final model due to:

- Highest accuracy
- Stable training behavior
- Low test loss
- Strong generalization ability

---
#### 🏗️ Model Architecture

The final solution is based on a fine-tuned VGG16 architecture.

![image alt](https://github.com/hajarbaider/AI-Powered-Web-Application-for-Precision-Medicine-in-Lung-Cancer/blob/main/architecture%20pour%20la%20pr%C3%A9diction.jpg?raw=true)

---

### 2️⃣ Survival Prediction


This module focuses on predicting the survival time and mortality risk of lung cancer patients using clinical data and machine learning techniques. It supports clinical decision-making by estimating patient prognosis and long-term survival probability.

---
#### 📊 Dataset

We used clinical data from the **National Lung Cancer Screening Trial (NLST)**.

- Study Period: 2002 – 2004
- Participants: Lung cancer patients
- Data Source: LDCT screening
- Data Type:
  - Demographics
  - Medical history
  - Smoking behavior
  - Cancer progression
  - Survival records

The NLST dataset represents one of the largest public resources for lung cancer research.

---
#### ⚙️ Data Preprocessing

The following preprocessing steps were applied:

- Exploratory data analysis
- Feature selection based on clinical relevance
- Patient filtering (lung cancer cases only)
- Missing value handling
- Variable standardization
- Variable renaming (duration, event)

These steps ensured a clean and consistent dataset.

---
#### 🤖 Survival Models Evaluated

Several survival analysis models were implemented and compared:

- Cox Proportional Hazards (CoxPH)
- Random Survival Forest (RSF)
- Survival Support Vector Machine (SVM)
- XGBoost
- TabNet
- Hybrid Ensemble Model (Stacking)

The hybrid model combines RSF, CoxPH, and SVM.

#### 📈 Evaluation Metrics

Model performance was evaluated using:

- Concordance Index (C-index)
- Area Under Curve (AUC)
- Integrated Brier Score (IBS)

These metrics assess ranking ability, prediction accuracy, and probability calibration.


---
#### 🏆 Selected Model: Hybrid Ensemble

Based on experimental results, a hybrid stacking model was selected.

**Base Models:**
- RSF
- CoxPH
- SVM

**Meta-Model:**
- Random Survival Forest

This ensemble approach improves robustness and prediction accuracy.

---
#### 🏗️ Model Architecture

The survival prediction system follows a multi-stage pipeline.

![image alt](https://github.com/hajarbaider/AI-Powered-Web-Application-for-Precision-Medicine-in-Lung-Cancer/blob/main/Hybrid%20Pipeline%20for%20Survival%20Prediction%20Based%20on%20RSF,%20CoxPH,%20and%20SVM%20for%20Survival..jpg?raw=true)

---



### 3️⃣ Treatment Recommendation

This module focuses on recommending personalized treatment strategies for patients with Non-Small Cell Lung Cancer (NSCLC) by integrating clinical and genomic data. It predicts both the appropriate treatment type and the most suitable therapeutic agent for each patient.

---

#### 📊 Dataset
We used multidimensional data from the **TCGA Pan-Cancer Atlas (2018)** via cBioPortal.

- Subtypes:
  - LUAD (Lung Adenocarcinoma)
  - LUSC (Lung Squamous Cell Carcinoma)
- Total Samples: > 1,000 patients
- Data Types:
  - Clinical data
  - Genomic mutations
  - Copy number variations
  - DNA methylation
  - Gene and protein expression
  - Treatment records

Sources:
- LUAD Dataset
- LUSC Dataset
---
#### ⚙️ Data Preprocessing

The following preprocessing steps were applied:

- File selection and conversion (TXT → CSV)
- Data merging (clinical + genomic + treatment data)
- Patient filtering (successful or partial response)
- Feature selection (EGFR, ALK and key biomarkers)
- Missing value handling
- Categorical encoding
- Class balancing using oversampling

Treatment Type:
- Chemotherapy
- Radiation Therapy

Treatment Agents:
- 12 drug categories (Cisplatin, Carboplatin, Paclitaxel, etc.)

---



#### 🤖 Machine Learning Models Evaluated

Two classification tasks were performed:

##### 1️⃣ Treatment Type Prediction
- Random Forest
- LightGBM
- Logistic Regression
- MLP

##### 2️⃣ Treatment Agent Prediction
- Random Forest
- Logistic Regression
- KNN
- Gaussian Naive Bayes
- MLP

---
#### 📈 Evaluation Metrics

Model performance was evaluated using:

- Accuracy
- Precision
- Recall
- F1-Score
- K-Fold Cross-Validation
  - Mean CV Accuracy
  - Std CV

These metrics assess model accuracy, stability, and generalization.

---
#### 🏆 Selected Models

Based on experimental results:

- Treatment Type → **LightGBM**
- Treatment Agent → **Random Forest**

These models achieved the best balance between accuracy and stability.

---
#### 🏗️ Model Architecture

The treatment recommendation system follows a two-stage pipeline.

![image alt](https://github.com/hajarbaider/AI-Powered-Web-Application-for-Precision-Medicine-in-Lung-Cancer/blob/main/Architecture%20for%20treatment%20recommendation%20in%20patients%20with%20lung%20cancer%20using%20clinical%20and%20genomic%20data..jpg?raw=true)

### 4️⃣ Biomedical Knowledge Extraction (NLP)


This module focuses on automatically analyzing biomedical research articles to support medical discovery in lung cancer. It uses Natural Language Processing (NLP) and transformer-based models to extract, summarize, and annotate scientific publications from PubMed.

The system helps identify potential biomarkers, treatments, and clinical trials for AI-assisted medical research.

---


#### 📊 Data Source: PubMed

We used data from **PubMed**, one of the largest biomedical literature databases.

- Total Records: > 38 million abstracts
- Provider: NCBI (NIH, USA)
- Content: Biomedical and life sciences publications
- Availability: Abstracts with links to full texts

PubMed ensures high-quality and peer-reviewed scientific data.

---


#### 🤖 NLP & Transformer Models Used

The system integrates several state-of-the-art transformer models:

##### 🔹 Text Summarization
- **BART** (facebook/bart-large-cnn)
- Task: Automatic abstract summarization

##### 🔹 Text Classification
- **PubMedBERT**
  (microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract)
- Task: Article categorization

##### 🔹 Named Entity Recognition (NER)
- **d4data/biomedical-ner-all**
- Task: Extraction of biomedical entities

---

#### 📁 Output Format

Each processed article is stored in JSON format containing:

- Title
- URL
- Category
- Generated Summary
- Annotated Summary
- Highlighted Entities

This structured format enables easy integration into clinical and research systems.

---
#### 🏗️ System Architecture

The NLP system is based on a modular transformer pipeline.
![image alt](https://github.com/hajarbaider/AI-Powered-Web-Application-for-Precision-Medicine-in-Lung-Cancer/blob/main/Architecture%20using%20NLP%20techniques%20and%20transformer-based%20models%20for%20novel%20discoveries..jpg?raw=true)


---
## 💻 Technologies Used

### Backend

- Python
- Flask
- SQLAlchemy
- MySQL
- REST API

### Frontend

- Angular
- TypeScript
- HTML / CSS
- Chart.js
- Node.js

### AI & Data Science

- PyTorch
- Scikit-learn
- NumPy
- Pandas
- Matplotlib
- HuggingFace Transformers
### Tools

- Google Colab
- VS Code
- StarUML


---

## 📸 Application Screenshots


### 🔹 Authentication
- Login Page
  ![image alt](https://github.com/hajarbaider/AI-Powered-Web-Application-for-Precision-Medicine-in-Lung-Cancer/blob/main/Home%20page.jpg?raw=true)
   ![image alt](https://github.com/hajarbaider/AI-Powered-Web-Application-for-Precision-Medicine-in-Lung-Cancer/blob/main/User%20authentication%20page.jpg?raw=true)
- Error Handling
   ![image alt](https://github.com/hajarbaider/AI-Powered-Web-Application-for-Precision-Medicine-in-Lung-Cancer/blob/main/Error%20in%20authentication..jpg?raw=true)

  ### 🔹 Administrator Area
- Dashboard
    ![image alt](https://github.com/hajarbaider/AI-Powered-Web-Application-for-Precision-Medicine-in-Lung-Cancer/blob/main/Administrator%20dashboard.png?raw=true)
- Profile Management
  ![image alt](https://github.com/hajarbaider/AI-Powered-Web-Application-for-Precision-Medicine-in-Lung-Cancer/blob/main/View%20profile.jpg?raw=true)
   ![image alt](https://github.com/hajarbaider/AI-Powered-Web-Application-for-Precision-Medicine-in-Lung-Cancer/blob/main/Edit%20profile.png?raw=true)
- Doctor & Patient Management
 ![image alt](https://github.com/hajarbaider/AI-Powered-Web-Application-for-Precision-Medicine-in-Lung-Cancer/blob/main/View%20profile.jpg?raw=true)
   ![image alt](https://github.com/hajarbaider/AI-Powered-Web-Application-for-Precision-Medicine-in-Lung-Cancer/blob/main/Edit%20profile.png?raw=true)
