import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-medecin-dashboard',
  standalone: false,
  templateUrl: './medecin-dashboard.component.html',
  styleUrl: './medecin-dashboard.component.scss'
})

export class MedecinDashboardComponent implements OnInit {


  
isSidebarHidden: boolean = false;
user: any;
numberOfPatients: number = 0;
numberOfTreatmentsMade: number = 0;
numberOfSurvivalPredictions: number = 0;
numberOfLungCancerPredictions:  number = 0;
patientsPredits: any[] = [];
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



  constructor(
  private authService: AuthService,
  private router: Router,
  private http: HttpClient  // ✅ ici
) {}


ngOnInit(): void {
    const userData = localStorage.getItem('user');
    console.log('📦 user data:', userData);
    if (userData) {
      this.user = JSON.parse(userData);

      // نتحقق من نوع profileImage
      if (this.user.profileImage && !this.user.profileImage.startsWith('http')) {
        this.user.profileImage = 'http://127.0.0.1:5000/static/images/' + this.user.profileImage;
      }

      console.log('Loaded user:', this.user);
    }
    this.loadMedecinStats();
    this.loadTreatmentStats();
    this.loadLungCancerPredictionStats();
    this.loadAgentStats();
    this.loadSurvivalStats(); 

  this.http.get<any[]>('http://localhost:5000/api/doctor/predicted-patients').subscribe({
  next: (data) => {
    this.patientsPredits = data.map(patient => ({
      ...patient,
      treatment_type_label: this.treatmentTypeMap[patient.traitement] || patient.traitement || 'Inconnu',
      agent_label: this.agentMap[patient.agent] || patient.agent || 'Inconnu'
    }));
  },
  error: (error) => {
    console.error("Erreur lors du chargement des patients prédits:", error);
  }
});


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
  
}
 navigateToPredectionSurvival(): void {
  this.router.navigate(['/medecin_survival_analysis']);
}
navigateToRecomandationTreatement(): void {
  this.router.navigate(['/medecins-recommandation-traitement']);
}

navigateToPredectionLungCancer(): void {
    this.router.navigate(['/lung-cancer-prediction']);
  }
loadMedecinStats() {
  const medecinId = this.user?.id;
  if (!medecinId) return;

  this.http.get<any>(`http://127.0.0.1:5000/api/medecin-dashboard-stats/${medecinId}`)
    .subscribe({
      next: (res) => {
        this.numberOfPatients = res.numberOfPatients;
        this.numberOfTreatmentsMade = res.numberOfTreatmentsMade;
        this.numberOfSurvivalPredictions = res.numberOfSurvivalPredictions;
        this.numberOfLungCancerPredictions = res.numberOfLungCancerPredictions;  // <--- 
      },
      error: (err) => {
        console.error('An error occurred while loading predicted patients', err);
      }
    });
}
navigateToPredectionLung(): void {
  this.router.navigate(['/medecins-predection-lung-cancer']);
}



navigateToPubmedArticles(): void {
  this.router.navigate(['/articles-pubmed']);
}

loadTreatmentStats() {
  const medecinId = this.user?.id;
  if (!medecinId) return;

  this.http.get<{ [key: string]: number }>(`http://127.0.0.1:5000/api/treatment-stats-json/${medecinId}`)
    .subscribe(data => {
      const labels = Object.keys(data);
      const values = Object.values(data);

      new Chart('treatmentChart', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Number of Treatments',
            data: values,
            backgroundColor: '#0dd3c1',
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Treatment Types Distribution'
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Treatment Type'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Patients'
              }
            }
          }
        }
      });
    });
}


loadLungCancerPredictionStats() {
  const medecinId = this.user?.id;
  if (!medecinId) return;

  this.http.get<{ [key: string]: number }>(
    `http://127.0.0.1:5000/api/lung-cancer-prediction-stats-json/${medecinId}`
  ).subscribe(data => {
    const labelMapping: { [key: string]: string } = {
      'Malignant': 'Malignant',
      'Benign': 'Benign'
    };

    const labels = Object.keys(data).map(key => labelMapping[key] || key);
    const values = Object.values(data);

    const total = values.reduce((sum, value) => sum + value, 0);
    const percentages = values.map(value =>
      total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%'
    );

    new Chart('lungCancerChart', {
      type: 'pie',
      data: {
        labels: labels.map((label, i) => `${label} (${percentages[i]})`),
        datasets: [{
          data: values,
          backgroundColor: ['#FFA490', '#3498db']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          title: {
            display: true,
            text: 'Lung Cancer Prediction Distribution'
          }
        }
      }
    });
  });
}




loadAgentStats() {
  const medecinId = this.user?.id;
  if (!medecinId) return;

  this.http.get<{ [key: string]: number }>(`http://127.0.0.1:5000/api/agent-stats-json/${medecinId}`)
    .subscribe(data => {
      // Remplacer les numéros par les noms des agents à l'aide de agentMap
      const labels = Object.keys(data).map(key => this.agentMap[+key] || `Unknown (${key})`);
      const values = Object.values(data);

      new Chart('agentChart', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Agent Count',
            data: values,
            backgroundColor: '#0dd3c1'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Agent Usage Distribution'
            }
          },
          scales: {
            x: {
              ticks: {
                autoSkip: false,
                maxRotation: 45,
                minRotation: 45
              }
            }
          }
        }
      });
    });
}



loadSurvivalStats() {
  const medecinId = this.user?.id;
  if (!medecinId) return;

  this.http.get<{
    durations: number[],
    avg_year_probs: { [year: string]: number }
  }>(`http://127.0.0.1:5000/api/survival-stats-json/${medecinId}`)
    .subscribe(data => {
      // Histogram
      const durationsInYears = data.durations.map(d => d / 365);
      const bins = [0, 1, 2, 3, 4, 5];
      const binCounts = bins.map((binStart, i) => {
        const binEnd = bins[i + 1];
        if (binEnd === undefined) return 0;
        return durationsInYears.filter(d => d >= binStart && d < binEnd).length;
      });
      const binLabels = bins.slice(0, -1).map((start, i) => `${start}–${bins[i + 1]} ans`);

      new Chart('durationHistogram', {
        type: 'bar',
        data: {
          labels: binLabels,
          datasets: [{
            label: 'Number of Patients',
            data: binCounts,
            backgroundColor: '#2ecc71'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Distribution of Predicted Survival Duration (Years)'
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Survival Duration (Years)'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Number of Patients'
              }
            }
          }
        }
      });

      // Line chart
      const yearLabels = Object.keys(data.avg_year_probs);
      const yearValues = Object.values(data.avg_year_probs);

      new Chart('avgProbLineChart', {
        type: 'line',
        data: {
          labels: yearLabels,
          datasets: [{
            label: 'Avg Survival Probability',
            data: yearValues,
            fill: false,
            borderColor: '#3498db',
            tension: 0.3,
            pointBackgroundColor: '#3498db'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Average Yearly Survival Probabilities'
            }
          },
          scales: {
            y: {
              min: 0,
              max: 1,
              title: {
                display: true,
                text: 'Probability'
              },
              ticks: {
                callback: function(value: string | number) {
                  return typeof value === 'number' ? value.toFixed(2) : value;
                }
              }
            }
          }
        }
      });

    }); 
}
}
