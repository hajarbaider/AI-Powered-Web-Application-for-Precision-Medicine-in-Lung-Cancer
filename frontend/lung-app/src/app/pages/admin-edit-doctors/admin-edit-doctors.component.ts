import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router,  ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-edit-doctors',
  standalone: false,
  templateUrl: './admin-edit-doctors.component.html',
  styleUrl: './admin-edit-doctors.component.scss'
})
export class AdminEditDoctorsComponent {
isSidebarHidden: boolean = false;
  user: any;
  doctor: any = {};
   selectedImage: File | null = null;
  doctorId: number = 0;

  constructor(private authService: AuthService, private router: Router, private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.doctorId = Number(this.route.snapshot.paramMap.get('id')); 
    this.getDoctorDetails();
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

  getDoctorDetails() {
    this.http.get<any>(`http://localhost:5000/api/doctors`).subscribe(doctors => {
      const doctor = doctors.find((d: any) => d.id === this.doctorId);
      if (doctor) {
        this.doctor = doctor;
      }
    });
  }
onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }
updateDoctor() {
    const formData = new FormData();
    for (let key in this.doctor) {
      if (key !== 'id') formData.append(key, this.doctor[key]);
    }

    if (this.selectedImage) {
      formData.append('profileImage', this.selectedImage);
    }

    this.http.put(`http://localhost:5000/api/admin-edit-doctor/${this.doctorId}`, formData).subscribe({
      next: () => {
        alert("Doctor updated successfully");
        this.router.navigate(['/admin-doctor-management']);
      },
      error: err => alert("Erreur: " + err.error?.error || "Update failed")
    });
  }
}

