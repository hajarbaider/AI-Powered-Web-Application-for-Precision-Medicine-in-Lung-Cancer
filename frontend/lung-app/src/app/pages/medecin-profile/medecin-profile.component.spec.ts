import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinProfileComponent } from './medecin-profile.component';

describe('MedecinProfileComponent', () => {
  let component: MedecinProfileComponent;
  let fixture: ComponentFixture<MedecinProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedecinProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedecinProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
