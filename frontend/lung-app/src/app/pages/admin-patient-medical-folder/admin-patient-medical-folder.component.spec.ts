import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPatientMedicalFolderComponent } from './admin-patient-medical-folder.component';

describe('AdminPatientMedicalFolderComponent', () => {
  let component: AdminPatientMedicalFolderComponent;
  let fixture: ComponentFixture<AdminPatientMedicalFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPatientMedicalFolderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPatientMedicalFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
