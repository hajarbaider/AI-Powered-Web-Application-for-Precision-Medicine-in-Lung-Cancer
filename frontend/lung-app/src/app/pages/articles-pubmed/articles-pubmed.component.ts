
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-articles-pubmed',
  standalone: false,
  templateUrl: './articles-pubmed.component.html',
  styleUrl: './articles-pubmed.component.scss'
})
export class ArticlesPubmedComponent {

 articles: any[] = [];
  stats: any = null;
  categoryKeys: string[] = [];
isSidebarHidden: boolean = false;
user: any;
numberOfPatients: number = 0;
numberOfTreatmentsMade: number = 0;
numberOfSurvivalPredictions: number = 0;
numberOfLungCancerPredictions:  number = 0;
patientsPredits: any[] = [];
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

      
      if (this.user.profileImage && !this.user.profileImage.startsWith('http')) {
        this.user.profileImage = 'http://127.0.0.1:5000/static/images/' + this.user.profileImage;
      }

      console.log('Loaded user:', this.user);
    }
    this.loadMedecinStats();
    this.loadArticles();

  this.http.get<any[]>('http://localhost:5000/api/doctor/predicted-patients').subscribe({
  next: (data) => {
    this.patientsPredits = data.map(patient => ({
      ...patient,
      treatment_type_label: this.treatmentTypeMap[patient.traitement] || patient.traitement || 'Inconnu',
      agent_label: this.agentMap[patient.agent] || patient.agent || 'Inconnu'
    }));
  },
  error: (error) => {
    console.error("Error while loading predicted patients:", error);
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


 loadArticles() {
    this.http.get<any[]>('http://localhost:5000/api/articles').subscribe({
      next: (data) => {
        this.articles = data;

        // Calcul stats à partir des articles
        if (data.length > 0) {
          const total = data.length;
          let sumRouge1 = 0, sumRouge2 = 0, sumRougeL = 0;
          let categoriesCount: {[key: string]: number} = {};

          for (const art of data) {
            sumRouge1 += art.rouge_scores['rouge-1'];
            sumRouge2 += art.rouge_scores['rouge-2'];
            sumRougeL += art.rouge_scores['rouge-L'];

            categoriesCount[art.category] = (categoriesCount[art.category] || 0) + 1;
          }

          this.stats = {
            total,
            rouge1: sumRouge1 / total,
            rouge2: sumRouge2 / total,
            rougeL: sumRougeL / total,
            categories: categoriesCount
          };

          this.categoryKeys = Object.keys(categoriesCount);
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement des articles PubMed:", err);
      }
    });
  }

navigateToPubmedArticles(): void {
  this.router.navigate(['/articles-pubmed']);
}

}
