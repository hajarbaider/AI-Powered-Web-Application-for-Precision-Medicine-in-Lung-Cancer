import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient-edit-profile',
  standalone: false,
  templateUrl: './patient-edit-profile.component.html',
  styleUrl: './patient-edit-profile.component.scss'
})
export class PatientEditProfileComponent {
isSidebarHidden: boolean = false;
user: any;
notifications: any[] = [];
unreadCount: number = 0;
showNotifications: boolean = false;

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
        
    this.user.currentEmail = this.user.email;

    this.user.password = '';

      
      if (this.user.profileImage && !this.user.profileImage.startsWith('http')) {
        this.user.profileImage = 'http://127.0.0.1:5000/static/images/' + this.user.profileImage;
      }

      console.log('Loaded user:', this.user);
    }
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

  isActive(route: string): boolean {
    return this.router.url === route;
  }

saveProfile() {
  const payload = {
    currentEmail: this.user.currentEmail,  
    email: this.user.email,
    firstName: this.user.firstName,
    lastName: this.user.lastName,
    phoneNumber: this.user.phoneNumber,
    city: this.user.city,
    address: this.user.address,
    password: this.user.password  
  };
   console.log('Payload:', payload); 
  this.http.put('http://127.0.0.1:5000/admin/edit-profile', payload, {
    headers: { 'Content-Type': 'application/json' }
  }).subscribe({
    next: (res: any) => {
      alert(res.message);
      
      localStorage.setItem('user', JSON.stringify(res.user));
      this.user = res.user; 
      this.user.password = ''; 
    },
    error: err => {
      alert("Error updating profile");
      console.error(err);
    }
  });
}
 navigateToDashboard() {
  this.router.navigate(['/patient-dashboard']);
}
 navigateToPatients(): void {
  this.router.navigate(['/patient/dossier-medecale']);
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
