import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRaComponent } from './select-ra.component';

describe('SelectRaComponent', () => {
  let component: SelectRaComponent;
  let fixture: ComponentFixture<SelectRaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectRaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectRaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
