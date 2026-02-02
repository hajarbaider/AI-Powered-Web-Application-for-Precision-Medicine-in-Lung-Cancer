import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-admin-patient-management',
  standalone: false,
  templateUrl: './admin-patient-management.component.html',
  styleUrl: './admin-patient-management.component.scss'
})
export class AdminPatientManagementComponent {
isSidebarHidden: boolean = false;
  user: any;

    
 patients: any[] = [];
 
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
    this.loadPatients();
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
  this.router.navigate(['/admin/patients']);
}
searchTerm: string = '';
limit: number = 5;

filterPatient(patient: any): boolean {
  const search = this.searchTerm.toLowerCase();
  return (
    patient.firstName.toLowerCase().includes(search) ||
    patient.lastName.toLowerCase().includes(search) ||
    patient.email.toLowerCase().includes(search)
  );
}
  navigateToAddPatient(): void {
    this.router.navigate(['/admin/add-patient']);
  }

loadPatients(): void {
  this.http.get<any[]>('http://127.0.0.1:5000/api/patients').subscribe(
    (data: any[]) => {
       console.log('📦 Raw API Response:', data);
      this.patients = data.map(patient => {
  if (patient.profileImage && !patient.profileImage.startsWith('http')) {
    patient.profileImage = `http://127.0.0.1:5000/static/images/${patient.profileImage}`;
  }
  return patient;
});

      console.log('Patients chargés :', this.patients);
    },
    (error) => {
      console.error('Erreur lors du chargement des patients :', error);
    }
  );
}
filteredPatients(): any[] {
  const filtered = this.patients.filter(patient => {
    const search = this.searchTerm.toLowerCase();
    return (
      patient.id.toString().includes(search) ||
      patient.firstName.toLowerCase().includes(search) ||
      patient.lastName.toLowerCase().includes(search) ||
      patient.email.toLowerCase().includes(search) ||
      patient.city?.toLowerCase().includes(search) ||
      patient.doctor?.toLowerCase().includes(search)
    );
  });

  return filtered.slice(0, this.limit); 
}
deletePatient(id: number): void {
  if (confirm('Are you sure you want to delete this patient?')) {
    this.http.delete(`http://127.0.0.1:5000/api/delete-patient/${id}`).subscribe({
      next: () => {
        alert('✅ Patient successfully deleted');
        this.loadPatients(); // Recharge la liste
      },
      error: err => {
        alert('❌ Failed to delete');
        console.error(err);
      }
    });
  }
}
editPatient(id: number): void {
  this.router.navigate([`/admin/edit-patient/${id}`]);
}


exportCSV(): void {
  const csvRows = [];

  // رؤوس الأعمدة
  const headers = ['ID', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Ville', 'Médecin'];
  csvRows.push(headers.join(','));

  // البيانات
  this.filteredPatients().forEach(patient => {
    const row = [
      patient.id,
      patient.lastName,
      patient.firstName,
      patient.email,
      patient.phoneNumber || '',
      patient.city || '',
      patient.doctor || ''
    ];
    csvRows.push(row.map(val => `"${val}"`).join(','));
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'patients.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
exportPDF(): void {
  const doc = new jsPDF();
  const columns = ['ID', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Ville', 'Médecin'];
  const rows = this.filteredPatients().map(patient => [
    patient.id,
    patient.lastName,
    patient.firstName,
    patient.email,
    patient.phoneNumber || '',
    patient.city || '',
    patient.doctor || ''
  ]);

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 20
  });

  doc.save('patients.pdf');
}
viewMedicalFolder(patientId: number) {
  this.router.navigate(['/admin/patient-medical-folder', patientId]);
}

showModal = false;
selectedImage: string = '';

openImageModal(imageUrl: string) {
  this.selectedImage = imageUrl;
  this.showModal = true;
}

closeImageModal() {
  this.showModal = false;
}

  navigateToDoctors(): void {
  this.router.navigate(['admin-doctor-management']);
}  
}
