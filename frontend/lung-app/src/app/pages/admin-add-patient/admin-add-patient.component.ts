import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-add-patient',
  standalone: false,
  templateUrl: './admin-add-patient.component.html',
  styleUrl: './admin-add-patient.component.scss'
})
export class AdminAddPatientComponent {
imageSelected: boolean = false;
ctScanSelected: boolean = false;
formData: any = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phoneNumber: '',
  city: '',
  address: '',
  doctor_id: null,
  diagnosed: null,
  age: null,
  gender: '',
  race: '',
  height: null,
  weight: null,
  lesionsize: null,
  de_stag: '',
  de_stag_7thed: '',
  histology_cat: '',
  treatlc: '',
  lung_cancer: '',
  progressed_ever: null,
  prog_days_1st: null,
  canc_free_days: null,
  candx_days: null,
  scan_date: null,
  disease_post_surg: null,
  rad_stop_days: null,
  treat_days: null,
  treat_year: null,
  cigsmok: '',
  age_quit: null,
  pkyr: null,
  smokeday: null,
  smokeyr: null,
  diagadas: '',
  diagasbe: '',
  diagbron: '',
  diagchas: '',
  diagchro: '',
  diagcopd: '',
  diagdiab: '',
  diagemph: '',
  diagfibr: '',
  diaghear: '',
  diaghype: '',
  diagpneu: '',
  diagsarc: '',
  diagsili: '',
  diagstro: '',
  diagtube: '',
  canclung: '',
  RADIATION_THERAPY: '',

  // ✅ Colonnes ajoutées : GeneticAlterations
  EGFR_cna: '',
  ALK_cna: '',
  ROS1_cna: '',
  BRAF_cna: '',
  MET_cna: '',
  RET_cna: '',
  ERBB2_cna: '',
  KRAS_cna: '',
  TP53_cna: '',
  STK11_cna: '',
  KEAP1_cna: '',
  PIK3CA_cna: '',
  NRAS_cna: '',
  NTRK1_cna: '',
  NTRK2_cna: '',
  NTRK3_cna: '',
  CD274_cna: '',

  // ✅ Colonnes ajoutées : HypoxiaScores
  RAGNUM_HYPOXIA_SCORE: null,
  BUFFA_HYPOXIA_SCORE: null,

  // ✅ Colonnes ajoutées : AncestryScores
  EUR: null,
  AFR: null,
  EAS: null,
  AMR: null,
  SAS: null

};


 isSidebarHidden: boolean = false;
  user: any;
  doctors: any[] = [];
   selectedProfileImage: File | null = null;
  selectedCtScanImage: File | null = null;
  diagnosed: number | null = null;  // 1 = Oui, 0 = Non

  constructor(private authService: AuthService, private router: Router, private doctorService: DoctorService, private http: HttpClient) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);

      
      if (this.user.profileImage && !this.user.profileImage.startsWith('http')) {
        this.user.profileImage = 'http://127.0.0.1:5000/static/images/' + this.user.profileImage;
      }

      console.log('Loaded user:', this.user);
    }
     this.doctorService.getDoctors().subscribe((data) => {
      this.doctors = data;
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
 onFileSelected(event: any) {
    const file = event.target.files[0];
    const inputName = event.target.name || event.target.id;

    if (inputName === 'profileImage') {
      this.selectedProfileImage = file;
      this.imageSelected = !!file;
    } else if (inputName === 'ct_scan_image') {
      this.selectedCtScanImage = file;
    }
  }

onSubmit(f: NgForm) {
  if (f.valid) {
    const formDataToSend = new FormData();

    // champs textuels
    for (const key in this.formData) {
      if (this.formData.hasOwnProperty(key) && this.formData[key] !== null && this.formData[key] !== undefined) {
        formDataToSend.append(key, this.formData[key]);
      }
    }

    // fichiers
    if (this.selectedProfileImage) {
      formDataToSend.append('profileImage', this.selectedProfileImage);
    }
    if (this.selectedCtScanImage) {
      formDataToSend.append('ct_scan_image', this.selectedCtScanImage);
    }

    this.http.post('http://127.0.0.1:5000/api/add-patient', formDataToSend).subscribe({
      next: (res: any) => {
        alert('✅ Patient registered successfully');
        f.resetForm();
      },
      error: (err) => {
        alert('❌ Erreur: ' + err.error?.error || 'Erreur inconnue');
        console.error(err);
      }
    });
  }
  else {
    console.warn('⚠️ Form is invalid');
  }
}
get isDiagnosed(): boolean {
  return this.formData.diagnosed == 1;
}
 navigateToDoctors(): void {
  this.router.navigate(['admin-doctor-management']);
}

}