import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatPredictionLungCancerComponent } from './resultat-prediction-lung-cancer.component';

describe('ResultatPredictionLungCancerComponent', () => {
  let component: ResultatPredictionLungCancerComponent;
  let fixture: ComponentFixture<ResultatPredictionLungCancerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultatPredictionLungCancerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultatPredictionLungCancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
