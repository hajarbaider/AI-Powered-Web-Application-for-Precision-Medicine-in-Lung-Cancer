import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
}
@Component({
  selector: 'app-lung-cancer-prediction',
  standalone: false,
  templateUrl: './lung-cancer-prediction.component.html',
  styleUrl: './lung-cancer-prediction.component.scss'
})
export class LungCancerPredictionComponent {
isSidebarHidden: boolean = false;
  user: any;
  
treatmentTypeMap: { [key: number]: string } = {
  0: 'Chemotherapy',
  1: 'Radiation Therapy',
  2: 'Other',
  3: 'Immunotherapy',
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
    this.loadPatients();
    
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

 loadPatients(): void {
  const doctorId = this.user?.id;
  if (!doctorId) {
    console.error('❌ Doctor ID not found!');
    return;
  }

  this.http.get<Patient[]>(`http://127.0.0.1:5000/api/patients/by-doctor/${doctorId}`)
    .subscribe({
      next: (data) => {
        this.patients = data;
        console.log('✅ Patients loaded:', this.patients);
      },
      error: (err) => {
        this.errorMessage = 'Error loading patients';
        console.error(err);
      }
    });
}

predictionResult: any = null;

showModal: boolean = false;
selectedImage: string = '';

recommendTreatment(): void {
  if (!this.selectedPatientId) {
    alert("❗Please select a patient");
    return;
  }

  this.loading = true;
  this.http.post<any>(`http://127.0.0.1:5000/api/recommend-treatment/${this.selectedPatientId}`, {})
    .subscribe({
      next: (data) => {
        this.predictionResult = data;
        this.showResult = true;
        this.loading = false;
        console.log("🧠 Treatment recommendation result:", data);
      },
      error: (error) => {
        this.loading = false;
        console.error("❌ Error during treatment recommendation", error);
        this.errorMessage = "Error during treatment recommendation.";
      }
    });
}

navigateToRecomandationTreatement(): void {
  this.router.navigate(['/medecins-recommandation-traitement']);
}

navigateToPredectionLungCancer(): void {
  this.router.navigate(['/lung-cancer-prediction']);
}

predictLungCancer(): void {
  if (!this.selectedPatientId) {
    alert("❗Please select a patient");
    return;
  }

  this.loading = true;
  this.http.post<any>(`http://127.0.0.1:5000/api/predict-lung-cancer/${this.selectedPatientId}`, {})
    .subscribe({
      next: (data) => {
        this.predictionResult = data;
        this.showResult = true;
        this.loading = false;
        console.log("🧠 Lung cancer prediction result:", data);
        // ✅ نرسم الشارت هنا
         this.renderPredictionChart();
      },
      error: (error) => {
        this.loading = false;
        console.error("❌ Error predicting lung cancer", error);
        this.errorMessage = "Error while predicting lung cancer.";
      }
    });
}

sendNotification(): void {
  if (!this.selectedPatientId) {
    alert("❗Please select a patient");
    return;
  }

  const message = `🫁 Lung cancer prediction result available. Click to view.`;

  const link = `/resultat-prediction-lung-cancer/${this.selectedPatientId}`;

  this.http.post(`http://127.0.0.1:5000/api/send-notification/${this.selectedPatientId}`, { message, link })
    .subscribe({
      next: () => alert("✅ Notification sent successfully!"),
      error: (err) => {
        console.error("Error while sending notification", err);
        alert("Error while sending the notification.");
      }
    });
}


navigateToPubmedArticles(): void {
  this.router.navigate(['/articles-pubmed']);
}


renderPredictionChart(): void {
  setTimeout(() => {
    if (this.predictionResult && this.predictionResult.probabilities) {
      const chartCanvas = document.getElementById('predictionDonutChart') as HTMLCanvasElement;

      if (chartCanvas) {
        const [cancerProb, normalProb] = this.predictionResult.probabilities.map((p: number) => +(p * 100).toFixed(2));

        new Chart(chartCanvas, {
          type: 'doughnut',
          data: {
            labels: ['Cancer', 'Normal'],
            datasets: [{
              data: [cancerProb, normalProb],
              backgroundColor: ['#ef4444', '#10b981'], 
              borderWidth: 2,
              borderRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,

            cutout: '70%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  font: {
                    size: 14
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: (ctx: any) => `${ctx.label}: ${ctx.parsed}%`
                }
              }
            }
          }
        });
      }
    }
  }, 100); 
}


}