import os
import pydicom
import numpy as np
import cv2

# === CONFIGURATION ===
root_dir = r"D:\set1_batch1_B\set1_batch1\sub_batch_B"  # dossier racine des groupes
output_dir = "output_dataset/normal"  # dossier de sortie
os.makedirs(output_dir, exist_ok=True)

# === FONCTIONS ===

def is_lung_scan(dicom_folder):
    """Vérifie si le dossier contient un scan thoracique"""
    for file in os.listdir(dicom_folder):
        if file.endswith('.dcm'):
            path = os.path.join(dicom_folder, file)
            try:
                dicom = pydicom.dcmread(path, stop_before_pixels=True)
                body = dicom.get("BodyPartExamined", "").lower()
                series = dicom.get("SeriesDescription", "").lower()
                if "lung" in body or "thorax" in body or "chest" in body:
                    return True
                if "lung" in series or "thorax" in series or "chest" in series:
                    return True
            except:
                continue
    return False

def load_dicom_slices(folder_path):
    """Charge les slices triés dans l'ordre"""
    slices = []
    for filename in sorted(os.listdir(folder_path)):
        if filename.endswith(".dcm"):
            path = os.path.join(folder_path, filename)
            try:
                dicom = pydicom.dcmread(path)
                slices.append(dicom.pixel_array)
            except:
                continue
    return np.array(slices)

def get_middle_slices(volume, num_slices=10):
    """Retourne les slices du centre du volume"""
    z = volume.shape[0]
    if z < num_slices:
        return volume  # retourne tout si < 10
    start = z // 2 - num_slices // 2
    return volume[start:start + num_slices]

def save_slices(slices, save_dir, patient_id):
    """Sauvegarde chaque slice normalisée en .png"""
    for i, slice_img in enumerate(slices):
        norm_img = cv2.normalize(slice_img, None, 0, 255, cv2.NORM_MINMAX)
        save_path = os.path.join(save_dir, f"{patient_id}_slice{i}.png")
        cv2.imwrite(save_path, norm_img.astype(np.uint8))

# === EXÉCUTION ===

for group in os.listdir(root_dir):
    group_path = os.path.join(root_dir, group)
    if not os.path.isdir(group_path):
        continue

    for patient in os.listdir(group_path):
        patient_path = os.path.join(group_path, patient)
        if not os.path.isdir(patient_path):
            continue

        # 🔁 Parcours direct des dossiers T0, T1, ...
        for scan_folder in os.listdir(patient_path):
            sub_path = os.path.join(patient_path, scan_folder)
            if not os.path.isdir(sub_path):
                continue

            if is_lung_scan(sub_path):
                print(f"✅ CT thorax trouvé: {sub_path}")
                slices = load_dicom_slices(sub_path)

                if len(slices) >= 1:
                    mid_slices = get_middle_slices(slices, 10)
                    # Ajoute group + patient + T0/T1 pour un identifiant unique
                    patient_id = f"{group}_{patient}_{scan_folder}"
                    save_slices(mid_slices, output_dir, patient_id)
                    print(f"💾 Sauvegardé: {len(mid_slices)} slices pour {patient_id}")
                else:
                    print(f"⚠️ Pas assez de slices pour {group}/{patient}/{scan_folder}")

                break  # on s'arrête après le 1er bon scan
