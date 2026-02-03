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

### 📊 Dataset

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

### ⚙️ Data Preprocessing

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

### 🤖 Deep Learning Models Evaluated

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

### 🧪 Training Configuration

| Parameter   | Value |
|-------------|--------|
| Epochs      | 25     |
| Batch Size  | 32     |
| Image Size  | 224×224|
| Classes     | 2      |
| Device      | CUDA   |

---

### 📈 Evaluation Metrics

Model performance was evaluated using:

- Accuracy
- Precision
- Recall (Sensitivity)
- F1-Score
- Test Loss

These metrics were computed using TP, TN, FP, and FN values.

---

### 🏆 Selected Model: VGG16

Based on experimental results, **VGG16** was selected as the final model due to:

- Highest accuracy
- Stable training behavior
- Low test loss
- Strong generalization ability

---
### 🏗️ Model Architecture

The final solution is based on a fine-tuned VGG16 architecture.

![image alt](https://github.com/hajarbaider/AI-Powered-Web-Application-for-Precision-Medicine-in-Lung-Cancer/blob/main/architecture%20pour%20la%20pr%C3%A9diction.jpg?raw=true)

