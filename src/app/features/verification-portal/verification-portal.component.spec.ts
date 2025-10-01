import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationPortalComponent } from './verification-portal.component';

describe('VerificationPortalComponent', () => {
  let component: VerificationPortalComponent;
  let fixture: ComponentFixture<VerificationPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerificationPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
