import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinEditProfileComponent } from './medecin-edit-profile.component';

describe('MedecinEditProfileComponent', () => {
  let component: MedecinEditProfileComponent;
  let fixture: ComponentFixture<MedecinEditProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedecinEditProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedecinEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
