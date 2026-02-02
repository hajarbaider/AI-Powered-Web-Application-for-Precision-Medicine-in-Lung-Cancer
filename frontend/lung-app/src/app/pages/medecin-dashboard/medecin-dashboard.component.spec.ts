import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinDashboardComponent } from './medecin-dashboard.component';

describe('MedecinDashboardComponent', () => {
  let component: MedecinDashboardComponent;
  let fixture: ComponentFixture<MedecinDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedecinDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedecinDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
