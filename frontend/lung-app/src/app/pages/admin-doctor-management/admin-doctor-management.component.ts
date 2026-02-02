import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-admin-doctor-management',
  standalone: false,
  templateUrl: './admin-doctor-management.component.html',
  styleUrl: './admin-doctor-management.component.scss'
})
export class AdminDoctorManagementComponent {
isSidebarHidden: boolean = false;
  user: any;
  doctors: any[] = [];
  searchTerm: string = '';
  limit: number = 5;
  showModal: boolean = false;
  selectedImage: string = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);

      if (this.user.profileImage && !this.user.profileImage.startsWith('http')) {
        this.user.profileImage = 'http://127.0.0.1:5000/static/images/' + this.user.profileImage;
      }
    }
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.http.get<any[]>('http://127.0.0.1:5000/api/doctors').subscribe(
      (data: any[]) => {
        this.doctors = data.map(doctor => {
          if (doctor.profileImage && !doctor.profileImage.startsWith('http')) {
            doctor.profileImage = `http://127.0.0.1:5000/static/images/${doctor.profileImage}`;
          }
          return doctor;
        });
      },
      error => {
        console.error('Error loading doctors:', error);
      }
    );
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

navigateToAddPatient(): void {
    this.router.navigate(['admin-add-doctor']);
  }







filteredDoctors() {
    let results = this.doctors;

    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      results = results.filter(doctor =>
        doctor.firstName.toLowerCase().includes(term) ||
        doctor.lastName.toLowerCase().includes(term) ||
        doctor.email.toLowerCase().includes(term) ||
        doctor.city.toLowerCase().includes(term)
      );
    }

    if (this.limit && this.limit > 0) {
      return results.slice(0, this.limit);
    }

    return results;
  }


   // ✅ Export CSV
  exportDoctorsToCSV(): void {
    const headers = ['ID', 'Nom', 'Email', 'Téléphone', 'Ville'];
    const rows = this.filteredDoctors().map(doctor => [
      doctor.id,
      `${doctor.firstName} ${doctor.lastName}`,
      doctor.email,
      doctor.phoneNumber,
      doctor.city
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,' + headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'doctors.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  // ✅ Export PDF
  exportDoctorsToPDF(): void {
    const doc = new jsPDF();
    const headers = [['ID', 'Nom', 'Email', 'Téléphone', 'Ville']];
    const rows = this.filteredDoctors().map(doctor => [
      doctor.id,
      `${doctor.firstName} ${doctor.lastName}`,
      doctor.email,
      doctor.phoneNumber,
      doctor.city
    ]);

    autoTable(doc, {
      head: headers,
      body: rows,
    });

    doc.save('doctors.pdf');
  }
   // ✅ Image Modal
  openImageModal(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.showModal = true;
  }

  closeImageModal(): void {
    this.showModal = false;
    this.selectedImage = '';
  }

  // ✅ Actions supplémentaires (edit/delete)
 editDoctor(id: number): void {
  this.router.navigate(['/admin/edit-doctor', id]);
}

  deleteDoctor(id: number): void {
  if (confirm('Are you sure you want to delete this doctor?')) {
    this.http.delete(`http://127.0.0.1:5000/api/doctors/${id}`).subscribe(
      () => {
        // بعد الحذف الناجح، نحدّث القائمة محليا باش تمسح الطبيب مباشرة من الواجهة
        this.doctors = this.doctors.filter(doc => doc.id !== id);
        alert('The doctor has been deleted successfully');
      },
      error => {
        console.error('An error occurred while deleting the doctor:', error);
        alert('An error occurred while deleting the doctor');
      }
    );
  }
}

}

