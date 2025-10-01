import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensingInfoComponent } from './licensing-info.component';

describe('LicensingInfoComponent', () => {
  let component: LicensingInfoComponent;
  let fixture: ComponentFixture<LicensingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LicensingInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicensingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
