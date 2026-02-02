import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditPatientComponent } from './admin-edit-patient.component';

describe('AdminEditPatientComponent', () => {
  let component: AdminEditPatientComponent;
  let fixture: ComponentFixture<AdminEditPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEditPatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
