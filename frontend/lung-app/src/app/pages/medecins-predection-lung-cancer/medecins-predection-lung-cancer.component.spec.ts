import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinsPredectionLungCancerComponent } from './medecins-predection-lung-cancer.component';

describe('MedecinsPredectionLungCancerComponent', () => {
  let component: MedecinsPredectionLungCancerComponent;
  let fixture: ComponentFixture<MedecinsPredectionLungCancerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedecinsPredectionLungCancerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedecinsPredectionLungCancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
