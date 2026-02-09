import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureModalComponent } from './configure-modal.component';

describe('ConfigureModalComponent', () => {
  let component: ConfigureModalComponent;
  let fixture: ComponentFixture<ConfigureModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigureModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
