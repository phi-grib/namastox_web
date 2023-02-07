import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorRaComponent } from './selector-ra.component';

describe('SelectorRaComponent', () => {
  let component: SelectorRaComponent;
  let fixture: ComponentFixture<SelectorRaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectorRaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectorRaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
