import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resultat-predection-survival',
  standalone: false,
  templateUrl: './resultat-predection-survival.component.html',
  styleUrls: ['./resultat-predection-survival.component.scss']
})
export class ResultatPredectionSurvivalComponent implements OnInit {
  predictionResult: any = null;
  user: any;
  isSidebarHidden: boolean = false;
   notifications: any[] = [];
unreadCount: number = 0;
showNotifications: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);

      if (this.user.profileImage && !this.user.profileImage.startsWith('http')) {
        this.user.profileImage = 'http://127.0.0.1:5000/static/images/' + this.user.profileImage;
      }

      this.http.get<any>(`http://127.0.0.1:5000/api/get_prediction_survival?user_id=${this.user.id}`)
        .subscribe({
          next: (res) => {
            this.predictionResult = res;
            console.log('Résultat prédiction:', res);
          },
          error: (err) => {
            console.error('Erreur prédiction:', err);
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

  navigateToProfile(): void {
    this.router.navigate(['/patient-my-profile']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/patient-dashboard']);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  navigateToDoctors(): void {
    // Implémente la navigation si nécessaire
  }

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

  
showModal: boolean = false;
selectedImage: string = '';

openImageModal(imageUrl: string) {
  this.selectedImage = 'http://127.0.0.1:5000' + imageUrl;
  this.showModal = true;
}

closeImageModal() {
  this.showModal = false;
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
