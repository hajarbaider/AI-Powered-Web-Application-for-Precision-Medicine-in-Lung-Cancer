import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-edit-patient',
  standalone: false,
  templateUrl: './admin-edit-patient.component.html',
  styleUrl: './admin-edit-patient.component.scss'
})
export class AdminEditPatientComponent implements OnInit {
 isSidebarHidden: boolean = false;
  user: any;
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
 doctors: any[] = [];
   selectedProfileImage: File | null = null;
  selectedCtScanImage: File | null = null;
  diagnosed: number | null = null;  // 1 = Oui, 0 = Non
 

  constructor(private authService: AuthService, private router: Router, private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
  const userData = localStorage.getItem('user');
  if (userData) {
    this.user = JSON.parse(userData);
    if (this.user.profileImage && !this.user.profileImage.startsWith('http')) {
      this.user.profileImage = 'http://127.0.0.1:5000/static/images/' + this.user.profileImage;
    }
  }

  const toBool = (v: any) => v === true || v === '1' || v === 1 || v === 'true';
  const toNum = (v: any) => v !== '' && v !== null && v !== undefined ? Number(v) : null;

  const patientId = this.route.snapshot.paramMap.get('id');
  if (patientId) {
    this.http.get<any>(`http://127.0.0.1:5000/api/patient/${patientId}`).subscribe((data) => {
      this.formData = {
        ...data,
        gender: toNum(data.gender),
        race: toNum(data.race),
        de_stag: toNum(data.de_stag),
        de_stag_7thed: toNum(data.de_stag_7thed),
        histology_cat: toNum(data.histology_cat),
        treatlc: toNum(data.treatlc),
        lung_cancer: toNum(data.lung_cancer),
        progressed_ever: toNum(data.progressed_ever),
        cigsmok: toNum(data.cigsmok),
        diagnosed: toBool(data.diagnosed) ? 1 : 0,
        diagadas: toBool(data.diagadas) ? 1 : 0,
        diagasbe: toBool(data.diagasbe) ? 1 : 0,
        diagbron: toBool(data.diagbron) ? 1 : 0,
        diagchas: toBool(data.diagchas) ? 1 : 0,
        diagchro: toBool(data.diagchro) ? 1 : 0,
        diagcopd: toBool(data.diagcopd) ? 1 : 0,
        diagdiab: toBool(data.diagdiab) ? 1 : 0,
        diagemph: toBool(data.diagemph) ? 1 : 0,
        diagfibr: toBool(data.diagfibr) ? 1 : 0,
        diaghear: toBool(data.diaghear) ? 1 : 0,
        diaghype: toBool(data.diaghype) ? 1 : 0,
        diagpneu: toBool(data.diagpneu) ? 1 : 0,
        diagsarc: toBool(data.diagsarc) ? 1 : 0,
        diagsili: toBool(data.diagsili) ? 1 : 0,
        diagstro: toBool(data.diagstro) ? 1 : 0,
        diagtube: toBool(data.diagtube) ? 1 : 0,
        canclung: toBool(data.canclung) ? 1 : 0,
        RAGNUM_HYPOXIA_SCORE: data?.hypoxia_scores?.RAGNUM_HYPOXIA_SCORE ?? '',
        BUFFA_HYPOXIA_SCORE: data?.hypoxia_scores?.BUFFA_HYPOXIA_SCORE ?? '',
        EUR: data?.ancestry_scores?.EUR ?? '',
        AFR: data?.ancestry_scores?.AFR ?? '',
        EAS: data?.ancestry_scores?.EAS ?? '',
        AMR: data?.ancestry_scores?.AMR ?? '',
        SAS: data?.ancestry_scores?.SAS ?? '',

        EGFR_cna: data?.genetic_alterations?.EGFR_cna ?? '',
        ALK_cna: data?.genetic_alterations?.ALK_cna ?? '',
        ROS1_cna: data?.genetic_alterations?.ROS1_cna ?? '',
        BRAF_cna: data?.genetic_alterations?.BRAF_cna ?? '',
        MET_cna: data?.genetic_alterations?.MET_cna ?? '',
        RET_cna: data?.genetic_alterations?.RET_cna ?? '',
        ERBB2_cna: data?.genetic_alterations?.ERBB2_cna ?? '',
        KRAS_cna: data?.genetic_alterations?.KRAS_cna ?? '',
        TP53_cna: data?.genetic_alterations?.TP53_cna ?? '',
        STK11_cna: data?.genetic_alterations?.STK11_cna ?? '',
        KEAP1_cna: data?.genetic_alterations?.KEAP1_cna ?? '',
        PIK3CA_cna: data?.genetic_alterations?.PIK3CA_cna ?? '',
        NRAS_cna: data?.genetic_alterations?.NRAS_cna ?? '',
        NTRK1_cna: data?.genetic_alterations?.NTRK1_cna ?? '',
        NTRK2_cna: data?.genetic_alterations?.NTRK2_cna ?? '',
        NTRK3_cna: data?.genetic_alterations?.NTRK3_cna ?? '',
        CD274_cna: data?.genetic_alterations?.CD274_cna ?? '',
        RADIATION_THERAPY: data?.clinical_data?.RADIATION_THERAPY ?? '',

      };

      this.diagnosed = this.formData.diagnosed;
    });
  }

  this.http.get<any[]>('http://127.0.0.1:5000/api/doctors').subscribe(data => {
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
  } else if (inputName === 'ct_scan_image') {
    this.selectedCtScanImage = file;
  }
}
onSubmit(f: NgForm) {
  if (f.valid) {
    const formDataToSend = new FormData();
    for (const key in this.formData) {
      if (this.formData[key] !== null && this.formData[key] !== undefined) {
        formDataToSend.append(key, this.formData[key]);
      }
    }
    if (this.selectedProfileImage) {
      formDataToSend.append('profileImage', this.selectedProfileImage);
    }
    if (this.selectedCtScanImage) {
      formDataToSend.append('ct_scan_image', this.selectedCtScanImage);
    }

    const id = this.route.snapshot.paramMap.get('id');

    this.http.put(`http://127.0.0.1:5000/api/update-patient/${id}`, formDataToSend).subscribe({
      next: () => {
        alert('✅ Patient updated successfully');
        this.router.navigate(['/admin-patient-manager']);
      },
      error: (err) => {
        alert('❌ Erreur: ' + err.error?.error || 'Erreur inconnue');
        console.error(err);
      }
    });
  }
}
get isDiagnosed(): boolean {
  return this.formData.diagnosed == 1;
}

  navigateToDoctors(): void {
  this.router.navigate(['admin-doctor-management']);
}
}
