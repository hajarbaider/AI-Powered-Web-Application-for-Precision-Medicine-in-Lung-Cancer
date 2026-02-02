import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultatRecomandationTraitementComponent } from './resultat-recomandation-traitement.component';

describe('ResultatRecomandationTraitementComponent', () => {
  let component: ResultatRecomandationTraitementComponent;
  let fixture: ComponentFixture<ResultatRecomandationTraitementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultatRecomandationTraitementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultatRecomandationTraitementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
