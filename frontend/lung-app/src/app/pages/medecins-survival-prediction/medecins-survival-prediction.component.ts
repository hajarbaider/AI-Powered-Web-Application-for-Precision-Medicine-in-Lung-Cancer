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
  selector: 'app-medecins-survival-prediction',
  standalone: false,
  templateUrl: './medecins-survival-prediction.component.html',
  styleUrl: './medecins-survival-prediction.component.scss'
})

export class MedecinsSurvivalPredictionComponent implements OnInit {
  isSidebarHidden: boolean = false;
  user: any;
  

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

predictSurvival(): void {
  if (!this.selectedPatientId) return;

  this.http.post<any>(`http://127.0.0.1:5000/api/predict-survival/${this.selectedPatientId}`, {})

    .subscribe({
      next: (data) => {
        this.predictionResult = data;
        console.log("✅ Résultat prédiction:", this.predictionResult);
      },
      error: (err) => {
        this.errorMessage = "Erreur lors de la prédiction";
        console.error(err);
      }
    });
}

showModal: boolean = false;
selectedImage: string = '';

openImageModal(imageUrl: string) {
  this.selectedImage = 'http://127.0.0.1:5000' + imageUrl;
  this.showModal = true;
}

closeImageModal() {
  this.showModal = false;
}

navigateToRecomandationTreatement(): void {
  this.router.navigate(['/medecins-recommandation-traitement']);
}

navigateToPredectionLungCancer(): void {
    this.router.navigate(['/lung-cancer-prediction']);
  }
  
sendSurvivalPredictionNotification(): void {
  if (!this.selectedPatientId) {
    alert("❗Please select a patient");
    return;
  }

  const message = `📊 Survival prediction result available. Click to view.`;
  const link = `/resultat-predection-survival/${this.selectedPatientId}`;

  this.http.post(
    `http://127.0.0.1:5000/api/send-survival-prediction-notification/${this.selectedPatientId}`,
    { message, link }
  ).subscribe({
    next: () => alert("✅ Survival notification sent successfully!"),
    error: (err) => {
      console.error("❌ Error while sending survival notification", err);
      alert("An error occurred while sending the notification.");
    }
  });
}

  navigateToPubmedArticles(): void {
  this.router.navigate(['/articles-pubmed']);
}

}