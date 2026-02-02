import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddPatientComponent } from './admin-add-patient.component';

describe('AdminAddPatientComponent', () => {
  let component: AdminAddPatientComponent;
  let fixture: ComponentFixture<AdminAddPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAddPatientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
