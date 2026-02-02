import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LungCancerPredictionComponent } from './lung-cancer-prediction.component';

describe('LungCancerPredictionComponent', () => {
  let component: LungCancerPredictionComponent;
  let fixture: ComponentFixture<LungCancerPredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LungCancerPredictionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LungCancerPredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
