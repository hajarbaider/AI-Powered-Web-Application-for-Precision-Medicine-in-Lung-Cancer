import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-resultat-recomandation-traitement',
  standalone: false,
  templateUrl: './resultat-recomandation-traitement.component.html',
  styleUrl: './resultat-recomandation-traitement.component.scss'
})
export class ResultatRecomandationTraitementComponent implements OnInit {

  isSidebarHidden: boolean = false;
  user: any;
  recommendedTreatments: any[] = [];
  notifications: any[] = [];
unreadCount: number = 0;
showNotifications: boolean = false;

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
    private http: HttpClient,
    private route: ActivatedRoute

  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');

    
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);

      if (this.user.profileImage && !this.user.profileImage.startsWith('http')) {
        this.user.profileImage = 'http://127.0.0.1:5000/static/images/' + this.user.profileImage;
      }

      console.log('Loaded user:', this.user);

      this.http.get<any[]>(`http://127.0.0.1:5000/api/get_recommended_treatment/${this.user.id}`)
        .subscribe({
          next: (res) => {
            console.log("Traitements recommandés :", res);
            this.recommendedTreatments = res;
          },
          error: (err) => {
            console.error("Erreur récupération :", err);
          }
        });
    }
    this.loadNotifications();
  }

  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  logout(): void {
    this.authService.logout();
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  navigateToProfile(): void {
    this.router.navigate(['/patient-my-profile']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/patient-dashboard']);
  }

  navigateToDoctors(): void {}
  
 navigateToPredectionSurvival(): void {
  if (this.user?.id) {
    this.router.navigate(['/resultat-predection-survival', this.user.id]);
  } else {
    console.error("❌ ID utilisateur introuvable");
  }
}


navigateToRecomandationTreatement(): void {
  if (this.user?.id) {
    this.router.navigate(['/resultat-recomandation-traitement', this.user.id]);
  } else {
    console.error("❌ User ID introuvable !");
  }
}


 navigateToPredictionLungCancer(): void {
  if (this.user?.id) {
    this.router.navigate(['/resultat-prediction-lung-cancer', this.user.id]);
  } else {
    console.error("User ID not found");
  }
}

  navigateToMyDossierMedecale(): void {
    if (this.user?.id) {
      this.router.navigate(['/patient-dossier-medecale', this.user.id]);
    }
  }












  
loadNotifications(): void {
  fetch(`http://127.0.0.1:5000/api/get-notifications/${this.user.id}`)
    .then(res => res.json())
    .then(data => {
      console.log('Notifications loaded:', data);
      this.notifications = data;
      this.unreadCount = data.filter((n: any) => !n.is_read).length;
    });
}

toggleNotificationDropdown(): void {
  this.showNotifications = !this.showNotifications;
}

handleNotificationClick(notif: any): void {
  console.log('🔗 Link to go:', notif.link);
  console.log('🛎️ Clicked notification:', notif);
  // Mark as read
  fetch(`http://127.0.0.1:5000/api/mark-notification-read/${notif.id}`, { method: 'PATCH' })
    .then(() => {
      // Go to notification link
      if (notif.link) {
        this.router.navigateByUrl(notif.link);
      }
      this.loadNotifications(); // reload count
      this.showNotifications = false;
    });

}



get unreadNotifications() {
  return this.notifications.filter((n: any) => !n.is_read);
}




get sortedNotifications() {
  return this.notifications.slice().sort((a, b) => Number(a.is_read) - Number(b.is_read));
}


}