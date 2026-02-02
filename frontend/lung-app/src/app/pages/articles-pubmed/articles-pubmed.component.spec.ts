import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesPubmedComponent } from './articles-pubmed.component';

describe('ArticlesPubmedComponent', () => {
  let component: ArticlesPubmedComponent;
  let fixture: ComponentFixture<ArticlesPubmedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticlesPubmedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesPubmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
