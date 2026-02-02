import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {

  isSidebarHidden: boolean = false;
  user: any;
    numberOfPatients: number = 0;
  numberOfDoctors: number = 0;
numberOfRecommendations: number = 0;
numberOfSurvivals: number = 0;
num_predections: number = 0;


barChartLabels: string[] = [];
barChartData: any[] = [];
chartReady: boolean = false;
chartUrl: string = '';
chartUrlPatients: string = '';
chartUrlGender: string = '';
timestamp: number = Date.now();
chartUrlNotifications: string = '';


  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}
ngAfterViewInit(): void {
  this.loadPatientsPerDoctorChart();
  this.loadGenderDistributionChart()  ;
  this.loadNotificationsPerDoctorChart()
}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);

      
      if (this.user.profileImage && !this.user.profileImage.startsWith('http')) {
        this.user.profileImage = 'http://127.0.0.1:5000/static/images/' + this.user.profileImage;
      }

      console.log('Loaded user:', this.user);
    }
     this.loadDashboardCounts();
     this.loadPatientsPerDoctorChart();
   
      

  
}
updateChartUrls(): void {
  this.chartUrlPatients = `http://127.0.0.1:5000/api/chart/patients-per-doctor`;
  this.chartUrlGender = `http://127.0.0.1:5000/admin/patient-gender-pie`;
  
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

  loadDashboardCounts() {
    this.authService.getDashboardCounts().subscribe(
      (res) => {
        this.numberOfPatients = res.patients;
        this.numberOfDoctors = res.medecins;
        this.numberOfRecommendations = res.recommendations;
        this.numberOfSurvivals = res.survivals;
        this.num_predections = res.predection_lung_cancer;

      },
      (err) => {
        console.error('Error while retrieving statistics', err);
      }
    );
  }



  loadPatientsPerDoctorChart(): void {
  this.http.get<any[]>('http://127.0.0.1:5000/api/patients-per-doctor')
    .subscribe({
      next: (data) => {
        const labels = data.map(item => item.doctor);
        const values = data.map(item => item.count);

        const chartCanvas = document.getElementById('patientsPerDoctorChart') as HTMLCanvasElement;
        if (chartCanvas) {
          new Chart(chartCanvas, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'Number of Patients',
                data: values,
                backgroundColor: '#0dd3c1'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  
                }
              },
              scales: {
                x: {
                  ticks: {
                    maxRotation: 60,
                    minRotation: 30
                  }
                },
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        }
      },
      error: (err) => {
        console.error('❌ Error loading patients per doctor chart:', err);
      }
    });
}


loadGenderDistributionChart(): void {
  this.http.get<any>('http://127.0.0.1:5000/api/gender-distribution')
    .subscribe({
      next: (data) => {
        const canvas = document.getElementById('genderDistributionChart') as HTMLCanvasElement;
        if (canvas) {
          new Chart(canvas, {
            type: 'pie',
            data: {
              labels: data.labels,
              datasets: [{
                data: data.data,
                backgroundColor: data.colors
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                },
                title: {
                  display: true,
              
                }
              }
            }
          });
        }
      },
      error: (err) => {
        console.error('❌ Error loading gender chart:', err);
      }
    });
}

loadNotificationsPerDoctorChart(): void {
  this.http.get<any[]>('http://127.0.0.1:5000/api/notifications-per-doctor')
    .subscribe({
      next: (data) => {
        const labels = data.map(item => item.doctor);
        const values = data.map(item => item.notification_count);

        const canvas = document.getElementById('notificationsPerDoctorChart') as HTMLCanvasElement;
        if (canvas) {
          new Chart(canvas, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'Notifications',
                data: values,
                backgroundColor: '#FFA490'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                
                },
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        }
      },
      error: (err) => {
        console.error('❌ Error loading notifications chart:', err);
      }
    });
}


}
