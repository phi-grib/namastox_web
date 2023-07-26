import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionsFormComponent } from './decisions-form.component';

describe('DecisionsFormComponent', () => {
  let component: DecisionsFormComponent;
  let fixture: ComponentFixture<DecisionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
