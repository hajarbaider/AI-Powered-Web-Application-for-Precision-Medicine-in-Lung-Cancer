import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinDossierPatientComponent } from './medecin-dossier-patient.component';

describe('MedecinDossierPatientComponent', () => {
  let component: MedecinDossierPatientComponent;
  let fixture: ComponentFixture<MedecinDossierPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedecinDossierPatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedecinDossierPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
