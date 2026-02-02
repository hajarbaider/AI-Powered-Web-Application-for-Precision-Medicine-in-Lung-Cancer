import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-admin-add-doctor',
  standalone: false,
  templateUrl: './admin-add-doctor.component.html',
  styleUrl: './admin-add-doctor.component.scss'
})
export class AdminAddDoctorComponent {
 isSidebarHidden: boolean = false;
  user: any;
  doctor: any = {}; 
selectedImage: File | null = null;


  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);

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
    this.router.navigate(['/admin/profile']);
  }
   navigateToDashboard() {
  this.router.navigate(['/admin-dashboard']);
}

  isActive(route: string): boolean {
    return this.router.url === route;
  }
  navigateToPatients(): void {
  this.router.navigate(['admin-patient-manager']);
}

  navigateToDoctors(): void {
  this.router.navigate(['admin-doctor-management']);
}
onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  addDoctor() {
    const formData = new FormData();
    for (let key in this.doctor) {
      formData.append(key, this.doctor[key]);
    }
    if (this.selectedImage) {
      formData.append('profileImage', this.selectedImage);
    }

    this.http.post('http://localhost:5000/api/admin-add-doctor', formData).subscribe({
      next: (res) => alert("Doctor added successfully"),
      error: (err) => alert("Erreur: " + err.error?.error || "Échec")
    });
  }
}