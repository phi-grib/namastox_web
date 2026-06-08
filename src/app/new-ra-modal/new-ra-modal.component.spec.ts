import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRaModalComponent } from './new-ra-modal.component';

describe('NewRaModalComponent', () => {
  let component: NewRaModalComponent;
  let fixture: ComponentFixture<NewRaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRaModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewRaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
