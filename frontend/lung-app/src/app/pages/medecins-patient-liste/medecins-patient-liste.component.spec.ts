import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinsPatientListeComponent } from './medecins-patient-liste.component';

describe('MedecinsPatientListeComponent', () => {
  let component: MedecinsPatientListeComponent;
  let fixture: ComponentFixture<MedecinsPatientListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedecinsPatientListeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedecinsPatientListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
