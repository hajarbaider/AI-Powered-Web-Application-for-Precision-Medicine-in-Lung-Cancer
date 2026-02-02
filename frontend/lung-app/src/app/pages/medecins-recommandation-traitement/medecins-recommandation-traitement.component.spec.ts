import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinsRecommandationTraitementComponent } from './medecins-recommandation-traitement.component';

describe('MedecinsRecommandationTraitementComponent', () => {
  let component: MedecinsRecommandationTraitementComponent;
  let fixture: ComponentFixture<MedecinsRecommandationTraitementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedecinsRecommandationTraitementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedecinsRecommandationTraitementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
