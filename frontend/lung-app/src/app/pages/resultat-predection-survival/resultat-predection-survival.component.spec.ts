import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatPredectionSurvivalComponent } from './resultat-predection-survival.component';

describe('ResultatPredectionSurvivalComponent', () => {
  let component: ResultatPredectionSurvivalComponent;
  let fixture: ComponentFixture<ResultatPredectionSurvivalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultatPredectionSurvivalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultatPredectionSurvivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
