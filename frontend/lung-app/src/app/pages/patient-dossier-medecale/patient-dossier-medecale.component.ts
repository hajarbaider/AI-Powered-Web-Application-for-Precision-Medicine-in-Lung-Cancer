import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { ActivatedRoute ,Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient-dossier-medecale',
  standalone: false,
  templateUrl: './patient-dossier-medecale.component.html',
  styleUrl: './patient-dossier-medecale.component.scss'
})
export class PatientDossierMedecaleComponent {
  isSidebarHidden: boolean = false;
user: any;
patientData: any;
patientId!: number; 
notifications: any[] = [];
unreadCount: number = 0;
showNotifications: boolean = false;

// inside component.ts
cnaLabels: { [key: number]: string } = {
  '-2': 'Large Deletion',
  '-1': 'Single Copy Loss',
  '0': 'Normal Copy',
  '1': 'Low Gain',
  '2': 'High Gain',
};

genes: string[] = [
  'EGFR', 'ALK', 'ROS1', 'BRAF', 'MET', 'RET', 'ERBB2', 'KRAS', 'TP53',
  'STK11', 'KEAP1', 'PIK3CA', 'NRAS', 'NTRK1', 'NTRK2', 'NTRK3', 'CD274'
];

  constructor(private authService: AuthService, private router: Router,  private route: ActivatedRoute,
    private http: HttpClient) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      this.user = JSON.parse(userData);

      
      if (this.user.profileImage && !this.user.profileImage.startsWith('http')) {
        this.user.profileImage = 'http://127.0.0.1:5000/static/images/' + this.user.profileImage;
      }

      console.log('Loaded user:', this.user);
    }
     this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get(`http://127.0.0.1:5000/api/patient_dosier/${this.patientId}`).subscribe({
      next: (data) => {
        this.patientData = data;
        if (this.patientData.profileImage && !this.patientData.profileImage.startsWith('http')) {
          this.patientData.profileImage = 'http://127.0.0.1:5000/static/images/' + this.patientData.profileImage;
        }
      },
      error: (err) => {
        console.error('Erreur chargement dossier médical:', err);
      }
    });
    this.loadNotifications();
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
    this.router.navigate(['/patient-my-profile']);
  }
   navigateToDashboard() {
     this.router.navigate(['/patient-dashboard']);
}

  isActive(route: string): boolean {
    return this.router.url === route;
  }
  navigateToPatients(): void {
  this.router.navigate(['/']);
}
  navigateToDoctors(): void {
  this.router.navigate(['']);
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
      
      if (notif.link) {
        this.router.navigateByUrl(notif.link);
      }
      this.loadNotifications(); // reload count
      this.showNotifications = false;
    });
}

raceLabels: { [key: number]: string } = {
  1: 'White',
  2: 'Black or African-American',
  3: 'Asian',
  4: 'American Indian or Alaskan Native',
  5: 'Native Hawaiian or Other Pacific Islander',
  6: 'More than one race',
  '-1': 'Other',
};

getRaceLabel(raceValue: number | undefined): string {
  if (raceValue === undefined || raceValue === null) return 'Unknown';
  return this.raceLabels[raceValue] || 'Unknown';
}
getGenderLabel(gender: number | undefined): string {
  if (gender == 1) return 'Male';
  if (gender == 2) return 'Female';
  return 'Unknown';
}




// Dans ton component.ts
histologyLabels: { [key: string]: string } = {
  '1': 'Small cell carcinoma',
  '2': 'Squamous cell carcinoma',
  '3': 'Adenocarcinoma',
  '4': 'Bronchiolo-alveolar carcinoma',
  '5': 'Large cell carcinoma',
  '6': 'Adenosquamous carcinoma',
  '7': 'Pleomorphic/sarcomatoid',
  '8': 'Carcinoid tumor',
  '-1': 'Other',
};
getHistologyLabel(code: number | null | undefined): string {
  if (code === null || code === undefined) return 'Unknown';
  const label = this.histologyLabels[String(code)];
  return label ? label : 'Unknown';
}
treatmentLabels: { [key: string]: string } = {
  '1': 'Confirmed treatment',
  '2': 'Confirmed no treatment',
};

getTreatmentLabel(code: number | null | undefined): string {
  if (code === null || code === undefined) return '';
  const label = this.treatmentLabels[String(code)];
  return label ? label : 'Unknown';
}




get unreadNotifications() {
  return this.notifications.filter((n: any) => !n.is_read);
}



get sortedNotifications() {
  return this.notifications.slice().sort((a, b) => Number(a.is_read) - Number(b.is_read));
}


}