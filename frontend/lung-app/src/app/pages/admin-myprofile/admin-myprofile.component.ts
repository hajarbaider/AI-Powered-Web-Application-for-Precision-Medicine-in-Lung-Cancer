import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-myprofile',
  standalone: false,
  templateUrl: './admin-myprofile.component.html',
  styleUrl: './admin-myprofile.component.scss'
})
export class AdminMyprofileComponent {
isSidebarHidden: boolean = false;
  user: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);

      // نتحقق من نوع profileImage
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
}
