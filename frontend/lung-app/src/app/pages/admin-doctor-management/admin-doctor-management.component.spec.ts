import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDoctorManagementComponent } from './admin-doctor-management.component';

describe('AdminDoctorManagementComponent', () => {
  let component: AdminDoctorManagementComponent;
  let fixture: ComponentFixture<AdminDoctorManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDoctorManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDoctorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
