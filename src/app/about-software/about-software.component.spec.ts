import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSoftwareComponent } from './about-software.component';

describe('AboutSoftwareComponent', () => {
  let component: AboutSoftwareComponent;
  let fixture: ComponentFixture<AboutSoftwareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutSoftwareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AboutSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
