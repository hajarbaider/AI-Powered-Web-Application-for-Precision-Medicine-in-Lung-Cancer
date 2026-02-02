import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditDoctorsComponent } from './admin-edit-doctors.component';

describe('AdminEditDoctorsComponent', () => {
  let component: AdminEditDoctorsComponent;
  let fixture: ComponentFixture<AdminEditDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEditDoctorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
