import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMyprofileComponent } from './admin-myprofile.component';

describe('AdminMyprofileComponent', () => {
  let component: AdminMyprofileComponent;
  let fixture: ComponentFixture<AdminMyprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMyprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMyprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
