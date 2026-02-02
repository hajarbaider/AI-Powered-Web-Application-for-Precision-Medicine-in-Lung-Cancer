import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDossierMedecaleComponent } from './patient-dossier-medecale.component';

describe('PatientDossierMedecaleComponent', () => {
  let component: PatientDossierMedecaleComponent;
  let fixture: ComponentFixture<PatientDossierMedecaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientDossierMedecaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientDossierMedecaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
