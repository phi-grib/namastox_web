import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsRasComponent } from './options-ras.component';

describe('OptionsRasComponent', () => {
  let component: OptionsRasComponent;
  let fixture: ComponentFixture<OptionsRasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionsRasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionsRasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
