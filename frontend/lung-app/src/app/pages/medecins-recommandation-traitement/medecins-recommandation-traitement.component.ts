import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
}


@Component({
  selector: 'app-medecins-recommandation-traitement',
  standalone: false,
  templateUrl: './medecins-recommandation-traitement.component.html',
  styleUrl: './medecins-recommandation-traitement.component.scss'
})
export class MedecinsRecommandationTraitementComponent {
 isSidebarHidden: boolean = false;
  user: any;
  
treatmentTypeMap: { [key: number]: string } = {
  0: 'Chemotherapy',
  3: 'Radiation Therapy',
  2: 'Other',
  1: 'Immunotherapy',
  4: 'Targeted Molecular Therapy',
  5: 'Vaccine'
};

agentMap: { [key: number]: string } = {
  0: 'Radiation 1',
  1: 'Cisplatin',
  2: 'Carboplatin',
  3: 'Erlotinib',
  4: 'Paclitaxel',
  5: 'Gemcitabine',
  6: 'Recprame + As15/Placebo',
  7: 'Bevacizumab',
  8: 'Pemetrexed',
  9: 'Docetaxel',
  10: 'Recprame + As15',
  11: 'Nos',
  12: 'Irinotecan',
  13: 'Vincristine',
  14: 'Gefitinib',
  15: 'Vinblastine',
  16: 'Etoposide',
  17: 'Belinostat',
  18: 'Vinorelbine',
  19: 'Doxorubicin',
  20: 'Temozolomide',
  21: 'Clinical Trial',
  22: 'Recmage-A + As15/Placebo',
  23: 'Carboplatin + Paclitaxel',
  24: 'Cisplatin + Etoposide',
  25: 'Oxaliplatin',
  26: 'Plicamycin'
};

  patients: Patient[] = [];
  selectedPatientId?: number;

  loading = false;
  errorMessage = '';
  showResult = false;

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);

      if (this.user.profileImage && !this.user.profileImage.startsWith('http')) {
        this.user.profileImage = 'http://127.0.0.1:5000/static/images/' + this.user.profileImage;
      }

      console.log('Loaded user:', this.user);
     
    }
    this.loadEligiblePatients();
  }

  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
    console.log('Sidebar toggled:', this.isSidebarHidden);
  }

  logout(): void {
    console.log('logout clicked');
    this.authService.logout();
  }

 navigateToProfile(): void {
    this.router.navigate(['/medecin-profil']);
}

navigateToDashboard() {
  this.router.navigate(['/medecin-dashboard']);
}

  isActive(route: string): boolean {
    return this.router.url === route;
  }
  navigateToPatients(): void {
    this.router.navigate(['/medecins-patient-liste']);
  
}

  navigateToDoctors(): void {
    this.router.navigate(['admin-doctor-management']);
  }

  navigateToPredectionSurvival(): void {
    this.router.navigate(['/medecin_survival_analysis']);
  }

 loadEligiblePatients(): void {
  const doctorId = this.user?.id;

  if (!doctorId) {
    console.error('❌ Doctor ID not found!');
    return;
  }

  this.http.get<any[]>(`http://127.0.0.1:5000/api/patients/eligible-survival/${doctorId}`)
    .subscribe({
      next: (data) => {
        this.patients = data;
        console.log('✅ Patients éligibles pour la prédiction:', this.patients);
      },
      error: (err) => {
        this.errorMessage = 'Erreur chargement patients éligibles';
        console.error('❌ Erreur API:', err);
      }
    });
}


predictionResult: any = null;


showModal: boolean = false;
selectedImage: string = '';
recommendTreatment(): void {
  if (!this.selectedPatientId) {
    alert("❗Veuillez sélectionner un patient");
    return;
  }

  this.loading = true;
  this.http.post<any>(`http://127.0.0.1:5000/api/recommend-treatment/${this.selectedPatientId}`, {})
    .subscribe({
      next: (data) => {
        this.predictionResult = data;
        this.showResult = true;
        this.loading = false;
        console.log("🧠 Résultat recommandation:", data);
        console.log("Résultat retour:", this.predictionResult);

      },
      error: (error) => {
        this.loading = false;
        console.error("❌ Erreur lors de la recommandation", error);
        this.errorMessage = "Erreur lors de la recommandation du traitement.";
      }
    });
}
navigateToRecomandationTreatement(): void {
    this.router.navigate(['/medecins-recommandation-traitement']);
  }
navigateToPredectionLungCancer(): void {
    this.router.navigate(['/lung-cancer-prediction']);
  }

sendTreatmentRecommendationNotification(): void {
  if (!this.selectedPatientId) {
    alert("❗Please select a patient");
    return;
  }

  const message = `💊 New treatment recommendation available. Click to view.`;
  const link = `/resultat-recomandation-traitement/${this.selectedPatientId}`;

  this.http.post(
    `http://127.0.0.1:5000/api/send-treatment-recommendation-notification/${this.selectedPatientId}`,
    { message, link }
  ).subscribe({
    next: () => alert("✅ Treatment notification sent successfully!"),
    error: (err) => {
      console.error("❌ Error sending the notification", err);
      alert("Error sending the notification.");
    }
  });
}


  navigateToPubmedArticles(): void {
  this.router.navigate(['/articles-pubmed']);
}

  

}