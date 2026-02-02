import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { PatientDashboardComponent } from './pages/patient-dashboard/patient-dashboard.component';
import { MedecinDashboardComponent } from './pages/medecin-dashboard/medecin-dashboard.component';
import { AdminMyprofileComponent } from './pages/admin-myprofile/admin-myprofile.component';
import { AdminEditProfileComponent } from './pages/admin-edit-profile/admin-edit-profile.component';
import { AdminPatientManagementComponent } from './pages/admin-patient-management/admin-patient-management.component';
import { AdminAddPatientComponent } from './pages/admin-add-patient/admin-add-patient.component';
import { AdminEditPatientComponent } from './pages/admin-edit-patient/admin-edit-patient.component';
import { AdminPatientMedicalFolderComponent } from './pages/admin-patient-medical-folder/admin-patient-medical-folder.component';
import { AdminDoctorManagementComponent } from './pages/admin-doctor-management/admin-doctor-management.component';
import { AdminAddDoctorComponent } from './pages/admin-add-doctor/admin-add-doctor.component';
import { AdminEditDoctorsComponent } from './pages/admin-edit-doctors/admin-edit-doctors.component';
import { MedecinProfileComponent } from './pages/medecin-profile/medecin-profile.component';
import { MedecinEditProfileComponent } from './pages/medecin-edit-profile/medecin-edit-profile.component';
import { MedecinsPatientListeComponent } from './pages/medecins-patient-liste/medecins-patient-liste.component';
import { MedecinDossierPatientComponent } from './pages/medecin-dossier-patient/medecin-dossier-patient.component';
import { MedecinsSurvivalPredictionComponent } from './pages/medecins-survival-prediction/medecins-survival-prediction.component';
import { MedecinsRecommandationTraitementComponent } from './pages/medecins-recommandation-traitement/medecins-recommandation-traitement.component';
import { NgChartsModule } from 'ng2-charts';
import { LungCancerPredictionComponent } from './pages/lung-cancer-prediction/lung-cancer-prediction.component';
import { PatientMyProfileComponent } from './pages/patient-my-profile/patient-my-profile.component';
import { PatientEditProfileComponent } from './pages/patient-edit-profile/patient-edit-profile.component';
import { PatientDossierMedecaleComponent } from './pages/patient-dossier-medecale/patient-dossier-medecale.component';
import { ResultatPredectionSurvivalComponent } from './pages/resultat-predection-survival/resultat-predection-survival.component';
import { ResultatRecomandationTraitementComponent } from './pages/resultat-recomandation-traitement/resultat-recomandation-traitement.component';
import { MedecinsPredectionLungCancerComponent } from './pages/medecins-predection-lung-cancer/medecins-predection-lung-cancer.component';
import { ResultatPredictionLungCancerComponent } from './pages/resultat-prediction-lung-cancer/resultat-prediction-lung-cancer.component';
import { ArticlesPubmedComponent } from './pages/articles-pubmed/articles-pubmed.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdminDashboardComponent,
    PatientDashboardComponent,
    MedecinDashboardComponent,
    AdminMyprofileComponent,
    AdminEditProfileComponent,
    AdminPatientManagementComponent,
    AdminAddPatientComponent,
    AdminEditPatientComponent,
    AdminPatientMedicalFolderComponent,
    AdminDoctorManagementComponent,
    AdminAddDoctorComponent,
    AdminEditDoctorsComponent,
    MedecinProfileComponent,
    MedecinEditProfileComponent,
    MedecinsPatientListeComponent,
    MedecinDossierPatientComponent,
    MedecinsSurvivalPredictionComponent,
    MedecinsRecommandationTraitementComponent,
    LungCancerPredictionComponent,
    PatientMyProfileComponent,
    PatientEditProfileComponent,
    PatientDossierMedecaleComponent,
    ResultatPredectionSurvivalComponent,
    ResultatRecomandationTraitementComponent,
    MedecinsPredectionLungCancerComponent,
    ResultatPredictionLungCancerComponent,
    ArticlesPubmedComponent
  
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgChartsModule
   
   
  ],
  providers: [],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
