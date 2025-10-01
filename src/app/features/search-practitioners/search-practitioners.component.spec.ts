import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPractitionersComponent } from './search-practitioners.component';

describe('SearchPractitionersComponent', () => {
  let component: SearchPractitionersComponent;
  let fixture: ComponentFixture<SearchPractitionersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchPractitionersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPractitionersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
