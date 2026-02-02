import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinsSurvivalPredictionComponent } from './medecins-survival-prediction.component';

describe('MedecinsSurvivalPredictionComponent', () => {
  let component: MedecinsSurvivalPredictionComponent;
  let fixture: ComponentFixture<MedecinsSurvivalPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedecinsSurvivalPredictionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedecinsSurvivalPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
