import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-medecin-edit-profile',
  standalone: false,
  templateUrl: './medecin-edit-profile.component.html',
  styleUrl: './medecin-edit-profile.component.scss'
})
export class MedecinEditProfileComponent {
 isSidebarHidden: boolean = false;
  user: any;

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
            
    this.user.currentEmail = this.user.email;

    // ✅ password input  
    this.user.password = '';

      // profileImage
      if (this.user.profileImage && !this.user.profileImage.startsWith('http')) {
        this.user.profileImage = 'http://127.0.0.1:5000/static/images/' + this.user.profileImage;
      }

      console.log('Loaded user:', this.user);
    }
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

  isActive(route: string): boolean {
    return this.router.url === route;
  }

saveProfile() {
  const payload = {
    currentEmail: this.user.currentEmail,  //    
    email: this.user.email,
    firstName: this.user.firstName,
    lastName: this.user.lastName,
    phoneNumber: this.user.phoneNumber,
    city: this.user.city,
    address: this.user.address,
    password: this.user.password  //       
  };
   console.log('Payload:', payload); 
  this.http.put('http://127.0.0.1:5000/admin/edit-profile', payload, {
    headers: { 'Content-Type': 'application/json' }
  }).subscribe({
    next: (res: any) => {
      alert(res.message);
      //  localStorage  
      localStorage.setItem('user', JSON.stringify(res.user));
      this.user = res.user; //    
      this.user.password = ''; //   
    },
    error: err => {
      alert("Error updating profile");
      console.error(err);
    }
  });
}
 navigateToDashboard() {
  this.router.navigate(['/medecin-dashboard']);
}
 navigateToPatients(): void {
  this.router.navigate(['/medecins-patient-liste']);
}

  navigateToDoctors(): void {
  this.router.navigate(['']);
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

  
navigateToPubmedArticles(): void {
  this.router.navigate(['/articles-pubmed']);
}
}      
