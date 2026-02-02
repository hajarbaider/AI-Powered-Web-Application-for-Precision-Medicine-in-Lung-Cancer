import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { ActivatedRoute ,Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-admin-patient-medical-folder',
  standalone: false,
  templateUrl: './admin-patient-medical-folder.component.html',
  styleUrl: './admin-patient-medical-folder.component.scss'
})
export class AdminPatientMedicalFolderComponent {
isSidebarHidden: boolean = false;
user: any;
patientData: any;
patientId!: number; 
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

      // نتحقق من نوع profileImage
      if (this.user.profileImage && !this.user.profileImage.startsWith('http')) {
        this.user.profileImage = 'http://127.0.0.1:5000/static/images/' + this.user.profileImage;
      }

      console.log('Loaded user:', this.user);
    }
     this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get(`http://127.0.0.1:5000/api/patient/${this.patientId}`).subscribe({
      next: (data) => {
        this.patientData = data;
        if (this.patientData.profileImage && !this.patientData.profileImage.startsWith('http')) {
          this.patientData.profileImage = 'http://127.0.0.1:5000/static/images/' + this.patientData.profileImage;
        }
      },
      error: (err) => {
        console.error('Medical record loading error:', err);
      }
    });
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

getGenderLabel(gender: number | undefined): string {
  if (gender == 1) return 'Male';
  if (gender == 2) return 'Female';
  return 'Unknown';
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
  if (code === null || code === undefined) return 'Unknown';
  const label = this.treatmentLabels[String(code)];
  return label ? label : 'Unknown';
}



}
